# Campaign Image Guide

Rules for advertising photography, social posts, email campaigns and paid media for DC Groceries.

## Core principle

**Every advertisement must show the exact product being promoted** — same SKU, variety, package size, brand, flavor and pack count as the live catalog listing.

## Required accuracy

| Element | Rule |
|---------|------|
| Product | Exact SKU from `data/products.ts` |
| Variety | Match `variety` field (Gala, Roma, Cavendish, etc.) |
| Package size | Match `packageSize` and `sellingUnit` |
| Brand | Match verified `brand` once configured — no stand-in brands |
| Flavor | Match title (e.g. Plain Greek, Sea Salt, 100% Apple) |
| Pack count | Match `packCount` (3 peppers, 12 eggs, 6 rolls) |
| Weight claims | Match `netWeight` / label verification |

## Prohibited in campaigns

- Fake or mock packaging
- AI-generated branded grocery products
- Unrelated grocery items standing in for catalog SKUs
- Stock photos of different varieties (Fuji for Gala, cherry for Roma)
- Bowl/lifestyle produce shots when the SKU sells a bag or clamshell
- Unverified health claims ("organic", "gluten-free", "superfood") without label proof
- Unverified dietary claims ("keto-friendly", "heart healthy")
- Fake discounts, countdown timers or inflated "was" prices
- Fake testimonials, star ratings or review counts
- Competitor logos or trademarks

## Produce campaigns

- Show the **actual bag, clamshell or bunch** format listed on the product page
- Tri-color pepper ads must show one red, one yellow and one orange pepper
- Weight-based items must note "approximate weight" if shown
- Refrigerated items must not promise delivery timelines until cold-chain is live

## Packaged goods campaigns

- Use front-of-package photography with readable label
- Brand name on image must match verified inventory brand
- Do not promote 48 fl oz oil with a gallon bottle image
- Canned goods: show the exact can size (15 oz vs 14.5 oz)

## Before publishing any creative

1. Cross-check image against SKU in `data/products.ts`
2. Confirm `imageVerificationStatus: "verified"` or dedicated campaign photo on file
3. Confirm label claims match `labelVerificationStatus: "verified"` data
4. Legal review for health/nutrition claims — see [legal-review.md](legal-review.md)
5. Archive source file and permission record in `data/image-credits.ts`

## Demo mode campaigns

While `NEXT_PUBLIC_STORE_MODE=demo`:

- Include "demonstration pricing" or "availability subject to verification" where required
- Do not drive paid traffic to live checkout for unverified SKUs
- Link to Food Information page for allergen and label disclaimers

## Checklist per ad creative

- [ ] SKU identified and matches creative
- [ ] Package format matches (bag/clamshell/bunch/can/box)
- [ ] Variety name correct
- [ ] Pack count visible or stated in copy
- [ ] No unverified health/dietary claims
- [ ] No fake urgency or social proof
- [ ] Image rights documented
- [ ] Refrigerated items only promoted if cold-chain ready
