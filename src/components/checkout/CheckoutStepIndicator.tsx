"use client";

import { cn } from "@/lib/utils";
import { CHECKOUT_STEPS, type CheckoutStepId } from "./checkout-form-schema";

interface CheckoutStepIndicatorProps {
  currentStep: CheckoutStepId;
  className?: string;
}

export function CheckoutStepIndicator({
  currentStep,
  className,
}: CheckoutStepIndicatorProps) {
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout progress" className={cn("mb-8", className)}>
      <ol className="flex flex-wrap gap-2">
        {CHECKOUT_STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.id === currentStep;

          return (
            <li key={step.id}>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  isCurrent &&
                    "bg-market-ink text-fresh-white",
                  isComplete &&
                    !isCurrent &&
                    "bg-garden-green/15 text-garden-green",
                  !isCurrent &&
                    !isComplete &&
                    "bg-produce-mist text-soft-graphite"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className="sr-only">
                  Step {index + 1} of {CHECKOUT_STEPS.length}:
                </span>
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
