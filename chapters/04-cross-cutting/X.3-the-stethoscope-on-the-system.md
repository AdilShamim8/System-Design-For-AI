---
chapter_id: "X.3"
title: "The Stethoscope on the System"
topic: "Evaluation & observability"
track: cross-cutting
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 16
prerequisites: ["A.6", "B.8"]
teaching_goal: "Design observability for AI: traces, spans, eval-in-production, drift signals, and explain why logging the prompt matters more than logging the response."
status: stable
last_updated: "2026-08-12"
---

# The Stethoscope on the System

The system is slow. Users are complaining. You look at your dashboards — CPU is fine, latency is fine, error rate is fine. Everything is fine, except the part where the system is broken. Traditional observability doesn't see AI problems. This chapter is about building the stethoscope that does.

---

## Remember

- **Observability** — understanding what's happening inside a system from the outside. Logs, metrics, traces.
- **Traces and spans** — following a single request through the pipeline. Each span captures latency, input, output, cost.
- **Eval-in-production** — sampling real traffic, grading outputs, feeding back into evals.
- **Drift signals** — input drift, output drift, ground-truth latency.
- **The four pillars**: logs, metrics, traces, evals. Traditional observability has the first three. The fourth — evals — is what makes AI observability different.

---

## Understand — what AI observability adds

Traditional observability (logs, metrics, traces) was built for deterministic software. It answers: is the system up? Is it fast? Is it erroring? For AI systems, these are necessary but insufficient. An AI system can be up, fast, and error-free — and still be producing wrong answers.

**Traces and spans:** following a single request through the pipeline: API gateway -> embedding -> vector search -> reranking -> LLM -> response. Each span captures latency, input, output, cost. This lets you see *where* a request is slow, *where* it's expensive, and *where* it might be going wrong.

**Eval-in-production:** sample real traffic (1% of requests), grade the outputs (LLM-as-judge or human review), track quality over time. This catches quality degradation that metrics can't see.

**Why logging the prompt matters more than the response:** most failures originate upstream of the model. The model gave a wrong answer because: retrieval returned bad chunks, the system prompt was ambiguous, the user's query was misunderstood. If you only log the response, you see the symptom but not the cause.

---

## Apply — design observability for a RAG system

1. **Tracing**: every request traced from API -> embed -> search -> rerank -> LLM -> response. Each span logs latency, input, output, cost.
2. **Eval-in-production**: 1% of requests sampled, graded by LLM-as-judge on faithfulness, answer relevance, context precision.
3. **Drift monitoring**: daily jobs track input distribution (query types), output distribution (response length, sentiment).
4. **Full prompt logging**: every request's full prompt (system + context + query) logged for debugging.
5. **Alerting**: alerts on latency p99, error rate, eval score drop, drift detection.

---

## Evaluate — observability is not a luxury

An AI system without observability is a black box: you don't know when it's degrading, you don't know why it's failing, you don't know what to fix. The teams that succeed in production AI invest heavily in observability.

---

## Create — design observability for a customer support bot

What do you trace? What do you eval? What drift signals matter? What do you log (full prompt or just response)? What alerts do you set?

---

## A common misconception

**"Traditional observability is sufficient for AI."** No. Traditional observability tells you if the system is *running*. It doesn't tell you if the system is *working*. AI observability adds evals — the quality dimension.

---

## Explain it back

> "AI observability adds _____ to the traditional three pillars. Traces and spans let you _____. Eval-in-production works by _____. Logging the prompt matters more than the response because _____."

---

## References

- **LangSmith Documentation.** https://docs.smith.langchain.com/
- **Langfuse Documentation.** https://langfuse.com/docs
- **Arize Phoenix.** https://docs.arize.com/phoenix
- **OpenTelemetry.** https://opentelemetry.io/docs/
