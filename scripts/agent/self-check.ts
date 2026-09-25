import assert from "node:assert/strict";
import { classifyTask } from "../../lib/agent/task-classifier";
import { searchProjectIndex, type ProjectIndex } from "../../lib/agent/project-index";

const index: ProjectIndex = {
  version: 2,
  repository: "test",
  fileCount: 4,
  files: [
    { path: "app/(chat)/api/chat/route.ts", category: "typescript", bytes: 100 },
    { path: "lib/ai/prompts.ts", category: "typescript", bytes: 100 },
    { path: "lib/db/queries.ts", category: "typescript", bytes: 100 },
    { path: "tests/e2e/api.test.ts", category: "typescript", bytes: 100 },
  ],
  symbols: [
    { file: "app/(chat)/api/chat/route.ts", name: "POST", kind: "function", exported: true, line: 1 },
    { file: "lib/ai/prompts.ts", name: "systemPrompt", kind: "variable", exported: true, line: 1 },
    { file: "lib/db/queries.ts", name: "getChatById", kind: "function", exported: true, line: 1 },
  ],
  dependencies: [],
  packages: { dependencies: [], devDependencies: [] },
  routes: [
    { file: "app/(chat)/api/chat/route.ts", route: "/api/chat", methods: ["POST"] },
  ],
  tests: [
    { file: "tests/e2e/api.test.ts", framework: "playwright", likelyTargets: ["app/**/api/**"] },
  ],
};

const classification = classifyTask("Fix the chat API error");
assert.equal(classification.primary, "BUG");
assert.ok(classification.secondary.includes("API"));

const matches = searchProjectIndex(index, "Fix the chat API error", classification, 3);
assert.equal(matches[0]?.file, "app/(chat)/api/chat/route.ts");

console.log("Agent intelligence self-check passed.");
