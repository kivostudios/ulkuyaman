import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Sentry kurulumu test endpoint'i. Admin only.
//
// Sentry SDK init durumunu rapor eder ve dogrudan captureException ile
// dashboard'a event gonderir. "Get Started" sayfasi cikiyorsa kurulumun
// nerede takildigini buradan anlayabiliriz.

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const dsnPresent = !!(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);
  const client = Sentry.getCurrentScope().getClient();
  const sdkInitialized = !!client;

  // Diagnostic event: SDK init olduysa Sentry'ye gider
  let captureResult = "skipped (no DSN)";
  let eventId: string | undefined;
  if (sdkInitialized) {
    try {
      eventId = Sentry.captureException(
        new Error(`Sentry test event @ ${new Date().toISOString()}`),
        {
          tags: { source: "admin-test", environment: process.env.VERCEL_ENV || "unknown" },
        }
      );
      // captureException sync calisiyor ama event'i flush etmek lazim
      await Sentry.flush(5000);
      captureResult = `sent (eventId: ${eventId})`;
    } catch (e) {
      captureResult = `failed: ${(e as Error).message}`;
    }
  }

  return NextResponse.json(
    {
      sentry: {
        env: {
          SENTRY_DSN_set: !!process.env.SENTRY_DSN,
          NEXT_PUBLIC_SENTRY_DSN_set: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
          dsnAvailableToServer: dsnPresent,
        },
        sdk: {
          initialized: sdkInitialized,
          dsn: client?.getDsn()?.host
            ? `***@${client.getDsn()?.host}`
            : null,
        },
        capture: {
          result: captureResult,
          eventId: eventId ?? null,
        },
      },
      next: sdkInitialized
        ? "30-60sn icinde Sentry > Issues sayfasinda test event'ini gor."
        : "Sentry SDK init olmamis. Vercel'da SENTRY_DSN env var ayarli mi kontrol et, sonra REDEPLOY.",
    },
    { status: 200 }
  );
}
