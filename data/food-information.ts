export interface FoodInformationSection {
  id: string;
  title: string;
  content: string[];
}

export const foodInformationIntro = {
  title: "Food Information",
  summary:
    "DC Groceries provides clear product details so you can make informed choices. Information on this site is for demonstration until physical inventory and label verification are complete.",
};

export const foodInformationSections: FoodInformationSection[] = [
  {
    id: "label-verification",
    title: "Label and Packaging Verification",
    content: [
      "Product titles, package sizes and variety names in our catalog are written to match the physical items we intend to sell.",
      "Nutrition facts, ingredients, allergen statements and country-of-origin details shown on product pages are placeholders until verified against the actual product label.",
      "Always review the physical product label before consumption. Packaging and formulation may change without notice on the website.",
    ],
  },
  {
    id: "fresh-produce",
    title: "Fresh Produce Handling",
    content: [
      "Fresh produce is sold by the package size or approximate weight listed on each product page.",
      "Some items, such as banana bunches and broccoli crowns, may be priced by estimated weight. Final charges may be adjusted at fulfilment once weight-based pricing is configured.",
      "Produce quality depends on seasonality and supplier availability. Substitutions are not enabled in demo mode.",
    ],
  },
  {
    id: "refrigerated-items",
    title: "Refrigerated and Temperature-Sensitive Items",
    content: [
      "Eggs, milk, yogurt and certain produce items require refrigerated storage and cold-chain shipping.",
      "Refrigerated fulfilment is not yet configured for this storefront. These items are shown for catalog demonstration and may be blocked at checkout.",
      "Do not purchase refrigerated items expecting same-day delivery until cold-chain shipping is confirmed on the shipping policy page.",
    ],
  },
  {
    id: "allergens",
    title: "Allergens and Dietary Information",
    content: [
      "Allergen information displayed on product pages is pending label verification.",
      "If you have food allergies or dietary restrictions, review the physical product label and consult the Product and Allergen Information page before ordering.",
      "We do not guarantee allergen-free handling until supplier and fulfilment processes are documented and approved.",
    ],
  },
  {
    id: "weight-based-pricing",
    title: "Weight-Based Pricing",
    content: [
      "Products marked as weight-based display an estimated weight and demo price.",
      "The demo price is calculated from the estimated weight and may differ from the final charge once the item is weighed at fulfilment.",
      "Weight-based pricing rules will be published on product pages and at checkout before live sales begin.",
    ],
  },
  {
    id: "country-of-origin",
    title: "Country of Origin and Sourcing",
    content: [
      "Country-of-origin information is marked as verification required until supplier documentation is on file.",
      "Origin may vary by season and supplier. The label on the product you receive is the authoritative source.",
    ],
  },
  {
    id: "storage-preparation",
    title: "Storage and Preparation",
    content: [
      "Storage and preparation instructions on product pages are general guidance pending label verification.",
      "Follow storage instructions on the physical product label. Refrigerate perishable items promptly after purchase or delivery.",
      "When in doubt, refer to the manufacturer or distributor information on the product packaging.",
    ],
  },
  {
    id: "demo-mode-notice",
    title: "Demonstration Storefront Notice",
    content: [
      "This storefront operates in demo mode by default. Checkout may be restricted for products that are not production-ready.",
      "Product images are placeholders until exact, legally usable photography is obtained for each SKU.",
      "Contact us through the Contact page if you have questions about a specific product before placing an order.",
    ],
  },
];

export function getFoodInformationSection(
  id: string
): FoodInformationSection | undefined {
  return foodInformationSections.find((s) => s.id === id);
}
