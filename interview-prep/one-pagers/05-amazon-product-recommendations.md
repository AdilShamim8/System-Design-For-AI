# 05 — Amazon's Item-to-Item CF (the scalability classic)

**The system in three sentences.** The 2003 paper that made collaborative filtering scale when users outnumber engineers a million to one: instead of matching users to users (O(users²)), match items to items (precomputed, catalog-stable) — 'customers who bought this also bought.' The insight that survives: precompute the expensive similarity offline, serve lookups online. Every 'design related-items' question since descends from it.

## The spine (draw it in 60 seconds)

```
purchase matrix → item-item cosine (precomputed, nightly) → top-K neighbors per item
serving: user's recent items (seeds) → neighbor lookup → merge/dedupe/rank → the shelf
             ↑ purchases stream back → tomorrow's similarity matrix ↑
```

## The numbers to carry

The 2003 Linden/Smith/York paper is the citation (name it — nobody does, and it lands) · my a2/coding-2 numbers: precomputed item-item serves in single-digit ms; per-request cosine is seconds (the budget blow) · at 100K+ items store top-K neighbors sparse (~80MB), not the full matrix (~380MB dense at 10K, worse beyond)

## The failure modes that get probed

Cold items (no co-purchases: content-based fallback — embeddings of text/images, b8) · drift in similarity (stale neighbors: refresh cadence) · the filter bubble of pure CF (diversity injection in the merge) · conversion-vs-discovery tension (same spiral as every feed)

**Interviews this arms you for:** Q-ML-7, coding-2 · the fastest full-marks answer in any recommender round

**The AI-era twist (say it before they ask):** Same precompute-vs-online rule now governs embedding tables and vector indexes — the classic's core insight (precompute the expensive, serve the cheap) is B.3's whole thesis. One sentence: 'the 2003 trick is why vector databases exist.'
