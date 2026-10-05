# Pilot Evaluation Rubric

Score each completed task from 0 to 4.

- 4 — Fully successful: correct or high-quality answer, follows every explicit instruction, and contains no material error.
- 3 — Mostly successful: substantively correct with a minor omission or formatting issue.
- 2 — Partially successful: useful progress but contains a material error, ambiguity, or multiple instruction violations.
- 1 — Poor: substantial errors or failure to follow the core task.
- 0 — Failed: no usable answer, unrelated refusal, malformed output where structure is essential, or unrecoverable error.

## Structured tasks

Verify valid JSON, required fields, field types, exact-value constraints, and extra or missing fields.

A response that is semantically correct but invalid JSON cannot receive 4.

## Coding tasks

Evaluate correctness, requested language, requested complexity or explanation, obvious edge cases, and clarity.

Do not execute generated code unless the harness explicitly supports safe execution.

## Instruction-following tasks

Evaluate every explicit constraint: requested length, requested format, prohibited words, requested item count, and semantic correctness.

## Reasoning tasks

Evaluate correctness of the final answer, correctness of supporting reasoning, and whether unsupported assumptions were introduced.

## Human scoring protocol

For the pilot, score outputs independently from the raw result files. Keep raw output unchanged. If multiple reviewers are available, record each reviewer score and calculate agreement before resolving disagreements.

Do not convert rubric scores into claims of objective accuracy unless the task has an objectively verifiable answer and the verification procedure is documented.
