export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentSlug: string | null;
  accentColor: string;
  accentName: string;
  href: string;
  imageHint: string;
  navOrder: number;
}

export const categories: Category[] = [
  {
    id: "cat-fresh-produce",
    slug: "fresh-produce",
    name: "Fresh Produce",
    description: "Fruit, vegetables, herbs and aromatics with clear package sizes.",
    parentSlug: null,
    accentColor: "#386641",
    accentName: "Garden Green",
    href: "/collections/fresh-produce",
    imageHint: "produce mosaic",
    navOrder: 1,
  },
  {
    id: "cat-fresh-fruit",
    slug: "fresh-fruit",
    name: "Fresh Fruit",
    description: "Bagged and clamshell fruit with verified variety names.",
    parentSlug: "fresh-produce",
    accentColor: "#D84A3A",
    accentName: "Tomato Red",
    href: "/collections/fresh-fruit",
    imageHint: "fruit",
    navOrder: 2,
  },
  {
    id: "cat-fresh-vegetables",
    slug: "fresh-vegetables",
    name: "Fresh Vegetables",
    description: "Everyday vegetables with pack counts and weight notes.",
    parentSlug: "fresh-produce",
    accentColor: "#386641",
    accentName: "Garden Green",
    href: "/collections/fresh-vegetables",
    imageHint: "vegetables",
    navOrder: 3,
  },
  {
    id: "cat-herbs-aromatics",
    slug: "herbs-aromatics",
    name: "Herbs and Aromatics",
    description: "Fresh bunches and bulb packs for cooking.",
    parentSlug: "fresh-produce",
    accentColor: "#386641",
    accentName: "Garden Green",
    href: "/collections/herbs-aromatics",
    imageHint: "herbs",
    navOrder: 4,
  },
  {
    id: "cat-pantry",
    slug: "pantry",
    name: "Pantry",
    description: "Grains, canned goods, oils and baking essentials.",
    parentSlug: null,
    accentColor: "#F2C94C",
    accentName: "Corn Yellow",
    href: "/collections/pantry",
    imageHint: "pantry shelf",
    navOrder: 5,
  },
  {
    id: "cat-rice-grains-pasta",
    slug: "rice-grains-pasta",
    name: "Rice, Grains and Pasta",
    description: "Shelf-stable grains and pasta with clear package sizes.",
    parentSlug: "pantry",
    accentColor: "#F2C94C",
    accentName: "Corn Yellow",
    href: "/collections/pantry?type=rice-grains-pasta",
    imageHint: "rice pasta",
    navOrder: 6,
  },
  {
    id: "cat-beans-canned",
    slug: "beans-canned-goods",
    name: "Beans and Canned Goods",
    description: "Canned beans and tomato products.",
    parentSlug: "pantry",
    accentColor: "#70405A",
    accentName: "Berry Plum",
    href: "/collections/pantry?type=beans-canned",
    imageHint: "canned goods",
    navOrder: 7,
  },
  {
    id: "cat-oils-condiments",
    slug: "cooking-oils-condiments",
    name: "Cooking Oils and Condiments",
    description: "Cooking oils and pantry condiments.",
    parentSlug: "pantry",
    accentColor: "#F28C28",
    accentName: "Citrus Orange",
    href: "/collections/pantry?type=oils",
    imageHint: "oil bottle",
    navOrder: 8,
  },
  {
    id: "cat-baking",
    slug: "baking-essentials",
    name: "Baking Essentials",
    description: "Baking staples when verified inventory is available.",
    parentSlug: "pantry",
    accentColor: "#F8F2E7",
    accentName: "Oat Cream",
    href: "/collections/pantry?type=baking",
    imageHint: "baking",
    navOrder: 9,
  },
  {
    id: "cat-dairy-refrigerated",
    slug: "dairy-refrigerated",
    name: "Dairy and Refrigerated",
    description: "Temperature-sensitive grocery items requiring verified handling.",
    parentSlug: null,
    accentColor: "#18332C",
    accentName: "Market Ink",
    href: "/collections/dairy-refrigerated",
    imageHint: "refrigerated",
    navOrder: 10,
  },
  {
    id: "cat-breakfast",
    slug: "breakfast",
    name: "Breakfast",
    description: "Morning staples including oats, eggs, milk and fruit.",
    parentSlug: null,
    accentColor: "#F28C28",
    accentName: "Citrus Orange",
    href: "/collections/breakfast",
    imageHint: "breakfast",
    navOrder: 11,
  },
  {
    id: "cat-snacks",
    slug: "snacks",
    name: "Snacks",
    description: "Packaged snack items with verified package sizes.",
    parentSlug: null,
    accentColor: "#F28C28",
    accentName: "Citrus Orange",
    href: "/collections/snacks",
    imageHint: "snacks",
    navOrder: 12,
  },
  {
    id: "cat-beverages",
    slug: "beverages",
    name: "Beverages",
    description: "Bottled beverages with clear volume labeling.",
    parentSlug: null,
    accentColor: "#70405A",
    accentName: "Berry Plum",
    href: "/collections/beverages",
    imageHint: "beverages",
    navOrder: 13,
  },
  {
    id: "cat-household",
    slug: "household",
    name: "Household Essentials",
    description: "Everyday household basics for restocking.",
    parentSlug: null,
    accentColor: "#5D615D",
    accentName: "Soft Graphite",
    href: "/collections/household",
    imageHint: "household",
    navOrder: 14,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getChildCategories(parentSlug: string): Category[] {
  return categories.filter((c) => c.parentSlug === parentSlug);
}

export function getTopLevelCategories(): Category[] {
  return categories.filter((c) => c.parentSlug === null);
}
