export const TASK_TYPES = [
  "BUG",
  "FEATURE",
  "REFACTOR",
  "PERFORMANCE",
  "SECURITY",
  "UI_UX",
  "AI_BEHAVIOR",
  "DATABASE",
  "AUTHENTICATION",
  "API",
  "TESTING",
  "DEPLOYMENT",
  "DOCUMENTATION",
  "ARCHITECTURE",
  "RESEARCH",
] as const;

export type TaskType = (typeof TASK_TYPES)[number];

export type TaskClassification = {
  primary: TaskType;
  secondary: TaskType[];
  confidence: "high" | "medium" | "low";
  signals: string[];
};

type Rule = {
  type: TaskType;
  patterns: RegExp[];
  signal: string;
};

const RULES: Rule[] = [
  {
    type: "BUG",
    patterns: [
      /bug/i,
      /broken/i,
      /error/i,
      /crash/i,
      /fail/i,
      /not working/i,
      /wrong/i,
      /issue/i,
    ],
    signal: "bug/failure language",
  },
  {
    type: "FEATURE",
    patterns: [
      /add/i,
      /build/i,
      /create/i,
      /implement/i,
      /support/i,
      /new feature/i,
    ],
    signal: "new functionality language",
  },
  {
    type: "REFACTOR",
    patterns: [
      /refactor/i,
      /clean up/i,
      /simplify/i,
      /restructure/i,
      /rewrite/i,
    ],
    signal: "code-structure language",
  },
  {
    type: "PERFORMANCE",
    patterns: [
      /slow/i,
      /performance/i,
      /latency/i,
      /optimi[sz]e/i,
      /faster/i,
      /memory/i,
    ],
    signal: "performance language",
  },
  {
    type: "SECURITY",
    patterns: [
      /security/i,
      /vulnerability/i,
      /exploit/i,
      /permission/i,
      /secret/i,
      /credential/i,
    ],
    signal: "security language",
  },
  {
    type: "UI_UX",
    patterns: [
      /ui/i,
      /ux/i,
      /interface/i,
      /design/i,
      /layout/i,
      /responsive/i,
      /accessibility/i,
    ],
    signal: "interface language",
  },
  {
    type: "AI_BEHAVIOR",
    patterns: [
      /prompt/i,
      /model/i,
      /llm/i,
      /agent/i,
      /ai/i,
      /stream/i,
      /reasoning/i,
      /tool call/i,
    ],
    signal: "AI behavior language",
  },
  {
    type: "DATABASE",
    patterns: [
      /database/i,
      /db/i,
      /sql/i,
      /postgres/i,
      /drizzle/i,
      /migration/i,
      /query/i,
    ],
    signal: "database language",
  },
  {
    type: "AUTHENTICATION",
    patterns: [
      /auth/i,
      /login/i,
      /logout/i,
      /session/i,
      /oauth/i,
      /password/i,
    ],
    signal: "authentication language",
  },
  {
    type: "API",
    patterns: [
      /api/i,
      /endpoint/i,
      /route/i,
      /request/i,
      /response/i,
      /http/i,
    ],
    signal: "API language",
  },
  {
    type: "TESTING",
    patterns: [/test/i, /spec/i, /playwright/i, /coverage/i, /verify/i],
    signal: "testing language",
  },
  {
    type: "DEPLOYMENT",
    patterns: [
      /deploy/i,
      /deployment/i,
      /vercel/i,
      /production/i,
      /build pipeline/i,
      /ci\b/i,
    ],
    signal: "deployment language",
  },
  {
    type: "DOCUMENTATION",
    patterns: [
      /docs/i,
      /documentation/i,
      /readme/i,
      /explain the code/i,
      /document/i,
    ],
    signal: "documentation language",
  },
  {
    type: "ARCHITECTURE",
    patterns: [
      /architecture/i,
      /structure/i,
      /design pattern/i,
      /system design/i,
      /dependency graph/i,
    ],
    signal: "architecture language",
  },
  {
    type: "RESEARCH",
    patterns: [
      /research/i,
      /literature/i,
      /paper/i,
      /benchmark/i,
      /investigate/i,
    ],
    signal: "research language",
  },
];

export function classifyTask(input: string): TaskClassification {
  const text = input.trim();

  if (!text) {
    return {
      primary: "RESEARCH",
      secondary: [],
      confidence: "low",
      signals: ["empty request"],
    };
  }

  const matches = RULES.map((rule) => ({
    ...rule,
    count: rule.patterns.filter((pattern) => pattern.test(text)).length,
  })).filter((rule) => rule.count > 0).sort((a, b) => b.count - a.count);

  if (matches.length === 0) {
    return {
      primary: "RESEARCH",
      secondary: [],
      confidence: "low",
      signals: ["no task-specific signals detected"],
    };
  }

  const primary = matches[0];
  const secondary = matches
    .slice(1, 4)
    .map((match) => match.type)
    .filter((type) => type !== primary.type);

  const confidence =
    primary.count >= 2 ? "high" : matches.length >= 2 ? "medium" : "low";

  return {
    primary: primary.type,
    secondary,
    confidence,
    signals: matches.slice(0, 4).map((match) => match.signal),
  };
}
