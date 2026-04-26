import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.active === "boolean") data.active = body.active;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.value !== undefined) data.value = Number(body.value);
  if (body.minSubtotal !== undefined)
    data.minSubtotal = body.minSubtotal === "" ? null : Number(body.minSubtotal);
  if (body.maxDiscount !== undefined)
    data.maxDiscount = body.maxDiscount === "" ? null : Number(body.maxDiscount);
  if (body.usageLimit !== undefined)
    data.usageLimit = body.usageLimit === "" ? null : Number(body.usageLimit);
  if (body.startsAt !== undefined)
    data.startsAt = body.startsAt ? new Date(body.startsAt) : null;
  if (body.expiresAt !== undefined)
    data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

  const coupon = await prisma.coupon.update({ where: { id }, data });
  return NextResponse.json({ coupon });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
