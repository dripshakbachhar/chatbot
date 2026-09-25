import { promises as fs } from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, ".project-agent", "index.json");
const IGNORED = new Set([
  ".git",
  ".next",
  "node_modules",
  ".turbo",
  "coverage",
  ".project-agent",
]);

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

type FileRecord = {
  path: string;
  category: string;
  bytes: number;
};

type SymbolRecord = {
  file: string;
  name: string;
  kind: string;
  exported: boolean;
  line: number;
};

type DependencyRecord = {
  file: string;
  imports: string[];
};

type RouteRecord = {
  file: string;
  route: string;
  methods: string[];
};

type TestRecord = {
  file: string;
  framework: string;
  likelyTargets: string[];
};

async function walk(directory: string): Promise<FileRecord[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files: FileRecord[] = [];

  for (const entry of entries) {
    if (IGNORED.has(entry.name)) {
      continue;
    }

    const absolute = path.join(directory, entry.name);
    const relative = path.relative(ROOT, absolute).replaceAll(path.sep, "/");

    if (entry.isDirectory()) {
      files.push(...(await walk(absolute)));
      continue;
    }

    const stat = await fs.stat(absolute);
    const extension = path.extname(entry.name).toLowerCase();

    files.push({
      path: relative,
      category: CATEGORY[extension] ?? "other",
      bytes: stat.size,
    });
  }

  return files;
}

function isCodeFile(file: string) {
  return /\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(file);
}

function isExported(node: ts.Node): boolean {
  return !!node.modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
  );
}

function symbolKind(node: ts.Node): string | null {
  if (ts.isFunctionDeclaration(node)) {
    return "function";
  }
  if (ts.isClassDeclaration(node)) {
    return "class";
  }
  if (ts.isInterfaceDeclaration(node)) {
    return "interface";
  }
  if (ts.isTypeAliasDeclaration(node)) {
    return "type";
  }
  if (ts.isEnumDeclaration(node)) {
    return "enum";
  }
  if (ts.isVariableStatement(node)) {
    return "variable";
  }
  if (ts.isModuleDeclaration(node)) {
    return "namespace";
  }
  return null;
}

function collectSymbols(source: ts.SourceFile): SymbolRecord[] {
  const symbols: SymbolRecord[] = [];

  const visit = (node: ts.Node) => {
    const kind = symbolKind(node);
    if (kind) {
      if (ts.isVariableStatement(node)) {
        for (const declaration of node.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name)) {
            symbols.push({
              file: source.fileName,
              name: declaration.name.text,
              kind,
              exported: isExported(node),
              line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1,
            });
          }
        }
      } else if ("name" in node && node.name && ts.isIdentifier(node.name)) {
        symbols.push({
          file: source.fileName,
          name: node.name.text,
          kind,
          exported: isExported(node),
          line:
            source.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        });
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(source);
  return symbols;
}

function collectImports(source: ts.SourceFile): string[] {
  const imports = new Set<string>();

  for (const statement of source.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      imports.add(statement.moduleSpecifier.text);
    }

    if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      imports.add(statement.moduleSpecifier.text);
    }

    if (
      ts.isImportEqualsDeclaration(statement) &&
      ts.isExternalModuleReference(statement.moduleReference) &&
      ts.isStringLiteral(statement.moduleReference.expression)
    ) {
      imports.add(statement.moduleReference.expression.text);
    }
  }

  return [...imports].sort();
}

function routeFromFile(file: string): string | null {
  const normalized = file.replaceAll(path.sep, "/");
  const match = normalized.match(
    /^app\/\(.*?\)\/api\/(.+)\/route\.(?:ts|tsx|js|jsx)$/
  );
  const appMatch = normalized.match(
    /^app\/api\/(.+)\/route\.(?:ts|tsx|js|jsx)$/
  );
  const tail = match?.[1] ?? appMatch?.[1];

  if (!tail) {
    return null;
  }

  return (
    "/" +
    tail
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.replace(/^\[(.+)\]$/, ":$1"))
      .join("/")
  );
}

function collectRouteMethods(source: ts.SourceFile): string[] {
  const methods = new Set<string>();

  for (const statement of source.statements) {
    if (!ts.isFunctionDeclaration(statement) || !statement.name) {
      continue;
    }

    const name = statement.name.text.toUpperCase();
    if (/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/.test(name)) {
      methods.add(name);
    }
  }

  return [...methods].sort();
}

function detectTest(file: string): TestRecord | null {
  if (
    !/(?:^|\/)(?:tests?|e2e)(?:\/|$)/i.test(file) &&
    !/\.(?:test|spec)\.[^.]+$/i.test(file)
  ) {
    return null;
  }

  const framework =
    file.includes("playwright") || file.includes("e2e")
      ? "playwright"
      : "unknown";
  const base = path.basename(file).replace(/\.(?:test|spec)\.[^.]+$/, "");
  const likelyTargets = base === "api" ? ["app/**/api/**"] : base ? [base] : [];

  return { file, framework, likelyTargets };
}

async function readJson(file: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}

const files = (await walk(ROOT)).sort((a, b) => a.path.localeCompare(b.path));
const codeFiles = files.filter((file) => isCodeFile(file.path));

const symbols: SymbolRecord[] = [];
const dependencies: DependencyRecord[] = [];
const routes: RouteRecord[] = [];
const tests: TestRecord[] = [];

for (const file of codeFiles) {
  const absolute = path.join(ROOT, file.path);
  const sourceText = await fs.readFile(absolute, "utf8");
  const source = ts.createSourceFile(
    file.path,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    file.path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  symbols.push(
    ...collectSymbols(source).map((symbol) => ({ ...symbol, file: file.path }))
  );

  const imports = collectImports(source);
  if (imports.length > 0) {
    dependencies.push({ file: file.path, imports });
  }

  const route = routeFromFile(file.path);
  if (route) {
    routes.push({
      file: file.path,
      route,
      methods: collectRouteMethods(source),
    });
  }

  const test = detectTest(file.path);
  if (test) {
    tests.push(test);
  }
}

const packageJson = await readJson(path.join(ROOT, "package.json"));
const dependenciesByPackage = {
  dependencies: Object.keys(
    (packageJson?.dependencies ?? {}) as Record<string, unknown>
  ).sort(),
  devDependencies: Object.keys(
    (packageJson?.devDependencies ?? {}) as Record<string, unknown>
  ).sort(),
};

const index = {
  version: 2,
  generatedAt: new Date().toISOString(),
  repository: "dripshakbachhar/chatbot",
  fileCount: files.length,
  files,
  symbols: symbols.sort(
    (a, b) => a.file.localeCompare(b.file) || a.line - b.line
  ),
  dependencies,
  packages: dependenciesByPackage,
  routes: routes.sort((a, b) => a.route.localeCompare(b.route)),
  tests: tests.sort((a, b) => a.file.localeCompare(b.file)),
};

await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
await fs.writeFile(OUTPUT, `${JSON.stringify(index, null, 2)}\n`, "utf8");

console.log(
  [
    `Repository index generated: ${files.length} files`,
    `Symbols: ${symbols.length}`,
    `Dependency entries: ${dependencies.length}`,
    `Routes: ${routes.length}`,
    `Tests: ${tests.length}`,
  ].join(" | ")
);
