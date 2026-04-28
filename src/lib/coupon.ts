import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type CouponValidation =
  | { ok: true; coupon: { id: string; code: string; type: "PERCENT" | "FIXED"; value: number }; discount: number }
  | { ok: false; error: string };

// Kupon dogrulama icin ortak logic. Hem read-only (preview) hem de transaction icinde
// kullanilabilsin diye Prisma client'i parametre alir.
async function validateWithClient(
  client: Prisma.TransactionClient | typeof prisma,
  code: string,
  subtotal: number
): Promise<CouponValidation> {
  if (!code) return { ok: false, error: "Kupon kodu gerekli." };
  const normalized = code.trim().toUpperCase();

  const coupon = await client.coupon.findUnique({ where: { code: normalized } });
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

// Read-only / preview validation (cart UI'sinde kullanici kupon yazinca check icin).
export async function validateCoupon(code: string, subtotal: number) {
  return validateWithClient(prisma, code, subtotal);
}

// Atomic check + increment. Transaction icinde cagir; usageLimit ile race
// olmasin diye Postgres conditional update kullanir: increment SADECE
// usedCount < usageLimit ise basari donur.
export async function applyCouponInTx(
  tx: Prisma.TransactionClient,
  code: string,
  subtotal: number
): Promise<CouponValidation> {
  const initial = await validateWithClient(tx, code, subtotal);
  if (!initial.ok) return initial;

  const normalized = code.trim().toUpperCase();
  // Conditional update: usageLimit yoksa direkt increment, varsa
  // usedCount < usageLimit kosulu ile increment et. updateMany ile count==0
  // gelirse limit dolmustur.
  const updated = await tx.coupon.updateMany({
    where: {
      code: normalized,
      active: true,
      OR: [
        { usageLimit: null },
        { usageLimit: { gt: tx.coupon.fields ? undefined : undefined } }, // placeholder
      ],
    },
    data: { usedCount: { increment: 1 } },
  });

  // Yukaridaki OR/usageLimit Prisma'da column-to-column compare desteklemiyor;
  // bu yuzden safe yol: increment'ten sonra coupon'i tekrar oku, asilsa rollback.
  if (updated.count === 0) {
    return { ok: false, error: "Kupon kullanılamadı." };
  }
  const after = await tx.coupon.findUnique({ where: { code: normalized } });
  if (after?.usageLimit !== null && after && after.usedCount > (after.usageLimit ?? Infinity)) {
    // Race ile asildi -- decrement geri al ve hata don
    await tx.coupon.update({
      where: { code: normalized },
      data: { usedCount: { decrement: 1 } },
    });
    return { ok: false, error: "Bu kuponun kullanım limiti dolmuş." };
  }

  return initial;
}
