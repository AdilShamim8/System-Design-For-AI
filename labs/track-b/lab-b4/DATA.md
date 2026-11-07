# Lab b4 — Dataset: SQuAD + your judgment labels

Reuses Lab b2's SQuAD validation split (see [that card](../../track-b/lab-b2/DATA.md)) — no new download. The new "data" you create here:

**The eval set (`evals/rag_eval_v1.jsonl`)** — 150 questions with: question, gold context (from SQuAD), retrieved chunks, answer, faithfulness judgment, relevance judgment. This file is the lab's real deliverable: a versioned, re-runnable quality artifact. In production, this same shape (question, retrieved, answer, judgments) is what RAG observability platforms (Langfuse, LangSmith — see `ai-stack/observability-eval.md`) store per request; you're building the offline mini-version.

**Judge labels** — 30–50 hand-checked judgments (the golden-set extension) to calibrate the LLM judge. Cohen's κ is the standard agreement statistic; ~0.6+ is workable, 0.8+ is good, and *unmeasured* is a stranger grading homework.

**Calibration numbers to expect:**

- MiniLM retrieval on SQuAD: hit@4 ≈ 0.70–0.80 (from b2).
- Faithfulness, decent prompt + small judge: ≈ 0.80–0.95.
- Judge self-agreement at temperature 0: ≈ 0.9–1.0; at default temperature: 0.7–0.9.
- Position bias on identical A/B: small models flip 20–40% of the time unless you randomize order.

**Why SQuAD and not "your own docs":** labeled ground truth for *retrieval* is the scarce resource; SQuAD has it built in. The *harness* transfers to any corpus; only the eval-set construction (Lab b3's 12-question pattern, scaled up) is corpus-specific work.
