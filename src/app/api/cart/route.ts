import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/cart — kullanıcı sepetini getir
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  return NextResponse.json(items);
}

// POST /api/cart — ürün ekle
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, color, size, quantity = 1 } = await req.json();

  const item = await prisma.cartItem.upsert({
    where: {
      userId_productId_color_size: {
        userId: session.user.id,
        productId,
        color,
        size,
      },
    },
    update: { quantity: { increment: quantity } },
    create: {
      userId: session.user.id,
      productId,
      color,
      size,
      quantity,
    },
    include: { product: true },
  });

  return NextResponse.json(item);
}

// DELETE /api/cart — ürün çıkar
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, color, size } = await req.json();

  await prisma.cartItem.delete({
    where: {
      userId_productId_color_size: {
        userId: session.user.id,
        productId,
        color,
        size,
      },
    },
  });

  return NextResponse.json({ ok: true });
}

// PATCH /api/cart — miktar güncelle
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, color, size, quantity } = await req.json();

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: {
        userId_productId_color_size: {
          userId: session.user.id,
          productId,
          color,
          size,
        },
      },
    });
    return NextResponse.json({ ok: true });
  }

  const item = await prisma.cartItem.update({
    where: {
      userId_productId_color_size: {
        userId: session.user.id,
        productId,
        color,
        size,
      },
    },
    data: { quantity },
    include: { product: true },
  });

  return NextResponse.json(item);
}
