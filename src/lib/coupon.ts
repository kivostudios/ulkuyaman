import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type CouponValidation =
  | { ok: true; coupon: { id: string; code: string; type: "PERCENT" | "FIXED"; value: number }; discount: number }
  | { ok: false; error: string };

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidation> {
  if (!code) return { ok: false, error: "Kupon kodu gerekli." };
  const normalized = code.trim().toUpperCase();

  const coupon = await prisma.coupon.findUnique({ where: { code: normalized } });
  if (!coupon || !coupon.active) {
    return { ok: false, error: "Geçersiz kupon kodu." };
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return { ok: false, error: "Kupon henüz aktif değil." };
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { ok: false, error: "Kuponun süresi dolmuş." };
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, error: "Bu kuponun kullanım limiti dolmuş." };
  }
  if (coupon.minSubtotal !== null && subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      error: `Kupon en az ₺${coupon.minSubtotal.toLocaleString("tr-TR")} tutarındaki sepetlerde geçerli.`,
    };
  }

  let discount =
    coupon.type === "PERCENT"
      ? (subtotal * coupon.value) / 100
      : coupon.value;
  if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }
  if (discount > subtotal) discount = subtotal;
  discount = Number(discount.toFixed(2));

  return {
    ok: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    },
    discount,
  };
}

export async function incrementCouponUsage(
  tx: Prisma.TransactionClient,
  code: string
) {
  await tx.coupon.update({
    where: { code },
    data: { usedCount: { increment: 1 } },
  });
}
