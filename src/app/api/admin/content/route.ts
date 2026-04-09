import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const items = await prisma.siteContent.findMany({ orderBy: { key: "asc" } });
  const map: Record<string, { id: string; value: unknown }> = {};
  items.forEach((item) => {
    map[item.key] = { id: item.id, value: item.value };
  });

  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { key, value } = await req.json();
  if (!key || value === undefined) {
    return NextResponse.json({ error: "key ve value zorunlu" }, { status: 400 });
  }

  const item = await prisma.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  return NextResponse.json(item);
}
