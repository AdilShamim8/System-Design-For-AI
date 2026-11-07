# Lab x2 — Data notes: your measured numbers, assembled

No external dataset. This lab aggregates your own measurements into a model:

| Input | From | Typical value (ours) |
|---|---|---|
| Token economics | b1 | 4.5K in / 400 out per request (RAG) |
| Prices (date-stamped) | b1 DATA.md | small $0.15/$0.60; mid ~$3/$15 per 1M |
| Cache hit rates | b5 | 30–50% (Zipf-ish support traffic) |
| Success rate | b4 | ≈ 0.65 end-to-end |
| Eval/judge overhead | b4/c5 | judge on 5–10% sample: +2–4% cost |
| Index rebuild | b3 | minutes, $1–5 at lab scale; scale with corpus |

**Tenant personas (make them concrete — names help you reason):**

- **"Corner cafe"** — 500 req/day, hit rate 55%, 6 chunks/req, short questions
- **"Regional chain"** — 5,000 req/day, hit rate 65%, 7 chunks/req
- **"The whale"** — 50,000 req/day, hit rate 40%, 8 chunks/req, messy corpus, long questions

The whale's *bad* parameters (low hit rate, more chunks, longer inputs) are not an accident — big tenants have big messy corpora and repetitive-but-diverse users. That correlation (size ↔ inefficiency) is the hidden driver of AI-service economics, and the reason per-tenant dashboards exist.

**Calibration outputs (our model):**

- Fully-loaded cost/request: ≈ $0.0008 (cafe) / $0.0009 (chain) / $0.0015 (whale)
- At $0.01/req pricing: gross margins 85–92% — healthy until you price *below* the whale's curve.
- Cost per successful answer: ≈ 1.5× cost per request at 0.65 success.
- Scenario 3 (small tier + reranker): ≈ 60–80% total cost cut at ±1pp quality — the routing pitch, quantified.

**License:** your numbers, your model. The *structure* is the deliverable; every number is a placeholder the reader re-measures.
