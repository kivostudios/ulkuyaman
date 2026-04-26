import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIyzipay } from "@/lib/iyzico";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<Response> {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const formData = await req.formData();
  const token = formData.get("token") as string;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;

  if (!orderId || !token) {
    return NextResponse.redirect(new URL("/odeme/basarisiz", baseUrl));
  }

  const iyzipay = getIyzipay();
  return new Promise<Response>((resolve) => {
    iyzipay.checkoutForm.retrieve(
      { locale: "tr", token },
      async (
        err: unknown,
        result: {
          status: string;
          paymentStatus?: string;
          paymentId?: string;
          price?: number | string;
        }
      ) => {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (!order) {
          resolve(NextResponse.redirect(new URL("/odeme/basarisiz", baseUrl)));
          return;
        }

        const failed =
          err || result.status !== "success" || result.paymentStatus !== "SUCCESS";

        // Anti-fraud: iyzico'dan dönen tutar bizim hesapladığımızla aynı olmalı.
        const remotePrice = result.price !== undefined ? Number(result.price) : null;
        const priceMismatch =
          remotePrice !== null && Math.abs(remotePrice - order.total) > 0.01;

        if (failed || priceMismatch) {
          await prisma.$transaction(async (tx) => {
            // Stok geri ver, kupon kullanım sayacını geri al
            for (const item of order.items) {
              await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } },
              });
            }
            if (order.couponCode) {
              await tx.coupon
                .update({
                  where: { code: order.couponCode },
                  data: { usedCount: { decrement: 1 } },
                })
                .catch(() => {
                  /* kupon silinmiş olabilir, sessiz geç */
                });
            }
            await tx.order.update({
              where: { id: orderId },
              data: { status: "PAYMENT_FAILED", paymentToken: token },
            });
          });

          resolve(
            NextResponse.redirect(
              new URL(`/odeme/basarisiz?orderId=${orderId}`, baseUrl)
            )
          );
          return;
        }

        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: "PAID",
              paymentId: result.paymentId,
              paymentToken: token,
            },
          });
          await tx.cartItem.deleteMany({ where: { userId: order.userId } });
        });

        // Sipariş onayı e-postası — async, hata oluşsa bile redirect'i etkilemesin
        const orderForEmail = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            user: { select: { email: true, name: true } },
            items: { include: { product: { select: { name: true } } } },
          },
        });
        if (orderForEmail?.user.email) {
          sendOrderConfirmationEmail(orderForEmail.user.email, {
            orderId: orderForEmail.id,
            customerName: orderForEmail.user.name ?? "Müşterimiz",
            total: orderForEmail.total,
            items: orderForEmail.items.map((i) => ({
              name: i.product.name,
              quantity: i.quantity,
              price: i.price,
            })),
          }).catch((e) => console.error("Order confirmation email failed:", e));
        }

        resolve(
          NextResponse.redirect(
            new URL(`/odeme/basarili?orderId=${orderId}`, baseUrl)
          )
        );
      }
    );
  });
}
