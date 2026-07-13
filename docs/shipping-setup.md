# Shipping Setup

Configure shipping zones, rates and refrigerated fulfilment for DC Groceries.

## Current state (demo)

Shipping logic lives in `data/shipping-rules.ts`:

| Setting | Value |
|---------|-------|
| `refrigeratedEligible` | `false` - cold-chain not configured |
| `demoMode` | `true` |
| Base shipping | $5.99 (`baseShippingCents: 599`) |
| Per-pound surcharge | $0.35/lb |
| Free-shipping threshold | $75.00 (50% shipping discount above threshold) |

## Zones

| Zone | States | Multiplier | Business days |
|------|--------|------------|---------------|
| Local | GA | 1.0× | 2-4 |
| Regional | AL, FL, SC, NC, TN | 1.25× | 3-6 |
| Extended | All other US | 1.6× | 5-10 |

Quote function: `calculateDemoShipping(totalWeightLb, destination, orderSubtotalCents)`

## Enabling live shipping

### 1. Define service area

Update `localStates`, `regionalStates` and business-day ranges in `data/shipping-rules.ts` after carrier contract review.

### 2. Integrate carrier rates

Replace demo calculation with live carrier API (UPS, FedEx, USPS) or flat-rate tables approved by the business.

### 3. Weight calculation

Sum `estimatedWeightLb` (or actual weight) across cart lines. Weight-based items use fulfilled weight at pick/pack.

### 4. Refrigerated fulfilment

Before shipping eggs, milk, yogurt or refrigerated produce:

1. Set `refrigeratedEligible: true` in `data/shipping-rules.ts`
2. Configure insulated packaging and ice packs
3. Define max transit time (typically 1-2 days)
4. Update shipping policy legal copy - [legal-review.md](legal-review.md)
5. Complete [refrigerated-product-readiness.md](refrigerated-product-readiness.md)

Until then, `canShipRefrigeratedItems()` returns `false` and refrigerated products are blocked at checkout.

### 5. Fragile produce

Set `fragileProduceHandlingConfigured: true` when pick/pack SOPs exist for clamshells, bags and bunches.

## Shipping policy page

Content template in `data/legal-config.ts` (`shippingPolicyContent`). Replace `[BUSINESS REVIEW REQUIRED]` placeholders before live launch.

## Checkout integration

- Display zone and estimated business days from `calculateDemoShipping()`
- Show "Calculated at checkout" on cart until address entered
- Block checkout when cart contains refrigerated items and `refrigeratedEligible` is false

## Testing

```bash
npm run test   # tests/unit/shipping.test.ts
```

Manual checks:

- GA address → local zone
- FL address → regional zone
- CA address → extended zone
- Cart over $75 → reduced shipping

## Launch requirements

From QA checklist:

- [ ] Demo shipping replaced or clearly labeled on policy page
- [ ] Refrigerated shipping rules documented
- [ ] Processing times defined
- [ ] Tracking workflow configured - see [order-processing.md](order-processing.md)
- [ ] `localPickupEnabled` / `localDeliveryEnabled` in `data/store-config.ts` remain false until configured
