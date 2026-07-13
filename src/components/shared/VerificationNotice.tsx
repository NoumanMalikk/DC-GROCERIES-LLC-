import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VerificationNoticeProps {
  message?: string;
  className?: string;
}

export function VerificationNotice({
  message = "Product details and availability are confirmed before fulfilment.",
  className,
}: VerificationNoticeProps) {
  return (
    <div
      role="note"
      className={cn(
        "flex gap-2.5 rounded-md border border-border-sand bg-oat-cream/80 px-3 py-2.5 text-sm text-soft-graphite",
        className,
      )}
    >
      <AlertCircle
        className="mt-0.5 size-4 shrink-0 text-citrus-orange"
        aria-hidden="true"
      />
      <p>{message}</p>
    </div>
  );
}
