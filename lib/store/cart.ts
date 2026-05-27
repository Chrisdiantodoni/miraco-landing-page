"use client";

import { create } from "zustand";

export interface CartItem {
  id: number;
  name: string;
  code: string;
  image_url: string;
  collection_name: string;
  thickness: string;
  size: string;
  finishing: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  favourites: number[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  isInCart: (id: number) => boolean;
  toggleFavourite: (id: number) => void;
  isFavourite: (id: number) => boolean;
  cartCount: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
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

  removeFromCart: (id: number) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },

  updateQuantity: (id: number, quantity: number) => {
    if (quantity < 1) return;
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  },

  isInCart: (id: number) => {
    return get().cart.some((item) => item.id === id);
  },

  toggleFavourite: (id: number) => {
    set((state) => {
      const exists = state.favourites.includes(id);
      return {
        favourites: exists
          ? state.favourites.filter((fid) => fid !== id)
          : [...state.favourites, id],
      };
    });
  },

  isFavourite: (id: number) => {
    return get().favourites.includes(id);
  },

  cartCount: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}));
