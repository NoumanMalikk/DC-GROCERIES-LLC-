"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  categories,
  getChildCategories,
  getTopLevelCategories,
} from "../../../data/categories";
import { useUIStore } from "@/store/ui";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { cn } from "@/lib/utils";

export function MegaMenu() {
  const megaMenuOpen = useUIStore((s) => s.megaMenuOpen);
  const setMegaMenuOpen = useUIStore((s) => s.setMegaMenuOpen);
  const menuRef = useFocusTrap<HTMLDivElement>(megaMenuOpen, {
    initialFocus: false,
  });
  const triggerRef = useRef<HTMLElement | null>(null);

  const topLevel = getTopLevelCategories().sort(
    (a, b) => a.navOrder - b.navOrder,
  );

  const close = useCallback(() => {
    setMegaMenuOpen(false);
  }, [setMegaMenuOpen]);

  useEffect(() => {
    if (!megaMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [megaMenuOpen, close]);

  useEffect(() => {
    if (megaMenuOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const firstLink =
        menuRef.current?.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
    } else if (triggerRef.current) {
      triggerRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- menuRef is stable
  }, [megaMenuOpen]);

  if (!megaMenuOpen) return null;

  return (
    <div
      ref={menuRef}
      id="mega-menu"
      role="region"
      aria-label="Shop categories"
      className="absolute left-0 right-0 top-full z-40 border-b border-border-sand bg-fresh-white shadow-elevated"
      onMouseLeave={close}
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {topLevel.map((category) => {
          const children = getChildCategories(category.slug).sort(
            (a, b) => a.navOrder - b.navOrder,
          );

          return (
            <div key={category.id} className="space-y-3">
              <Link
                href={category.href}
                onClick={close}
                className="group inline-flex items-center gap-2 font-heading text-base font-semibold text-market-ink transition-colors hover:text-garden-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                style={{ borderLeftColor: category.accentColor }}
              >
                <span
                  className="inline-block h-4 w-1 rounded-full"
                  style={{ backgroundColor: category.accentColor }}
                  aria-hidden="true"
                />
                {category.name}
                <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <p className="text-xs leading-relaxed text-soft-graphite">
                {category.description}
              </p>
              {children.length > 0 && (
                <ul className="space-y-1.5" role="list">
                  {children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={child.href}
                        onClick={close}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-sm text-market-ink transition-colors",
                          "hover:bg-produce-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                        )}
                      >
                        <span
                          className="mr-2 inline-block size-1.5 rounded-full"
                          style={{ backgroundColor: child.accentColor }}
                          aria-hidden="true"
                        />
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        <div className="rounded-xl bg-oat-cream p-5 lg:col-span-1">
          <p className="font-heading text-sm font-semibold text-market-ink">
            Editorial picks
          </p>
          <p className="mt-2 text-xs leading-relaxed text-soft-graphite">
            Browse by category with clear package sizes and availability notes.
          </p>
          <ul className="mt-4 space-y-2" role="list">
            {categories
              .filter((c) => c.parentSlug === null)
              .slice(0, 3)
              .map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={cat.href}
                    onClick={close}
                    className="text-sm font-medium text-garden-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    Shop {cat.name.toLowerCase()}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
