"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const mosaicItems = [
  {
    slug: "gala-apples-3lb-bag",
    label: "Gala apples",
    color: "#D84A3A",
    shape: "apple",
    grid: "col-start-1 row-start-1 col-span-2 row-span-2",
  },
  {
    slug: "navel-oranges-4lb-bag",
    label: "Navel oranges",
    color: "#F28C28",
    shape: "citrus",
    grid: "col-start-3 row-start-1 col-span-2 row-span-2",
  },
  {
    slug: "roma-tomatoes-2lb-pack",
    label: "Roma tomatoes",
    color: "#D84A3A",
    shape: "tomato",
    grid: "col-start-1 row-start-3 col-span-2 row-span-2",
  },
  {
    slug: "tri-color-bell-peppers-3-count",
    label: "Bell peppers",
    color: "#386641",
    shape: "pepper",
    grid: "col-start-3 row-start-3 col-span-1 row-span-2",
  },
  {
    slug: "whole-carrots-2lb-bag",
    label: "Whole carrots",
    color: "#F28C28",
    shape: "carrot",
    grid: "col-start-4 row-start-3 col-span-1 row-span-1",
  },
  {
    slug: "baby-spinach-10oz-clamshell",
    label: "Baby spinach",
    color: "#386641",
    shape: "greens",
    grid: "col-start-4 row-start-4 col-span-1 row-span-1",
  },
] as const;

function ProduceShape({ shape, color }: { shape: string; color: string }) {
  switch (shape) {
    case "apple":
      return (
        <svg viewBox="0 0 80 80" className="size-full" aria-hidden="true">
          <circle cx="40" cy="44" r="28" fill={color} opacity="0.85" />
          <path d="M40 18 Q44 8 48 14" stroke="#386641" strokeWidth="3" fill="none" />
          <ellipse cx="46" cy="14" rx="6" ry="3" fill="#386641" opacity="0.7" />
        </svg>
      );
    case "citrus":
      return (
        <svg viewBox="0 0 80 80" className="size-full" aria-hidden="true">
          <circle cx="40" cy="42" r="26" fill={color} opacity="0.9" />
          <circle cx="40" cy="42" r="18" fill="none" stroke="#F2C94C" strokeWidth="2" opacity="0.5" />
          <path d="M40 16 L40 68 M22 42 L58 42 M28 28 L52 56 M52 28 L28 56" stroke="#F2C94C" strokeWidth="1.5" opacity="0.4" />
        </svg>
      );
    case "tomato":
      return (
        <svg viewBox="0 0 80 80" className="size-full" aria-hidden="true">
          <ellipse cx="40" cy="46" rx="24" ry="22" fill={color} opacity="0.88" />
          <path d="M32 26 Q40 18 48 26" fill="#386641" opacity="0.75" />
        </svg>
      );
    case "pepper":
      return (
        <svg viewBox="0 0 80 80" className="size-full" aria-hidden="true">
          <path d="M36 20 Q28 30 30 50 Q32 62 40 66 Q48 62 50 50 Q52 30 44 20 Z" fill="#D84A3A" opacity="0.85" />
          <path d="M44 20 Q48 14 52 18 Q50 24 44 22 Z" fill="#F2C94C" opacity="0.9" />
          <path d="M36 24 Q32 34 34 48 Q36 58 40 60 Q44 58 46 48 Q48 34 40 26 Z" fill="#386641" opacity="0.8" />
        </svg>
      );
    case "carrot":
      return (
        <svg viewBox="0 0 80 80" className="size-full" aria-hidden="true">
          <path d="M38 18 Q42 40 40 68 Q36 68 34 40 Q36 18 38 18" fill={color} opacity="0.9" />
          <path d="M34 18 Q30 10 36 8 M38 16 Q42 8 46 12 M40 14 Q44 6 48 10" stroke="#386641" strokeWidth="2" fill="none" />
        </svg>
      );
    case "greens":
      return (
        <svg viewBox="0 0 80 80" className="size-full" aria-hidden="true">
          <ellipse cx="40" cy="52" rx="22" ry="14" fill={color} opacity="0.35" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${20 + i * 10} 58 Q${24 + i * 8} ${20 + i * 2} ${28 + i * 8} 58`}
              fill="none"
              stroke={color}
              strokeWidth="3"
              opacity="0.75"
            />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

export function EditorialHero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-oat-cream py-12 sm:py-16 lg:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 40%, rgb(237 242 234 / 0.9), transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <motion.p
              className="text-sm font-semibold uppercase tracking-widest text-garden-green"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Produce, pantry and everyday grocery essentials
            </motion.p>

            <motion.h1
              className="font-heading text-4xl font-semibold leading-tight tracking-tight text-market-ink sm:text-5xl lg:text-[3.25rem]"
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              A more colorful way to fill your basket.
            </motion.h1>

            <motion.p
              className="max-w-lg text-lg leading-relaxed text-soft-graphite"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Browse fresh produce, pantry staples and household basics with
              package sizes, units and availability shown clearly—before you
              add anything to your cart.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <Link href="/shop" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Shop Groceries
              </Link>
              <Link
                href="/collections/fresh-produce"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Explore Fresh Produce
              </Link>
            </motion.div>

            <VerificationNotice message="Inventory, labels and product images are verified before live fulfilment." />
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3"
              animate={reducedMotion ? undefined : { scale: [1, 1.02, 1] }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: 12, repeat: Infinity, ease: "easeInOut" }
              }
            >
              {mosaicItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className={cn(
                    "group relative flex items-center justify-center overflow-hidden rounded-2xl border border-border-sand bg-fresh-white p-3 shadow-card transition-shadow hover:shadow-card-hover motion-reduce:transition-none",
                    item.grid,
                  )}
                  aria-label={`View ${item.label}`}
                >
                  <div className="aspect-square w-full max-w-[100px] sm:max-w-[120px]">
                    <ProduceShape shape={item.shape} color={item.color} />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 bg-market-ink/75 px-2 py-1.5 text-center text-[10px] font-medium text-fresh-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-xs">
                    {item.label}
                  </span>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
