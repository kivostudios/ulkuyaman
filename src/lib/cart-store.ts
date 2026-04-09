"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./data";

export type CartItem = {
  product: Product;
  quantity: number;
  color: string;
  size: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, color: string, size: string) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, color, size) => {
        const existing = get().items.find(
          (i) => i.product.id === product.id && i.color === color && i.size === size
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id && i.color === color && i.size === size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity: 1, color, size }] });
        }
      },
      removeItem: (productId, color, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.product.id === productId && i.color === color && i.size === size)
          ),
        });
      },
      updateQuantity: (productId, color, size, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, color, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId && i.color === color && i.size === size
              ? { ...i, quantity: qty }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "ulkuyaman-cart" }
  )
);
