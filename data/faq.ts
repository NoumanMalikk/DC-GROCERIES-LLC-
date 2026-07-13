export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "ordering" | "products" | "shipping" | "account" | "general";
}

export const faqItems: FaqItem[] = [
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
      "Product pages show catalog information that is confirmed against physical labels before fulfilment. Nutrition facts, ingredients and allergen statements on the product you receive are authoritative. Always read the label on the product you receive.",
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
      "Some fresh items, such as banana bunches and broccoli crowns, are sold by approximate weight. The price shown is based on an estimated weight. Final pricing may be adjusted at fulfilment once the item is weighed.",
    category: "products",
  },
  {
    id: "faq-shipping-estimates",
    question: "How are shipping costs calculated?",
    answer:
      "Shipping estimates are based on total order weight and destination zone. Final shipping rates, carriers and delivery windows are confirmed in the shipping policy and at checkout.",
    category: "shipping",
  },
  {
    id: "faq-delivery-time",
    question: "When will my order arrive?",
    answer:
      "Estimated business-day ranges are shown at checkout. Actual processing and transit times depend on inventory availability, carrier selection and destination.",
    category: "shipping",
  },
  {
    id: "faq-track-order",
    question: "How do I track my order?",
    answer:
      "After your order ships, a tracking link may be available on the Track Order page if carrier integration is configured. Use your order reference number and the email address used at checkout to look up status.",
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
