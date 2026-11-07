# Lab b1 — "Dataset": real API prices + your measurements

This lab's data is (a) **published prices** — from your provider's pricing page, date-stamped in your table — and (b) **your own latency distributions**. Both are perishable: prices change several times a year, and latency depends on region, load, and model version. That perishability is itself the lesson (Chapter X.4's date-stamp rule exists because of exactly this).

**Prices we used while writing the solutions** (ours, late-2026, US region — *check your own before quoting*):

| Tier (OpenAI, illustrative) | Input $/1M | Output $/1M |
|---|---|---|
| gpt-4o-mini class | $0.15 | $0.60 |
| gpt-4o class | $2.50–3.00 | $10.00–15.00 |
| frontier class | $10–15 | $60–75 |

Embedding models are ~100× cheaper on input (e.g., text-embedding-3-small at $0.02/1M) — the reason RAG indexing is cheap and LLM answering is not. Local models (Ollama) have zero marginal token cost but real GPU/hardware cost — the b6 lab computes when self-hosting crosses over.

**Calibration numbers to sanity-check your measurements:**

- English prose ≈ 4 chars/token; ~750 words ≈ 1,000 tokens.
- Hosted small models: TTFT 0.3–1 s; TPS 50–150. Hosted frontier: TTFT 0.5–2 s; TPS 30–80. Local 7–8B on a modern laptop: TTFT 0.2–1 s, TPS 5–20.
- If your TTFT p99 is less than 2× your p50, you either got lucky or measured too few samples — run 30+.

**License note:** provider prices are facts, not data — quoting them is fine; republishing a provider's full price sheet wholesale is their copyright. Your *measurements* are yours; keep them in your journal.
