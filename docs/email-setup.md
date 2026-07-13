# Email Setup (Resend)

Configure transactional email for DC Groceries using [Resend](https://resend.com).

## Environment variables

```env
RESEND_API_KEY=re_…
EMAIL_FROM=orders@yourdomain.com
CONTACT_EMAIL=hello@yourdomain.com
```

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Server-side API authentication |
| `EMAIL_FROM` | Sender for order confirmations, shipping updates |
| `CONTACT_EMAIL` | Recipient for contact form submissions |

## Setup steps

### 1. Create Resend account

Sign up at [resend.com](https://resend.com) under DC GROCERIES LLC business details.

### 2. Verify sending domain

1. **Domains → Add Domain** (e.g. `dcgroceries.com`)
2. Add DNS records (SPF, DKIM, DMARC) per Resend instructions
3. Wait for verification status **Verified**

### 3. Configure sender addresses

Recommended addresses:

| Address | Use |
|---------|-----|
| `orders@yourdomain.com` | `EMAIL_FROM` - transactional |
| `hello@yourdomain.com` | `CONTACT_EMAIL` - customer inquiries |
| `noreply@yourdomain.com` | Optional system notices |

**Do not use invented or unverified email addresses** on the public site.

### 4. Implement email routes

| Email type | Trigger | Route |
|------------|---------|-------|
| Order confirmation | `payment_intent.succeeded` webhook | Server action / API route |
| Shipping notification | Order status → `shipped` | Admin fulfilment trigger |
| Contact form | Form submission | `src/app/api/contact/route.ts` |
| Newsletter | Subscription | `src/app/api/newsletter/route.ts` |

Resend SDK is installed (`resend` package).

Example send pattern:

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: process.env.EMAIL_FROM!,
  to: customer.email,
  subject: `Order confirmed - ${order.reference}`,
  html: renderOrderConfirmation(order),
});
```

## Email content requirements

### Order confirmation must include

- Order reference (`DCG-XXXXXXXXXXXX`)
- Line items with SKU, title, quantity, price
- Subtotal, shipping, tax, total
- Shipping address
- Link to [track order](/track-order) page
- Food information disclaimer for pending label verification

### Must not include

- Unverified health or dietary claims
- Fake urgency ("only 2 left!")
- Incorrect product images

## Demo mode

When `NEXT_PUBLIC_STORE_MODE=demo`:

- Prefix subject with `[Demo]` or include demo disclaimer in body
- Optionally redirect all mail to a staging inbox

## Testing

```bash
# Resend test mode / sandbox
RESEND_API_KEY=re_test_…
```

1. Place test order with Stripe test card
2. Confirm email received with correct reference and totals
3. Submit contact form → verify delivery to `CONTACT_EMAIL`
4. Check Resend dashboard for bounce/complaint rates

## Rate limiting

Contact and newsletter routes should use `src/lib/rate-limit.ts` to prevent abuse.

## Launch checklist

- [ ] Domain verified in Resend
- [ ] `EMAIL_FROM` and `CONTACT_EMAIL` set in Vercel production
- [ ] Order confirmation template reviewed
- [ ] Shipping update template reviewed
- [ ] Unsubscribe/consent on newsletter (already required in `newsletterSchema`)
- [ ] Privacy policy mentions email collection - [legal-review.md](legal-review.md)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 403 from Resend | Verify domain; check API key |
| Emails to spam | Complete SPF/DKIM/DMARC; warm up domain |
| Missing order email | Check webhook handler; verify `RESEND_API_KEY` in env |
| Contact form silent failure | Confirm `CONTACT_EMAIL` is set |
