import Link from "next/link";
import { Home, Search, ShoppingBag } from "lucide-react";
import { storeConfig } from "@data/store-config";
import { Container } from "@/components/shared/Container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-produce-mist text-garden-green">
        <ShoppingBag className="size-7" aria-hidden="true" />
      </div>

      <h1 className="font-heading text-3xl font-semibold tracking-tight text-market-ink sm:text-4xl">
        Page not found
      </h1>

      <p className="mt-3 max-w-md text-base text-soft-graphite">
        We couldn&apos;t find that page on {storeConfig.brandName}. The product
        or collection may have moved, or the link may be incorrect.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "primary", size: "md" }), "gap-2")}
        >
          <Home className="size-4" />
          Go home
        </Link>
        <Link
          href="/shop"
          className={cn(buttonVariants({ variant: "outline", size: "md" }), "gap-2")}
        >
          <ShoppingBag className="size-4" />
          Browse shop
        </Link>
        <Link
          href="/search"
          className={cn(buttonVariants({ variant: "ghost", size: "md" }), "gap-2")}
        >
          <Search className="size-4" />
          Search products
        </Link>
      </div>
    </Container>
  );
}
