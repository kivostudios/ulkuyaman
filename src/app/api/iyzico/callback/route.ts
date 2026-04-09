import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { iyzipay } from "@/lib/iyzico";

export async function POST(req: NextRequest): Promise<Response> {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const formData = await req.formData();
  const token = formData.get("token") as string;

  if (!orderId || !token) {
    return NextResponse.redirect(
      new URL("/odeme/basarisiz", process.env.NEXT_PUBLIC_BASE_URL)
    );
  }

  return new Promise<Response>((resolve) => {
    iyzipay.checkoutForm.retrieve(
      { locale: "tr", token },
      async (
        err: unknown,
        result: { status: string; paymentStatus?: string; paymentId?: string }
      ) => {
        if (err || result.status !== "success" || result.paymentStatus !== "SUCCESS") {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "PAYMENT_FAILED", paymentToken: token },
          });
          resolve(
            NextResponse.redirect(
              new URL(`/odeme/basarisiz?orderId=${orderId}`, process.env.NEXT_PUBLIC_BASE_URL)
            )
          );
          return;
        }

        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paymentId: result.paymentId,
            paymentToken: token,
          },
        });

        await prisma.cartItem.deleteMany({ where: { userId: order.userId } });

        resolve(
          NextResponse.redirect(
            new URL(`/odeme/basarili?orderId=${orderId}`, process.env.NEXT_PUBLIC_BASE_URL)
          )
        );
      }
    );
  });
}
