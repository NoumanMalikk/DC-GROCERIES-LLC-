export type TemperatureClass =
  | "ambient"
  | "refrigerated"
  | "frozen"
  | "household";

export type AvailabilityStatus =
  | "in_stock"
  | "limited"
  | "out_of_stock"
  | "verification_required";

export type VerificationStatus =
  | "pending"
  | "verified"
  | "missing"
  | "rejected";

export type ImageVerificationStatus = VerificationStatus;
export type LabelVerificationStatus = VerificationStatus;

export interface NutritionFacts {
  servingSize: string | null;
  calories: number | null;
  totalFat: string | null;
  saturatedFat: string | null;
  transFat: string | null;
  cholesterol: string | null;
  sodium: string | null;
  totalCarbohydrate: string | null;
  dietaryFiber: string | null;
  totalSugars: string | null;
  protein: string | null;
  note: string;
}

export interface ProductDimensions {
  lengthIn: number | null;
  widthIn: number | null;
  heightIn: number | null;
}

export interface ProductImage {
  src: string;
  alt: string;
  type:
    | "main"
    | "front"
    | "back-label"
    | "nutrition-label"
    | "ingredients-label"
    | "package-size"
    | "produce-detail"
    | "placeholder";
  width: number;
  height: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  supplierSku: string | null;
  title: string;
  category: string;
  subcategory: string;
  brand: string | null;
  variety: string | null;
  sellingUnit: string;
  packageSize: string;
  packCount: number | null;
  netWeight: string | null;
  unitPrice: number | null;
  demoPrice: number;
  currency: "USD";
  shortDescription: string;
  longDescription: string;
  ingredients: string | null;
  nutritionFacts: NutritionFacts;
  allergenInformation: string | null;
  storageInstructions: string | null;
  preparationInstructions: string | null;
  countryOfOrigin: string | null;
  manufacturer: string | null;
  distributor: string | null;
  barcode: string | null;
  weight: number | null;
  dimensions: ProductDimensions;
  temperatureClass: TemperatureClass;
  imageGallery: ProductImage[];
  imageSourceRecord: string;
  imageVerificationStatus: ImageVerificationStatus;
  labelVerificationStatus: LabelVerificationStatus;
  productionReady: boolean;
  availabilityStatus: AvailabilityStatus;
  relatedProductIds: string[];
  crossSellProductIds: string[];
  searchKeywords: string[];
  seoTitle: string;
  seoDescription: string;
  isWeightBased: boolean;
  estimatedWeightLb: number | null;
  featured: boolean;
  collectionSlugs: string[];
  freshOrPackaged: "fresh" | "packaged";
  sortOrder: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}
