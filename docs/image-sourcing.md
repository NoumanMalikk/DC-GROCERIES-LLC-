# Image Sourcing

Every catalog product requires an **exact, legally usable** photograph matching the listed title, variety, package size and pack count. Until verified images exist, the site uses `/products/placeholder.svg`.

## Missing image rule

When an exact image is unavailable:

1. Keep `imageVerificationStatus: "missing"`
2. Use `placeholder.svg` as the only gallery image with `type: "placeholder"`
3. Set alt text: `Exact product image required for {title}`
4. Record status `productionStatus: "blocked"` in `data/image-credits.ts`
5. Keep `productionReady: false` - product cannot enter live checkout
6. **Never** substitute a different variety, brand, package size or stock photo

## Priority order for sourcing

Source images in this order (highest business impact first):

### Tier 1 - Featured homepage & breakfast (source first)

| Priority | SKU | Product | Package format |
|----------|-----|---------|----------------|
| 1 | DC-FRU-001 | Gala Apples, 3 lb Bag | Produce bag |
| 2 | DC-FRU-002 | Cavendish Bananas, ~2 lb Bunch | Loose bunch |
| 3 | DC-FRU-005 | Fresh Strawberries, 1 lb Clamshell | Clamshell |
| 4 | DC-REF-021 | Grade A Large White Eggs, 12 Count | Carton |
| 5 | DC-REF-022 | Whole Milk, 1 Gallon | Gallon jug |
| 6 | DC-PAN-016 | Old-Fashioned Rolled Oats, 42 oz | Container |
| 7 | DC-BEV-024 | 100% Apple Juice, 64 fl oz | Bottle |

### Tier 2 - High-traffic produce & pantry

| Priority | SKU | Product | Package format |
|----------|-----|---------|----------------|
| 8 | DC-FRU-003 | Navel Oranges, 4 lb Bag | Produce bag |
| 9 | DC-VEG-006 | Roma Tomatoes, 2 lb Pack | Pack |
| 10 | DC-VEG-007 | Tri-Color Bell Peppers, 3 Count | Multi-count pack |
| 11 | DC-VEG-009 | Russet Potatoes, 5 lb Bag | Produce bag |
| 12 | DC-VEG-012 | Baby Spinach, 10 oz Clamshell | Clamshell |
| 13 | DC-PAN-015 | Long Grain White Rice, 5 lb | Bag |
| 14 | DC-PAN-017 | Spaghetti Pasta, 16 oz Box | Box |
| 15 | DC-PAN-020 | Vegetable Cooking Oil, 48 fl oz | Bottle |
| 16 | DC-HOU-026 | Ultra Paper Towels, 6 Double Rolls | Multi-roll pack |

### Tier 3 - Remaining catalog

| Priority | SKU | Product | Package format |
|----------|-----|---------|----------------|
| 17 | DC-FRU-004 | Seedless Red Grapes, 2 lb Clamshell | Clamshell |
| 18 | DC-VEG-008 | Yellow Onions, 3 lb Bag | Produce bag |
| 19 | DC-VEG-010 | Whole Carrots, 2 lb Bag | Produce bag |
| 20 | DC-VEG-011 | Fresh Broccoli Crowns, ~1.5 lb | Loose crown |
| 21 | DC-HER-013 | Fresh Cilantro, 1 Bunch | Bunch |
| 22 | DC-HER-014 | Fresh Garlic, 5 Bulb Pack | Bulb pack |
| 23 | DC-PAN-018 | Black Beans, 15 oz Can | Can |
| 24 | DC-PAN-019 | Diced Tomatoes, 14.5 oz Can | Can |
| 25 | DC-REF-023 | Plain Greek Yogurt, 32 oz Tub | Tub |
| 26 | DC-SNK-025 | Sea Salt Popcorn, 7 oz Bag | Bag |

## All 26 products - exact image required

| # | SKU | Title | Status |
|---|-----|-------|--------|
| 1 | DC-FRU-001 | Gala Apples, 3 lb Bag | Placeholder - exact Gala 3 lb bag required |
| 2 | DC-FRU-002 | Cavendish Bananas, Approximately 2 lb Bunch | Placeholder - exact Cavendish bunch required |
| 3 | DC-FRU-003 | Navel Oranges, 4 lb Bag | Placeholder - exact Navel 4 lb bag required |
| 4 | DC-FRU-004 | Seedless Red Grapes, 2 lb Clamshell | Placeholder - exact clamshell required |
| 5 | DC-FRU-005 | Fresh Strawberries, 1 lb Clamshell | Placeholder - no bowl shots |
| 6 | DC-VEG-006 | Roma Tomatoes, 2 lb Pack | Placeholder - elongated Roma only |
| 7 | DC-VEG-007 | Tri-Color Bell Peppers, 3 Count Pack | Placeholder - red, yellow, orange |
| 8 | DC-VEG-008 | Yellow Onions, 3 lb Bag | Placeholder - not white/red onion |
| 9 | DC-VEG-009 | Russet Potatoes, 5 lb Bag | Placeholder - bagged format |
| 10 | DC-VEG-010 | Whole Carrots, 2 lb Bag | Placeholder - not baby/loose carrots |
| 11 | DC-VEG-011 | Fresh Broccoli Crowns, Approximately 1.5 lb | Placeholder - not frozen florets |
| 12 | DC-VEG-012 | Baby Spinach, 10 oz Clamshell | Placeholder - not mixed greens |
| 13 | DC-HER-013 | Fresh Cilantro, 1 Bunch | Placeholder - not parsley |
| 14 | DC-HER-014 | Fresh Garlic, 5 Bulb Pack | Placeholder - not peeled/paste |
| 15 | DC-PAN-015 | Long Grain White Rice, 5 lb Bag | Placeholder - not basmati/jasmine |
| 16 | DC-PAN-016 | Old-Fashioned Rolled Oats, 42 oz Container | Placeholder - not instant packets |
| 17 | DC-PAN-017 | Spaghetti Pasta, 16 oz Box | Placeholder - not penne/linguine |
| 18 | DC-PAN-018 | Black Beans, 15 oz Can | Placeholder - not kidney beans |
| 19 | DC-PAN-019 | Diced Tomatoes, 14.5 oz Can | Placeholder - not sauce/crushed |
| 20 | DC-PAN-020 | Vegetable Cooking Oil, 48 fl oz Bottle | Placeholder - not olive/canola |
| 21 | DC-REF-021 | Grade A Large White Eggs, 12 Count | Placeholder - exact grade/size |
| 22 | DC-REF-022 | Whole Milk, 1 Gallon | Placeholder - not 2% or plant milk |
| 23 | DC-REF-023 | Plain Greek Yogurt, 32 oz Tub | Placeholder - not vanilla/cups |
| 24 | DC-BEV-024 | 100% Apple Juice, 64 fl oz Bottle | Placeholder - 100% claim must match label |
| 25 | DC-SNK-025 | Sea Salt Popcorn, 7 oz Bag | Placeholder - not butter/cheese/microwave |
| 26 | DC-HOU-026 | Ultra Paper Towels, 6 Double Rolls | Placeholder - not toilet paper |

## Acceptable image sources

| Source | Permission basis |
|--------|------------------|
| In-house photography | Own copyright - see [produce-photography-guide.md](produce-photography-guide.md) |
| Supplier/manufacturer assets | Written license or brand portal terms |
| Licensed stock | Only if exact product match (rare for grocery) |

Record every source in `data/image-credits.ts`:

- `imageSource`, `sourceOrganization`, `permissionBasis`
- `dateObtained`, `dateVerified`, `verifiedBy`
- `productionStatus`: `blocked` → `pending` → `approved`

## Unacceptable substitutes

- Different apple variety for Gala
- Round/cherry tomatoes for Roma
- Bowl or lifestyle shots as primary produce images
- AI-generated branded packaging
- Competitor brand labels on pantry items
- Generic "fruit assortment" for single-SKU listings

## File naming

```
public/products/{sku-lowercase}-{type}.webp
```

Examples:

- `dc-fru-001-main.webp`
- `dc-ref-021-nutrition-label.webp`

## After sourcing

1. Add images to `public/products/`
2. Update `imageGallery` in `data/products.ts`
3. Set `imageVerificationStatus: "verified"`
4. Update `data/image-credits.ts` → `productionStatus: "approved"`
5. Run `npm run test`

See also: [campaign-image-guide.md](campaign-image-guide.md), [produce-photography-guide.md](produce-photography-guide.md)
