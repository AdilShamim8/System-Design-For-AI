# 1 — ML System Design Patterns

## The three-stage recommender (A.2, Lab a2)
```
candidates (cheap, recall-oriented, ~100s from millions)
   → ranker (expensive, precision-oriented, pointwise scores)
   → re-rank (business rules: diversity, freshness, fairness)
```
Blend multiple candidate sources (popularity, CF, content, session). Evaluate: Precision@K, Recall@K, coverage — **time-split, never random-split.**

## The patterns, one line each

| Pattern | The idea | Where |
|---|---|---|
| Feature store | one feature definition, offline + online runtimes; kills skew | A.1, Lab a6 |
| Point-in-time correctness | features computable *as of* prediction time | Lab a6 (the law) |
| Champion/challenger | new model shadows, gets canary %, promotes on data | A.6 |
| Shadow deploy | log new model, serve old; zero user risk | A.6 |
| Batch vs realtime scoring | precompute vs on-demand: freshness × latency × cost | A.0, X.0 |
| Layered rules + model | rules for knowns (velocity), model for patterns | A.5, Lab a3 |
| Calibrated probabilities | Platt/isotonic post-hoc; free for rankers, vital for bidders | A.4, Lab a4 |
| Cost-matrix thresholds | pick threshold by dollars, not F1 | Lab a3 |
| Feedback loops | model changes data changes model; monitor your own footprint | a2, FN-02 |
| Cold start | content-based before collaborative; blend | Lab a2 |

## The failure taxonomy (A.7, Lab a7)
- **Data drift**: inputs move (PSI > 0.1 watch, > 0.25 investigate — heuristics, calibrate per feature).
- **Concept drift**: input→output relationship moves (world changed, or adversary adapted).
- **Upstream data bugs**: schema changes, renames — the loudest PSI, the cheapest fix (don't retrain!).
- **Label maturity**: fraud/defaults materialize late; compare like windows (Lab a3).

## Interview openers that signal structure
"What's the label? Who's the user? What's the latency budget? What happens when it's wrong — who pays, how much?" — then draw boxes, then talk models *last*.
