import { isDemoMode } from "@data/store-config";
import { validateEnv } from "@/lib/env";

export interface TaxEstimate {
  taxCents: number;
  rateLabel: string | null;
  note: string;
  calculatedAtPayment: boolean;
}

/** Demo tax estimate - actual tax is finalized by Stripe at payment. */
export function calculateTaxEstimate(
  subtotalCents: number,
  state: string
): TaxEstimate {
  const env = validateEnv();
  const hasStripeTax = Boolean(env.STRIPE_SECRET_KEY);

  if (isDemoMode()) {
    return {
      taxCents: 0,
      rateLabel: null,
      note: "Tax calculated at payment.",
      calculatedAtPayment: true,
    };
  }

  if (hasStripeTax) {
    return {
      taxCents: 0,
      rateLabel: null,
      note: "Sales tax will be calculated automatically by Stripe Tax at payment based on your shipping address.",
      calculatedAtPayment: true,
    };
  }

  const demoRate = state.toUpperCase() === "GA" ? 0.07 : 0;
  const taxCents = Math.round(subtotalCents * demoRate);

  return {
    taxCents,
    rateLabel: demoRate > 0 ? `${(demoRate * 100).toFixed(1)}%` : null,
    note:
      demoRate > 0
        ? "Estimated tax for review. Final amount confirmed at payment."
        : "Tax calculated at payment.",
    calculatedAtPayment: demoRate === 0,
  };
}
