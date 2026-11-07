> Reference landscape, current as of **late 2026**. Tools change; the *categories* and the selection questions are durable. Every file leads with the questions you should ask before picking anything in its category.


# Orchestration Frameworks

## The honest framing

Frameworks sell speed-to-demo. What they cost is *opacity*: when the abstraction leaks (it will), you debug code you didn't write against behavior you can't see. This course's position (and its pedagogy): **build the loop bare-handed once (Labs c1–c2), then let a framework save you time with your eyes open.**

| Framework | The shape | Reach for it when |
|---|---|---|
| **LangChain** | the everything-store: chains, tools, retrievers, memory | you want the widest integration surface and accept churn in the API |
| **LangGraph** | explicit graph-of-state control flow for agents | your agent has real control-flow requirements (loops, branches, human-in-loop checkpoints) |
| **LlamaIndex** | retrieval-first: ingestion, indices, query engines | your problem is 80% RAG/data and 20% orchestration |
| **smolagents** (HF) | minimal code-first agents; the loop is visible in a page | you want small, readable, close-to-the-metal (closest to Lab c1) |
| **Haystack** | pipeline DAGs, strong retrieval lineage (deepset) | production NLP/RAG pipelines with a team that wants a stable, versioned framework |
| **DSPy** | *programming* prompts: declarative signatures, compiled optimization | prompt-tuning is your bottleneck and you want it measured and automated (very b4-native) |

## What frameworks hide (the lab c1 checklist, mapped)

- **The loop itself** — steps, budgets, termination (c1's four killers live here).
- **Context management** — what gets resent, trimmed, summarized (c4's budget problem).
- **Tool dispatch and errors** — hopefully c2's contracts; often just try/except.
- **Tracing** — the good ones emit spans you can read (check this *before* committing; c5's traces are the product).
- **Evaluation hooks** — can you run your b4/c5 eval sets through *this* path? If not, you're flying blind in a nicer cockpit.

## The decision rule

- Prototype/demo, integrations matter → framework, any of them, whatever your team knows.
- Production agent with reliability requirements → explicit control flow (LangGraph-class) or your own thin loop (c1's ~100 lines + c2's contracts + c5's guards). The "write it yourself" option is genuinely competitive at this layer, which surprises people until they've built the loop once.
- Anything you can't debug from its traces is disqualified, regardless of stars.

**Read next:** [observability-eval.md](./observability-eval.md) — the traces a framework must give you.
