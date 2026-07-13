import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border-sand bg-fresh-white/60 px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-produce-mist text-soft-graphite">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-lg font-semibold text-market-ink">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-soft-graphite">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
