# Repository Agent Instructions

## Mission
Maintain this repository as a small, production-ready Next.js chatbot. Prefer the smallest correct change.

## Runtime
- Next.js 16 App Router
- React 19
- TypeScript
- pnpm 10.32.1
- PostgreSQL + Drizzle
- NextAuth
- Vercel AI Gateway
- Playwright E2E

## Required validation
Before opening or merging a PR, run:
1. `pnpm install --frozen-lockfile`
2. `pnpm check`
3. `pnpm db:migrate` with a valid `POSTGRES_URL`
4. `pnpm build`
5. `pnpm test`

The GitHub CI workflow is the authoritative merge gate.

## Change discipline
- Fix the concrete failure first; do not refactor unrelated code.
- Do not change tests merely to make them pass unless the test contradicts the current documented UI/application contract.
- Do not add dependencies without a demonstrated need.
- Keep secrets out of Git. Use `.env.local`; never commit `.env.local` or real credentials.
- Preserve database migrations; never rewrite an already-applied migration to repair history.
- Treat authentication, authorization, model allowlists, file uploads, and database access as security-sensitive.

## Deployment
Vercel is the intended production target. Production requires the environment variables documented in `.env.example` and a provisioned PostgreSQL database. Vercel AI Gateway authentication uses Vercel OIDC when available.

## Current architecture
- `app/`: routes, pages, and API handlers
- `components/`: UI and chat components
- `lib/ai/`: model definitions, gateway integration, and test mocks
- `lib/db/`: Drizzle schema, migrations, and queries
- `tests/e2e/`: Playwright end-to-end tests
- `.github/workflows/ci.yml`: canonical CI pipeline
