# Lab a1 — Worked Solution and What the Numbers Mean

*Read only after your version runs. If your numbers differ from these, that's data, not error — the machine you're on is part of the experiment.*

## Expected results (our runs, late-2026 laptop, CPU)

| Measurement | What we got | What to compare against |
|---|---|---|
| AUC (logistic regression + one-hot) | ≈ 0.90 | HGB extension: ≈ 0.92 |
| Recall on >50K at threshold 0.5 | ≈ 0.55–0.60 | accuracy ≈ 0.85 — the gap is imbalance |
| Sequential p50 | 2–6 ms | first (cold) request: 10–30× slower |
| Sequential p99 | 5–15 ms | watch the outliers |
| Concurrent (20 threads) p50/p99 | ≈ 1.5–4× sequential | your cores decide |

## The five lessons hidden in those numbers

1. **The cold request lies.** The first call loads code paths, allocates buffers, and is 10–30× slower. Production systems *warm up before taking traffic* (that's what a readiness probe is for). Your benchmark skipped request #1 — on purpose; now you know why every serious benchmark does.
2. **p99 is a different system than p50.** Under 20-thread concurrency, average latency creeps but the tail explodes: GIL contention, allocation, context switching. When an interviewer asks "why did your p99 SLO breach while p50 looked fine?", this lab is your answer.
3. **The model is not the bottleneck — until it is.** `predict_proba` on logistic regression is microseconds; the milliseconds live in HTTP, JSON parsing, pandas DataFrame construction, and Pydantic validation. That's why real serving stacks obsess over the *path around* the model (Chapter A.6, X.0).
4. **422 > 500 is a system-design decision.** Validation at the edge (Pydantic) converts "mysterious internal failure" into "actionable client error." Same event, radically different on-call experience. This is Chapter X.5's graceful-failure principle, implemented in eight lines.
5. **`handle_unknown="ignore"` is a loaded gun.** For census data it's benign; for fraud (Lab a3) "unknown category → silently scored as baseline" is how a novel fraud pattern sails past your model. Choosing the fallback behavior is a *design* decision, not a library default.

## Common mistakes we made so you don't

- **Renaming columns wrong at serve time** (hyphens vs underscores) → the classic `ValueError: feature names mismatch`. If you hit it: the fix in `serve.py` shows the pattern — the API owns its naming, the adapter translates.
- **Benchmarking while the terminal was busy** (uvicorn logs printing per request). Silence the logs (`--log-level warning`) or your latency numbers include *printing*.
- **Forgetting `stratify=y`** in the split — with 24% positives, an unlucky split wobbles AUC by ±0.01 and makes your checkpoints unreproducible.

## Interview lines this lab earns you

- "In my first serving lab I measured the gap between model time and request time — the model was ~5% of end-to-end latency, which matches the industry rule of thumb that the model is a small part of the system."
- "I break my APIs on purpose before users do: type garbage, unknown categories, kill the process mid-request. My validation strategy comes from that habit."
