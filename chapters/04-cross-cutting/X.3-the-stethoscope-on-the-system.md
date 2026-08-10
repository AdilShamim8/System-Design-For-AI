---
chapter_id: "X.3"
title: "The Stethoscope on the System"
topic: "Evaluation & observability"
track: cross-cutting
bloom_stage: ["apply", "evaluate"]
est_read_minutes: 16
prerequisites: ["A.6", "B.8"]
teaching_goal: "Design observability for AI: traces, spans, eval-in-production, drift signals, and explain why logging the prompt matters more than logging the response."
primary_diagram: assets/diagrams/X.3/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Stethoscope on the System

The system is slow. Users are complaining. You look at your dashboards — CPU is fine, latency is fine, error rate is fine. Everything is fine, except the part where the system is broken. Traditional observability doesn't see AI problems. This chapter is about building the stethoscope that does.

---

## Remember

**Observability** — the ability to understand what's happening inside a system from the outside. **Traces and spans** — following a single request through the pipeline. **Eval-in-production** — sampling real traffic and grading outputs. **Drift signals** — input drift, output drift, ground-truth latency. **The four pillars**: logs, metrics, traces, evals.

---

## Understand

Traditional observability (logs, metrics, traces) was built for deterministic software. It answers: is the system up? Is it fast? Is it erroring? For AI systems, these questions are necessary but insufficient. An AI system can be up, fast, and error-free — and still be producing wrong answers. Traditional observability doesn't see AI problems.

**What AI observability adds:**

**Traces and spans.** Following a single request through the pipeline: API gateway → embedding → vector search → reranking → LLM → response. Each span captures: latency, input, output, cost. This lets you see *where* a request is slow, *where* it's expensive, and *where* it might be going wrong. Tools: LangSmith, Langfuse, Arize Phoenix.

**Eval-in-production.** Sample real traffic (e.g., 1% of requests), grade the outputs (using LLM-as-judge or human review), and track quality over time. This catches quality degradation that metrics can't see. The loop: production traffic → sampled → evaluated → metrics tracked → alerts on quality drop → investigation.

**Drift signals.**
- **Input drift**: has the query distribution changed? Are users asking different questions than they used to?
- **Output drift**: has the model's response distribution changed? Is it answering differently for the same inputs?
- **Ground-truth latency**: how quickly do you learn whether predictions were right? For ads, seconds. For loan defaults, months. Long latency means slow drift detection.

**Why logging the prompt matters more than logging the response.** Most failures originate upstream of the model. The model gave a wrong answer because: the retrieval returned bad chunks, the system prompt was ambiguous, the user's query was misunderstood, the context was stale. If you only log the response, you see the symptom but not the cause. Logging the full prompt (system + retrieved context + user query) lets you debug *why* the model did what it did.

---

## Apply

Design observability for a RAG system:
1. **Tracing**: every request traced from API → embed → search → rerank → LLM → response. Each span logs latency, input, output, cost.
2. **Eval-in-production**: 1% of requests sampled, graded by LLM-as-judge on faithfulness, answer relevance, context precision. Metrics tracked daily.
3. **Drift monitoring**: daily jobs track input distribution (query types), output distribution (response length, sentiment), ground-truth latency (how quickly do users give feedback?).
4. **Full prompt logging**: every request's full prompt (system + context + query) logged, not just the response. This is the debugging lifeline.
5. **Alerting**: alerts on latency p99, error rate, eval score drop, drift detection.

This gives: tracing (where), evals (quality), drift (early warning), prompt logging (why), alerting (when to investigate).

---

## Analyze

The observability stack for AI has four pillars: logs (what happened), metrics (aggregate health), traces (per-request detail), evals (quality assessment). Traditional observability has the first three. The fourth — evals — is what makes AI observability different. Without evals, you know the system is *running* but not whether it's *working*. Evals are the stethoscope that lets you hear whether the heart is beating properly, not just whether the patient is breathing.

---

## Evaluate

Observability is not a luxury — it's the difference between flying blind and flying with instruments. An AI system without observability is a black box: you don't know when it's degrading, you don't know why it's failing, you don't know what to fix. The teams that succeed in production AI invest heavily in observability — because they can see problems before users complain, and they can diagnose problems when users do.

---

## Create

Design observability for a customer support bot. What do you trace? What do you eval? What drift signals matter? What do you log (full prompt or just response)? What alerts do you set? How do you balance observability depth with cost (logging everything is expensive)?

---

## A common misconception

**'Traditional observability is sufficient for AI.'** No. Traditional observability (logs, metrics, traces) tells you if the system is *running*. It doesn't tell you if the system is *working*. AI systems can be up, fast, and error-free while producing wrong answers. AI observability adds evals — the quality dimension — which is what actually matters for users.

---

## Explain it back

AI observability adds _____ to the traditional three pillars (logs, metrics, traces). Traces and spans let you _____. Eval-in-production works by _____. The three drift signals are _____, _____, and _____. Logging the prompt matters more than logging the response because _____.

---

## Further reading

- **LangSmith documentation** — observability for LLM applications.
- **Langfuse documentation** — open-source LLM observability.
- **Arize Phoenix** — AI observability and evaluation.
- **OpenTelemetry for LLMs** — emerging standard for AI tracing.
