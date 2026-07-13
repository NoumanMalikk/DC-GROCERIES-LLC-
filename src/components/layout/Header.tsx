"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Heart, Menu, Phone, Search, ShoppingCart } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { storeConfig } from "../../../data/store-config";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useUIStore } from "@/store/ui";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { MegaMenu } from "./MegaMenu";

const primaryNav = [
  { label: "Shop All", href: "/shop", mega: true },
  { label: "Produce", href: "/collections/fresh-produce" },
  { label: "Pantry", href: "/collections/pantry" },
  { label: "Dairy", href: "/collections/dairy-refrigerated", hideBelow: "xl" },
  { label: "Drinks", href: "/collections/beverages", hideBelow: "xl" },
  { label: "Snacks", href: "/collections/snacks", hideBelow: "2xl" },
  { label: "Household", href: "/collections/household", hideBelow: "2xl" },
];

function subscribe() {
  return () => {};
}

export function Header() {
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const megaMenuOpen = useUIStore((s) => s.megaMenuOpen);
  const toggleMegaMenu = useUIStore((s) => s.toggleMegaMenu);
  const toggleMobileNav = useUIStore((s) => s.toggleMobileNav);
  const toggleCartDrawer = useUIStore((s) => s.toggleCartDrawer);
  const closeAllOverlays = useUIStore((s) => s.closeAllOverlays);

  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getItemCount());

  const backgroundOpacity = useTransform(scrollY, [0, 60], [0.92, 1]);
  const borderOpacity = useTransform(scrollY, [0, 60], [0.4, 1]);
  const borderColor = useTransform(
    borderOpacity,
    (v) => `rgba(221, 212, 197, ${v})`,
  );

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        className="pointer-events-none absolute inset-0 border-b bg-fresh-white/95 backdrop-blur-md"
        style={
          reducedMotion
            ? { opacity: 1, borderColor: "var(--color-border-sand)" }
            : { opacity: backgroundOpacity, borderColor }
        }
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="flex h-[4.25rem] items-center justify-between gap-4 lg:h-[4.75rem]">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileNav}
              aria-label="Open menu"
              aria-controls="mobile-nav"
            >
              <Menu />
            </Button>

            <Link
              href="/"
              className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={closeAllOverlays}
              aria-label={`${storeConfig.brandName} home`}
            >
              <span className="hidden sm:block">
                <Logo variant="horizontal" className="h-10 w-auto" />
              </span>
              <span className="sm:hidden">
                <Logo variant="monogram" className="size-10" />
              </span>
            </Link>
          </div>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {primaryNav.map((link) => {
              const hideClass =
                link.hideBelow === "xl"
                  ? "hidden xl:inline-flex"
                  : link.hideBelow === "2xl"
                    ? "hidden 2xl:inline-flex"
                    : "inline-flex";

              if (link.mega) {
                return (
                  <button
                    key={link.label}
                    type="button"
                    className={cn(
                      hideClass,
                      "items-center rounded-full px-3.5 py-2 text-sm font-semibold text-market-ink transition-colors",
                      "hover:bg-produce-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      megaMenuOpen && "bg-produce-mist text-garden-green",
                    )}
                    onClick={toggleMegaMenu}
                    aria-expanded={megaMenuOpen}
                    aria-controls="mega-menu"
                    aria-haspopup="true"
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    hideClass,
                    "items-center rounded-full px-3.5 py-2 text-sm font-medium text-market-ink/90 transition-colors hover:bg-produce-mist hover:text-market-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  )}
                  onClick={closeAllOverlays}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/search"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "hidden sm:inline-flex",
              )}
              aria-label="Search"
            >
              <Search />
            </Link>

            <Link
              href="/wishlist"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative",
              )}
              aria-label={`Wishlist${mounted && wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
            >
              <Heart />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-tomato-red text-[10px] font-bold text-fresh-white">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            <Button
              variant="primary"
              size="sm"
              onClick={toggleCartDrawer}
              aria-label={`Cart${mounted && cartCount > 0 ? `, ${cartCount} items` : ""}`}
              className="relative gap-2 rounded-full px-3.5"
            >
              <ShoppingCart className="size-4" />
              <span className="hidden sm:inline">Cart</span>
              {mounted && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-citrus-orange text-[10px] font-bold text-market-ink ring-2 ring-fresh-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Button>

            <a
              href={`tel:${storeConfig.phoneE164}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "hidden rounded-full md:inline-flex",
              )}
              aria-label={`Call ${storeConfig.phoneDisplay}`}
            >
              <Phone className="size-4" />
            </a>
          </div>
        </div>
      </Container>

      <div className="relative hidden lg:block">
        <MegaMenu />
      </div>
    </header>
  );
}
