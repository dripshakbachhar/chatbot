# Repository Intelligence

V1 turns this repository into a machine-readable project.

## What it indexes

Run:

```bash
pnpm agent:index
```

The generated `.project-agent/index.json` is intentionally ignored by Git because it is derived state.

The index contains:

- **Files** — path, category, and size
- **Symbols** — functions, classes, interfaces, types, enums, variables, exports, and line numbers
- **Dependencies** — source-file imports and re-exports
- **Packages** — runtime and development dependencies from `package.json`
- **Routes** — Next.js API route files, route paths, and detected HTTP handlers
- **Tests** — test files, detected framework, and likely target areas

## Why this matters

The repository agent should not repeatedly read the entire project. It can first use the index to locate the smallest useful set of files, then inspect only those files before making a change.

The intended loop is:

```text
User request
    ↓
Task classification
    ↓
Project index
    ↓
Relevant files / symbols / routes / tests
    ↓
Focused source inspection
    ↓
Change
    ↓
Test
    ↓
Verification
    ↓
Update project memory
```

## V2 foundation

This index is the foundation for the next agent layers:

1. Repository Analyzer
2. Code Agent
3. Test Agent
4. Project Memory
5. Engineering Dashboard

The indexer uses the TypeScript compiler API already present in the project, so V2 does not add a new parser dependency.
