# Capstone cap1 — Reference Architecture and Build Notes

## The shape that works (our reference build, FastAPI docs corpus)

```
user ──▶ gateway (FastAPI)
            │  input guardrail (injection patterns → log + harden)
            ▼
         semantic cache ──hit──▶ answer (50ms path)
            │ miss
            ▼
         retrieval (section-aware chunks → embed → ANN top-6)
            │
            ▼
         generation (small tier, cited, refusal-prompted)
            │
            ▼
         output guardrail (schema + banned content) ──▶ user
            │
            ├──▶ request log (JSONL: query, chunks, answer, timings, versions)
            └──▶ sampled to eval set (failures become eval cases)
```

## Numbers from our reference build

| Metric | Value |
|---|---|
| Chunks / corpus | 1,140 (FastAPI docs, section-aware, ~400 tokens) |
| hit@4 (20-q eval) | 0.80 |
| Faithfulness / relevance (b4 judge) | 0.91 / 0.86 |
| Refusal on adversarial set | 12/15 (two "helpful drift" failures — the eternal enemy) |
| Cache hit rate (Zipf-ish dev traffic) | ~45% |
| Cost per successful answer | ≈ $0.0021 (mid tier) / ≈ $0.0004 (small + rerank) |
| p50/p95 end-to-end | 1.9 s / 4.1 s (cache hits: 60 ms) |

## What the build teaches that labs couldn't

1. **Integration multiplies failure modes, and the logs are the only map.** Retrieval was 0.80 alone; through the full stack with cache and guards, first end-to-end pass was 0.65 — the gaps were cache-key bugs (wrong corpus version) and an output validator mangling citations. Every fix started in the request log. x1's schema isn't bureaucracy; it's the debugger.
2. **Refusal is the last 10% that takes 30% of the time.** Two adversarial failures both were the model "helpfully" answering adjacent-but-absent questions. The fix was prompt-side *and* retrieval-side (return "insufficient context" signal when top-sim < threshold). Guardrails are layers because single fixes never close it.
3. **The cost model changed the architecture.** Mid-tier at $0.0021/answer was fine for dev; projecting 10K requests/day made the small-tier + reranker route ($0.0004) the obvious ship — a decision made from the x2 dashboard in ten minutes, not from vibes.
4. **Real users break eval sets, which is the point.** First real user asked three questions that were *combinations* no eval case covered; one broke retrieval (topic-split). The failure became eval case #36. The eval set is a living artifact — its growth rate is the project's honesty metric.
5. **The one-pager is the capstone's last deliverable.** Writing the x4 doc after building forces you to *reconcile* what you claimed with what you measured — and the doc that survives that reconciliation is interview-ready by construction, because every line has a number you bled for.
