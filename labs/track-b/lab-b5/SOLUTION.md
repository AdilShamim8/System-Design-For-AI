# Lab b5 — Worked Solution and What the Numbers Mean

## Expected results (our runs, MiniLM, Zipf-weighted 500-question stream)

| Threshold | Hit rate (Zipf) | Wrong-hit rate | Monthly cost @10K/day, mid tier | Saving |
|---|---|---|---|---|
| no cache | — | — | ≈ $4,500 | — |
| 0.97 | ≈ 10–25% | ≈ 0% | ≈ $3,400–4,000 | 10–25% |
| 0.92 | ≈ 30–50% | ≈ 1–3% | ≈ $2,300–3,200 | 30–50% |
| 0.85 | ≈ 45–65% | ≈ 5–15% | ≈ $1,600–2,500 | 45–65% |
| 0.75 | ≈ 60–80% | 20%+ | "cheap" | — and untrustworthy |

## The five lessons hidden in those numbers

1. **The threshold is a trust/cost dial on one axis.** Every point of hit rate buys cost savings and risks wrong answers — and the curve is steep on both ends. 0.92 on MiniLM is the classic landing zone for support traffic (paraphrases cluster above it, different-asks below), but *you measured yours*, which is the difference between a setting and a decision.
2. **Cache value is a property of traffic, not code.** Zipf vs. uniform flips the answer from "obvious win" to "don't build it." Before any cache project: model the query distribution (the clustering extension). The top-20 clusters being ~30–50% of support traffic is why every support-bot team ends up here.
3. **Invalidation is the hard part, not lookup.** Corpus bump = flush everything (version the key with the corpus hash). Finer granularity — "this answer's source chunks changed" — requires tracking chunk→answer lineage, which is CDC/change-data-capture territory (X.0). The teams that skip this ship confidently wrong cached answers at machine speed.
4. **The cache is the fastest tier, so it goes first.** ~50–100 ms (embed + ANN) vs. 1.5–4 s (full RAG). Gateways put semantic cache before routing for exactly this reason — it's the rare optimization that improves cost *and* p99 simultaneously.
5. **Wrong-hit asymmetry mirrors fraud's cost asymmetry.** A miss costs cents; a wrong hit costs a customer complaint, a trust breach, or (Air Canada) a court case. Same structure as a3's false-positive/false-negative economics — once you've seen the pattern twice, you recognize it everywhere, and you design thresholds as business decisions everywhere.

## Common mistakes

- **Testing on unique questions only.** Raw SQuAD streaming gives 0% hits and the false conclusion "caches don't work." Simulate repetition (Zipf) or you didn't test the thing the cache exists for.
- **No corpus version in the key.** Docs update; the cache keeps serving the old world. This bug is invisible in tests (no updates during the test) and inevitable in production.
- **Threshold tuned on one embedding model, deployed with another.** Models differ in similarity scale — 0.92 is not portable. Re-tune on migration; log best-sim so you *can*.
- **Forgetting the embed cost.** Every lookup embeds the question (~30 tokens). At tiny hit rates the cache is pure overhead — the economics function includes it for a reason; read your own Part-3 table at 10% hits.

## Interview lines this lab earns you

- "My semantic cache at 0.92 on MiniLM gave 30–50% hit rate on Zipf-like support traffic — about a third off the bill — with a 1–3% wrong-hit rate I hand-audited. The threshold is a trust/cost dial, and I re-tune it when the embedder or the query mix changes."
- "The two failure modes after 'we added a cache' are invalidation and stampede: I version cache keys by corpus hash, and coalesce concurrent identical misses so a viral question computes once, not five thousand times."
