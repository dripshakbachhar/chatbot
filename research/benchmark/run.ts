import { mkdir, readFile, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

import { generateText } from "ai";

import { chatModels } from "../../lib/ai/models";
import { getLanguageModel } from "../../lib/ai/providers";

type Task = {
  id: string;
  category: string;
  prompt: string;
};

type Result = {
  taskId: string;
  category: string;
  modelId: string;
  startedAt: string;
  latencyMs: number;
  success: boolean;
  text: string;
  finishReason: string | null;
  usage: unknown;
  error: string | null;
};

const tasksPath = "research/benchmark/prompts/tasks.json";
const outputDir = "research/benchmark/results";

async function main() {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    throw new Error(
      "Set AI_GATEWAY_API_KEY (or use a Vercel OIDC environment) before running the benchmark."
    );
  }

  const tasks = JSON.parse(await readFile(tasksPath, "utf8")) as Task[];

  const requestedModels = process.env.BENCHMARK_MODELS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const modelIds = requestedModels?.length
    ? requestedModels
    : chatModels.map((model) => model.id);

  const knownModelIds = new Set(chatModels.map((model) => model.id));
  const unknownModel = modelIds.find((id) => !knownModelIds.has(id));

  if (unknownModel) {
    throw new Error(
      `Model is not in the curated application allowlist: ${unknownModel}`
    );
  }

  const results: Result[] = [];

  for (const modelId of modelIds) {
    for (const task of tasks) {
      const startedAt = new Date().toISOString();
      const start = performance.now();

      try {
        const response = await generateText({
          model: getLanguageModel(modelId),
          prompt: task.prompt,
        });

        results.push({
          taskId: task.id,
          category: task.category,
          modelId,
          startedAt,
          latencyMs: Math.round(performance.now() - start),
          success: true,
          text: response.text,
          finishReason: response.finishReason ?? null,
          usage: response.usage ?? null,
          error: null,
        });
      } catch (error) {
        results.push({
          taskId: task.id,
          category: task.category,
          modelId,
          startedAt,
          latencyMs: Math.round(performance.now() - start),
          success: false,
          text: "",
          finishReason: null,
          usage: null,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  await mkdir(outputDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputPath = `${outputDir}/run-${timestamp}.json`;

  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        benchmarkVersion: 1,
        taskCount: tasks.length,
        modelIds,
        modelConfiguration: chatModels.filter((model) =>
          modelIds.includes(model.id)
        ),
        startedAt: results[0]?.startedAt ?? new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results,
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const successful = results.filter((result) => result.success).length;
  console.log(
    JSON.stringify(
      {
        outputPath,
        models: modelIds.length,
        tasks: tasks.length,
        attempted: results.length,
        successful,
        failed: results.length - successful,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
