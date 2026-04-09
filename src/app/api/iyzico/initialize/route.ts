import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";

export async function POST(req: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { addressId } = await req.json();

  // Adres kontrolü
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });
  if (!address) {
    return NextResponse.json({ error: "Adres bulunamadı" }, { status: 404 });
  }

  // Sepet kontrolü
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });
  if (!cartItems.length) {
    return NextResponse.json({ error: "Sepet boş" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
  }

  // Sipariş oluştur
  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const shippingCost = subtotal >= 250 ? 0 : 49.9;
  const total = Number((subtotal + shippingCost).toFixed(2));

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: "PENDING",
      total,
      shippingCost,
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
  });

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
      id: session.user.id,
      name: firstName,
      surname: lastName,
      email: user.email || "",
      identityNumber: "11111111111", // Production'da gerçek TC alınmalı
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
    basketItems: cartItems.map((i) => ({
      id: i.productId,
      name: i.product.name,
      category1: i.product.category,
      itemType: "PHYSICAL",
      price: String(Number((i.product.price * i.quantity).toFixed(2))),
    })),
  };

  return new Promise<Response>((resolve) => {
    iyzipay.checkoutFormInitialize.create(request, (err: unknown, result: { status: string; checkoutFormContent?: string; errorMessage?: string }) => {
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
    });
  });
}
