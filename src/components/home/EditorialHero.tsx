"use client";

import Image from "next/image";
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
    src: "/products/gala-apples-3lb-bag/main.webp",
    grid: "col-start-1 row-start-1 col-span-2 row-span-2",
  },
  {
    slug: "navel-oranges-4lb-bag",
    label: "Navel oranges",
    src: "/products/navel-oranges-4lb-bag/main.webp",
    grid: "col-start-3 row-start-1 col-span-2 row-span-2",
  },
  {
    slug: "roma-tomatoes-2lb-pack",
    label: "Roma tomatoes",
    src: "/products/roma-tomatoes-2lb-pack/main.webp",
    grid: "col-start-1 row-start-3 col-span-2 row-span-2",
  },
  {
    slug: "tri-color-bell-peppers-3-count",
    label: "Bell peppers",
    src: "/products/tri-color-bell-peppers-3-count/main.webp",
    grid: "col-start-3 row-start-3 col-span-1 row-span-2",
  },
  {
    slug: "whole-carrots-2lb-bag",
    label: "Whole carrots",
    src: "/products/whole-carrots-2lb-bag/main.webp",
    grid: "col-start-4 row-start-3 col-span-1 row-span-1",
  },
  {
    slug: "baby-spinach-10oz-clamshell",
    label: "Baby spinach",
    src: "/products/baby-spinach-10oz-clamshell/main.webp",
    grid: "col-start-4 row-start-4 col-span-1 row-span-1",
  },
] as const;

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
              Browse fresh produce, everyday pantry goods, refrigerated items,
              beverages, snacks and household basics through one clearly
              organized grocery storefront.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <Link
                href="/shop"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Shop Groceries
              </Link>
              <Link
                href="/collections/fresh-produce"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Explore Fresh Produce
              </Link>
            </motion.div>

            <VerificationNotice message="Product images, package sizes and food details must match verified inventory records." />
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
          >
            <div className="grid grid-cols-4 grid-rows-4 gap-2.5 sm:gap-3">
              {mosaicItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-border-sand bg-white shadow-card transition-shadow hover:shadow-card-hover motion-reduce:transition-none",
                    item.grid,
                  )}
                  aria-label={`View ${item.label}`}
                >
                  <div className="relative h-full min-h-[88px] w-full sm:min-h-[110px]">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      sizes="(max-width: 768px) 40vw, 20vw"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                      priority={item.slug === "gala-apples-3lb-bag"}
                    />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-market-ink/80 to-transparent px-2 pb-2 pt-6 text-center text-[10px] font-medium text-fresh-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-xs">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
