import type { Metadata } from "next";
import { storeConfig, getContactEmail } from "@data/store-config";
import {
  accessibilityPolicyContent,
  LEGAL_PLACEHOLDER,
} from "@data/legal-config";
import { LegalPage } from "@/components/shared/LegalPage";
import { PolicyContent } from "@/components/shared/PolicyContent";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Accessibility Statement",
  description: `${storeConfig.brandName} commitment to web accessibility and WCAG 2.2 Level AA conformance.`,
  path: "/accessibility",
});

const contactEmail = getContactEmail();

const accessibilitySections = accessibilityPolicyContent.sections.map(
  (section) => {
    if (section.heading === "Commitment") {
      return {
        ...section,
        body: `${storeConfig.brandName} is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards, including WCAG 2.2 Level AA, where practicable for this storefront.\n\n${LEGAL_PLACEHOLDER}`,
      };
    }
    if (section.heading === "Feedback") {
      return {
        ...section,
        body: contactEmail
          ? `We welcome feedback on the accessibility of this website. Please contact us at ${contactEmail}, through the Contact page, or by phone at ${storeConfig.phoneDisplay} if you encounter accessibility barriers.\n\n${LEGAL_PLACEHOLDER}`
          : `We welcome feedback on the accessibility of this website. Please use the Contact page or call ${storeConfig.phoneDisplay} if you encounter accessibility barriers.\n\n${LEGAL_PLACEHOLDER}`,
      };
    }
    return section;
  },
);

export default function AccessibilityPage() {
  return (
    <LegalPage
      title={accessibilityPolicyContent.title}
      description="Our commitment to accessible design and how to report barriers."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Accessibility" },
      ]}
      lastUpdated={accessibilityPolicyContent.lastUpdated}
    >
      <PolicyContent sections={accessibilitySections} />
    </LegalPage>
  );
}
