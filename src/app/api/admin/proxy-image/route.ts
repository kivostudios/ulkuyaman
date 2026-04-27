import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

// Resmi origin'den server-side cek, browser'a CORS-safe sekilde donur.
// CropEditor'un canvas crop'i icin gerekli (browser cross-origin fetch
// CORS olmayan kaynaklardan blob okuyamiyor).

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const target = req.nextUrl.searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "url query parametresi gerekli" }, { status: 400 });
  }

  // Sadece http/https
  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Gecersiz URL" }, { status: 400 });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Sadece http/https URL'leri" }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), {
      // Bazi siteler hotlink korumasi icin referer kontrolu yapiyor.
      // Origin'in kendi referer'ini gonderirsek hotlink filtresinden gecer.
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

  const buf = await upstream.arrayBuffer();
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=300",
    },
  });
}
