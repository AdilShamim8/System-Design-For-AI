# 6 — LLM Cost Math (X.4, Labs b1, b5, x2)

## The one formula
```
cost_per_request = (input_tokens/1M × price_in) + (output_tokens/1M × price_out)
monthly = cost_per_request × req/day × 30
```
Illustrative prices (late-2026, **date-stamp your own**): small ~$0.15/$0.60; mid ~$3/$15; frontier ~$10–75 per 1M in/out. Embeddings ~100× cheaper ($0.02–0.20/1M).

## Token rules of thumb
- English ≈ 4 chars ≈ 0.75 words per token; 1K tokens ≈ 750 words
- Chinese ≈ 1–2 chars/token; code has its own dialect; **count with the model's tokenizer, not guesses**

## The RAG cost shape (b1's law)
Typical RAG request: ~4.5K in / 400 out → **cost is 60–90% input price.**
Optimization order: trim context (chunk size, k, history) → cache (b5) → route down-tier (b6) → self-host (crossover ~10M–100M tok/day, mid-tier).

## The cost tree (x2) — every leaf, per request
embedding/lookup · retrieval (amortized) · generation input · generation output · guardrails/eval sampling · fixed amortized (index builds, monitoring, on-call)

## The two headline metrics
- **Cost per 1K requests** — the engineering view
- **Cost per successful answer** (divide by end-to-end success rate) — the product view; at 65% success, a 5pp quality fix = a ~7% cost cut (x2's punchline)

## Multi-tenant rules (x2, cap2)
Per-tenant ledgers from day one; fixed costs amortize cruelly over small tenants; the whale's inefficiency (low hit rate, fat contexts) is usually the top lever; cache savings = hit_rate × ~0.95 (the lookup isn't free).

## Benchmarks to quote
- RAG at mid tier, 10K req/day ≈ $4–5K/month; routed small-tier ≈ $800–1,500 (our lab numbers — recompute with your prices)
- Agent episodes: 3–6 calls each; runaway episodes = 100s of normal ones — budget guards are cost controls (c1)
