import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, ".project-agent", "index.json");
const IGNORED = new Set([".git", ".next", "node_modules", ".turbo", "coverage", ".project-agent"]);

const CATEGORY: Record<string, string> = {
  ".ts": "typescript",
  ".tsx": "typescript-react",
  ".js": "javascript",
  ".jsx": "javascript-react",
  ".json": "config",
  ".md": "documentation",
  ".sql": "database",
  ".css": "style",
  ".mjs": "javascript-module",
};

async function walk(directory: string): Promise<Array<Record<string, unknown>>> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files: Array<Record<string, unknown>> = [];

  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue;

    const absolute = path.join(directory, entry.name);
    const relative = path.relative(ROOT, absolute).replaceAll(path.sep, "/");

    if (entry.isDirectory()) {
      files.push(...(await walk(absolute)));
      continue;
    }

    const stat = await fs.stat(absolute);
    const extension = path.extname(entry.name).toLowerCase();

    files.push({ path: relative, category: CATEGORY[extension] ?? "other", bytes: stat.size });
  }

  return files;
}

const files = (await walk(ROOT)).sort((a, b) => String(a.path).localeCompare(String(b.path)));
const index = {
  version: 1,
  generatedAt: new Date().toISOString(),
  repository: "dripshakbachhar/chatbot",
  fileCount: files.length,
  files,
};

await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
await fs.writeFile(OUTPUT, JSON.stringify(index, null, 2) + "\n", "utf8");
console.log("Repository index generated: " + files.length + " files");
