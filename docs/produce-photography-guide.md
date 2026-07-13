# Produce Photography Guide

In-house workflow for photographing DC Groceries fresh produce and packaged inventory.

## Goal

Capture **exact SKU-accurate** images: the same bag, clamshell, bunch or pack the customer receives.

## Equipment

| Item | Recommendation |
|------|----------------|
| Camera | Smartphone (12MP+) or DSLR |
| Surface | White seamless paper or cream sweep |
| Lighting | Two soft diffused lights at 45°, or shaded north-window daylight |
| Tripod | Optional — improves consistency |
| Scale reference | Small card with SKU printed (not in final crop) |

## Backgrounds

- **Primary:** pure white (`#FFFFFF`) or warm cream (`#F8F2E7`) — match site `--color-fresh-white`
- No busy wood/granite surfaces for primary catalog images
- Lifestyle/secondary images may use kitchen context — never as primary if title says "3 lb Bag"

## What to photograph

| Package type | Show |
|--------------|------|
| Produce bag | Full sealed bag, label/sticker visible, weight printed |
| Clamshell | Closed clamshell front-on, label readable |
| Loose bunch | Full bunch with tie/band, approximate scale |
| Multi-count pack | All items visible (3 peppers, 5 garlic bulbs) |
| Cans/boxes | Front label, size statement legible |

## Variety accuracy

| SKU | Must show | Must NOT show |
|-----|-----------|---------------|
| DC-FRU-001 | Gala apples in 3 lb bag | Fuji, Honeycrisp, loose apples |
| DC-VEG-006 | Elongated Roma tomatoes | Round, cherry, vine tomatoes |
| DC-VEG-007 | Red + yellow + orange peppers | Single-color packs |
| DC-VEG-008 | Yellow onions | Red or white onions |
| DC-HER-013 | Cilantro bunch | Parsley, packaged chopped cilantro |

## Composition

```
┌─────────────────────────┐
│                         │
│    ┌─────────────┐      │
│    │   PRODUCT   │      │  ← centered, 80% frame fill
│    │  (contain)  │      │
│    └─────────────┘      │
│                         │
└─────────────────────────┘
```

- `aspect-ratio: 1 / 1`
- `object-fit: contain`
- Minimum 800×800 px export
- Leave even padding on all sides

## Show package count and weight

- Angle bag so weight sticker faces camera
- For clamshells, ensure net weight on label is readable
- For bunches, include band label if present
- For multi-packs, count items before shooting (3 peppers, 5 bulbs)

## Color accuracy

- Shoot in consistent white balance (5500K daylight)
- Avoid orange saturation boosts
- Compare photo to physical product before approval
- Minor exposure correction only — **no variety-changing edits**

## Avoid over-editing

Prohibited:

- Replacing product pixels with AI
- Swapping colors (red grapes → purple)
- Removing blemishes that customer will see
- Adding text claims not on package

Allowed:

- Crop, straighten, white-balance
- Mild shadow lift
- Background cleanup to pure white

## Scale and context

- Optional second image (`produce-detail`) showing size reference (coin, ruler) — no text overlays on image
- Do not embed price or title text inside image file

## File naming

```
public/products/{sku-lowercase}-{type}.webp
```

| Type | Example |
|------|---------|
| `main` | `dc-fru-001-main.webp` |
| `produce-detail` | `dc-veg-006-produce-detail.webp` |
| `package-size` | `dc-pan-015-package-size.webp` |
| `nutrition-label` | `dc-ref-021-nutrition-label.webp` |

Use lowercase SKU with hyphens. No spaces.

## Compression

1. Export WebP at quality **80–85**
2. Target ≤ 150 KB for 800×800 main images
3. Keep lossless PNG source archived off-repo
4. Run `npm run build` to confirm Next.js image optimizer accepts files

## SKU verification before publish

1. Print SKU label slip next to product during shoot
2. Compare photo to `data/products.ts` title, `variety`, `packageSize`, `packCount`
3. Second person signs off match
4. Update `data/image-credits.ts`:
   - `imageSource: "supplier"` or in-house
   - `dateVerified`, `verifiedBy`
   - `productionStatus: "approved"`
5. Set `imageVerificationStatus: "verified"` on product

## Batch workflow

Recommended shoot order matches [image-sourcing.md](image-sourcing.md) priority tiers:

1. Tier 1 featured items (7 SKUs)
2. Tier 2 high-traffic (9 SKUs)
3. Tier 3 remaining (10 SKUs)

Shoot all bags together, all clamshells together, all bunches together for lighting consistency.

## Testing after upload

```bash
npm run test        # image verification status tests
npm run build       # image paths resolve
npm run test:e2e    # product detail pages render images
```

## Related guides

- [image-sourcing.md](image-sourcing.md) — priority list and missing-image rule
- [campaign-image-guide.md](campaign-image-guide.md) — advertising use of photos
- [food-label-verification.md](food-label-verification.md) — label photos
