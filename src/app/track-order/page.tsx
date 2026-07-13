import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/track-order/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track order",
  description: "Look up your DC Groceries order by reference and email.",
};

export default function TrackOrderPage() {
  return <TrackOrderForm />;
}
