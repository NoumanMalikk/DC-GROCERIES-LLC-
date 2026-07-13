# Payment Setup (Stripe)

Configure Stripe for DC Groceries checkout.

## Overview

| Component | Location |
|-----------|----------|
| Server helpers | `src/lib/stripe/server.ts` |
| Client loader | `src/lib/stripe/client.ts` |
| Env validation | `src/lib/env.ts` |
| Webhook route | `src/app/api/stripe/webhook/route.ts` (when deployed) |

## Environment variables

```env
STRIPE_SECRET_KEY=sk_test_…
STRIPE_WEBHOOK_SECRET=whsec_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…
```

Optional explicit mode override:

```env
STRIPE_MODE=test   # or live
```

`getStripeMode()` infers mode from key prefix (`sk_test_` / `sk_live_`) when `STRIPE_MODE` is unset.

## Setup steps

### 1. Create Stripe account

1. Register at [stripe.com](https://stripe.com) for DC GROCERIES LLC
2. Complete business verification
3. Enable **Cards** payment method

### 2. Get API keys

Dashboard → **Developers → API keys**

| Key | Env variable | Exposure |
|-----|--------------|----------|
| Publishable | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-safe |
| Secret | `STRIPE_SECRET_KEY` | Server only |

Use **test keys** until launch checklist is complete.

### 3. Configure webhook

1. **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
3. Select events:
 - `payment_intent.succeeded`
 - `payment_intent.payment_failed`
 - `charge.refunded`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

For local testing use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4. Payment flow

1. Customer submits checkout form
2. Server creates `PaymentIntent` via `createPaymentIntent()` with amount in **cents**
3. Client confirms payment with Stripe.js
4. Webhook updates order status to `paid`
5. Confirmation email sent via Resend

Order references use `DCG-XXXXXXXXXXXX` format from `src/lib/orders.ts`.

## Demo vs live

| Mode | Stripe behavior |
|------|-----------------|
| Demo (`NEXT_PUBLIC_STORE_MODE=demo`) | Checkout may simulate or skip live charge; banner shown |
| Live | Real PaymentIntents; unverified products blocked |

`isStripeConfigured()` returns true only when both secret and publishable keys are set.

## Security

- Never expose `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` client-side
- Always verify webhook signatures via `constructWebhookEvent()`
- Use idempotent order creation (check existing order before creating duplicate on webhook retry)
- Store `stripePaymentIntentId` on order record

## Testing

```bash
# Unit tests
npm run test

# Stripe test cards
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002
```

Confirm in Stripe Dashboard → **Payments** (test mode).

## Go-live

1. Switch to live API keys in Vercel production env
2. Update webhook endpoint to production URL
3. Set `NEXT_PUBLIC_STORE_MODE=live`
4. Complete [launch-checklist.md](launch-checklist.md) items 43-48 (shipping, tax, billing, Stripe, webhook, idempotent orders)

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| `STRIPE_SECRET_KEY is not configured` | Add key to `.env.local` / Vercel |
| Webhook 400 invalid signature | Verify `STRIPE_WEBHOOK_SECRET` matches endpoint |
| Payment succeeds but order not updated | Check webhook delivery logs; ensure idempotent handler |
| Wrong amount charged | Amounts must be in cents; verify `calculateSubtotalCents()` |
