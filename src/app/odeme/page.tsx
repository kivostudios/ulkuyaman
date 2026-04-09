import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";

export const metadata = { title: "Ödeme | Ülkü Yaman Collection" };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const [cartItems, addresses] = await Promise.all([
    prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: "desc" },
    }),
  ]);

  if (!cartItems.length) redirect("/sepet");

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 250 ? 0 : 49.9;

  return (
    <CheckoutClient
      cartItems={cartItems.map((i) => ({
        ...i,
        product: {
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          images: i.product.images,
        },
      }))}
      addresses={addresses}
      subtotal={subtotal}
      shipping={shipping}
    />
  );
}
