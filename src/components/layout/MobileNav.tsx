"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import {
  getChildCategories,
  getTopLevelCategories,
} from "../../../data/categories";
import { useUIStore } from "@/store/ui";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useFocusTrap<HTMLDivElement>(mobileNavOpen);

  useScrollLock(mobileNavOpen);

  const topLevel = getTopLevelCategories().sort(
    (a, b) => a.navOrder - b.navOrder,
  );

  const close = useCallback(() => {
    setMobileNavOpen(false);
    setExpandedSlug(null);
    setSearchQuery("");
  }, [setMobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen, close]);

  if (!mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-market-ink/40 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={close}
      />
      <nav
        ref={navRef}
        id="mobile-nav"
        aria-label="Mobile navigation"
        className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col border-r border-border-sand bg-fresh-white shadow-elevated"
      >
        <div className="flex items-center justify-between border-b border-border-sand px-4 py-3">
          <span className="font-heading text-base font-semibold text-market-ink">
            Menu
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={close}
            aria-label="Close menu"
          >
            <X />
          </Button>
        </div>

        <div className="border-b border-border-sand px-4 py-3">
          <label htmlFor="mobile-nav-search" className="sr-only">
            Search products
          </label>
          <Input
            id="mobile-nav-search"
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          {searchQuery.trim() && (
            <Link
              href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
              onClick={close}
              className="mt-2 block text-sm font-medium text-garden-green hover:underline"
            >
              Search for &ldquo;{searchQuery.trim()}&rdquo;
            </Link>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          <ul role="list">
            {topLevel.map((category) => {
              const children = getChildCategories(category.slug).sort(
                (a, b) => a.navOrder - b.navOrder,
              );
              const isExpanded = expandedSlug === category.slug;

              return (
                <li key={category.id} className="border-b border-border-sand/60 last:border-0">
                  <div className="flex items-center">
                    <Link
                      href={category.href}
                      onClick={close}
                      className="flex-1 px-2 py-3 text-sm font-semibold text-market-ink"
                    >
                      <span
                        className="mr-2 inline-block size-2 rounded-full"
                        style={{ backgroundColor: category.accentColor }}
                        aria-hidden="true"
                      />
                      {category.name}
                    </Link>
                    {children.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          setExpandedSlug(isExpanded ? null : category.slug)
                        }
                        aria-expanded={isExpanded}
                        aria-controls={`mobile-sub-${category.slug}`}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.name} subcategories`}
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform motion-reduce:transition-none",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </Button>
                    )}
                  </div>

                  {children.length > 0 && isExpanded && (
                    <ul
                      id={`mobile-sub-${category.slug}`}
                      className="pb-2 pl-6"
                      role="list"
                    >
                      {children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.href}
                            onClick={close}
                            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-soft-graphite hover:bg-produce-mist hover:text-market-ink"
                          >
                            <ChevronRight className="size-3.5" aria-hidden="true" />
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-border-sand px-4 py-4 space-y-2">
          <Link
            href="/contact"
            onClick={close}
            className="block text-sm font-medium text-market-ink hover:text-garden-green"
          >
            Contact us
          </Link>
          <Link
            href="/wishlist"
            onClick={close}
            className="block text-sm font-medium text-market-ink hover:text-garden-green"
          >
            Wishlist
          </Link>
        </div>
      </nav>
    </div>
  );
}
