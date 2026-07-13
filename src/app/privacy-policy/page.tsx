import type { Metadata } from "next";
import { storeConfig, getContactEmail } from "@data/store-config";
import { LEGAL_PLACEHOLDER } from "@data/legal-config";
import { LegalPage } from "@/components/shared/LegalPage";
import { PolicyContent } from "@/components/shared/PolicyContent";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `How ${storeConfig.brandName} collects and uses information on this website.`,
  path: "/privacy-policy",
});

const contactEmail = getContactEmail();

const privacySections = [
  {
    heading: "Overview",
    body: `${storeConfig.legalName} ("we," "us") operates the ${storeConfig.brandName} website. This policy describes what information this demonstration storefront may collect and how it is used. A complete, attorney-reviewed privacy policy will replace placeholder sections below.\n\n${LEGAL_PLACEHOLDER}`,
  },
  {
    heading: "Information We Collect",
    body: `In demo and live operation, this website may collect:\n\n• Checkout details: name, email address, phone (optional), shipping address and order notes when you place an order.\n• Contact form: name, email, optional phone, topic, message and optional order reference.\n• Newsletter sign-up: email address and consent confirmation.\n• Order lookup: order reference number and email address used at checkout.\n• Cart and browsing: product selections stored in your browser session or local storage.\n• Payment: payment card details are processed by our payment provider (Stripe) and are not stored on our servers.\n\n${LEGAL_PLACEHOLDER}`,
  },
  {
    heading: "How We Use Information",
    body: `We use collected information to process orders, respond to inquiries, send order confirmations, provide tracking updates when available, improve the website and comply with legal obligations. We do not sell personal information.\n\n${LEGAL_PLACEHOLDER}`,
  },
  {
    heading: "Cookies and Analytics",
    body: `This site may use essential cookies and local storage for cart functionality and session management. Analytics or marketing cookies, if enabled, will be described in an updated policy after business review.\n\n${LEGAL_PLACEHOLDER}`,
  },
  {
    heading: "Your Choices",
    body: `You may decline optional communications, request correction of contact details and ask questions about your information by contacting us. Account creation is not required to browse or checkout.\n\n${LEGAL_PLACEHOLDER}`,
  },
  {
    heading: "Contact",
    body: contactEmail
      ? `For privacy questions, contact us at ${contactEmail} or through the Contact page.\n\n${LEGAL_PLACEHOLDER}`
      : `For privacy questions, use the Contact page or call ${storeConfig.phoneDisplay}.\n\n${LEGAL_PLACEHOLDER}`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="What information this website may collect and how it is handled."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Privacy Policy" },
      ]}
    >
      <PolicyContent sections={privacySections} />
    </LegalPage>
  );
}
