# Repository Sync Contract

This file is the compact handoff record for coding agents.

## Current state
- Main branch contains the CI stabilization merged after a fully green validation run.
- Canonical CI: check → database migrations → production build → Playwright E2E.
- The application currently has 23 E2E tests.
- Test environment uses mock AI models from `lib/ai/models.mock.ts`.
- Curated production chat models are defined in `lib/ai/models.ts`.

## Working rules
1. Read `AGENTS.md` before editing.
2. Inspect the current source before changing behavior.
3. Make one coherent change at a time.
4. Run the smallest relevant validation locally, then the full CI-equivalent pipeline for merge candidates.
5. Do not claim deployment/runtime health without direct evidence.
6. Record important architectural changes here rather than creating large agent-memory documents.

## Environment
See `.env.example`. Local secrets belong in `.env.local`.

## Production checklist
- [ ] Vercel project linked to this repository
- [ ] Production environment variables provisioned
- [ ] PostgreSQL reachable and migrations applied
- [ ] AI Gateway access verified
- [ ] Authentication verified
- [ ] Production deployment verified in-browser
- [ ] Runtime logs checked after first production smoke test
