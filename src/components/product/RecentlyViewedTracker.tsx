"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/store/recently-viewed";

export interface RecentlyViewedTrackerProps {
  productId: string;
}

export function RecentlyViewedTracker({ productId }: RecentlyViewedTrackerProps) {
  const addProduct = useRecentlyViewedStore((s) => s.addProduct);

  useEffect(() => {
    addProduct(productId);
  }, [productId, addProduct]);

  return null;
}
