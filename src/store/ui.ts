import { create } from "zustand";

interface UIState {
  cartDrawerOpen: boolean;
  mobileNavOpen: boolean;
  megaMenuOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setMegaMenuOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
  toggleMobileNav: () => void;
  toggleMegaMenu: () => void;
  closeAllOverlays: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartDrawerOpen: false,
  mobileNavOpen: false,
  megaMenuOpen: false,

  setCartDrawerOpen: (open) =>
    set({
      cartDrawerOpen: open,
      ...(open
        ? { mobileNavOpen: false, megaMenuOpen: false }
        : {}),
    }),

  setMobileNavOpen: (open) =>
    set({
      mobileNavOpen: open,
      ...(open
        ? { cartDrawerOpen: false, megaMenuOpen: false }
        : {}),
    }),

  setMegaMenuOpen: (open) =>
    set({
      megaMenuOpen: open,
      ...(open
        ? { cartDrawerOpen: false, mobileNavOpen: false }
        : {}),
    }),

  toggleCartDrawer: () =>
    set((state) => ({
      cartDrawerOpen: !state.cartDrawerOpen,
      mobileNavOpen: false,
      megaMenuOpen: false,
    })),

  toggleMobileNav: () =>
    set((state) => ({
      mobileNavOpen: !state.mobileNavOpen,
      cartDrawerOpen: false,
      megaMenuOpen: false,
    })),

  toggleMegaMenu: () =>
    set((state) => ({
      megaMenuOpen: !state.megaMenuOpen,
      cartDrawerOpen: false,
      mobileNavOpen: false,
    })),

  closeAllOverlays: () =>
    set({
      cartDrawerOpen: false,
      mobileNavOpen: false,
      megaMenuOpen: false,
    }),
}));
