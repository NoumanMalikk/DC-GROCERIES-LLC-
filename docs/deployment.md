# Deployment (Vercel)

Deploy the DC Groceries storefront to [Vercel](https://vercel.com) for production hosting.

## Initial setup

1. Push the repository to GitHub (or GitLab/Bitbucket).
2. Import the project in Vercel → **Add New Project**.
3. Framework preset: **Next.js** (auto-detected).
4. Build command: `npm run build` (default).
5. Output: Next.js default (no static export).

## Environment variables

Add these in **Project Settings → Environment Variables** for Production (and Preview if needed):

| Variable | Production value |
|----------|------------------|
| `NEXT_PUBLIC_STORE_MODE` | `demo` until launch checklist complete, then `live` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `CONTACT_EMAIL` | Verified business inbox |
| `STRIPE_SECRET_KEY` | `sk_live_…` or `sk_test_…` for staging |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook endpoint |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Matching `pk_…` key |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | `orders@yourdomain.com` (verified in Resend) |
| `NEXT_PUBLIC_FACEBOOK_URL` | Optional social URL |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Optional social URL |
| `NEXT_PUBLIC_X_URL` | Optional social URL |
| `SUPABASE_URL` | If order DB enabled |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only — never expose client-side |

Mark `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` as **sensitive**.

## Custom domain

1. Add domain in Vercel → **Domains**.
2. Update DNS per Vercel instructions.
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
4. Redeploy.

## Stripe webhooks on Vercel

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://your-domain.com/api/stripe/webhook`
3. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET` in Vercel
5. Redeploy

## Preview deployments

Every pull request gets a preview URL. Use preview env vars with **Stripe test keys** only.

Recommended preview settings:

```
NEXT_PUBLIC_STORE_MODE=demo
STRIPE_SECRET_KEY=sk_test_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…
```

## Security headers

`next.config.ts` applies security headers (HSTS, X-Frame-Options, CSP report-only). Review CSP before removing `Report-Only` in production.

## Pre-deploy checklist

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Complete [launch-checklist.md](launch-checklist.md) before setting `NEXT_PUBLIC_STORE_MODE=live`.

## Rollback

Vercel keeps deployment history. To rollback:

1. **Deployments** → select last known-good deployment → **Promote to Production**

## Monitoring

- Vercel Analytics (optional)
- Stripe Dashboard for payment failures
- Resend dashboard for email delivery
- Run `npm run test:e2e` against preview URL: `PLAYWRIGHT_BASE_URL=https://preview-url.vercel.app npm run test:e2e`
