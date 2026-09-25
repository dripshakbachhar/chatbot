import { classifyTask, type TaskClassification } from "./task-classifier";
import {
  loadProjectIndex,
  searchProjectIndex,
  type ProjectIndex,
  type ProjectMatch,
} from "./project-index";

export type AgentContext = {
  request: string;
  classification: TaskClassification;
  matches: ProjectMatch[];
};

export async function buildAgentContext(
  request: string,
  options?: { index?: ProjectIndex; limit?: number },
): Promise<AgentContext> {
  const classification = classifyTask(request);
  const index = options?.index ?? (await loadProjectIndex());

  return {
    request: request.trim(),
    classification,
    matches: searchProjectIndex(
      index,
      request,
      classification,
      options?.limit ?? 8,
    ),
  };
}
