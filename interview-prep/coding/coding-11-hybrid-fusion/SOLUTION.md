# Coding 11 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

Fusion is 15 lines; the analysis is the answer.

```python
def rrf(rankings, k=60):
    scores = {}
    for ranking in rankings:               # each: list of doc_ids, best first
        for rank, doc in enumerate(ranking, start=1):
            scores[doc] = scores.get(doc, 0.0) + 1.0 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)

def weighted(bm25_rank, vec_rank, alpha=0.5, k=60):
    # same skeleton; alpha decides which system's ranking dominates the score
    return {**{d: alpha * 1.0/(k+r) for r, d in enumerate(bm25_rank, 1)},
            **{d: vec_score(d)}}
# (real implementation merges dicts by sum — shown compressed; say the merge
#  out loud while writing it)

# Evaluation: NDCG@10 for bm25, vector, rrf, weighted-alpha.
# Expected shape on any realistic set: rrf >= best_single + a few points
# (a5's +3-8 band), because:
#   - vector retrieves paraphrases BM25 misses (vocabulary mismatch)
#   - BM25 nails exact rare entities vectors blur (product codes, names)
# The two error sets are DIFFERENT — that is the entire reason fusion works.
```

The win/lose analysis to deliver: fusion wins most on queries mixing common and rare terms (the two systems split the query's demands); wins least when one system dominates the corpus type (pure technical-doc lookups where BM25 is near-perfect — fusion drags it toward the vector system's errors). The production sentence: "RRF ships as the default because it needs no tuning and is latency-free (two top-k lists and a merge); weighted-alpha buys 1-2 points when a dev set justifies it; the cross-encoder reranker then spends its 40-150ms on the fused top-20 (B.5) — retrieval breadth first, ranking depth second.

## Complexity and cost

O(k x systems) per query — microseconds. The cost story lives elsewhere: two indexes to keep fresh (Q-BR-10's CDC for both), and embeddings to re-embed on model change (Q-GEN-10). Say that the cheap fusion hides an expensive dual-index ops burden.

## Self-check

- [ ] RRF with k=60, missing docs score zero
- [ ] Weighted variant tuned on a dev split (not test)
- [ ] NDCG@10 on all four variants
- [ ] Win/lose analysis by query class, not just averages
- [ ] The different-failure-modes reasoning stated
