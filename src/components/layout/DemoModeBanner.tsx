import { isDemoMode } from "../../../data/store-config";
import { storeConfig } from "../../../data/store-config";

export function DemoModeBanner() {
  if (!isDemoMode()) return null;

  return (
    <div
      role="status"
      className="border-b border-citrus-orange/30 bg-citrus-orange/10 px-4 py-2 text-center text-sm text-market-ink"
    >
      <span className="font-semibold">Demo mode</span>
      <span className="mx-2 text-soft-graphite" aria-hidden="true">
        ·
      </span>
      <span>
        Prices and checkout on {storeConfig.brandName} are for demonstration
        only.
      </span>
    </div>
  );
}
