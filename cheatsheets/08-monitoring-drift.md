# 8 — Monitoring & Drift (X.3, Labs a7, x1)

## The three horizons (x1) — in firing order
| Horizon | Watches | Catches | Latency |
|---|---|---|---|
| Input | feature/query distributions (PSI, KS, centroid) | world changing, pipeline bugs | earliest |
| Output | score/answer distributions, refusal rate | consequences | early |
| Business/labels | matured metrics, A/B outcomes | confirmation | late |

## PSI thresholds (heuristics — calibrate on your data)
< 0.1 stable · 0.1–0.25 watch · > 0.25 investigate. Sustained violation (3h) before paging (a7). Numeric → PSI + KS; categorical → PSI. Alert rules need: owner, runbook link, sustain window — **simulate a boring month; delete rules that fire on normal traffic** (x1).

## The ML-specific monitors (beyond uptime)
- Training/serving skew (feature parity checks) — A.1
- Label maturity (fraud 30-day windows — Lab a3)
- Retrieval health: hit@k proxy, top-sim distribution, corpus-version mix (b2/x1)
- LLM: TTFT, tokens/req, refusal rate, faithfulness on sampled answers (b4, x1)
- Agents: steps/episode, tool-failure rate, repair rate, budget breaches (c5)
- Cache: hit rate, wrong-hit rate (sampled), invalidation events (b5)

## The log schema that makes it all possible (x1's law)
Per request: `{ts, query, features/chunks, scores/answer, timings, model_version, prompt_version, corpus_hash}` — the last three turn "mystery" into `GROUP BY`.

## Runbook answers to have ready
- Input drift, stable output → benign population shift or pending lag? Check volume + segment.
- Everything stable, business down → presentation/position bias (a8's proxy gap)
- Latency fine, cost up → context bloat or reranker churn (x2)
- One tenant degraded → their corpus/index, not the platform (cap2)
