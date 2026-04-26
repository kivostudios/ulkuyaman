import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: [{ color: "asc" }, { size: "asc" }] } },
  });
  if (!product) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });

  return NextResponse.json(product);
}

type VariantInput = { color: string; size: string; stock: number };

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { name, description, price, images, colors, category, stock, active, variants } = body;

  const product = await prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(images !== undefined && { images }),
        ...(colors !== undefined && { colors }),
        ...(category !== undefined && { category }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(active !== undefined && { active }),
      },
    });

    // Variants gelmisse atomik olarak replace et
    if (Array.isArray(variants)) {
      await tx.productVariant.deleteMany({ where: { productId: id } });
      const cleaned: VariantInput[] = variants
        .filter((v: VariantInput) => v?.color && v?.size)
        .map((v: VariantInput) => ({
          color: String(v.color).trim(),
          size: String(v.size).trim(),
          stock: Math.max(0, parseInt(String(v.stock)) || 0),
        }));
      if (cleaned.length) {
        await tx.productVariant.createMany({
          data: cleaned.map((v) => ({ productId: id, ...v })),
          skipDuplicates: true,
        });
      }
    }

    return tx.product.findUnique({
      where: { id: updated.id },
      include: { variants: { orderBy: [{ color: "asc" }, { size: "asc" }] } },
    });
  });

  return NextResponse.json(product);
}

// Soft delete: gecmis siparislere referans bozulmasin diye row'u silmiyoruz.
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), active: false },
  });

  return NextResponse.json({ success: true });
}
