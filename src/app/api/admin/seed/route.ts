import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// One-time endpoint to make a user admin by email — local geliştirmeyi
// kolaylaştırmak için. Production'da kullanmak istemiyoruz; admin role'u
// Supabase Table Editor'dan veya db migration'dan verilmeli.
export async function POST(req: NextRequest) {
  // Production'da kapali. Local/dev/preview'de calismaya devam.
  if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production") {
    return NextResponse.json(
      { error: "Bu endpoint production'da devre dışıdır." },
      { status: 404 }
    );
  }

  const secretEnv = process.env.ADMIN_SEED_SECRET;
  if (!secretEnv || secretEnv.length < 16) {
    return NextResponse.json(
      { error: "ADMIN_SEED_SECRET ayarlanmamış veya çok kısa (min 16 karakter)." },
      { status: 500 }
    );
  }

  const { email, secret } = await req.json();
  if (secret !== secretEnv) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({ success: true, user });
}
