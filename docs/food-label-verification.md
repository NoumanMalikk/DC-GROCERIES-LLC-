# Food Label Verification

Workflow for verifying product labels before live sale.

## Why verification matters

Catalog nutrition facts, ingredients, allergens, country of origin and brand names are **placeholders** until matched to physical inventory. Selling with incorrect label data creates legal and customer safety risk.

## Status fields

Each product in `data/products.ts` tracks:

| Field | Initial value | Verified value |
|-------|---------------|----------------|
| `labelVerificationStatus` | `pending` | `verified` |
| `imageVerificationStatus` | `missing` | `verified` |
| `productionReady` | `false` | `true` |
| `availabilityStatus` | `verification_required` | `in_stock` |

## Verification checklist per SKU

For each of the 26 products:

### 1. Physical label review

- [ ] Product in hand matches catalog title and `packageSize`
- [ ] Variety matches (Gala, Roma, Cavendish, etc.)
- [ ] Brand name recorded (pantry/refrigerated/packaged items)
- [ ] Net weight / count matches listing
- [ ] UPC/barcode recorded in `barcode` field

### 2. Nutrition panel (packaged items)

- [ ] Serving size transcribed to `nutritionFacts.servingSize`
- [ ] Calories, fats, carbs, protein entered
- [ ] Panel photographed → `nutrition-label` image type

### 3. Ingredients and allergens

- [ ] Full ingredients list in `ingredients`
- [ ] Allergen statement in `allergenInformation` (e.g. "Contains: milk, soy")
- [ ] Allergen label photographed → `ingredients-label` image type

### 4. Origin and supplier

- [ ] `countryOfOrigin` from label (not guessed)
- [ ] `manufacturer` and `distributor` from label
- [ ] Supplier documentation on file

### 5. Storage and preparation

- [ ] `storageInstructions` from label
- [ ] `preparationInstructions` if applicable

### 6. Claims audit

Reject or correct any catalog copy that claims:

- Organic, non-GMO, gluten-free, heart healthy — **unless printed on verified label**
- "100%" juice — must match label (see DC-BEV-024)
- Grade/size for eggs — must match carton (DC-REF-021)

## Produce-specific rules

Fresh produce may lack full nutrition panels. For produce:

- Verify variety, pack weight and count visually
- Record `countryOfOrigin` when sticker present
- Use `pending` nutrition with the standard disclaimer in `nutritionFacts.note`

## Weight-based items

Products with `isWeightBased: true`:

- Bananas (DC-FRU-002)
- Broccoli crowns (DC-VEG-011)

Document price-per-pound rule on label or scale ticket. Update `unitPrice` logic before live mode.

## Blocking live checkout

`canPurchaseProduct()` in `src/lib/production-readiness.ts` blocks in live mode when:

- `productionReady` is false
- `availabilityStatus` is `verification_required`

Demo mode allows catalog browsing but still shows verification notices.

## Documentation trail

Maintain per SKU:

1. Photos of front, back, nutrition and ingredient labels
2. Date verified and reviewer name
3. Supplier invoice or receipt (optional)
4. Update `data/image-credits.ts` and product record

## Sign-off

| Role | Responsibility |
|------|----------------|
| Inventory manager | Physical product match |
| Owner / compliance | Final approval for live sale |
| Developer | Update `data/products.ts` fields |

After sign-off:

```typescript
labelVerificationStatus: "verified",
productionReady: true,  // only when images also verified
availabilityStatus: "in_stock",
unitPrice: <live price>,
```

## Testing

```bash
npm run test   # food-label-status.test.ts, production-readiness.test.ts
```

## Customer-facing pages

- [Food Information](/food-information) — general guidance
- [Product and Allergen Information](/product-allergen-information) — detailed allergen policy
- Product pages show `labelVerificationStatus` in info sections

Always instruct customers to **review the physical label** before consumption.
