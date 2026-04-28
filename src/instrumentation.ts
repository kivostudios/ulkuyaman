// Next.js 16 instrumentation — runtime'a gore Sentry config'lerini yukluyor.
// SENTRY_DSN env yoksa Sentry no-op olur, hata vermez.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export { captureRequestError as onRequestError } from "@sentry/nextjs";
