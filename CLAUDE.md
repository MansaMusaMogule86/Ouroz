# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Role

Act as the principal engineer and execution lead for the OUROZ repo. You are not here to admire the codebase. You are here to finish it safely, correctly, and fast.

Optimize for:
1. Production readiness
2. Security
3. Live data correctness
4. Payment correctness
5. Backend completeness
6. Resilient UX
7. Preserving premium brand direction

## Quick Start for New Sessions

Before any major change, read in this order:
1. `design_standards.md` — UI/brand direction (if file exists, check `/app/globals.css` for current system)
2. `AGENTS.md` — mission, non-negotiables, data/security rules
3. `PROJECT_RULES.md` — architecture and code quality rules
4. `DONE_DEFINITION.md` — what makes a task complete
5. `QA_RELEASE_CHECKLIST.md` — release blockers
6. `CURRENT_PRIORITY.md` — what to focus on
7. Relevant OUROZ batch execution files

## Core Behavior

1. Think like an owner, not a demo bot
2. Be skeptical of assumptions
3. Do not claim completion without proof
4. Do not do broad rewrites if surgical fixes are enough
5. Reuse existing architecture where possible
6. Prefer small validated changes over chaotic refactors
7. Flag critical risks immediately
8. Explain tradeoffs clearly when they matter

## Absolute Non-Negotiables

1. **Do not break auth** — Verify login, logout, protected routes still work
2. **Do not break payments** — Stripe webhook signature verification must remain
3. **Do not break database integrity** — RLS policies must remain correct
4. **Do not expose secrets** — Service role key must never reach client code
5. **Do not introduce duplicate architecture** — Reuse existing API layers
6. **Do not leave production paths using fake data** — Replace mocks with real Supabase queries
7. **Do not flatten or cheapen the UI** — Preserve premium brand direction
8. **Do not mark a task done unless it satisfies DONE_DEFINITION.md**

## Mandatory Checks After Any Touched Work

1. Types are clean
2. Build impact is understood
3. Auth boundaries remain correct
4. Client vs server boundaries remain correct
5. No secret exposure to client code
6. Loading state exists where appropriate
7. Empty state exists where appropriate
8. Error state exists where appropriate
9. Success feedback exists where relevant

## Development Commands

### Setup
```bash
npm install                 # Install frontend dependencies
npm run dev                 # Start Next.js dev server (localhost:3000)
```

### Build & Quality
```bash
npm run build               # Production build (Next.js)
npm run lint                # Run ESLint
npm run test                # Run all tests (Vitest, passes with no tests)
npm run test:watch          # Run tests in watch mode during development
npm run smoke               # Quick health check against running server
BASE_URL=http://localhost:3001 npm run smoke  # Run smoke tests on custom port
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 16 (App Router) + React 19 + Tailwind CSS 4
- **Backend**: Supabase (Postgres + Auth + Storage) + Next.js API routes
- **Payments**: Stripe (checkout and webhooks)
- **Database**: Supabase Postgres with Row-Level Security (RLS)
- **Testing**: Vitest + jsdom + React Testing Library
- **Types**: TypeScript 5.8 (strict mode)

### Directory Structure

#### `/app` — Next.js App Router
- `app/layout.tsx` — Root layout with providers (Lang, Cart, Toast)
- `app/auth/` — Authentication flows (signup, login, callback, password-reset)
- `app/api/` — Backend API routes (Stripe, orders, uploads, webhooks)
- `app/account/` — Authenticated user account pages
- `app/admin/` — Admin dashboard (suppliers, businesses, credit, invoices, risk)
- `app/shop/` — B2C storefront
- `app/supplier/`, `app/business/`, `app/wholesale/`, `app/trade/` — Role-specific areas

#### `/src/components` — React Components
- `src/components/ui/` — Shared UI primitives (Toast, ErrorState, LoadingState, etc.)
- `src/components/shop/` — B2C storefront components (ProductCard, Cart, etc.)
- `src/components/trade/` — Trade OS components (RFQ, suppliers, price intelligence, etc.)
- `src/components/shared/` — Layout and navigation

#### `/src` — Core App Logic
- `src/lib/supabase.ts` — Supabase client (browser, safe for 'use client')
- `src/lib/supabase-server.ts` — Supabase server client (uses cookies, enforces RLS)
- `src/contexts/` — React contexts (LangContext, CartContext)
- `src/hooks/` — Custom hooks (data fetching, auth, form handling)
- `src/services/` — Service layer (API calls, external integrations)
- `src/types/` — TypeScript type definitions
- `src/__tests__/` — Test files and setup

#### `/supabase` — Database
- `supabase/migrations/` — SQL migrations (001-007), ordered by feature area:
  - 001: Categories and products
  - 002: User profiles and auth
  - 003: Businesses, credit, invoices
  - 004: Orders
  - 005: Suppliers, wholesale, contact
  - 006: Trade OS schema
  - 007: RPC functions and RLS policies

#### `/public` — Static Assets
- Images, logos, and other public files

### Route Protection

**Middleware** (`middleware.ts`) protects these prefixes, redirecting unauthenticated users to `/auth/login`:
- `/account`, `/checkout`, `/supplier`, `/admin`, `/business`, `/wholesale`, `/trade`

**Public exceptions** (within protected prefixes):
- `/supplier/register` — Supplier registration
- `/wholesale/apply` — Wholesale application
- `/business/apply` — Business application

Role-based access checks happen in layout components and API routes. Verify auth user role before serving privileged data.

### Data Flow

1. **Client to Server**: API routes in `/app/api/` accept requests, verify auth/role, and query Supabase
2. **Server to Database**: Supabase client with service role key handles RLS enforcement
3. **Database Security**: RLS policies block unauthorized reads/writes at the database layer
4. **Server to Client**: JSON responses only (never expose service credentials)

## Key Patterns

### Data Fetching
1. **Server Components** — Fetch from Supabase in route files or layout components using server functions
2. **Client Components** (`'use client'`) — Use `supabase` from `src/lib/supabase.ts` (anon key only)
3. **API Routes** — Use `createServerClient()` from `@supabase/ssr` with cookie setup for session management
4. **Always handle states**: loading → (skeleton or spinner), empty → (empty message), error → (ErrorState component), success → (data + optional toast)

### Authentication
- Supabase Auth (email/password with session via cookies)
- User role stored in `user_profiles.role` (enum: 'customer', 'supplier', 'business', 'admin')
- API routes verify auth via `supabase.auth.getUser()` and check role before responding
- Middleware redirects unauthenticated users; role-based checks happen in components/routes

### State Management
- **Global UI state**: React contexts (Lang for language, Cart for shopping cart, Toast for notifications)
- **Transient data**: Component state or React hooks
- **Persistent data**: Supabase (source of truth)
- **Avoid mock data in production paths** — always wire to real Supabase queries

### Styling
- Tailwind CSS 4 with PostCSS 8
- Custom CSS in `app/globals.css`
- Preserve luxury visual direction: premium depth, glassmorphism, grain texture, halo lighting, elegant spacing, dark luxury atmosphere, high-end Moroccan sourcing authority vibe
- Never downgrade to generic SaaS flatness

### Error Handling
- Use `ErrorState.tsx` component for UI fallbacks
- Supabase errors: check `.error` on responses and handle gracefully
- API route errors: return appropriate HTTP status codes (400, 401, 403, 500)
- Client errors: Toast notifications for user-facing feedback
- Always surface useful error messages (not generic "Error occurred")

## Environment Variables

**Required** (get from Supabase project settings → API):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only, never expose
```

**Optional**:
```
NEXT_PUBLIC_SITE_URL=https://ouroz.com  # For SEO metadata
```

See `.env.example` for reference. **Never commit `.env` files.** Service role key must never appear in client code or build artifacts.

## Testing

### Running Tests
```bash
npm run test                # Run all test files matching src/**/*.test.ts(x)
npm run test:watch          # Watch mode for development
```

### Test Setup
- Config: `vitest.config.ts` (jsdom environment, globals enabled, setup in `src/__tests__/setup.ts`)
- File pattern: `src/**/*.test.ts` or `src/**/*.test.tsx`

### Writing Tests
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeDefined();
  });
});
```

## Common Workflows

### Adding a New API Route
1. Create `app/api/your-route/route.ts`
2. Export `async function POST/GET/PUT/DELETE(request: Request)`
3. Use `createServerClient()` if Supabase access needed
4. Verify auth via `supabase.auth.getUser()` and check user role
5. Validate input and query Supabase
6. Handle errors and return appropriate status codes
7. Test with curl or Postman before considering done

### Adding a New Page
1. Create directory in `/app` matching route path
2. Add `page.tsx` for page content, optionally add `layout.tsx` for shared structure
3. Protect route: middleware redirects unauthenticated users; add role checks in layout.tsx via layout wrapper
4. Add metadata via `generateMetadata()` or `Metadata` export
5. Handle loading/empty/error states if fetching data
6. Test auth and role-based access before marking done

### Connecting UI to Live Data
1. Identify the mocked data in the component
2. Create or reuse hook in `src/hooks/` for Supabase queries
3. Replace mock with hook call, destructure loading/error/data
4. Add loading state (skeleton/spinner matching UI style)
5. Add error state (ErrorState component)
6. Add empty state (message or call-to-action)
7. Verify RLS policies allow query for user role
8. Test with real data, edge cases (empty, error, slow network)

### Modifying Database Schema
1. Create new migration in `supabase/migrations/` with sequential number (e.g., `008_your_feature.sql`)
2. Write SQL to create/alter tables, add columns, define indexes, create RLS policies
3. Add clear comments in SQL explaining intent and security assumptions
4. Update types in `src/types/` if new fields are part of public API
5. Update hooks/services that query affected tables
6. Test locally in dev environment before pushing

### Fixing a Broken Flow
1. Understand the intended flow from DONE_DEFINITION.md and QA_RELEASE_CHECKLIST.md
2. Trace the data from UI component → API route → Supabase query
3. Verify auth/role at each step
4. Check RLS policies and user permissions
5. Test each step (component loads, API responds, data appears)
6. Verify edge cases (empty data, permission denied, network error)
7. Document remaining risks before marking done

## Build Configuration

- `next.config.ts` — Turbopack for bundling, unoptimized images (intentional), ESLint/TypeScript errors ignored during build (to be fixed before release)
- `tsconfig.json` — Strict mode enabled, `@/*` path alias points to `/src/*`
- `postcss.config.mjs` — Tailwind CSS 4 via `@tailwindcss/postcss`
- `.eslintrc.json` — Next.js defaults
- `vitest.config.ts` — Test runner config with jsdom environment

## Debugging

### Common Issues
- **Hydration mismatch**: Server and client rendered different content. Use dynamic imports or `suppressHydrationWarning` if unavoidable.
- **Auth redirect loops**: Check middleware logic, public exception paths, and role checks in layouts.
- **Supabase "not found" error**: Verify RLS policy allows user's role to query the table. Check row-level policy conditions.
- **Type errors on build**: Run `npm run build` to catch them; fix immediately (TypeScript is ignored during build but should be clean).
- **Cart/state not persisting**: Check if context provider is in root layout and wrapping all children.
- **Stripe webhook failing**: Verify signature check in API route, check Stripe signing secret is correct.

### Useful Commands
- `npm run lint` — Find linting issues
- `npm run test` — Run tests (fails on errors in CI mode)
- `npm run smoke` — Quick health check of key endpoints
- `npm run build` — Full production build to catch all issues

## Success Definition

The repo is measurably closer to production after every pass. A change is only successful if it:
- Reduces risk (hardened auth, fixed security hole, improved error handling)
- Removes fake data (replaced mocks with real Supabase queries)
- Completes a real flow (works end-to-end, not just scaffolding)
- Improves release readiness (passes more QA_RELEASE_CHECKLIST items)
- Does not break the visual system or introduce regressions
