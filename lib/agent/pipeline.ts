import {
  loadProjectIndex,
  type ProjectIndex,
  type ProjectMatch,
  searchProjectIndex,
} from "./project-index";
import { classifyTask, type TaskClassification } from "./task-classifier";

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
      options?.limit ?? 8
    ),
  };
}
