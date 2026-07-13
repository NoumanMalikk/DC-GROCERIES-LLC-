import type { Metadata } from "next";
import { storeConfig } from "@data/store-config";
import CartPageClient from "./cart-client";

export const metadata: Metadata = {
  title: `Cart | ${storeConfig.brandName}`,
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageClient />;
}
