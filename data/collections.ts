export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  filterHints: string[];
  accentColor: string;
}

export const collections: Collection[] = [
  {
    id: "col-fresh-produce",
    slug: "fresh-produce",
    name: "Fresh Produce",
    description:
      "Fruit, vegetables, herbs and aromatics with clear package sizes and variety names.",
    seoTitle: "Fresh Produce | DC Groceries",
    seoDescription:
      "Shop fresh produce including fruit, vegetables, herbs and aromatics from DC Groceries.",
    filterHints: ["fresh", "produce", "fruit", "vegetables", "herbs"],
    accentColor: "#386641",
  },
  {
    id: "col-fresh-fruit",
    slug: "fresh-fruit",
    name: "Fresh Fruit",
    description:
      "Bagged and clamshell fruit with verified variety names and package formats.",
    seoTitle: "Fresh Fruit | DC Groceries",
    seoDescription:
      "Browse fresh fruit including apples, bananas, oranges, grapes and berries.",
    filterHints: ["fruit", "apples", "bananas", "oranges", "berries", "grapes"],
    accentColor: "#D84A3A",
  },
  {
    id: "col-fresh-vegetables",
    slug: "fresh-vegetables",
    name: "Fresh Vegetables",
    description:
      "Everyday vegetables with pack counts, weight notes and clear selling units.",
    seoTitle: "Fresh Vegetables | DC Groceries",
    seoDescription:
      "Shop fresh vegetables including tomatoes, peppers, onions, potatoes and leafy greens.",
    filterHints: [
      "vegetables",
      "tomatoes",
      "peppers",
      "onions",
      "potatoes",
      "carrots",
      "broccoli",
      "spinach",
    ],
    accentColor: "#386641",
  },
  {
    id: "col-herbs-aromatics",
    slug: "herbs-aromatics",
    name: "Herbs and Aromatics",
    description: "Fresh bunches and bulb packs for everyday cooking.",
    seoTitle: "Herbs and Aromatics | DC Groceries",
    seoDescription:
      "Browse fresh herbs and aromatics including cilantro and garlic.",
    filterHints: ["herbs", "cilantro", "garlic", "aromatics", "bunch"],
    accentColor: "#386641",
  },
  {
    id: "col-pantry",
    slug: "pantry",
    name: "Pantry",
    description:
      "Grains, canned goods, oils, condiments and baking essentials for your kitchen.",
    seoTitle: "Pantry Staples | DC Groceries",
    seoDescription:
      "Shop pantry staples including rice, pasta, beans, canned tomatoes and cooking oil.",
    filterHints: [
      "pantry",
      "rice",
      "pasta",
      "beans",
      "canned",
      "oil",
      "oats",
      "baking",
    ],
    accentColor: "#F2C94C",
  },
  {
    id: "col-dairy-refrigerated",
    slug: "dairy-refrigerated",
    name: "Dairy and Refrigerated",
    description:
      "Temperature-sensitive grocery items requiring verified cold-chain handling.",
    seoTitle: "Dairy and Refrigerated | DC Groceries",
    seoDescription:
      "Browse dairy and refrigerated items including eggs, milk and yogurt.",
    filterHints: ["dairy", "refrigerated", "eggs", "milk", "yogurt", "cold"],
    accentColor: "#18332C",
  },
  {
    id: "col-breakfast",
    slug: "breakfast",
    name: "Breakfast",
    description:
      "Morning staples including oats, eggs, milk, fruit and juice.",
    seoTitle: "Breakfast | DC Groceries",
    seoDescription:
      "Shop breakfast essentials including oats, bananas, eggs, milk and apple juice.",
    filterHints: ["breakfast", "oats", "eggs", "milk", "fruit", "juice"],
    accentColor: "#F28C28",
  },
  {
    id: "col-snacks",
    slug: "snacks",
    name: "Snacks",
    description: "Packaged snack items with verified package sizes.",
    seoTitle: "Snacks | DC Groceries",
    seoDescription: "Browse packaged snacks including popcorn.",
    filterHints: ["snacks", "popcorn"],
    accentColor: "#F28C28",
  },
  {
    id: "col-beverages",
    slug: "beverages",
    name: "Beverages",
    description: "Bottled beverages with clear volume labeling.",
    seoTitle: "Beverages | DC Groceries",
    seoDescription: "Shop beverages including 100% apple juice.",
    filterHints: ["beverages", "juice", "apple juice"],
    accentColor: "#70405A",
  },
  {
    id: "col-household",
    slug: "household",
    name: "Household Essentials",
    description: "Everyday household basics for restocking.",
    seoTitle: "Household Essentials | DC Groceries",
    seoDescription: "Browse household essentials including paper towels.",
    filterHints: ["household", "paper towels", "essentials"],
    accentColor: "#5D615D",
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getAllCollectionSlugs(): string[] {
  return collections.map((c) => c.slug);
}
