# Setup Guide

This guide covers local development for the DC Groceries storefront.

## Prerequisites

- Node.js 20+
- npm 10+
- Git

## Installation

```bash
git clone <repository-url>
cd DC-GROCERIES-LLC-
npm install
```

## Environment variables

Copy the example file and fill in values locally:

```bash
cp .env.example .env.local
```

### Required for local development

| Variable | Example | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_STORE_MODE` | `demo` | Keep `demo` until launch checklist is complete |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical site URL |

### Optional (enable features as you configure them)

| Variable | Service | When needed |
|----------|---------|-------------|
| `CONTACT_EMAIL` | - | Contact form delivery |
| `STRIPE_SECRET_KEY` | Stripe | Live/test checkout |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Payment webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | Client-side Stripe.js |
| `RESEND_API_KEY` | Resend | Order/confirmation email |
| `EMAIL_FROM` | Resend | Sender address (verified domain) |
| `NEXT_PUBLIC_FACEBOOK_URL` | - | Footer social link |
| `NEXT_PUBLIC_INSTAGRAM_URL` | - | Footer social link |
| `NEXT_PUBLIC_X_URL` | - | Footer social link |
| `SUPABASE_URL` | Supabase | Order persistence (if enabled) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Server-side database access |

**Never commit secrets.** `.env.local` and `.data/` are gitignored.

## Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). A demo-mode banner appears when `NEXT_PUBLIC_STORE_MODE=demo`.

## Verify the installation

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm run test        # Unit tests (26-product catalog, cart math, shipping)
npm run test:e2e    # Playwright smoke tests (starts dev server automatically)
npm run build       # Production build
```

## Project structure

```
data/           Product catalog, categories, shipping rules, legal config
src/app/        Next.js App Router pages and API routes
src/components/ UI components (layout, product, shop, cart)
src/lib/        Business logic (cart math, env, orders, validation)
src/store/      Zustand client state (cart, wishlist)
tests/unit/     Vitest unit tests
tests/e2e/      Playwright smoke tests
docs/           Operational documentation
public/         Static assets, brand logos, product placeholders
```

## Editing product data

See [product-editing.md](product-editing.md). The catalog must always contain exactly **26 products**.

## Switching to live mode

Only after completing [launch-checklist.md](launch-checklist.md):

1. Set `NEXT_PUBLIC_STORE_MODE=live` in Vercel environment variables
2. Configure Stripe, Resend, shipping and tax
3. Mark verified products `productionReady: true` in `data/products.ts`
4. Replace placeholder images with verified photography

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `PORT=3001 npm run dev` and set `PLAYWRIGHT_BASE_URL` for e2e |
| Stripe errors in checkout | Confirm keys in `.env.local`; demo mode works without Stripe |
| Type errors after editing products | Run `npm run typecheck` - all 26 products must satisfy `Product` type |
| Playwright timeout | Ensure no other process blocks port 3000; increase `webServer.timeout` in `playwright.config.ts` |
