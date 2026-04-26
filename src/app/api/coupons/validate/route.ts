import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateCoupon } from "@/lib/coupon";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Lütfen giriş yapın." }, { status: 401 });
  }

  const { code } = (await req.json()) as { code?: string };
  if (!code) {
    return NextResponse.json({ ok: false, error: "Kupon kodu gerekli." }, { status: 400 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: { select: { price: true } } },
  });
  const subtotal = cartItems.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );

  const result = await validateCoupon(code, subtotal);
  return NextResponse.json(result);
}
