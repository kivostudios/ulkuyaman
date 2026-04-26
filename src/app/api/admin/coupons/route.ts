import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const code = String(body.code || "").trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Kod gerekli" }, { status: 400 });
  }
  if (!["PERCENT", "FIXED"].includes(body.type)) {
    return NextResponse.json({ error: "Geçersiz tip" }, { status: 400 });
  }
  const value = Number(body.value);
  if (!Number.isFinite(value) || value <= 0) {
    return NextResponse.json({ error: "Değer pozitif olmalı" }, { status: 400 });
  }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code,
        description: body.description || null,
        type: body.type,
        value,
        minSubtotal: body.minSubtotal ? Number(body.minSubtotal) : null,
        maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : null,
        usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
        startsAt: body.startsAt ? new Date(body.startsAt) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        active: body.active !== false,
      },
    });
    return NextResponse.json({ coupon });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Kupon oluşturulamadı";
    if (message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Bu kod zaten var." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
