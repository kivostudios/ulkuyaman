"use client";
import { useEffect } from "react";

// Client-side Sentry init. NEXT_PUBLIC_SENTRY_DSN env'i set'liyse browser'da
// hata izleme aktif olur, yoksa hicbir sey yapmaz.
//
// withSentryConfig wrapper kullanmadigimiz icin bu component'i layout'a
// ekleyerek manuel init ediyoruz.

export default function SentryInit() {
  useEffect(() => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) return;

    // Dynamic import: bundle size'i sadece DSN varsa yukler
    import("@sentry/nextjs").then((Sentry) => {
      // Zaten init edilmisse tekrar etme
      if (Sentry.getCurrentScope().getClient()) return;

      Sentry.init({
        dsn,
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0.5,
        environment:
          process.env.NEXT_PUBLIC_VERCEL_ENV ||
          process.env.NODE_ENV ||
          "production",
      });
    });
  }, []);

  return null;
}
