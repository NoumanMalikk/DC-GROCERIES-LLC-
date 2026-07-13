# Refrigerated Product Readiness

Prerequisites for selling temperature-sensitive items online.

## Affected catalog items

| SKU | Product | Class |
|-----|---------|-------|
| DC-FRU-004 | Seedless Red Grapes, 2 lb Clamshell | refrigerated |
| DC-FRU-005 | Fresh Strawberries, 1 lb Clamshell | refrigerated |
| DC-VEG-011 | Fresh Broccoli Crowns, ~1.5 lb | refrigerated |
| DC-VEG-012 | Baby Spinach, 10 oz Clamshell | refrigerated |
| DC-HER-013 | Fresh Cilantro, 1 Bunch | refrigerated |
| DC-REF-021 | Grade A Large White Eggs, 12 Count | refrigerated |
| DC-REF-022 | Whole Milk, 1 Gallon | refrigerated |
| DC-REF-023 | Plain Greek Yogurt, 32 oz Tub | refrigerated |

## Current blocking behavior

`data/shipping-rules.ts`:

```typescript
refrigeratedEligible: false
```

`canShipRefrigeratedItems()` returns `false`, so `canPurchaseProduct()` adds `refrigerated_not_supported` for all refrigerated SKUs — even in demo cart validation.

Cart page shows: *"Your cart includes refrigerated items that require temperature-controlled handling."*

## Readiness checklist

### Inventory and storage

- [ ] Refrigerated storage on-site (walk-in or commercial fridge)
- [ ] FIFO rotation documented
- [ ] Expiration date check at pick time
- [ ] Eggs: Grade A Large White verified on carton
- [ ] Milk: whole gallon — not substituted with 2% or half gallon
- [ ] Yogurt: plain Greek 32 oz tub — not cups or flavored

### Packaging

- [ ] Insulated shipper boxes sized for 1–2 day transit
- [ ] Gel ice packs sufficient for regional zone summer temps
- [ ] Clamshell/produce padding to prevent crushing
- [ ] Egg cartons secured against shock
- [ ] Gallon milk upright orientation markers

### Carrier and transit

- [ ] Carrier service selected with **1–2 day max** transit to regional states
- [ ] No refrigerated items to extended zone until tested
- [ ] Cut-off times for same-day pack (e.g. 12:00 PM ET)
- [ ] Weekend/holiday hold rules defined

### Configuration

- [ ] Set `refrigeratedEligible: true` in `data/shipping-rules.ts`
- [ ] Update shipping policy legal copy
- [ ] Define refrigerated surcharge if applicable
- [ ] Update checkout messaging for cold-chain expectations

### Legal and customer communication

- [ ] Shipping policy section "Refrigerated and Perishable Items" approved
- [ ] Food Information page cold-chain notice updated
- [ ] No promise of same-day delivery until capability exists
- [ ] Return policy for perishables defined — [legal-review.md](legal-review.md)

### Testing

- [ ] Test pack-out with data logger (internal temp ≤ 40°F at delivery simulation)
- [ ] Test summer edge case (GA → FL regional)
- [ ] Place test order with DC-REF-022 + DC-FRU-005
- [ ] Confirm `validateCartForCheckout()` passes when `refrigeratedEligible: true`
- [ ] Run `npm run test` and `npm run test:e2e` (refrigerated-blocking.spec.ts)

## Product page requirements

Refrigerated PDPs must show:

- "Refrigerated" temperature badge
- Storage instructions (after label verification)
- Shipping eligibility notice
- No add-to-cart bypass for blocked state in live mode

## When not ready

Keep:

- `refrigeratedEligible: false`
- Products visible in catalog for demonstration
- Clear blocking message at checkout
- `productionReady: false` until cold-chain SOP signed off

## Go-live sequence

1. Complete checklist above
2. Verify labels and images for all 8 refrigerated SKUs
3. Enable `refrigeratedEligible`
4. Set `productionReady: true` per SKU
5. Limited launch to local (GA) zone first
6. Expand to regional zone after successful fulfilment samples
