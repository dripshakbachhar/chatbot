import { describe, expect, it } from "vitest";
import { classifyTask } from "./task-classifier";

describe("classifyTask", () => {
  it("classifies a bug report", () => {
    expect(classifyTask("The chat streaming is broken and throws an error").primary).toBe("BUG");
  });

  it("classifies an implementation request", () => {
    expect(classifyTask("Add repository search to the agent").primary).toBe("FEATURE");
  });

  it("keeps multiple concerns", () => {
    const result = classifyTask("Fix the API bug and add a Playwright test");
    expect(result.primary).toBe("BUG");
    expect(result.secondary).toContain("API");
    expect(result.secondary).toContain("TESTING");
  });
});
