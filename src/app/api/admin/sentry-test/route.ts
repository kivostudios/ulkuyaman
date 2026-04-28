import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Sentry kurulumunu test et: bu endpoint admin yetkili oldugu icin sadece
// adminler tetikleyebilir. Hata fırlatir; Sentry DSN setiliyse dashboard'a
// dusmesi lazim.

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  // Bilinen bir hata fırlat — server-side Sentry yakalamasi gerek
  throw new Error("Sentry test error — istegi admin yapti, deploy basarili.");
}

export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  // Async yakalanmis hata pattern'i
  setTimeout(() => {
    throw new Error("Sentry test (async) — istegi admin yapti.");
  }, 0);
  return NextResponse.json({ message: "Async hata firlatildi (1sn icinde)." });
}
