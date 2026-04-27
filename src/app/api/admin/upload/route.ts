import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/admin";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 8 * 1024 * 1024;

const VALID_EXTS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (e) {
    return NextResponse.json(
      { error: `Dosya alinamadi: ${(e as Error).message || "bilinmeyen hata"}` },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Dosya cok buyuk (${Math.round(file.size / 1024 / 1024)}MB). Limit 8MB.` },
      { status: 413 }
    );
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Yalnizca resim dosyalari kabul edilir." }, { status: 400 });
  }

  // Filename: sadece [a-z0-9-] karakterleri.
  // Date prefix + UUID, ext mime'dan turetiliyor (file.name dependency'siz).
  const mimeExt = file.type.split("/")[1]?.toLowerCase() || "jpg";
  const ext = VALID_EXTS.has(mimeExt) ? (mimeExt === "jpeg" ? "jpg" : mimeExt) : "jpg";
  const filename = `${Date.now()}-${randomUUID()}.${ext}`;

  const bytes = await file.arrayBuffer();

  let supabase;
  try {
    supabase = getSupabase();
  } catch (e) {
    return NextResponse.json(
      { error: `Supabase baglantisi yok: ${(e as Error).message}` },
      { status: 500 }
    );
  }

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(filename, bytes, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json(
      {
        error: `Supabase yukleme hatasi: ${uploadError.message}`,
        debug: { filename, size: file.size, type: file.type },
      },
      { status: 500 }
    );
  }

  const { data } = supabase.storage.from("products").getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}

