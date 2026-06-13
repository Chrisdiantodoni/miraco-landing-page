"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toggleFavourite } from "../api/queries/favourite";

export interface CartItem {
  id: string;
  name: string;
  code: string;
  image_url: string;
  price: number;
  promo_price?: number;
  collection_name: string;
  thickness: string;
  size: string;
  finishing: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  favourites: string[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isInCart: (id: string) => boolean;
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  setFavourites: (ids: string[]) => void;
  cartCount: () => number;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      favourites: [],
      isCartOpen: false,

      addToCart: (item) => {
        const exists = get().cart.find((i) => i.id === item.id);
        if (!exists) {
          set((state) => ({
            cart: [...state.cart, { ...item, quantity: 1 }],
          }));
        }
      },

      removeFromCart: (id: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) return;
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        }));
      },

      isInCart: (id: string) => {
        return get().cart.some((item) => item.id === id);
      },

      toggleFavourite: async (id: string) => {
        const wasActive = get().favourites.includes(id);

        // optimistic update dulu
        set((state) => ({
          favourites: wasActive
            ? state.favourites.filter((fid) => fid !== id)
            : [...state.favourites, id],
        }));

        try {
          await toggleFavourite(String(id));
        } catch (err) {
          // rollback kalau gagal
          set((state) => ({
            favourites: wasActive
              ? [...state.favourites, id]
              : state.favourites.filter((fid) => fid !== id),
          }));
          throw err;
        }
      },

      isFavourite: (id: string) => {
        return get().favourites.includes(id);
      },

      setFavourites: (ids: string[]) => set({ favourites: ids }),

      cartCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      clearCart: () => set({ cart: [] }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    {
      name: "miraco-cart",
      partialize: (state) => ({
        cart: state.cart,
      }),
    },
  ),
);
