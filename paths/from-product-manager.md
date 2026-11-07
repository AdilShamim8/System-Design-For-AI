# Path: From Product Manager

**You are:** a PM or product lead who frames problems, owns metrics, and writes specs. You can't (and don't need to) write production code, but you keep ending up in meetings about AI features — and you've realized you can't spec what you can't reason about, and you can't push back on engineers' estimates you can't sanity-check.

**This is the concept track.** You skip the coding labs and focus on chapters, field notes, the design-studio chapters, and the *reading* side of interview prep. Target: 6–8 weeks at ~5 hours/week. You will not become an AI system designer; you will become the PM who knows exactly what "RAG," "semantic cache," "guardrails," "hallucination rate," and "$0.004 per request" mean — and who can whiteboard the shape of the system with the best of them.

---

## What you already have

- **Problem framing.** The hardest part of any AI system design is deciding what problem it solves and what "good" means — the exact skills Chapter 0.0 and the interview framework (step 1: clarify) reward.
- **Metric ownership.** X.2 (evaluation) is your home chapter: online vs. offline metrics, guardrail metrics, A/B design — PMs who internalize *why offline metrics lie* become dangerous (in the good way).
- **User sense.** You know that a feature that answers in 4 seconds with 99% accuracy loses to one that answers in 1 second with 92% accuracy — latency/quality tradeoffs (X.0, B.6) are product decisions wearing engineering clothes.

## What will be new

1. **The vocabulary of the stack** — embeddings, vector databases, chunking, agents, tool calls, fine-tuning, context windows (Track B, C). You'll stop nodding along in architecture reviews.
2. **The cost model** — tokens, per-request economics, cache hit rates, GPU-hour math (X.4). You will never again accept "AI features are expensive" without asking *how expensive, per what, compared to what*.
3. **The failure modes** — hallucination, drift, prompt injection, guardrail bypass (field notes, C.5). A PM who cites the Air Canada case (FN-04) when reviewing a support-bot spec earns the room's trust instantly.
4. **What's hard vs. what's demo-easy** — the demo-to-production gap is the core PM risk of 2020s AI products; Track C's "building blocks vs. production principles" framing exists precisely for you.

---

## Your 7-week concept track

| Week | Read | Also | Product takeaway |
|---|---|---|---|
| 1 | 0.0–0.3 | FN-11 | The four questions; why the best model can die on the way to production |
| 2 | A.2, A.5 | FN-02 | Recommendation and fraud patterns — where AI creates business value |
| 3 | B.0–B.2 | FN-04 | LLM mechanics + RAG; hallucination liability is a product risk |
| 4 | B.3–B.6 | — | Chunking, reranking, cost tiers — what your engineers will negotiate over |
| 5 | B.8, X.2 | FN-09 | Evaluation — the spec language for "good" |
| 6 | C.0–C.5 | FN-07 | Agents and guardrails; the Chevy $1 car as a spec-writing lesson |
| 7 | X.4, S.1, S.4 | Mock 1 (read only) | Unit economics; end with a full design walkthrough, PM-style |

*(Optionally skim lab READMEs — not to run them, but to see what the work actually involves. Lab b1's cost table and x2's cost dashboard are directly useful artifacts for roadmap planning.)*

---

## How you'll use this (and how you won't)

**Will:** writing specs with acceptance criteria an engineer can't weasel out of ("faithfulness ≥ X% on a 200-question eval set; p95 first-token latency ≤ 1.5s; cost ≤ $0.006/request at 10K requests/day"); sanity-checking timelines ("a RAG MVP is weeks, a fine-tuning program is quarters" — B.6); risk-registering the right failures (drift, injection, cost spikes).

**Won't:** don't quote this course as implementation authority. Your line is "here's the pattern and the tradeoff" — then let your engineers own the details. The seniority ladder (`interview-prep/09-seniority-ladder.md`) is useful reading for calibrating what to expect from engineers at each level, too.

**First 48 hours:** read 0.0 and FN-11 (the Netflix Prize: a perfect model, no product), then Chapter B.2 and FN-04 (Air Canada: a working chatbot, a lost court case). Those four reads will already change your next AI spec.
