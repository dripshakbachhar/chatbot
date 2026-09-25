import { promises as fs } from "node:fs";
import path from "node:path";
import type { TaskClassification, TaskType } from "./task-classifier";

export type ProjectIndex = {
  version: number;
  repository: string;
  fileCount: number;
  files: Array<{ path: string; category: string; bytes: number }>;
  symbols: Array<{
    file: string;
    name: string;
    kind: string;
    exported: boolean;
    line: number;
  }>;
  dependencies: Array<{ file: string; imports: string[] }>;
  packages: { dependencies: string[]; devDependencies: string[] };
  routes: Array<{ file: string; route: string; methods: string[] }>;
  tests: Array<{ file: string; framework: string; likelyTargets: string[] }>;
};

export type ProjectMatch = {
  file: string;
  score: number;
  reasons: string[];
  symbols: string[];
  routes: string[];
  tests: string[];
};

const INDEX_PATH = path.join(process.cwd(), ".project-agent", "index.json");

const TASK_HINTS: Record<TaskType, string[]> = {
  BUG: ["error", "bug", "route", "test"],
  FEATURE: ["app", "components", "lib", "hooks"],
  REFACTOR: ["lib", "components", "app"],
  PERFORMANCE: ["lib", "app", "hooks"],
  SECURITY: ["auth", "middleware", "api", "lib"],
  UI_UX: ["components", "app", "hooks", "css"],
  AI_BEHAVIOR: ["lib/ai", "api/chat", "app/(chat)"],
  DATABASE: ["lib/db", "schema", "migration"],
  AUTHENTICATION: ["app/(auth)", "auth", "session"],
  API: ["api", "route"],
  TESTING: ["tests", "e2e", "test"],
  DEPLOYMENT: [".github", "vercel", "package.json", "next.config"],
  DOCUMENTATION: ["README", "docs", ".md"],
  ARCHITECTURE: ["app", "lib", "components"],
  RESEARCH: ["lib", "app", "tests"],
};

function tokens(input: string): string[] {
  return [
    ...new Set(
      input
        .toLowerCase()
        .split(/[^a-z0-9_./-]+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2)
    ),
  ];
}

export async function loadProjectIndex(
  indexPath = INDEX_PATH
): Promise<ProjectIndex> {
  const content = await fs.readFile(indexPath, "utf8");
  return JSON.parse(content) as ProjectIndex;
}

export function searchProjectIndex(
  index: ProjectIndex,
  query: string,
  classification: TaskClassification,
  limit = 8
): ProjectMatch[] {
  const queryTokens = tokens(query);
  const hints = TASK_HINTS[classification.primary];
  const matches = new Map<string, ProjectMatch>();

  const add = (file: string, score: number, reason: string) => {
    const current = matches.get(file) ?? {
      file,
      score: 0,
      reasons: [],
      symbols: [],
      routes: [],
      tests: [],
    };
    current.score += score;
    if (!current.reasons.includes(reason)) {
      current.reasons.push(reason);
    }
    matches.set(file, current);
  };

  for (const file of index.files) {
    const lowerPath = file.path.toLowerCase();

    for (const token of queryTokens) {
      if (lowerPath.includes(token)) {
        add(file.path, 10, `path matches "${token}"`);
      }
    }

    for (const hint of hints) {
      if (lowerPath.includes(hint.toLowerCase())) {
        add(file.path, 3, `task area matches "${hint}"`);
      }
    }

    if (
      file.category.toLowerCase().includes(classification.primary.toLowerCase())
    ) {
      add(file.path, 2, "category matches task");
    }
  }

  for (const symbol of index.symbols) {
    const lowerName = symbol.name.toLowerCase();
    const matched = queryTokens.filter((token) => lowerName.includes(token));
    if (matched.length === 0) {
      continue;
    }

    add(symbol.file, 15 * matched.length, `symbol matches "${matched[0]}"`);
    const result = matches.get(symbol.file);
    if (result && !result.symbols.includes(symbol.name)) {
      result.symbols.push(symbol.name);
    }
  }

  for (const route of index.routes) {
    const haystack =
      `${route.route} ${route.file} ${route.methods.join(" ")}`.toLowerCase();
    const matched = queryTokens.filter((token) => haystack.includes(token));
    if (matched.length === 0 && classification.primary !== "API") {
      continue;
    }

    add(
      route.file,
      matched.length ? 18 * matched.length : 7,
      matched.length
        ? `route matches "${matched[0]}"`
        : "API task matches route"
    );
    const result = matches.get(route.file);
    if (result && !result.routes.includes(route.route)) {
      result.routes.push(route.route);
    }
  }

  for (const test of index.tests) {
    const haystack =
      `${test.file} ${test.likelyTargets.join(" ")}`.toLowerCase();
    const matched = queryTokens.filter((token) => haystack.includes(token));

    if (
      matched.length === 0 &&
      classification.primary !== "TESTING" &&
      classification.primary !== "BUG"
    ) {
      continue;
    }

    add(
      test.file,
      matched.length ? 12 * matched.length : 5,
      matched.length
        ? `test matches "${matched[0]}"`
        : "test coverage is relevant"
    );
    const result = matches.get(test.file);
    if (result && !result.tests.includes(test.file)) {
      result.tests.push(test.file);
    }
  }

  return [...matches.values()]
    .map((match) => ({
      ...match,
      reasons: match.reasons.slice(0, 4),
      symbols: match.symbols.slice(0, 6),
      routes: match.routes.slice(0, 4),
      tests: match.tests.slice(0, 3),
    }))
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file))
    .slice(0, limit);
}
