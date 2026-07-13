# DC Groceries

Customer-facing grocery e-commerce storefront for **DC GROCERIES LLC** - fresh produce, pantry staples, refrigerated essentials, beverages, snacks and household goods with clear package sizes and verification-first product data.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | React 19, Tailwind CSS 4, Motion |
| State | Zustand (cart, wishlist, UI) |
| Payments | Stripe (test/live via env) |
| Email | Resend |
| Validation | Zod |
| Unit tests | Vitest |
| E2E tests | Playwright |
| Deployment | Vercel |

## Quick start

```bash
# Install dependencies
npm install

# Copy environment template - never commit real secrets
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run test` | Vitest unit tests |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:e2e` | Playwright smoke tests |

## Demo vs live mode

The storefront defaults to **demo mode** (`NEXT_PUBLIC_STORE_MODE=demo`).

| Mode | Behavior |
|------|----------|
| **Demo** | Demonstration pricing (`demoPrice`). Checkout may proceed for catalog review. Banner shown site-wide. |
| **Live** | Uses `unitPrice` when set. Blocks unverified / non-production-ready products at checkout. Requires Stripe, shipping, tax and label verification. |

Switch to live only after completing the [launch checklist](docs/launch-checklist.md).

```env
NEXT_PUBLIC_STORE_MODE=live
```

## Catalog

The catalog contains **exactly 26 products** across:

- Fresh fruit, vegetables, herbs and aromatics
- Pantry (rice, pasta, canned goods, oils, oats)
- Dairy and refrigerated
- Beverages, snacks, household essentials

Product data lives in `data/products.ts`. Images use placeholders until exact photography is sourced - see [image sourcing guide](docs/image-sourcing.md).

## Documentation

| Guide | Description |
|-------|-------------|
| [Setup](docs/setup.md) | Local development and environment variables |
| [Deployment](docs/deployment.md) | Vercel production deployment |
| [Product editing](docs/product-editing.md) | How to add or update catalog items |
| [Image sourcing](docs/image-sourcing.md) | Priority order and missing-image rules |
| [Campaign image guide](docs/campaign-image-guide.md) | Advertising photography rules |
| [Produce photography](docs/produce-photography-guide.md) | In-house produce photo workflow |
| [Payment setup](docs/payment-setup.md) | Stripe configuration |
| [Shipping setup](docs/shipping-setup.md) | Zones, refrigerated fulfilment |
| [Tax setup](docs/tax-setup.md) | Sales tax configuration |
| [Email setup](docs/email-setup.md) | Resend transactional email |
| [Food label verification](docs/food-label-verification.md) | Label review workflow |
| [Refrigerated readiness](docs/refrigerated-product-readiness.md) | Cold-chain prerequisites |
| [Order processing](docs/order-processing.md) | Fulfilment workflow |
| [Legal review](docs/legal-review.md) | Policy page approval |
| [Launch checklist](docs/launch-checklist.md) | Pre-launch QA mapped to requirements |

## Security

- Never commit `.env`, `.env*.local`, or `.data/` - see `.gitignore`
- Copy `.env.example` to `.env.local` for local secrets
- Security headers configured in `next.config.ts` (CSP report-only, X-Frame-Options, HSTS)

## Business

| Field | Value |
|-------|-------|
| Legal name | DC GROCERIES LLC |
| Brand | DC Groceries |
| Location | Fairburn, Georgia |
| Phone | +1 (331) 731-4338 |

Registered address is **not** displayed as a public storefront location. Local pickup and delivery are disabled until explicitly configured.
