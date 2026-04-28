import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { assertSafeUrl } from "@/lib/ssrf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 25 * 1024 * 1024; // 25MB upstream limit (admin-only)

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const target = req.nextUrl.searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "url query parametresi gerekli" }, { status: 400 });
  }

  // SSRF: private IP / metadata / loopback adreslerine erismeyi engelle
  let parsed: URL;
  try {
    parsed = await assertSafeUrl(target);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), {
      // Bazi siteler hotlink korumasi icin referer kontrolu yapiyor.
      redirect: "manual", // SSRF: 30x redirect ile bypass edilmesin
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Referer: `${parsed.protocol}//${parsed.host}/`,
        Accept: "image/*,*/*;q=0.8",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Origin'e baglanilamadi: ${(e as Error).message}` },
      { status: 502 }
    );
  }

  // Manual redirect mode'da 30x gelirse follow etmiyoruz (SSRF'e karsi)
  if (upstream.status >= 300 && upstream.status < 400) {
    return NextResponse.json(
      { error: `Origin redirect dondu (${upstream.status}); yeniden yonlendirme desteklenmiyor` },
      { status: 502 }
    );
  }
  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Origin ${upstream.status} ${upstream.statusText}` },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("Content-Type") || "image/jpeg";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json(
      { error: `Resim degil (Content-Type: ${contentType})` },
      { status: 415 }
    );
  }

  const contentLength = Number(upstream.headers.get("Content-Length") || 0);
  if (contentLength > MAX_BYTES) {
    return NextResponse.json(
      { error: `Resim cok buyuk (${Math.round(contentLength / 1024 / 1024)}MB). Limit ${MAX_BYTES / 1024 / 1024}MB.` },
      { status: 413 }
    );
  }

  const buf = await upstream.arrayBuffer();
  // Header'da boyut yoksa burada da kontrol et
  if (buf.byteLength > MAX_BYTES) {
    return NextResponse.json(
      { error: "Resim cok buyuk" },
      { status: 413 }
    );
  }

  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=300",
    },
  });
}

