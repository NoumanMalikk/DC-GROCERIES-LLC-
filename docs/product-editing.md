# Product Editing

How to maintain the 26-product DC Groceries catalog.

## Catalog file

Primary source: `data/products.ts`

Supporting files:

| File | Purpose |
|------|---------|
| `data/categories.ts` | Navigation categories |
| `data/collections.ts` | Collection landing pages |
| `data/image-credits.ts` | Image permission records |
| `src/types/product.ts` | TypeScript `Product` interface |

## Hard rules

1. **Exactly 26 products** - the file throws if count ≠ 26.
2. Every title must include **size, weight or count** (e.g. `3 lb Bag`, `12 Count`, `1 Bunch`).
3. Variety must match imagery (Gala ≠ Fuji, Roma ≠ cherry tomato).
4. No fake branded packaging or AI-generated product photos.
5. Missing images → `placeholder.svg` with `imageVerificationStatus: "missing"`.
6. New products start with `productionReady: false` and `labelVerificationStatus: "pending"`.
7. Do not enable live checkout for unverified products.

## Adding or editing a product

Use the `baseProduct()` helper in `data/products.ts`:

```typescript
baseProduct({
  id: "prod-0XX",
  slug: "product-slug",
  sku: "DC-CAT-0XX",
  title: "Product Name, Size",
  category: "Pantry",
  subcategory: "Rice, Grains and Pasta",
  sellingUnit: "One 16 oz box",
  packageSize: "16 oz",
  packCount: 1,
  demoPrice: 2.99,
  temperatureClass: "ambient",
  availabilityStatus: "verification_required",
  isWeightBased: false,
  featured: false,
  collectionSlugs: ["pantry"],
  freshOrPackaged: "packaged",
  sortOrder: 27, // adjust - must still total 26 items
  // …
})
```

### Required fields

- `id`, `slug`, `sku` (unique)
- `title`, `shortDescription`, `longDescription`
- `category`, `subcategory`, `variety`
- `sellingUnit`, `packageSize`, `packCount`, `netWeight` (where applicable)
- `demoPrice`, `temperatureClass`, `availabilityStatus`
- `searchKeywords`, `seoTitle`, `seoDescription`
- `relatedProductIds`, `crossSellProductIds`
- `collectionSlugs`, `freshOrPackaged`, `sortOrder`

### Weight-based produce

Set `isWeightBased: true` and `estimatedWeightLb` for items sold by approximate weight (bananas, broccoli crowns). Cart math uses `estimateWeightBasedPrice()` in `src/lib/cart-math.ts`.

### Refrigerated items

Set `temperatureClass: "refrigerated"`. Purchase is blocked until cold-chain shipping is configured - see [refrigerated-product-readiness.md](refrigerated-product-readiness.md).

## Marking a product production-ready

Only after **both** image and label verification:

```typescript
productionReady: true,
availabilityStatus: "in_stock",
imageVerificationStatus: "verified",
labelVerificationStatus: "verified",
unitPrice: 5.49,  // live price in dollars
```

Update matching record in `data/image-credits.ts`.

## Image gallery

```typescript
imageGallery: [
  {
    src: "/products/dc-fru-001-main.webp",
    alt: "Gala Apples, 3 lb Bag - front of produce bag",
    type: "main",
    width: 800,
    height: 800,
  },
],
```

Image types: `main`, `front`, `back-label`, `nutrition-label`, `ingredients-label`, `package-size`, `produce-detail`, `placeholder`.

## Verification workflow

1. Photograph or license exact product image → [image-sourcing.md](image-sourcing.md)
2. Verify physical label → [food-label-verification.md](food-label-verification.md)
3. Update `image-credits.ts` permission record
4. Set `productionReady: true` when both pass
5. Run `npm run test` to confirm catalog integrity

## Testing changes

```bash
npm run test        # unit tests assert 26 products and category coverage
npm run typecheck
npm run build
```

## SKU convention

| Prefix | Category |
|--------|----------|
| `DC-FRU` | Fresh fruit |
| `DC-VEG` | Fresh vegetables |
| `DC-HER` | Herbs and aromatics |
| `DC-PAN` | Pantry |
| `DC-REF` | Dairy and refrigerated |
| `DC-BEV` | Beverages |
| `DC-SNK` | Snacks |
| `DC-HOU` | Household |
