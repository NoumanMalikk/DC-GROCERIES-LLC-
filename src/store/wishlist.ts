import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem } from "@/types/product";

interface WishlistState {
  items: WishlistItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        if (get().hasItem(productId)) return;
        set((state) => ({
          items: [
            ...state.items,
            { productId, addedAt: new Date().toISOString() },
          ],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      toggleItem: (productId) => {
        if (get().hasItem(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      hasItem: (productId) =>
        get().items.some((i) => i.productId === productId),

      getItemCount: () => get().items.length,
    }),
    { name: "dc-groceries-wishlist" },
  ),
);
