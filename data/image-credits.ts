export type ImageSource = "placeholder" | "supplier" | "manufacturer" | "licensed";

export type ProductionStatus = "blocked" | "pending" | "approved";

export interface ImageCreditRecord {
  productId: string;
  sku: string;
  title: string;
  exactVariant: string;
  imageSource: ImageSource;
  sourceOrganization: string;
  permissionBasis: string;
  sourceUrlOrReference: string | null;
  dateObtained: string | null;
  dateVerified: string | null;
  verifiedBy: string | null;
  productionStatus: ProductionStatus;
  notes: string;
}

function creditRecord(
  productId: string,
  sku: string,
  title: string,
  exactVariant: string
): ImageCreditRecord {
  return {
    productId,
    sku,
    title,
    exactVariant,
    imageSource: "placeholder",
    sourceOrganization: "Pending",
    permissionBasis: "Exact product image required",
    sourceUrlOrReference: null,
    dateObtained: null,
    dateVerified: null,
    verifiedBy: null,
    productionStatus: "blocked",
    notes: "Exact legally usable product image unavailable. Using placeholder.",
  };
}

export const imageCredits: ImageCreditRecord[] = [
  creditRecord(
    "prod-001",
    "DC-FRU-001",
    "Gala Apples, 3 lb Bag",
    "Gala variety, 3 lb bag"
  ),
  creditRecord(
    "prod-002",
    "DC-FRU-002",
    "Cavendish Bananas, Approximately 2 lb Bunch",
    "Cavendish variety, approximately 2 lb bunch"
  ),
  creditRecord(
    "prod-003",
    "DC-FRU-003",
    "Navel Oranges, 4 lb Bag",
    "Navel variety, 4 lb bag"
  ),
  creditRecord(
    "prod-004",
    "DC-FRU-004",
    "Seedless Red Grapes, 2 lb Clamshell",
    "Seedless red variety, 2 lb clamshell"
  ),
  creditRecord(
    "prod-005",
    "DC-FRU-005",
    "Fresh Strawberries, 1 lb Clamshell",
    "Strawberry variety, 1 lb clamshell"
  ),
  creditRecord(
    "prod-006",
    "DC-VEG-006",
    "Roma Tomatoes, 2 lb Pack",
    "Roma variety, 2 lb pack"
  ),
  creditRecord(
    "prod-007",
    "DC-VEG-007",
    "Tri-Color Bell Peppers, 3 Count Pack",
    "Red, yellow and orange bell peppers, 3 count pack"
  ),
  creditRecord(
    "prod-008",
    "DC-VEG-008",
    "Yellow Onions, 3 lb Bag",
    "Yellow variety, 3 lb bag"
  ),
  creditRecord(
    "prod-009",
    "DC-VEG-009",
    "Russet Potatoes, 5 lb Bag",
    "Russet variety, 5 lb bag"
  ),
  creditRecord(
    "prod-010",
    "DC-VEG-010",
    "Whole Carrots, 2 lb Bag",
    "Whole carrot variety, 2 lb bag"
  ),
  creditRecord(
    "prod-011",
    "DC-VEG-011",
    "Fresh Broccoli Crowns, Approximately 1.5 lb",
    "Broccoli crown, approximately 1.5 lb"
  ),
  creditRecord(
    "prod-012",
    "DC-VEG-012",
    "Baby Spinach, 10 oz Clamshell",
    "Baby spinach, 10 oz clamshell"
  ),
  creditRecord(
    "prod-013",
    "DC-HER-013",
    "Fresh Cilantro, 1 Bunch",
    "Cilantro, 1 bunch"
  ),
  creditRecord(
    "prod-014",
    "DC-HER-014",
    "Fresh Garlic, 5 Bulb Pack",
    "Garlic, 5 bulb pack"
  ),
  creditRecord(
    "prod-015",
    "DC-PAN-015",
    "Long Grain White Rice, 5 lb Bag",
    "Long grain white rice, 5 lb bag"
  ),
  creditRecord(
    "prod-016",
    "DC-PAN-016",
    "Old-Fashioned Rolled Oats, 42 oz Container",
    "Old-fashioned rolled oats, 42 oz container"
  ),
  creditRecord(
    "prod-017",
    "DC-PAN-017",
    "Spaghetti Pasta, 16 oz Box",
    "Spaghetti pasta, 16 oz box"
  ),
  creditRecord(
    "prod-018",
    "DC-PAN-018",
    "Black Beans, 15 oz Can",
    "Black beans, 15 oz can"
  ),
  creditRecord(
    "prod-019",
    "DC-PAN-019",
    "Diced Tomatoes, 14.5 oz Can",
    "Diced tomatoes, 14.5 oz can"
  ),
  creditRecord(
    "prod-020",
    "DC-PAN-020",
    "Vegetable Cooking Oil, 48 fl oz Bottle",
    "Vegetable cooking oil, 48 fl oz bottle"
  ),
  creditRecord(
    "prod-021",
    "DC-REF-021",
    "Grade A Large White Eggs, 12 Count",
    "Grade A large white eggs, 12 count carton"
  ),
  creditRecord(
    "prod-022",
    "DC-REF-022",
    "Whole Milk, 1 Gallon",
    "Whole milk, 1 gallon container"
  ),
  creditRecord(
    "prod-023",
    "DC-REF-023",
    "Plain Greek Yogurt, 32 oz Tub",
    "Plain Greek yogurt, 32 oz tub"
  ),
  creditRecord(
    "prod-024",
    "DC-BEV-024",
    "100% Apple Juice, 64 fl oz Bottle",
    "100% apple juice, 64 fl oz bottle"
  ),
  creditRecord(
    "prod-025",
    "DC-SNK-025",
    "Sea Salt Popcorn, 7 oz Bag",
    "Sea salt popcorn, 7 oz bag"
  ),
  creditRecord(
    "prod-026",
    "DC-HOU-026",
    "Ultra Paper Towels, 6 Double Rolls",
    "Ultra paper towels, 6 double rolls"
  ),
];

if (imageCredits.length !== 26) {
  throw new Error(
    `Expected exactly 26 image credit records, found ${imageCredits.length}`
  );
}

export function getImageCreditByProductId(
  productId: string
): ImageCreditRecord | undefined {
  return imageCredits.find((r) => r.productId === productId);
}

export function getImageCreditBySku(
  sku: string
): ImageCreditRecord | undefined {
  return imageCredits.find((r) => r.sku === sku);
}

export function getBlockedImageCredits(): ImageCreditRecord[] {
  return imageCredits.filter((r) => r.productionStatus === "blocked");
}
