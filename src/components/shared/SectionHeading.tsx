import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-2",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    >
      <Tag className="font-heading text-2xl font-semibold tracking-tight text-market-ink sm:text-3xl">
        {title}
      </Tag>
      {description && (
        <p className="max-w-2xl text-base text-soft-graphite">{description}</p>
      )}
    </div>
  );
}
