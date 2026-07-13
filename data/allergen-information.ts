export const allergenInformationIntro = {
  title: "Product and Allergen Information",
  summary:
    "How allergen information is presented on DC Groceries and what to know before ordering. This page provides general information only - not medical advice.",
};

export const commonAllergens = [
  "Milk",
  "Eggs",
  "Fish",
  "Crustacean shellfish",
  "Tree nuts",
  "Peanuts",
  "Wheat",
  "Soybeans",
  "Sesame",
] as const;

export const allergenInformationSections = [
  {
    id: "label-authority",
    title: "Product Labels Are Authoritative",
    content: [
      "Allergen information displayed on product pages is pending verification against physical product labels.",
      "Formulations and packaging can change. The label on the product you receive controls when it differs from what is shown on this website.",
      "Always read the ingredient statement and allergen declaration on the physical package before consumption.",
    ],
  },
  {
    id: "cross-contact",
    title: "Cross-Contact and Shared Handling",
    content: [
      "Grocery products may be manufactured in facilities that also process common allergens.",
      "During storage, fulfilment and shipping, products may come into contact with shared equipment or surfaces.",
      "We do not claim an allergen-free environment. Cross-contact risk cannot be eliminated without verified supplier and fulfilment documentation.",
    ],
  },
  {
    id: "severe-allergies",
    title: "Severe Food Allergies",
    content: [
      "If you have a severe food allergy, read every product label carefully and confirm allergen information with us before ordering.",
      "Do not rely solely on website descriptions for allergen decisions. Contact us with the product name and SKU so we can help you review available label information.",
      "This page does not provide medical guidance. Consult a qualified healthcare professional for advice about food allergies and dietary restrictions.",
    ],
  },
  {
    id: "label-changes",
    title: "Label and Formulation Changes",
    content: [
      "Manufacturers may change ingredients, allergen statements or facility information without advance notice to retailers.",
      "We update product pages when verified label changes are received, but there may be a delay between a supplier change and a website update.",
      "If you receive a product whose label differs from the website listing, follow the physical label and contact us with details.",
    ],
  },
  {
    id: "contact",
    title: "Questions About Allergens",
    content: [
      "For questions about a specific product's ingredients or allergen statement, use the Contact page and select Food or allergen information as the topic.",
      "Include the product name and SKU in your message. We will respond based on label information available to us at the time of your inquiry.",
    ],
  },
] as const;
