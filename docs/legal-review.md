# Legal Review

Process for approving policy pages and public claims before live launch.

## Policy pages

Templates live in `data/legal-config.ts`. All sections currently contain:

```
[BUSINESS REVIEW REQUIRED: insert approved policy]
```

| Page | Route | Slug |
|------|-------|------|
| Privacy Policy | `/privacy` | `privacy` |
| Terms of Service | `/terms` | `terms` |
| Shipping Policy | `/shipping` | `shipping` |
| Returns Policy | `/returns` | `returns` |
| Accessibility Statement | `/accessibility` | `accessibility` |

`hasUnresolvedLegalPlaceholders()` returns `true` until all placeholders are replaced.

## Review workflow

### 1. Draft policies

Owner or legal counsel drafts each section covering:

- DC GROCERIES LLC legal entity
- Fairburn, GA jurisdiction
- Grocery/perishable product specifics
- Online-only storefront (no public retail location claim)
- Data collection (Stripe, Resend, analytics if any)
- Refund rules for perishables

### 2. Business accuracy check

Confirm policies reflect actual operations:

| Claim | Must match config |
|-------|-------------------|
| Business name | `storeConfig.legalName` |
| Contact | `CONTACT_EMAIL`, phone `+1 (331) 731-4338` |
| Location label | `Fairburn, Georgia` — not full street address publicly |
| Pickup/delivery | `localPickupEnabled: false`, `localDeliveryEnabled: false` |
| Store hours | `storeHours: null` — do not display hours |
| Substitutions | `substitutionsEnabled: false` |

### 3. Prohibited public claims

Do not publish until verified:

- Fake testimonials or star ratings
- Fake discounts or urgency
- Unverified health claims (organic, gluten-free, etc.)
- Unverified dietary claims
- Invented email addresses
- "Visit us at" registered mailing address as retail store

### 4. Food and allergen pages

Separate from legal policies but require review:

- `/food-information` — content from `data/food-information.ts`
- `/product-allergen-information` — allergen handling policy

Must state label verification is pending and customers should read physical labels.

### 5. Replace placeholders

Edit `data/legal-config.ts`:

```typescript
{
  heading: "Shipping Areas",
  body: "Approved policy text here…",
}
```

Set `lastUpdated` to ISO date string on each page.

### 6. Sign-off

| Reviewer | Sign-off |
|----------|----------|
| Business owner | Content accuracy |
| Legal counsel | Compliance (recommended) |
| Developer | Placeholders removed; `hasUnresolvedLegalPlaceholders()` false |

## Refrigerated and perishable legal notes

Shipping and Returns policies must address:

- Temperature-sensitive fulfilment limitations until cold-chain live
- Non-returnable perishables after delivery
- Damage reporting window (e.g. 24 hours with photo)

## Payment and tax disclosures

Terms of Service must cover:

- Pricing in USD
- Weight-based price adjustments at fulfilment
- Tax calculation method
- Stripe as payment processor
- Chargeback process

## Privacy considerations

Disclose collection of:

- Name, email, phone, shipping/billing address
- Order history
- Payment tokens (via Stripe — no raw card storage)
- Newsletter email with consent
- Cookies/analytics if enabled

## Accessibility

Accessibility statement should reference:

- Skip link and keyboard navigation
- Reduced motion support
- Contact method for accessibility feedback

## Pre-launch verification

```bash
# Confirm no placeholders remain
npm run test
```

Manual:

- [ ] Read every policy page on mobile and desktop
- [ ] Footer legal links work
- [ ] Contact information consistent across site
- [ ] No `[BUSINESS REVIEW REQUIRED]` visible
- [ ] Checkout terms checkbox links to approved Terms of Service

## Ongoing maintenance

Update `lastUpdated` and republish when:

- Shipping zones change
- Return window changes
- New data processors added
- Refrigerated shipping enabled
- Business address or contact changes
