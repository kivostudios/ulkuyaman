import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orderItems: true } } },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { name, description, price, images, colors, category, stock, active, slug } = body;

  if (!name || !price) {
    return NextResponse.json({ error: "Ad ve fiyat zorunlu" }, { status: 400 });
  }

  const generatedSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

  const product = await prisma.product.create({
    data: {
      name,
      slug: generatedSlug,
      description: description || "",
      price: parseFloat(price),
      images: images || [],
      colors: colors || [],
      category: category || "",
      stock: parseInt(stock) || 0,
      active: active ?? true,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
