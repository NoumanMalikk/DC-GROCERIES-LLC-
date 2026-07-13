"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { products } from "../../../data/products";
import type { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { getProductMainImage } from "@/lib/format";
import { cn } from "@/lib/utils";

const MAX_RESULTS = 8;

function searchProducts(query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return products
    .filter((product) => {
      const haystack = [
        product.title,
        product.brand,
        product.category,
        product.subcategory,
        product.packageSize,
        ...product.searchKeywords,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    })
    .slice(0, MAX_RESULTS);
}

export interface PredictiveSearchProps {
  className?: string;
  placeholder?: string;
  onResultSelect?: () => void;
  autoFocus?: boolean;
}

export function PredictiveSearch({
  className,
  placeholder = "Search products...",
  onResultSelect,
  autoFocus = false,
}: PredictiveSearchProps) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [panelOpen, setPanelOpen] = useState(false);

  const hasQuery = query.trim().length > 0;
  const results = useMemo(
    () => (hasQuery ? searchProducts(query) : []),
    [query, hasQuery],
  );
  const isOpen = panelOpen && hasQuery;
  const announcement = useMemo(() => {
    if (!hasQuery) return "";
    if (results.length === 0) return "No products found";
    return `${results.length} product${results.length === 1 ? "" : "s"} found`;
  }, [hasQuery, results.length]);

  const resultCountLabel = announcement;

  const selectResult = useCallback(
    (product: Product) => {
      setQuery("");
      setPanelOpen(false);
      setActiveIndex(-1);
      onResultSelect?.();
      window.location.href = `/products/${product.slug}`;
    },
    [onResultSelect],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (event.key === "Escape") {
        setQuery("");
        setPanelOpen(false);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1,
        );
        break;
      case "Enter":
        event.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          selectResult(results[activeIndex]);
        } else if (hasQuery) {
          window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
        }
        break;
      case "Escape":
        event.preventDefault();
        setPanelOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-soft-graphite"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen && hasQuery}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-label="Search products"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            const next = e.target.value;
            setQuery(next);
            setPanelOpen(next.trim().length > 0);
            setActiveIndex(next.trim().length > 0 ? 0 : -1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => hasQuery && setPanelOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setPanelOpen(false), 150);
          }}
          autoFocus={autoFocus}
          autoComplete="off"
          className="pl-9"
        />
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {isOpen && hasQuery && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border-sand bg-fresh-white shadow-elevated"
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-soft-graphite">
              No products found for &ldquo;{query.trim()}&rdquo;
            </p>
          ) : (
            <ul
              id={listboxId}
              role="listbox"
              aria-label={resultCountLabel}
              className="max-h-80 overflow-y-auto py-1"
            >
              {results.map((product, index) => {
                const { src, alt } = getProductMainImage(product);
                const isActive = index === activeIndex;

                return (
                  <li
                    key={product.id}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={isActive}
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 transition-colors",
                        isActive
                          ? "bg-produce-mist"
                          : "hover:bg-produce-mist/60",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={(e) => {
                        e.preventDefault();
                        selectResult(product);
                      }}
                    >
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-produce-mist">
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          sizes="40px"
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-market-ink">
                          {product.title}
                        </p>
                        <p className="text-xs text-soft-graphite">
                          {product.packageSize}
                        </p>
                      </div>
                      <PriceDisplay product={product} size="sm" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {results.length > 0 && (
            <div className="border-t border-border-sand px-3 py-2">
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                className="text-xs font-semibold text-garden-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                onClick={onResultSelect}
              >
                View all results for &ldquo;{query.trim()}&rdquo;
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
