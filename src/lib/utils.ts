import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface FormatPriceOptions {
  /** When true, amount is treated as cents and divided by 100. Default: false (dollars). */
  cents?: boolean;
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Formats a numeric amount as a localized currency string.
 * Pass `cents: true` when the amount is in cents; otherwise amount is in dollars.
 */
export function formatPrice(
  amount: number,
  options: FormatPriceOptions = {}
): string {
  const {
    cents = false,
    currency = "USD",
    locale = "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  const value = cents ? amount / 100 : amount;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/** Alias for formatPrice with explicit currency formatting defaults. */
export function formatCurrency(
  amount: number,
  options: Omit<FormatPriceOptions, "cents"> & { cents?: boolean } = {}
): string {
  return formatPrice(amount, options);
}

/** Converts dollar amount to cents, rounding to nearest cent. */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/** Converts cents to dollar amount. */
export function centsToDollars(cents: number): number {
  return cents / 100;
}
