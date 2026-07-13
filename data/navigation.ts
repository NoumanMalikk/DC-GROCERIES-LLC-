export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export interface FooterNavGroup {
  title: string;
  items: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    label: "Fresh Produce",
    href: "/collections/fresh-produce",
    description: "Fruit, vegetables, herbs and aromatics",
    children: [
      {
        label: "Fresh Fruit",
        href: "/collections/fresh-fruit",
        description: "Bagged and clamshell fruit",
      },
      {
        label: "Fresh Vegetables",
        href: "/collections/fresh-vegetables",
        description: "Everyday vegetables with clear pack sizes",
      },
      {
        label: "Herbs and Aromatics",
        href: "/collections/herbs-aromatics",
        description: "Fresh bunches and bulb packs",
      },
    ],
  },
  {
    label: "Pantry",
    href: "/collections/pantry",
    description: "Grains, canned goods, oils and baking",
    children: [
      {
        label: "Rice, Grains and Pasta",
        href: "/collections/pantry?type=rice-grains-pasta",
      },
      {
        label: "Beans and Canned Goods",
        href: "/collections/pantry?type=beans-canned",
      },
      {
        label: "Cooking Oils and Condiments",
        href: "/collections/pantry?type=oils",
      },
      {
        label: "Baking Essentials",
        href: "/collections/pantry?type=baking",
      },
    ],
  },
  {
    label: "Dairy and Refrigerated",
    href: "/collections/dairy-refrigerated",
    description: "Temperature-sensitive grocery items",
  },
  {
    label: "Breakfast",
    href: "/collections/breakfast",
    description: "Morning staples",
  },
  {
    label: "Snacks",
    href: "/collections/snacks",
    description: "Packaged snack items",
  },
  {
    label: "Beverages",
    href: "/collections/beverages",
    description: "Bottled beverages",
  },
  {
    label: "Household Essentials",
    href: "/collections/household",
    description: "Everyday household basics",
  },
  {
    label: "Shop All",
    href: "/shop",
    description: "Browse the full catalog",
  },
];

export const utilityNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Food Information", href: "/food-information" },
  {
    label: "Product and Allergen Information",
    href: "/product-allergen-information",
  },
  { label: "Shipping", href: "/shipping-policy" },
  { label: "Returns", href: "/return-refund-policy" },
  { label: "Track Order", href: "/track-order" },
  { label: "FAQ", href: "/faq" },
];

export const footerNav: FooterNavGroup[] = [
  {
    title: "Shop",
    items: [
      { label: "Fresh Produce", href: "/collections/fresh-produce" },
      { label: "Pantry", href: "/collections/pantry" },
      { label: "Dairy and Refrigerated", href: "/collections/dairy-refrigerated" },
      { label: "Breakfast", href: "/collections/breakfast" },
      { label: "Snacks", href: "/collections/snacks" },
      { label: "Beverages", href: "/collections/beverages" },
      { label: "Household Essentials", href: "/collections/household" },
      { label: "Shop All", href: "/shop" },
    ],
  },
  {
    title: "Customer Service",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping", href: "/shipping-policy" },
      { label: "Returns", href: "/return-refund-policy" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Food and Product Information",
    items: [
      { label: "Food Information", href: "/food-information" },
      {
        label: "Product and Allergen Information",
        href: "/product-allergen-information",
      },
      { label: "Storage and Handling", href: "/storage-handling" },
    ],
  },
  {
    title: "Company",
    items: [{ label: "About", href: "/about" }],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms and Conditions", href: "/terms-conditions" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];
