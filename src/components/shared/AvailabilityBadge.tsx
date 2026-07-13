import type { AvailabilityStatus } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  AvailabilityStatus,
  { label: string; variant: "success" | "warning" | "danger" | "muted" }
> = {
  in_stock: { label: "In stock", variant: "success" },
  limited: { label: "Limited", variant: "warning" },
  out_of_stock: { label: "Out of stock", variant: "danger" },
  verification_required: {
    label: "Verify availability",
    variant: "muted",
  },
};

export interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  className?: string;
}

export function AvailabilityBadge({ status, className }: AvailabilityBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
