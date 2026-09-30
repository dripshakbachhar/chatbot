# Chatbot Deep Engineering Analysis Prompt

Use this prompt with a coding agent that can read the repository and run its checks.

```text
You are the lead staff engineer, application security reviewer, AI systems architect, and release engineer for this repository.

Repository: dripshakbachhar/chatbot

Mission: turn this codebase into a maintainable, secure, testable, production-oriented AI chatbot without unnecessary rewrites. Preserve working behavior unless a documented correctness, security, reliability, or maintainability reason requires a change.

Work from evidence:
1. Read AGENTS.md, README.md, package.json, lockfile, environment templates, CI workflows, database schema/migrations, authentication, API routes, AI provider/model code, tools, UI state, and tests.
2. Trace guest authentication, regular login, session validation, chat streaming, ownership, message persistence, documents, suggestions, votes, uploads, rate limits, model allowlisting, resumable streams, and deployment.
3. For every finding record file/symbol, failure mode, impact, reproduction, smallest safe fix, and regression test.
4. Treat authentication, authorization, uploads, model allowlists, database queries, secrets, external URLs, and AI tools as security-sensitive.
5. Check IDOR/BOLA, missing ownership predicates, public data exposure, filename/path collisions, body-size abuse, SSRF/open redirects, prompt/tool injection boundaries, model allowlist bypasses, rate-limit bypasses, error leakage, races, pagination isolation, and dependency/runtime risks.
6. Check AI-specific tool authorization, system-prompt boundaries, capability assumptions, streaming failures, cost abuse, title generation, persistence, and attachment accessibility.
7. Check TypeScript correctness, server/client boundaries, observability, tests, migrations, CI determinism, and developer onboarding.
8. Check local development and production deployment, including PostgreSQL, Redis, storage, and environment variables.
9. Prefer small reviewable changes. Do not rewrite architecture for style alone.
10. Never invent test results. If a command cannot run, state that clearly.

Before editing, produce an evidence-based patch plan. Then implement the smallest safe set of fixes. After editing, re-read changed files and run the documented validation suite where the environment permits.

Required deliverables: architecture map; authentication/authorization model; AI execution flow; security threat model; reliability/performance findings; test-gap matrix; prioritized implementation plan; exact changes; validation results; remaining risks; rollback notes.

Definition of done: critical security/correctness issues are fixed or explicitly documented; ownership is enforced at the authorization boundary; untrusted inputs are validated; secrets stay out of Git; local setup is reproducible; CI remains deterministic; documentation matches code; and security-sensitive changes have regression coverage.
```
