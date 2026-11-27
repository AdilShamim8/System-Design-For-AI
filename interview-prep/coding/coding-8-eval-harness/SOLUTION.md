# Coding 8 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

The harness is a decision machine, not a scoreboard — the verdict logic is the deliverable.

```python
import pandas as pd

def hit_at_k(retrieved, gold_docs, k=3):
    return float(len(set(retrieved[:k]) & set(gold_docs)) > 0)

def score_variant(df, out_col):
    df = df.copy()
    df["retrieval_hit"] = df.apply(
        lambda r: hit_at_k(r[out_col + "_docs"], r.gold_docs), axis=1)
    df["faithfulness"] = df[out_col + "_faith"]        # judged offline, or:
    # judged_here = [llm_judge(JUDGE_PROMPT_v3, q, a) for q, a in ...]  # versioned judge
    return df

def gate(old, new, slice_col="slice", margin=2.0):
    report = []
    for sl in old[slice_col].unique():
        o = new[new[slice_col] == sl]; n = old[old[slice_col] == sl]
        for m in ("retrieval_hit", "faithfulness"):
            delta = n[m].mean() * 5 - o[m].mean() * 5   # compare on 5-pt scale
            report.append({"slice": sl, "metric": m, "old": o[m].mean(),
                           "new": n[m].mean(), "delta": round(delta, 2)})
    R = pd.DataFrame(report)
    worst = R.sort_values("delta").iloc[0]
    overall_delta = (new.faithfulness.mean() - old.faithfulness.mean()) * 5
    if worst.delta < -margin and overall_delta < 0: verdict = "NO SHIP"
    elif worst.delta < -margin:                    verdict = "INVESTIGATE"
    elif overall_delta >= 0:                       verdict = "SHIP"
    else:                                          verdict = "INVESTIGATE"
    return verdict, R, worst

# The report that comes out: one page — overall delta, the slice table sorted
# worst-first, and the 5 largest per-row deltas in BOTH directions (the rows
# where new beat old tell you what the prompt change actually bought).
```

The two lies this harness can tell, spoken in the interview: "(1) *judge drift* — the judge prompt is code; when it changes, every historical score is stale, so the judge is versioned and re-baselined like a model (Q-CC-12's point). (2) *golden-set skew* — 100 rows sampled once age badly as traffic shifts; the set is re-sampled quarterly, stratified by production intent mix, with version history so old verdicts stay interpretable." The gate's margin (2 points) is a business tolerance, not a statistical constant — say who owns it.

## Complexity and cost

100 rows × (2 variants × ~2 metrics + judge calls if online): minutes offline, ~$0.50–2 in judge calls online (b6's math: ~500 tokens/judge call at mid-tier). The harness runs per prompt-change PR — cheap enough to gate every one, which is the point.

## Self-check

- [ ] Retrieval scored exact (hit@k), generation judged — both present
- [ ] Per-slice table with deltas on a common scale
- [ ] Closed verdict logic with a margin someone owns
- [ ] Biggest per-row deltas shown both directions
- [ ] Judge drift + golden-set skew named with guards
