export interface ShippingDestination {
  state: string;
  postalCode: string;
  country?: string;
}

export interface DemoShippingQuote {
  subtotalCents: number;
  shippingCents: number;
  totalWeightLb: number;
  zone: "local" | "regional" | "extended";
  estimatedBusinessDays: { min: number; max: number };
  refrigeratedEligible: boolean;
  demoMode: true;
  note: string;
}

export const shippingRules = {
  refrigeratedEligible: false,
  fragileProduceHandlingConfigured: false,
  demoMode: true,
  currency: "USD" as const,
  baseShippingCents: 599,
  perLbCents: 35,
  freeShippingThresholdCents: 7500,
  localStates: ["GA"] as const,
  regionalStates: ["AL", "FL", "SC", "NC", "TN"] as const,
  localZoneMultiplier: 1,
  regionalZoneMultiplier: 1.25,
  extendedZoneMultiplier: 1.6,
  localBusinessDays: { min: 2, max: 4 },
  regionalBusinessDays: { min: 3, max: 6 },
  extendedBusinessDays: { min: 5, max: 10 },
} as const;

function resolveZone(
  destination: ShippingDestination
): DemoShippingQuote["zone"] {
  const state = destination.state.toUpperCase();

  if (
    (shippingRules.localStates as readonly string[]).includes(state)
  ) {
    return "local";
  }

  if (
    (shippingRules.regionalStates as readonly string[]).includes(state)
  ) {
    return "regional";
  }

  return "extended";
}

function zoneMultiplier(zone: DemoShippingQuote["zone"]): number {
  switch (zone) {
    case "local":
      return shippingRules.localZoneMultiplier;
    case "regional":
      return shippingRules.regionalZoneMultiplier;
    case "extended":
      return shippingRules.extendedZoneMultiplier;
  }
}

function businessDaysForZone(
  zone: DemoShippingQuote["zone"]
): DemoShippingQuote["estimatedBusinessDays"] {
  switch (zone) {
    case "local":
      return shippingRules.localBusinessDays;
    case "regional":
      return shippingRules.regionalBusinessDays;
    case "extended":
      return shippingRules.extendedBusinessDays;
  }
}

export function calculateDemoShipping(
  totalWeightLb: number,
  destination: ShippingDestination,
  orderSubtotalCents = 0
): DemoShippingQuote {
  const zone = resolveZone(destination);
  const weightLb = Math.max(0, totalWeightLb);
  const weightChargeCents = Math.round(weightLb * shippingRules.perLbCents);
  const zoneAdjustedBase = Math.round(
    shippingRules.baseShippingCents * zoneMultiplier(zone)
  );
  let shippingCents = zoneAdjustedBase + weightChargeCents;

  if (orderSubtotalCents >= shippingRules.freeShippingThresholdCents) {
    shippingCents = Math.round(shippingCents * 0.5);
  }

  return {
    subtotalCents: orderSubtotalCents,
    shippingCents,
    totalWeightLb: weightLb,
    zone,
    estimatedBusinessDays: businessDaysForZone(zone),
    refrigeratedEligible: shippingRules.refrigeratedEligible,
    demoMode: true,
    note:
      "Demo shipping estimate only. Actual rates, carriers and delivery windows require business review before live fulfilment.",
  };
}

export function canShipRefrigeratedItems(): boolean {
  return shippingRules.refrigeratedEligible;
}

export function isFragileProduceHandlingConfigured(): boolean {
  return shippingRules.fragileProduceHandlingConfigured;
}
