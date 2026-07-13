# Tax Setup

Sales tax configuration for DC Groceries online orders.

## Current state

Demo checkout calculates tax as **$0** (`taxCents: 0` in `createOrderDraft()`). Tax display on cart page shows "Calculated at checkout."

## Requirements before live launch

1. Determine nexus states (Georgia home state + states where economic nexus applies)
2. Identify product tax categories:
   - Fresh produce (often exempt or reduced in many states)
   - Grocery/pantry staples
   - Beverages (may differ for juice vs soda)
   - Household goods (often fully taxable)
3. Choose tax calculation provider or manual rate tables

## Recommended approach: Stripe Tax

If using Stripe for payments:

1. Stripe Dashboard → **Settings → Tax**
2. Enable Stripe Tax
3. Register business address (Fairburn, GA)
4. Add product tax codes per SKU category
5. Pass `automatic_tax: { enabled: true }` on PaymentIntents (update `createPaymentIntent()`)

### Product tax codes (examples)

| Category | Stripe tax code |
|----------|-----------------|
| Fresh produce | `txcd_40060003` (food for home consumption — verify per state) |
| Packaged grocery | `txcd_40060003` |
| Household paper goods | `txcd_99999999` (general tangible goods) |

**Consult a tax professional** — grocery taxability varies significantly by state.

## Alternative: Manual tax table

For demo or pre-Stripe-Tax launch:

1. Create `data/tax-rules.ts` with state → rate mapping
2. Apply at checkout based on `shippingAddress.state`
3. Store `taxCents` on order record
4. Display itemized tax on checkout and confirmation email

## Address validation

Checkout uses `addressSchema` in `src/lib/validation.ts`:

- US state: two-letter code
- ZIP: `#####` or `#####-####`

Tax must be calculated on the **shipping address** jurisdiction.

## Exemptions

If selling wholesale or accepting tax-exempt certificates:

- Do not enable until legal/accounting workflow exists
- Document certificate collection and audit trail

## Testing

1. Test GA order → verify GA rate applied
2. Test out-of-state order → verify correct jurisdiction
3. Test mixed cart (produce + household) → verify blended rates if applicable
4. Confirm tax line on order confirmation email

## Launch checklist items

- [ ] Tax provider configured (Stripe Tax or approved alternative)
- [ ] Rates verified for primary shipping states (GA, regional zone)
- [ ] Tax shown at checkout before payment
- [ ] Tax stored on order record (`taxCents`)
- [ ] Policy updated in Terms of Service — [legal-review.md](legal-review.md)

## Record keeping

Retain per order:

- `subtotalCents`, `shippingCents`, `taxCents`, `totalCents`
- Shipping address state/ZIP
- Tax calculation source/reference ID
