import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://ulkuyamancollection.com";

  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/sandaletler`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/hakkimizda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/iletisim`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/kvkk`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/gizlilik`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cerez`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/mesafeli-satis`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/iade-cayma`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/on-bilgilendirme`, changeFrequency: "yearly", priority: 0.2 },
  ];

  let products: { id: string; updatedAt: Date }[] = [];
  try {
    products = await prisma.product.findMany({
      where: { active: true, deletedAt: null },
      select: { id: true, updatedAt: true },
      take: 5000,
    });
  } catch {
    // DB erisimi yoksa sadece static yollar dön
  }

  const productPaths: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/urunler/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPaths, ...productPaths];
}
