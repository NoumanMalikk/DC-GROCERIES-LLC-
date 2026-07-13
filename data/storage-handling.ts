export interface StorageHandlingSection {
  id: string;
  title: string;
  content: string[];
}

export const storageHandlingIntro = {
  title: "Storage and Handling",
  summary:
    "General guidance for grocery items sold through DC Groceries. Always follow storage instructions on the physical product label you receive.",
};

export const storageHandlingSections: StorageHandlingSection[] = [
  {
    id: "fresh-produce",
    title: "Fresh Produce",
    content: [
      "Fresh produce is sold by the package size or approximate weight listed on each product page.",
      "Refrigerate perishable produce promptly after purchase or delivery. Storage needs vary by item—refer to the product label.",
      "Produce quality depends on seasonality and supplier availability. Inspect items on receipt and use within a reasonable timeframe for freshness.",
    ],
  },
  {
    id: "refrigerated",
    title: "Refrigerated and Temperature-Sensitive Items",
    content: [
      "Eggs, milk, yogurt and certain produce items require refrigerated storage.",
      "Keep refrigerated items at appropriate temperatures from purchase through storage at home. Do not leave perishable items at room temperature for extended periods.",
      "Refrigerated fulfilment and cold-chain shipping are not yet configured for this storefront. These items may be blocked at checkout until approved processes are in place.",
    ],
  },
  {
    id: "shelf-stable",
    title: "Shelf-Stable Pantry Items",
    content: [
      "Pantry goods such as grains, canned goods, oils and baking essentials should be stored in a cool, dry place unless the product label states otherwise.",
      "Keep packages sealed until use. Check best-by or use-by dates on the physical label and rotate stock so older items are used first.",
      "If a package is damaged, swollen or compromised, do not consume the contents.",
    ],
  },
  {
    id: "frozen",
    title: "Frozen Items",
    content: [
      "Frozen products are not currently offered in the DC Groceries catalog. This section will be updated if frozen items are added.",
      "When frozen items become available, storage and handling guidance will be published here and on individual product pages after label verification.",
    ],
  },
  {
    id: "household",
    title: "Household Essentials",
    content: [
      "Household items should be stored according to manufacturer instructions on the product label.",
      "Keep cleaning and household products away from food preparation areas unless the label indicates food-safe use.",
      "Store out of reach of children and pets when required by the product label.",
    ],
  },
];
