export const storeConfig = {
  legalName: "DC GROCERIES LLC",
  brandName: "DC Groceries",
  ownerName: "Deresha Denise Cash",
  showOwnerNamePublicly: false,
  phoneDisplay: "+1 (331) 731-4338",
  phoneE164: "+13317314338",
  registeredAddress: {
    line1: "60 Nowell Dr",
    city: "Fairburn",
    state: "GA",
    postalCode: "30213",
    country: "United States",
  },
  publicLocationLabel: "Fairburn, Georgia",
  showFullBusinessAddress: false,
  isPublicStorefront: false,
  storeHours: null as string | null,
  localPickupEnabled: false,
  localDeliveryEnabled: false,
  contactEmail: process.env.CONTACT_EMAIL ?? null,
  currency: "USD" as const,
  defaultCountry: "United States",
  storeMode: (process.env.NEXT_PUBLIC_STORE_MODE ?? "demo") as "demo" | "live",
  tagline: "From produce to pantry, shop with clarity.",
  brandConcept: "Fresh color. Clear choices. Everyday essentials.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  substitutionsEnabled: false,
  socialLinks: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? null,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? null,
    x: process.env.NEXT_PUBLIC_X_URL ?? null,
  },
  announcementMessages: [
    "Fresh produce, pantry goods and household essentials",
    "Package sizes and product details shown clearly",
    "Secure online checkout",
    "Product availability confirmed before fulfilment",
  ],
} as const;

export type StoreConfig = typeof storeConfig;

export function isDemoMode(): boolean {
  return storeConfig.storeMode !== "live";
}

export function isLiveMode(): boolean {
  return storeConfig.storeMode === "live";
}

export function getContactEmail(): string | null {
  return process.env.CONTACT_EMAIL ?? null;
}
