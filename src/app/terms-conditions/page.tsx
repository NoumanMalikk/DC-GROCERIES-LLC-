import type { Metadata } from "next";
import { storeConfig } from "@data/store-config";
import { termsOfServiceContent } from "@data/legal-config";
import { LegalPage } from "@/components/shared/LegalPage";
import { PolicyContent } from "@/components/shared/PolicyContent";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms and Conditions",
  description: `Terms and conditions for using the ${storeConfig.brandName} website and placing orders.`,
  path: "/terms-conditions",
});

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title={termsOfServiceContent.title}
      description="Terms governing use of this website and purchase of products. Full terms pending business review."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Terms and Conditions" },
      ]}
      lastUpdated={termsOfServiceContent.lastUpdated}
    >
      <p className="mb-8 text-base leading-relaxed text-soft-graphite">
        By using this website or placing an order, you agree to these terms
        once finalized. Placeholder sections below require business and legal
        review before live sales.
      </p>
      <PolicyContent sections={termsOfServiceContent.sections} />
    </LegalPage>
  );
}
