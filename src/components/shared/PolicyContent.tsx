import { LEGAL_PLACEHOLDER } from "@data/legal-config";
import { cn } from "@/lib/utils";

export interface PolicySection {
  heading: string;
  body: string;
}

export interface PolicyContentProps {
  sections: PolicySection[];
  className?: string;
}

function PlaceholderNotice() {
  return (
    <div
      role="note"
      className="rounded-lg border border-amber-400/60 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-market-ink"
    >
      <p className="font-medium text-amber-950">{LEGAL_PLACEHOLDER}</p>
    </div>
  );
}

function PolicyBody({ body }: { body: string }) {
  if (body.trim() === LEGAL_PLACEHOLDER) {
    return <PlaceholderNotice />;
  }

  const parts = body.split(LEGAL_PLACEHOLDER);

  return (
    <div className="space-y-3 text-base leading-relaxed text-soft-graphite">
      {parts.map((part, partIndex) => (
        <div key={partIndex} className="space-y-3">
          {part
            .split("\n\n")
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={`${partIndex}-${index}`}>{paragraph}</p>
            ))}
          {partIndex < parts.length - 1 && <PlaceholderNotice />}
        </div>
      ))}
    </div>
  );
}

export function PolicyContent({ sections, className }: PolicyContentProps) {
  return (
    <div className={cn("space-y-10", className)}>
      {sections.map((section) => (
        <section key={section.heading} aria-labelledby={section.heading}>
          <h2
            id={section.heading}
            className="font-heading text-xl font-semibold text-market-ink sm:text-2xl"
          >
            {section.heading}
          </h2>
          <div className="mt-4">
            <PolicyBody body={section.body} />
          </div>
        </section>
      ))}
    </div>
  );
}
