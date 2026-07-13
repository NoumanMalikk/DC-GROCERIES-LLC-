import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

export interface ProductGridProps {
  products: Product[];
  className?: string;
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

export function ProductGrid({
  products,
  className,
  columns = 4,
}: ProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <ul
      className={cn(
        "grid gap-4 sm:gap-6",
        columnClasses[columns],
        className,
      )}
      role="list"
    >
      {products.map((product, index) => (
        <li key={product.id} className="flex">
          <ProductCard
            product={product}
            className="w-full"
            priority={index < 4}
          />
        </li>
      ))}
    </ul>
  );
}
