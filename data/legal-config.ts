export const LEGAL_PLACEHOLDER =
  "[BUSINESS REVIEW REQUIRED: insert approved policy]" as const;

export interface PolicyPageContent {
  slug: string;
  title: string;
  lastUpdated: string | null;
  sections: Array<{
    heading: string;
    body: string;
  }>;
}

export const privacyPolicyContent: PolicyPageContent = {
  slug: "privacy",
  title: "Privacy Policy",
  lastUpdated: null,
  sections: [
    {
      heading: "Overview",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Information We Collect",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "How We Use Information",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Cookies and Analytics",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Your Choices",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Contact",
      body: LEGAL_PLACEHOLDER,
    },
  ],
};

export const termsOfServiceContent: PolicyPageContent = {
  slug: "terms",
  title: "Terms of Service",
  lastUpdated: null,
  sections: [
    {
      heading: "Agreement to Terms",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Orders and Acceptance",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Pricing and Payment",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Product Information",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Limitation of Liability",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Governing Law",
      body: LEGAL_PLACEHOLDER,
    },
  ],
};

export const shippingPolicyContent: PolicyPageContent = {
  slug: "shipping",
  title: "Shipping Policy",
  lastUpdated: null,
  sections: [
    {
      heading: "Shipping Areas",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Processing Times",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Shipping Rates",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Refrigerated and Perishable Items",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Tracking",
      body: LEGAL_PLACEHOLDER,
    },
  ],
};

export const returnsPolicyContent: PolicyPageContent = {
  slug: "returns",
  title: "Returns Policy",
  lastUpdated: null,
  sections: [
    {
      heading: "Eligible Returns",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Non-Returnable Items",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "How to Request a Return",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Refunds",
      body: LEGAL_PLACEHOLDER,
    },
  ],
};

export const accessibilityPolicyContent: PolicyPageContent = {
  slug: "accessibility",
  title: "Accessibility Statement",
  lastUpdated: null,
  sections: [
    {
      heading: "Commitment",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Measures",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Feedback",
      body: LEGAL_PLACEHOLDER,
    },
    {
      heading: "Compatibility",
      body: LEGAL_PLACEHOLDER,
    },
  ],
};

export const allPolicyPages: PolicyPageContent[] = [
  privacyPolicyContent,
  termsOfServiceContent,
  shippingPolicyContent,
  returnsPolicyContent,
  accessibilityPolicyContent,
];

export function getPolicyBySlug(slug: string): PolicyPageContent | undefined {
  return allPolicyPages.find((p) => p.slug === slug);
}

export function hasUnresolvedLegalPlaceholders(): boolean {
  return allPolicyPages.some((page) =>
    page.sections.some((section) => section.body.includes(LEGAL_PLACEHOLDER))
  );
}
