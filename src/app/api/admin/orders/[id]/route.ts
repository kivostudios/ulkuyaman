import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, image: true } },
      items: {
        include: { product: { select: { name: true, images: true, price: true } } },
      },
    },
  });

  if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  return NextResponse.json(order);
}

const VALID_STATUSES = [
  "PENDING",
  "PAYMENT_FAILED",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = (await req.json()) as {
    status?: string;
    trackingCarrier?: string | null;
    trackingNumber?: string | null;
  };

  const data: Record<string, unknown> = {};
  let prevStatus: string | undefined;
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json({ error: "Geçersiz durum" }, { status: 400 });
    }
    data.status = body.status;
    const existing = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });
    prevStatus = existing?.status;
  }
  if (body.trackingCarrier !== undefined)
    data.trackingCarrier = body.trackingCarrier || null;
  if (body.trackingNumber !== undefined)
    data.trackingNumber = body.trackingNumber || null;

  const order = await prisma.order.update({
    where: { id },
    data,
    include: { user: { select: { email: true, name: true } } },
  });

  // Bilgilendirme e-postası: status değişti ise tetikle
  if (body.status && body.status !== prevStatus && order.user.email) {
    sendOrderStatusEmail(order.user.email, {
      orderId: order.id,
      customerName: order.user.name ?? "Müşterimiz",
      newStatus: body.status,
      trackingCarrier: order.trackingCarrier,
      trackingNumber: order.trackingNumber,
    }).catch((e) => console.error("Order status email failed:", e));
  }

  return NextResponse.json(order);
}
