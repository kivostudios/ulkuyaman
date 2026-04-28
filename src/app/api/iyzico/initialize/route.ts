import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getIyzipay } from "@/lib/iyzico";
import { applyCouponInTx } from "@/lib/coupon";
import { isValidTCKimlik } from "@/lib/tckimlik";
import { rateLimit, ipFrom } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // Ödeme başlatma 60sn'de 5 kez yeterli — daha fazlasi sahtekarlik/abuse
  const rl = rateLimit(`iyzico:init:${userId}`, 5, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Çok hızlı denedin. Birazdan tekrar dene." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
    );
  }

  const { addressId, couponCode } = (await req.json()) as {
    addressId?: string;
    couponCode?: string;
  };
  if (!addressId) {
    return NextResponse.json({ error: "Adres seçilmedi" }, { status: 400 });
  }

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) {
    return NextResponse.json({ error: "Adres bulunamadı" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
  }

  // T.C. kimlik no kontrol — fatura ve iyzico için zorunlu.
  // Sadece format değil Mernis check digit'i de doğrulaniyor (rastgele 11 hane gecemiyor).
  const tcKimlik = address.tcKimlik || user.tcKimlik;
  if (!tcKimlik || !isValidTCKimlik(tcKimlik)) {
    return NextResponse.json(
      {
        error:
          "Geçerli T.C. kimlik numarası gerekli. Lütfen adresinizdeki kimlik numarasını kontrol edin.",
      },
      { status: 400 }
    );
  }

  // Sipariş hazırlanırken stoğu rezerve etmek + kupon kullanımını artırmak için tek transaction
  const prepared = await prisma.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: { userId },
      include: { product: { include: { variants: true } } },
    });
    if (!cartItems.length) {
      throw new HttpError(400, "Sepet boş");
    }

    // Stok kontrolu: varyant varsa o (color, size) varyantinin stok'una bak,
    // yoksa product.stock fallback.
    for (const item of cartItems) {
      if (!item.product.active || item.product.deletedAt) {
        throw new HttpError(409, `${item.product.name} satışta değil.`);
      }
      const variants = item.product.variants;
      if (variants.length > 0) {
        const v = variants.find((x) => x.color === item.color && x.size === item.size);
        if (!v) {
          throw new HttpError(409, `${item.product.name} (${item.color}, ${item.size}) bulunamadı.`);
        }
        if (v.stock < item.quantity) {
          throw new HttpError(
            409,
            `${item.product.name} (${item.color}, beden ${item.size}) için yeterli stok yok. (kalan: ${v.stock})`
          );
        }
      } else {
        if (item.product.stock < item.quantity) {
          throw new HttpError(
            409,
            `${item.product.name} için yeterli stok yok. (kalan: ${item.product.stock})`
          );
        }
      }
    }

    const subtotal = cartItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
    const shippingCost = subtotal >= 250 ? 0 : 49.9;

    let discount = 0;
    let usedCouponCode: string | null = null;
    if (couponCode) {
      // applyCouponInTx atomic check+increment yapar — usageLimit race'i
      // engellenir, paralel istekler ayni kupon'u limit'i asarak kullanamaz.
      const result = await applyCouponInTx(tx, couponCode, subtotal);
      if (!result.ok) {
        throw new HttpError(400, result.error);
      }
      discount = result.discount;
      usedCouponCode = result.coupon.code;
    }

    const total = Number(
      Math.max(0, subtotal + shippingCost - discount).toFixed(2)
    );

    // Stok düş — pessimistic, ödeme başarısız olursa callback'te geri ekleriz
    // Varyant varsa varyantın stoğunu düş, yoksa product.stock'tan düş.
    for (const item of cartItems) {
      const hasVariants = item.product.variants.length > 0;
      if (hasVariants) {
        await tx.productVariant.update({
          where: {
            productId_color_size: {
              productId: item.productId,
              color: item.color,
              size: item.size,
            },
          },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    const order = await tx.order.create({
      data: {
        userId,
        status: "PENDING",
        subtotal,
        shippingCost,
        discount,
        couponCode: usedCouponCode,
        total,
        addressSnapshot: address,
        items: {
          create: cartItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.product.price,
            color: i.color,
            size: i.size,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    return { order, subtotal, shippingCost, discount, total };
  }).catch((err) => {
    if (err instanceof HttpError) {
      return { error: err.message, status: err.status } as const;
    }
    throw err;
  });

  if ("error" in prepared) {
    return NextResponse.json({ error: prepared.error }, { status: prepared.status });
  }

  const { order, total } = prepared;
  const nameParts = (user.name || "Müşteri").split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "-";

  const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/iyzico/callback?orderId=${order.id}`;

  const request = {
    locale: "tr",
    conversationId: order.id,
    price: String(total),
    paidPrice: String(total),
    currency: "TRY",
    basketId: order.id,
    paymentGroup: "PRODUCT",
    callbackUrl,
    enabledInstallments: [1, 2, 3, 6, 9, 12],
    buyer: {
      id: userId,
      name: firstName,
      surname: lastName,
      email: user.email || "",
      identityNumber: tcKimlik,
      registrationAddress: address.address,
      city: address.city,
      country: "Turkey",
      gsmNumber: address.phone,
    },
    shippingAddress: {
      contactName: address.name,
      city: address.city,
      country: "Turkey",
      address: address.address,
    },
    billingAddress: {
      contactName: address.name,
      city: address.city,
      country: "Turkey",
      address: address.address,
    },
    basketItems: order.items.map((i) => ({
      id: i.productId,
      name: i.product.name,
      category1: i.product.category,
      itemType: "PHYSICAL",
      price: String(Number((i.product.price * i.quantity).toFixed(2))),
    })),
  };

  const iyzipay = getIyzipay();
  return new Promise<Response>((resolve) => {
    iyzipay.checkoutFormInitialize.create(
      request,
      (
        err: unknown,
        result: {
          status: string;
          checkoutFormContent?: string;
          errorMessage?: string;
        }
      ) => {
        if (err || result.status !== "success") {
          resolve(
            NextResponse.json(
              { error: result?.errorMessage || "Ödeme başlatılamadı" },
              { status: 500 }
            )
          );
          return;
        }
        resolve(
          NextResponse.json({
            checkoutFormContent: result.checkoutFormContent,
            orderId: order.id,
          })
        );
      }
    );
  });
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
