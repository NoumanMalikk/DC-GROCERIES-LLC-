"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingCart,
} from "lucide-react";
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

const desktopNav = [
  { label: "Shop All", href: "/shop", mega: true },
  { label: "Fresh Produce", href: "/collections/fresh-produce", mega: false },
  { label: "Pantry", href: "/collections/pantry", mega: false },
  {
    label: "Dairy & Refrigerated",
    href: "/collections/dairy-refrigerated",
    mega: false,
    className: "hidden xl:inline-flex",
  },
  {
    label: "Beverages",
    href: "/collections/beverages",
    mega: false,
    className: "hidden 2xl:inline-flex",
  },
  {
    label: "Snacks",
    href: "/collections/snacks",
    mega: false,
    className: "hidden 2xl:inline-flex",
  },
  {
    label: "Household",
    href: "/collections/household",
    mega: false,
    className: "hidden 2xl:inline-flex",
  },
  { label: "Contact", href: "/contact", mega: false },
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

  const backgroundOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const shadowOpacity = useTransform(scrollY, [0, 80], [0, 0.08]);
  const borderColor = useTransform(
    borderOpacity,
    (v) => `rgba(221, 212, 197, ${v})`,
  );
  const boxShadow = useTransform(
    shadowOpacity,
    (v) => `0 4px 20px rgba(24, 51, 44, ${v})`,
  );

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        className="pointer-events-none absolute inset-0 border-b bg-fresh-white"
        style={
          reducedMotion
            ? { opacity: 1, borderColor: "var(--color-border-sand)" }
            : {
                opacity: backgroundOpacity,
                borderColor,
                boxShadow,
              }
        }
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileNav}
              aria-label="Open menu"
              aria-expanded={false}
              aria-controls="mobile-nav"
            >
              <Menu />
            </Button>

            <Link
              href="/"
              className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={closeAllOverlays}
              aria-label={`${storeConfig.brandName} home`}
            >
              <span className="hidden sm:block">
                <Logo variant="horizontal" className="h-9 w-auto lg:h-10" />
              </span>
              <span className="sm:hidden">
                <Logo variant="monogram" className="size-9" width={36} height={36} />
              </span>
            </Link>
          </div>

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Main navigation"
          >
            {desktopNav.map((link) =>
              link.mega ? (
                <button
                  key={link.label}
                  type="button"
                  className={cn(
                    "rounded-md px-2.5 py-2 text-sm font-semibold text-market-ink transition-colors xl:px-3",
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
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "rounded-md px-2.5 py-2 text-sm font-medium text-market-ink transition-colors hover:bg-produce-mist hover:text-garden-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 xl:px-3",
                    link.className,
                  )}
                  onClick={closeAllOverlays}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
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
              variant="ghost"
              size="icon"
              onClick={toggleCartDrawer}
              aria-label={`Cart${mounted && cartCount > 0 ? `, ${cartCount} items` : ""}`}
              className="relative"
            >
              <ShoppingCart />
              {mounted && cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-citrus-orange text-[10px] font-bold text-fresh-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Button>

            <a
              href={`tel:${storeConfig.phoneE164}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden md:inline-flex gap-1.5",
              )}
              aria-label={`Call ${storeConfig.phoneDisplay}`}
            >
              <Phone className="size-3.5" />
              <span className="hidden lg:inline">Call</span>
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
