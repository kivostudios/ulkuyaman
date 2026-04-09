import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// One-time endpoint to make a user admin by email
// Protected by a secret key
export async function POST(req: NextRequest) {
  const { email, secret } = await req.json();

  if (secret !== process.env.ADMIN_SEED_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({ success: true, user });
}
