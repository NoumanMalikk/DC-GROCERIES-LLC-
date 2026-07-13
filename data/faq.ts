export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "ordering" | "products" | "shipping" | "account" | "general";
}

export const faqItems: FaqItem[] = [
  {
    id: "faq-demo-mode",
    question: "Is this storefront live for purchases?",
    answer:
      "By default, DC Groceries operates in demo mode. You can browse the catalog and explore checkout, but products that are not production-ready may be blocked from purchase. Live sales require completed inventory, label and image verification.",
    category: "ordering",
  },
  {
    id: "faq-place-order",
    question: "How do I place an order?",
    answer:
      "Add items to your cart, proceed to checkout, and enter your shipping and payment details. Order confirmation is sent after payment is processed. If checkout is blocked for an item, the cart will explain why before you pay.",
    category: "ordering",
  },
  {
    id: "faq-product-labels",
    question: "Can I trust the nutrition and allergen information on product pages?",
    answer:
      "Product pages show demo information pending label verification. Nutrition facts, ingredients and allergen statements must be confirmed against the physical product label before live sale. Always read the label on the product you receive.",
    category: "products",
  },
  {
    id: "faq-refrigerated",
    question: "Can I order refrigerated items like milk, eggs or yogurt?",
    answer:
      "Refrigerated fulfilment is not yet configured. Items such as milk, eggs, yogurt and certain produce may appear in the catalog but can be blocked at checkout until cold-chain shipping is approved and enabled.",
    category: "products",
  },
  {
    id: "faq-weight-based",
    question: "Why does my cart show an estimated price for some produce?",
    answer:
      "Some fresh items, such as banana bunches and broccoli crowns, are sold by approximate weight. The price shown is based on an estimated weight. Final pricing may be adjusted at fulfilment once weight-based pricing is live.",
    category: "products",
  },
  {
    id: "faq-shipping-estimates",
    question: "How are shipping costs calculated?",
    answer:
      "Shipping estimates in demo mode are based on total order weight and destination zone. These are illustrative only. Final shipping rates, carriers and delivery windows will be published in the shipping policy before live fulfilment begins.",
    category: "shipping",
  },
  {
    id: "faq-delivery-time",
    question: "When will my order arrive?",
    answer:
      "Delivery timeframes are not guaranteed in demo mode. Estimated business-day ranges shown at checkout are placeholders. Actual processing and transit times depend on inventory availability, carrier selection and destination.",
    category: "shipping",
  },
  {
    id: "faq-track-order",
    question: "How do I track my order?",
    answer:
      "After your order ships, a tracking link may be available on the Track Order page if carrier integration is configured. In demo mode, tracking may not be available for all orders. Use your order reference number and the email address used at checkout to look up status.",
    category: "shipping",
  },
  {
    id: "faq-returns",
    question: "What is your return policy?",
    answer:
      "The returns policy is pending business review. Perishable and opened food items may have limited return eligibility. See the Returns page for the current policy status and contact us with questions before ordering.",
    category: "general",
  },
  {
    id: "faq-contact",
    question: "How do I contact DC Groceries with a product question?",
    answer:
      "Use the Contact page or call the phone number listed in the site footer. For questions about allergens, package size or refrigerated handling, include the product name and SKU so we can respond accurately.",
    category: "general",
  },
];

export function getFaqById(id: string): FaqItem | undefined {
  return faqItems.find((f) => f.id === id);
}

export function getFaqsByCategory(category: FaqItem["category"]): FaqItem[] {
  return faqItems.filter((f) => f.category === category);
}
