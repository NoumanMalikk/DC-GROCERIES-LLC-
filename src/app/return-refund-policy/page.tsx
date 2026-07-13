import type { Metadata } from "next";
import { storeConfig } from "@data/store-config";
import { returnsPolicyContent } from "@data/legal-config";
import { LegalPage } from "@/components/shared/LegalPage";
import { PolicyContent } from "@/components/shared/PolicyContent";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Return and Refund Policy",
  description: `Return and refund information for ${storeConfig.brandName}. Policy details pending business review.`,
  path: "/return-refund-policy",
});

export default function ReturnsPolicyPage() {
  return (
    <LegalPage
      title={returnsPolicyContent.title}
      description="Return eligibility and refund procedures. Full policy pending business review."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Return and Refund Policy" },
      ]}
      lastUpdated={returnsPolicyContent.lastUpdated}
    >
      <p className="mb-8 text-base leading-relaxed text-soft-graphite">
        Return windows, eligibility rules and refund timelines are not yet
        published. Perishable and opened food items may have limited return
        eligibility once the policy is finalized. Contact us with questions
        before ordering.
      </p>
      <PolicyContent sections={returnsPolicyContent.sections} />
    </LegalPage>
  );
}
