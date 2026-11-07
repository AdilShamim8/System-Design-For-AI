# Path: From ML Engineer

**You are:** the person who already trains models, versions data, runs pipelines in Airflow or Kubeflow, deploys to SageMaker/Vertex/a homegrown serving stack, and has opinions about MLflow vs. W&B. Classical ML systems are your day job.

**What you're here for:** the LLM-era layer — RAG, agents, token economics, LLM evaluation — plus the interview shape of AI system design, which has drifted from "design the training pipeline" toward "design the product around a foundation model." Per the [AI Engineering Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide)'s job-posting data, the smoothest MLE→AI-engineer transition mostly means: keep your engineering, swap the model call for an API call, and add evaluation and cost discipline for non-deterministic components.

---

## What you already have

- **The classical lifecycle** (A.0–A.7): you can skim these; they'll read as a well-organized refresher. Do the labs anyway — a1, a3, a7 are calibrated to expose training/serving skew and drift habits you may have faked.
- **Monitoring basics** (X.3): metric dashboards, alerts. What's new is *semantic* monitoring (B.8, Lab c5).
- **Infra courage.** Kubernetes, GPUs, queues — Track C and the serving labs will feel like home.

## What will be new

1. **LLM serving is not model serving.** No weights to load — an API with quotas, rate limits, and per-token pricing; latency is *streaming*, and throughput is measured in tokens/sec. Chapters B.0, B.6; Lab b1.
2. **RAG as a system** — chunking, embedding pipelines, vector indexes, rerankers, freshness (CDC). Chapters B.2–B.5; Labs b2–b4. Your retrieval instincts from search infra transfer, but evaluation is completely different.
3. **Evaluation without ground truth** (B.8): LLM-as-judge, faithfulness/relevance metrics, trace-level evals for agents (C.5, Lab c5). This is the #1 stated differentiator in AI-engineer job postings.
4. **Agents** (C.0–C.5): loops, tool contracts, guardrails. You'll recognize the control flow; the new part is failure modes of *autonomy*.
5. **Prompt/versioning discipline** — prompts are code, and B.1 treats them as an interface with regression tests.

---

## Your 9-week plan

| Week | Read | Do | Note |
|---|---|---|---|
| 1 | 0.0–0.3 (skim), A.1 | Setup, Lab a1 | Calibration check on fundamentals; feature-store chapter properly |
| 2 | A.2, A.4 | Lab a4 | CTR + calibration — the sub-topic MLEs most often fumble in interviews |
| 3 | B.0–B.2 | Lab b1 | Token math and streaming latency |
| 4 | B.3, B.4 | Lab b2 | RAG from scratch; you build the index yourself |
| 5 | B.5, B.8 | Labs b3, b4 | Reranking + RAG evaluation |
| 6 | C.0–C.2 | Lab c1 | Agent loop with no framework — read the loop, not the library |
| 7 | C.3–C.5 | Labs c2, c5 | Tool contracts, guardrails, trace evals |
| 8 | X.1, X.4 | Labs b5, x2 | Semantic caching + unit economics — quote real numbers in interviews |
| 9 | S.2, S.3 | Capstone cap2 | Multi-tenant RAG platform; mocks 4, 5, 7 |

---

## Your interview profile

**Strengths:** you can go deeper than anyone on training pipelines, feature stores, and drift. When an interviewer asks "how would you retrain without downtime?", you have a real answer (A.6: shadow, canary, champion/challenger).

**Blind spots to patch:**
- Over-indexing on the model when the question is about the *product*. If asked to design a support bot, do not start with "first, fine-tune…" — start with the request flow and evaluation plan (Mock 1 exists to break this habit).
- Treating the LLM as a solved component ("we'll call GPT"). Interviewers probe provider failover, rate limits, caching, and cost per 1K requests — Mock 4.
- Never having built guardrails: FN-07 (Chevy's $1 car), FN-04 (Air Canada) are your cautionary-tale ammunition.
- Sounding like 2019 MLOps: mention eval-driven development, semantic caching, and routing — not just "retrain on schedule."

**First 48 hours:** read B.2 and C.1, do Lab b1 (measure tokens and cost on real API pricing), and read FN-02 (Zillow) — the best existing-skills warning shot in the repo: great model, sound pipeline, business destroyed by uncertainty the system never priced in.
