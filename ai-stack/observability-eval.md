> Reference landscape, current as of **late 2026**. Tools change; the *categories* and the selection questions are durable. Every file leads with the questions you should ask before picking anything in its category.


# Observability and Evaluation Tooling

## Instrument in this order (the labs already taught it)

1. **Structured logs per request** (Lab x1's schema): query, retrieved chunks, answer, timings, versions (model, prompt, corpus hash). No observability tool compensates for a missing log line.
2. **Traces for agents** (Lab c1/c5): step-level, replayable — the *only* debugging tool for "why did the agent do that."
3. **Eval sets + gates** (Labs b4, c5): versioned questions, two-tier grading, CI-blocking on regression.
4. **Drift monitors** (Labs a7, x1): PSI/KS per feature, output distributions, three-horizon dashboard.

## The tools by category

| Category | Tools | What you'd pick them for |
|---|---|---|
| LLM tracing/platform | **Langfuse** (open-source, self-hostable), **LangSmith** (LangChain-native), **Arize Phoenix** (open), **Braintrust** | traces, prompt versioning, eval runs, datasets — the b4/c5 machinery, productized |
| Experiment tracking | **MLflow** (classic, self-hosted), **Weights & Biases** | training runs, artifacts, compare-metrics — Lab b6 territory at scale |
| LLM eval frameworks | **RAGAS** (RAG metrics), **DeepEval**, **promptfoo** | packaged faithfulness/relevance/judge metrics; CI for prompts |
| Drift/data quality | **Evidently** (open-source, ML/data drift), **Great Expectations** (data validation) | a7/x1 dashboards without building the math yourself |
| Metrics/infra | **Prometheus + Grafana**, **OpenTelemetry** (incl. OpenLLMetry) | the x1/x3 plumbing; industry default |

**Selection honesty:** Langfuse-vs-LangSmith-vs-Phoenix is a team-context decision (self-host policy, framework affinity), not a capability decision — by late 2026 all three do traces + evals + datasets well. The *category* is table stakes; the differentiator is whether you feed it the four layers above. A team with great logs and eval sets on plain Postgres beats a team with a fancy platform and no eval discipline.

## What tooling cannot do

- Make an eval set exist (you write it — b3/b4/c5 taught the craft; the tool stores and runs it).
- Calibrate a judge you never checked (b4's bias tests are yours to run, whatever the platform).
- Decide thresholds (a7's month-simulation and x1's runbook are judgment + data, not installs).

**The order of operations this course implies:** logs → evals → drift → platform. Reverse it and you've bought a dashboard farm with nothing to render.
