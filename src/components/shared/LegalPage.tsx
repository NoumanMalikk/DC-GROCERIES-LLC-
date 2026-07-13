import { type ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";

export interface LegalPageProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  lastUpdated?: string | null;
  children: ReactNode;
  size?: "default" | "narrow" | "wide";
  className?: string;
}

export function LegalPage({
  title,
  description,
  breadcrumbs,
  lastUpdated,
  children,
  size = "narrow",
  className,
}: LegalPageProps) {
  return (
    <div className={cn("bg-oat-cream py-10 sm:py-14", className)}>
      <Container size={size}>
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <header className="mb-10 space-y-3 border-b border-border-sand pb-8">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-market-ink sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-base leading-relaxed text-soft-graphite">
              {description}
            </p>
          )}
          {lastUpdated && (
            <p className="text-sm text-soft-graphite">
              Last updated: {lastUpdated}
            </p>
          )}
        </header>

        {children}
      </Container>
    </div>
  );
}
