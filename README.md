# OUROZ

Premium Moroccan B2B/B2C commerce platform built with Next.js App Router and Supabase.

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Supabase (Postgres, Auth, Storage, RLS)
- Stripe payments (PaymentIntent + webhooks)
- Vitest + Testing Library

## Local Setup

### 1. Install

```bash
npm install
```

### 2. Configure environment

Create `.env.local` with required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=
GEMINI_API_KEY=
```

Server secrets must never be exposed in client code.

### 3. Run development server

```bash
npm run dev
```

## Database Migrations

Migrations live in `supabase/migrations` and must be applied in order.

- `001` to `007`: core OUROZ schema and policies
- `008_atlas_souk_catalog.sql`: Atlas Souk supplier, category, product seed, readiness and compliance extensions

## Atlas Souk Catalog Architecture

Catalog source of truth is in `src/lib/catalog/atlasSoukCatalog.ts`:

- Supplier: `atlas-souk`
- Categories: `kitchen-accessories`, `skin-care`, `groceries`
- Exact total products: 45
- SKU pattern: `BM-KIT-*`, `BM-SKN-*`, `BM-GRO-*`
- Compliance flags and data-quality warnings included as non-blocking readiness metadata

## Placeholder Image Architecture

All placeholders are local SVG assets (no remote dependencies):

- Supplier: `public/images/catalog/atlas-souk/supplier/`
- Categories: `public/images/catalog/atlas-souk/categories/`
- Products: category-specific folders under `public/images/catalog/atlas-souk/`
- Shared fallbacks: `public/images/catalog/atlas-souk/shared/`

Replace placeholders by preserving file paths to avoid UI/layout regressions.

## Key Routes

- Shop: `/shop`
- Category pages: `/shop/kitchen-accessories`, `/shop/skin-care`, `/shop/groceries`
- Product pages: `/product/[productSlug]`
- Supplier storefront: `/supplier/atlas-souk`
- Cart: `/cart`
- Wishlist: `/wishlist`

## Validation and Security

- Query params validated via Zod (`src/lib/catalog/catalogQueryParams.ts`)
- Runtime-specific Supabase clients:
  - `src/lib/supabase/client.ts`
  - `src/lib/supabase/server.ts`
  - `src/lib/supabase/admin.ts`
  - `src/lib/supabase/middleware.ts`
- Server auth guards in `src/lib/auth/guards.ts`
- Stripe webhook signature verification in `app/api/stripe/webhook/route.ts`

## Quality Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run smoke
```

`npm run smoke` checks route availability for key catalog flows. Override host with:

```bash
BASE_URL=http://localhost:3001 npm run smoke
```

## Notes on Catalog Compliance

- Cosmetic names such as `Whitening Cream` and `Whitening Soap` are retained from supplier inputs but flagged for compliance review.
- Food safety fields are intentionally marked pending when supplier-verified data is not yet available.
- Generic product names are flagged in non-blocking quality metadata for refinement.
