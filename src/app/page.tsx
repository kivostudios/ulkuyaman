import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [bestsellersRaw, newProductsRaw] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, isBestseller: true, deletedAt: null },
      take: 5,
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, price: true, images: true },
    }),
    prisma.product.findMany({
      where: { active: true, isNew: true, deletedAt: null },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, price: true, images: true },
    }),
  ]);

  const serialize = (p: { id: string; name: string; price: number; images: string[] }) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images[0] ?? null,
  });

  return (
    <HomeClient
      bestsellers={bestsellersRaw.map(serialize)}
      newArrivals={newProductsRaw.map(serialize)}
    />
  );
}
