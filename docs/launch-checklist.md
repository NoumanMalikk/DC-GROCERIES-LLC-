# Launch Checklist

Pre-launch quality assurance for DC Groceries, mapped to project requirements.

Use this checklist before setting `NEXT_PUBLIC_STORE_MODE=live` in production.

**How to use:** Check each item. Run automated commands where noted. Link to detailed guides for configuration tasks.

---

## Repository and build

| # | Item | Command / reference |
|---|------|---------------------|
| 1 | Repository inspected and starter content removed | Manual review |
| 2 | Dependencies installed | `npm install` |
| 3 | TypeScript passes | `npm run typecheck` |
| 4 | Lint passes | `npm run lint` |
| 5 | Unit tests pass | `npm run test` |
| 6 | Playwright tests pass | `npm run test:e2e` |
| 7 | Production build succeeds | `npm run build` |
| 8 | All errors fixed | No CI failures |

---

## Brand and UI

| # | Item | Reference |
|---|------|-----------|
| 9 | DC Groceries brand identity complete | `public/brand/` |
| 10 | Logo family created | logo-horizontal, stacked, monogram |
| 11 | Premium responsive header | `src/components/layout/Header.tsx` |
| 12 | Editorial produce hero | `src/components/home/EditorialHero.tsx` |
| 13 | Every homepage section built | `src/app/page.tsx` |
| 14 | Mobile navigation works | `src/components/layout/MobileNav.tsx` |
| 15 | Responsive layouts tested | Manual + Playwright |
| 16 | Keyboard navigation works | `tests/e2e/a11y-basics.spec.ts` |
| 17 | Reduced motion respected | `src/lib/hooks/use-reduced-motion.ts` |
| 30 | All product cards equal dimensions | Shop, homepage, wishlist grids |
| 31 | Consistent 1:1 image ratio | `aspect-ratio: 1/1; object-fit: contain` |
| 32 | Long titles clamped — no card height shift | Two-line clamp on titles |

---

## Catalog (26 products)

| # | Item | Verification |
|---|------|--------------|
| 9–10 | Exactly 26 products | `npm run test` → `pack-count.test.ts` |
| 11 | Fresh fruit included | DC-FRU-001 through DC-FRU-005 |
| 12 | Fresh vegetables included | DC-VEG-006 through DC-VEG-012 |
| 13 | Herbs included | DC-HER-013, DC-HER-014 |
| 14 | Pantry items included | DC-PAN-015 through DC-PAN-020 |
| 15 | Refrigerated products included | DC-REF-021 through DC-REF-023 + refrigerated produce |
| 16 | Beverages included | DC-BEV-024 |
| 17 | Snacks included | DC-SNK-025 |
| 18 | Household goods included | DC-HOU-026 |
| 19 | Not copied from generic catalog | Unique DC SKU prefix |
| 20 | Every title has size/weight/count | `pack-count.test.ts` |
| 21 | Every image matches exact title | [image-sourcing.md](image-sourcing.md) |
| 22 | Gala ≠ other apple varieties | Visual + SKU review |
| 23 | Roma ≠ other tomato types | Visual + SKU review |
| 24 | Produce package matches count/weight | Label verification |
| 25 | Packaged items match brand and size | [food-label-verification.md](food-label-verification.md) |
| 26 | No fake branded packaging | Image audit |
| 27 | No AI-generated fake products | Image audit |
| 28 | Missing images use placeholder | `food-label-status.test.ts` |
| 29 | Incomplete products blocked from live checkout | `production-readiness.test.ts` |

---

## Shopping functionality

| # | Item | Test |
|---|------|------|
| 33 | Search | `tests/e2e/shop-search.spec.ts` |
| 34 | Produce filters | Manual / shop page filters |
| 35 | Pantry filters | Manual / shop page filters |
| 36 | Sorting | `src/lib/products.ts` sortProducts |
| 37 | Wishlist | `tests/e2e/cart-wishlist.spec.ts` |
| 38 | Cart | `tests/e2e/cart-wishlist.spec.ts` |
| 39 | Quantities | Cart quantity selector |
| 40 | Weight-based notices | Banana/broccoli PDP + cart |
| 41 | Refrigerated restrictions | `tests/e2e/refrigerated-blocking.spec.ts` |

---

## Checkout and payments

| # | Item | Guide |
|---|------|-------|
| 42 | Shipping | [shipping-setup.md](shipping-setup.md) |
| 43 | Tax | [tax-setup.md](tax-setup.md) |
| 44 | Billing | Checkout form validation |
| 45 | Stripe test mode | [payment-setup.md](payment-setup.md) |
| 46 | Webhook verification | Stripe CLI + production endpoint |
| 47 | Idempotent order creation | Webhook handler |
| 48 | Protected order success | Success page requires reference |
| 49 | Confirmation email | [email-setup.md](email-setup.md) |
| 50 | Order tracking | `/track-order` page |
| 75 | End-to-end checkout with production credentials | Full QA order |

---

## Forms and pages

| # | Item | Test |
|---|------|------|
| 51 | Contact forms | `form-validation.test.ts` + manual |
| 52 | Legal pages | `tests/e2e/legal-pages.spec.ts` + [legal-review.md](legal-review.md) |
| 53 | Food-information pages | `/food-information`, `/product-allergen-information` |
| 54 | Mobile navigation | Playwright mobile project (optional) |

---

## Trust and compliance

| # | Item | Config / check |
|---|------|----------------|
| 64 | `/admin` does not exist | `404` on `/admin` |
| 65 | No fake testimonials | Content audit |
| 66 | No fake ratings | Content audit |
| 67 | No fake discounts | Content audit |
| 68 | No unverified health claims | [campaign-image-guide.md](campaign-image-guide.md) |
| 69 | No unverified dietary claims | Label verification |
| 70 | No invented email | `CONTACT_EMAIL` env only |
| 71 | No store hours displayed | `storeHours: null` |
| 72 | Registered address not public store | `showFullBusinessAddress: false` |
| 73 | Local pickup disabled | `localPickupEnabled: false` |
| 74 | Local delivery disabled | `localDeliveryEnabled: false` |

---

## Environment and deployment

| # | Item | Reference |
|---|------|-----------|
| — | `.env.example` complete | Root directory |
| — | Secrets not committed | `.gitignore` → `.env*.local`, `.data/` |
| — | Vercel env vars set | [deployment.md](deployment.md) |
| — | `NEXT_PUBLIC_SITE_URL` correct | Production domain |
| — | Security headers active | `next.config.ts` |

---

## Documentation complete

| Guide | Status |
|-------|--------|
| [setup.md](setup.md) | Local dev |
| [deployment.md](deployment.md) | Vercel |
| [product-editing.md](product-editing.md) | Catalog |
| [image-sourcing.md](image-sourcing.md) | 26-product image list |
| [campaign-image-guide.md](campaign-image-guide.md) | Advertising |
| [produce-photography-guide.md](produce-photography-guide.md) | In-house photos |
| [payment-setup.md](payment-setup.md) | Stripe |
| [shipping-setup.md](shipping-setup.md) | Zones + cold-chain |
| [tax-setup.md](tax-setup.md) | Sales tax |
| [email-setup.md](email-setup.md) | Resend |
| [food-label-verification.md](food-label-verification.md) | Labels |
| [refrigerated-product-readiness.md](refrigerated-product-readiness.md) | Cold-chain |
| [order-processing.md](order-processing.md) | Fulfilment |
| [legal-review.md](legal-review.md) | Policies |

---

## Go-live command

When all items above are checked:

1. Set Vercel `NEXT_PUBLIC_STORE_MODE=live`
2. Deploy production
3. Place one real test order in staging with live keys
4. Monitor Stripe webhooks and Resend delivery for 24 hours

**Do not go live** with placeholder images, unresolved legal copy, or `refrigeratedEligible: false` while selling refrigerated SKUs.
