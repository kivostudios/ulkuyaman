import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { isValidTCKimlik } from "@/lib/tckimlik";

const addressSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  tcKimlik: z
    .string()
    .refine((s) => s === "" || isValidTCKimlik(s), {
      message: "Geçersiz T.C. kimlik numarası (Mernis kontrol hanesi tutmuyor)",
    })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  city: z.string().min(2),
  district: z.string().min(2),
  address: z.string().min(10),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });
  return NextResponse.json(addresses);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return NextResponse.json(address);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  // IDOR koruması: deleteMany ile owner kontrolü zorunlu (delete sadece unique
  // field'i kabul ediyor — userId compound check yapmıyor).
  const result = await prisma.address.deleteMany({
    where: { id, userId: session.user.id },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "Adres bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
