# Chatbot

A production-oriented Next.js chatbot built with the Vercel AI SDK, AI Gateway, PostgreSQL, NextAuth, and a modern React UI.

## Features

- Streaming AI chat with multiple curated models
- Authentication with NextAuth
- Persistent chat history and votes
- File attachments through Vercel Blob
- Document creation and editing tools
- Model selector with capability indicators
- Responsive chat UI
- Playwright end-to-end coverage
- Drizzle database migrations

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Vercel AI SDK
- Vercel AI Gateway
- PostgreSQL + Drizzle ORM
- NextAuth
- Tailwind CSS
- Playwright
- pnpm 10.32.1

## Models

The curated models are defined in `lib/ai/models.ts`. The current list includes DeepSeek V3.2, Kimi K2.5, GPT OSS 20B, GPT OSS 120B, and Grok 4.1 Fast.

## Requirements

- Node.js 22+
- pnpm 10.32.1
- PostgreSQL
- Vercel account for production deployment

## Local setup

For the fastest reproducible local environment, use the included PostgreSQL and Redis Compose stack:

```bash
pnpm install --frozen-lockfile
cp .env.local.example .env.local
pnpm local:infra:up
pnpm db:migrate
pnpm dev
```

Open http://localhost:3000. Stop local infrastructure with `pnpm local:infra:down`.

AI responses still require `AI_GATEWAY_API_KEY` outside Vercel, and file attachments still require `BLOB_READ_WRITE_TOKEN` unless a local storage adapter is introduced.


1. Clone the repository.
2. Install dependencies:

```bash
pnpm install
```

3. Create `.env.local` from `.env.example` and provide the required values.
4. Apply database migrations:

```bash
pnpm db:migrate
```

5. Start development:

```bash
pnpm dev
```

Open http://localhost:3000.

## Engineering documentation

- `docs/ARCHITECTURE.md` — request flows, boundaries, and local architecture.
- `docs/ENGINEERING_ANALYSIS_PROMPT.md` — implementation-grade audit prompt for future engineering passes.
- `SECURITY.md` — security-sensitive areas and reporting guidance.

## Validation

Run the same checks used by CI:

```bash
pnpm check
pnpm db:migrate
pnpm build
pnpm test
```

For a clean dependency install:

```bash
pnpm install --frozen-lockfile
```

## Environment variables

See `.env.example` for the complete template.

- `AUTH_SECRET`: authentication/session secret.
- `AI_GATEWAY_API_KEY`: required outside Vercel; Vercel deployments use AI Gateway OIDC when configured.
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob access token.
- `POSTGRES_URL`: PostgreSQL connection string.
- `REDIS_URL`: optional Redis connection used for production rate limiting and stream coordination.

Never commit `.env.local` or real credentials.

## Vercel deployment

1. Push the repository to GitHub.
2. In Vercel, import `dripshakbachhar/chatbot`.
3. Keep the framework as Next.js and use the repository root.
4. Add the production environment variables from `.env.example`.
5. Provision/connect PostgreSQL and provide its connection string as `POSTGRES_URL`.
6. Provision Vercel Blob and provide `BLOB_READ_WRITE_TOKEN`.
7. Configure Redis and provide `REDIS_URL` if production rate limiting/stream coordination is required.
8. Set a strong random `AUTH_SECRET`.
9. Deploy.
10. Verify the production home page, authentication pages, model selector, chat request, database persistence, and file upload.
11. Check Vercel runtime logs after the first smoke test.

No custom Vercel server is required; Next.js routes and functions are deployed directly by Vercel.

## Project structure

```
app/                 Next.js routes, pages, and API handlers
components/          UI and chat components
lib/ai/              AI models, gateway integration, test mocks
lib/db/              Schema, migrations, and database queries
tests/e2e/           Playwright tests
.github/workflows/   CI
AGENTS.md            Coding-agent operating contract
SYNC.md              Compact repository handoff state
.env.example         Environment variable template
```

## Maintenance

- Keep `pnpm-lock.yaml` synchronized with `package.json`.
- Add database changes as new Drizzle migrations.
- Keep `.env.example` synchronized with newly required environment variables.
- Treat `pnpm check`, migrations, build, and E2E as merge gates.
- Prefer small pull requests with a concrete validation result.
