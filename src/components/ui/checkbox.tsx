"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId =
      id ??
      (typeof label === "string"
        ? label.replace(/\s+/g, "-").toLowerCase()
        : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "group/chk inline-flex cursor-pointer items-center gap-2.5",
          props.disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <span className="relative flex size-5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="sr-only"
            {...props}
          />
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded border border-border-sand bg-fresh-white transition-colors",
              "group-has-[:checked]/chk:border-market-ink group-has-[:checked]/chk:bg-market-ink",
              "group-has-[:focus-visible]/chk:ring-2 group-has-[:focus-visible]/chk:ring-ring group-has-[:focus-visible]/chk:ring-offset-1",
            )}
            aria-hidden="true"
          >
            <Check className="size-3.5 text-fresh-white opacity-0 transition-opacity group-has-[:checked]/chk:opacity-100" />
          </span>
        </span>
        {label && (
          <span className="text-sm text-market-ink select-none">{label}</span>
        )}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
