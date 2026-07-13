import type { Metadata } from "next";
import { storeConfig } from "@data/store-config";
import { EditorialHero } from "@/components/home/EditorialHero";
import { KitchenMoments } from "@/components/home/KitchenMoments";
import { ProduceMarketBoard } from "@/components/home/ProduceMarketBoard";
import { ColorOfMarket } from "@/components/home/ColorOfMarket";
import { FeaturedGroceryGrid } from "@/components/home/FeaturedGroceryGrid";
import { PantryShelf } from "@/components/home/PantryShelf";
import { ProduceToPantryStory } from "@/components/home/ProduceToPantryStory";
import { RefrigeratedEssentials } from "@/components/home/RefrigeratedEssentials";
import { BasketBuilder } from "@/components/home/BasketBuilder";
import { EverydayCategories } from "@/components/home/EverydayCategories";
import { HowOrderingWorks } from "@/components/home/HowOrderingWorks";
import { FoodInformationBand } from "@/components/home/FoodInformationBand";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Fresh Produce & Everyday Groceries | DC Groceries LLC",
  description:
    "Browse fresh fruit, vegetables, pantry goods, refrigerated items, beverages and household essentials from DC Groceries LLC.",
  openGraph: {
    title: "Fresh Produce & Everyday Groceries | DC Groceries LLC",
    description:
      "Browse fresh fruit, vegetables, pantry goods, refrigerated items, beverages and household essentials from DC Groceries LLC.",
    url: storeConfig.siteUrl,
    siteName: storeConfig.brandName,
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-brand.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fresh Produce & Everyday Groceries | DC Groceries LLC",
    description:
      "Browse fresh fruit, vegetables, pantry goods, refrigerated items, beverages and household essentials from DC Groceries LLC.",
    images: ["/og-brand.png"],
  },
  alternates: {
    canonical: storeConfig.siteUrl,
  },
};

export default function HomePage() {
  return (
    <>
      <EditorialHero />
      <KitchenMoments />
      <ProduceMarketBoard />
      <ColorOfMarket />
      <FeaturedGroceryGrid />
      <PantryShelf />
      <ProduceToPantryStory />
      <RefrigeratedEssentials />
      <BasketBuilder />
      <EverydayCategories />
      <HowOrderingWorks />
      <FoodInformationBand />
      <NewsletterSection />
    </>
  );
}
