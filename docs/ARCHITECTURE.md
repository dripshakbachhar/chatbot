# Architecture Overview

## System shape

```
Browser
  |
  +-- Next.js App Router UI
  |     +-- Server Components / Server Actions
  |     +-- React chat client
  |
  +-- HTTP requests
         |
         v
Next.js route handlers
  |
  +-- NextAuth authentication/session
  +-- Zod request validation
  +-- ownership/authorization checks
  +-- Redis rate limiting (production)
  +-- Vercel AI Gateway
  |     +-- curated model allowlist
  +-- PostgreSQL + Drizzle
  |     +-- users / chats / messages
  |     +-- documents / suggestions / votes
  |     +-- resumable streams
  +-- Vercel Blob
        +-- image attachments
```

## Authentication and authorization

The application has regular email/password and guest Credentials providers. Passwords are bcrypt hashes. The authenticated user ID and type are propagated through the NextAuth JWT/session callbacks. Protected routes call `auth()` and resource operations compare the owner ID with `session.user.id`.

`proxy.ts` performs a request-level token gate and redirects unauthenticated browser requests into guest authentication.

## Chat request flow

1. Validate the request body with Zod.
2. Authenticate with `auth()`.
3. Enforce the curated model allowlist.
4. Enforce IP and per-user message limits.
5. Enforce chat ownership for existing chats.
6. Stream the AI response.
7. Persist completed messages.
8. Create resumable-stream metadata when Redis is configured.

## Local development

The local Compose file supplies PostgreSQL and Redis while Next.js runs on the host for Fast Refresh and Playwright.

```bash
pnpm install --frozen-lockfile
cp .env.local.example .env.local
pnpm local:infra:up
pnpm db:migrate
pnpm dev
```

AI requests still require an AI Gateway credential outside Vercel. File attachments still use Vercel Blob unless a local storage adapter is introduced later.
