import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-market-ink text-fresh-white",
        secondary: "bg-produce-mist text-market-ink",
        outline: "border border-border-sand text-market-ink bg-fresh-white",
        citrus: "bg-citrus-orange/15 text-citrus-orange",
        success: "bg-garden-green/15 text-garden-green",
        warning: "bg-corn-yellow/25 text-market-ink",
        danger: "bg-tomato-red/15 text-tomato-red",
        muted: "bg-soft-graphite/10 text-soft-graphite",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
