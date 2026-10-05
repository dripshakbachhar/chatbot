# Reproducible LLM Benchmark

## Research question

How do the curated language models used by this application trade off response quality, latency, reliability, and output validity across standardized application workloads?

## Scope

This benchmark is an empirical research instrument, not a claim about which model is universally best. It evaluates the models configured in lib/ai/models.ts under fixed tasks and records reproducible measurements.

The first pilot contains 20 tasks across four categories:
- reasoning
- coding
- structured generation
- instruction following

A later expansion should add tool-use and document/artifact workloads once the evaluation harness can execute those workflows consistently.

## Variables

Independent variable: model ID.

Primary dependent variables:
- latency in milliseconds
- successful completion
- output validity
- rubric score
- error/failure category

Secondary variables:
- input/output token usage when exposed by the provider
- estimated cost when reliable provider pricing data is available
- repeated-run consistency

## Methodology

1. Use the exact task text stored in research/benchmark/prompts/tasks.json.
2. Run the same task set against every selected model.
3. Do not change prompts between models.
4. Record timestamps, model ID, task ID, response text, finish reason, usage metadata, and errors.
5. Keep raw results immutable; derived analysis belongs in separate files.
6. Score outputs with the rubric in research/benchmark/rubric.md.
7. Report missing metrics rather than estimating them.
8. Record the model/provider configuration and benchmark commit SHA with every run.

## Pilot design

The 20-task pilot is intentionally small. It is designed to expose flaws in the harness and scoring process before a larger 100+ task study.

Recommended expansion after pilot validation:
- 25 reasoning tasks
- 25 coding tasks
- 25 structured-generation tasks
- 25 instruction-following tasks
- 25 tool-use tasks
- 25 document/artifact tasks

## Reproducibility requirements

A benchmark result is only considered reproducible when another researcher can identify:
- repository commit
- model ID
- prompt/task ID
- model settings
- benchmark timestamp
- runtime/environment
- raw output
- scoring rubric
- any excluded or failed runs

Never report fabricated scores, costs, latency, or accuracy.

## Research outputs

The intended outputs are:
1. machine-readable raw results;
2. summary tables and plots;
3. methodology document;
4. research report/paper;
5. reproducibility instructions.

The benchmark does not imply publication or external validation until the resulting work has actually been reviewed or accepted by an external venue.
