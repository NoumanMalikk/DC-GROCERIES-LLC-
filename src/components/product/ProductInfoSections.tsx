import type { Product, NutritionFacts } from "@/types/product";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface ProductInfoSectionsProps {
  product: Product;
  className?: string;
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="font-heading text-lg font-semibold text-market-ink">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-soft-graphite">{children}</div>
    </section>
  );
}

function NutritionTable({ facts }: { facts: NutritionFacts }) {
  const rows: { label: string; value: string | number | null }[] = [
    { label: "Serving size", value: facts.servingSize },
    { label: "Calories", value: facts.calories },
    { label: "Total fat", value: facts.totalFat },
    { label: "Saturated fat", value: facts.saturatedFat },
    { label: "Trans fat", value: facts.transFat },
    { label: "Cholesterol", value: facts.cholesterol },
    { label: "Sodium", value: facts.sodium },
    { label: "Total carbohydrate", value: facts.totalCarbohydrate },
    { label: "Dietary fiber", value: facts.dietaryFiber },
    { label: "Total sugars", value: facts.totalSugars },
    { label: "Protein", value: facts.protein },
  ];

  const hasValues = rows.some((r) => r.value !== null);

  if (!hasValues) {
    return (
      <p>
        Nutrition facts pending label verification. {facts.note}
      </p>
    );
  }

  return (
    <div>
      <table className="w-full max-w-sm text-sm">
        <tbody>
          {rows.map((row) =>
            row.value !== null ? (
              <tr key={row.label} className="border-b border-border-sand/60">
                <th className="py-1.5 pr-4 text-left font-medium text-market-ink">
                  {row.label}
                </th>
                <td className="py-1.5 text-right tabular-nums">{row.value}</td>
              </tr>
            ) : null,
          )}
        </tbody>
      </table>
      {facts.note && (
        <p className="mt-3 text-xs italic">{facts.note}</p>
      )}
    </div>
  );
}

export function ProductInfoSections({
  product,
  className,
}: ProductInfoSectionsProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <InfoSection title="Description">
        <p>{product.longDescription}</p>
      </InfoSection>

      <Separator />

      <InfoSection title="Ingredients">
        {product.ingredients ? (
          <p>{product.ingredients}</p>
        ) : (
          <p>Ingredients pending label verification.</p>
        )}
      </InfoSection>

      <Separator />

      <InfoSection title="Nutrition">
        <NutritionTable facts={product.nutritionFacts} />
      </InfoSection>

      <Separator />

      <InfoSection title="Allergens">
        {product.allergenInformation ? (
          <p>{product.allergenInformation}</p>
        ) : (
          <p>Allergen information pending label verification.</p>
        )}
      </InfoSection>

      <Separator />

      <InfoSection title="Storage">
        {product.storageInstructions ? (
          <p>{product.storageInstructions}</p>
        ) : (
          <p>
            Store according to package instructions.{" "}
            {product.temperatureClass === "refrigerated"
              ? "Keep refrigerated."
              : product.temperatureClass === "frozen"
                ? "Keep frozen."
                : "Store in a cool, dry place."}
          </p>
        )}
      </InfoSection>

      <Separator />

      <InfoSection title="Preparation">
        {product.preparationInstructions ? (
          <p>{product.preparationInstructions}</p>
        ) : (
          <p>See package for preparation instructions.</p>
        )}
      </InfoSection>

      <Separator />

      <InfoSection title="Origin">
        {product.countryOfOrigin ? (
          <p>Country of origin: {product.countryOfOrigin}</p>
        ) : (
          <p>Country of origin pending verification.</p>
        )}
      </InfoSection>

      <Separator />

      <InfoSection title="Package information">
        <ul className="list-inside list-disc space-y-1">
          <li>Package size: {product.packageSize}</li>
          <li>Selling unit: {product.sellingUnit}</li>
          {product.netWeight && <li>Net weight: {product.netWeight}</li>}
          {product.packCount !== null && (
            <li>Pack count: {product.packCount}</li>
          )}
          {product.barcode && <li>Barcode: {product.barcode}</li>}
        </ul>
      </InfoSection>

      <Separator />

      <InfoSection title="Label notice">
        <p>
          Product packaging, labels and information may change. Please review
          the physical product label before consumption. Image verification
          status: {product.imageVerificationStatus}. Label verification status:{" "}
          {product.labelVerificationStatus}.
        </p>
      </InfoSection>
    </div>
  );
}
