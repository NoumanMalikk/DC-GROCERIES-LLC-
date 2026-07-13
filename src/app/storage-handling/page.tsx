import type { Metadata } from "next";
import Link from "next/link";
import {
  storageHandlingIntro,
  storageHandlingSections,
} from "@data/storage-handling";
import { LegalPage } from "@/components/shared/LegalPage";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: storageHandlingIntro.title,
  description: storageHandlingIntro.summary,
  path: "/storage-handling",
});

export default function StorageHandlingPage() {
  return (
    <LegalPage
      title={storageHandlingIntro.title}
      description={storageHandlingIntro.summary}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Storage and Handling" },
      ]}
    >
      <VerificationNotice
        message="Storage guidance on product pages is pending label verification. The physical product label is always authoritative."
        className="mb-8"
      />

      <div className="space-y-10">
        {storageHandlingSections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h2
              id={section.id}
              className="font-heading text-xl font-semibold text-market-ink sm:text-2xl"
            >
              {section.title}
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-soft-graphite">
              {section.content.map((paragraph, index) => (
                <li key={index}>{paragraph}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border-sand bg-fresh-white p-6">
        <p className="text-sm leading-relaxed text-soft-graphite">
          For broader food safety context, see{" "}
          <Link
            href="/food-information"
            className="font-medium text-market-ink underline-offset-2 hover:underline"
          >
            Food Information
          </Link>
          .
        </p>
      </div>
    </LegalPage>
  );
}
