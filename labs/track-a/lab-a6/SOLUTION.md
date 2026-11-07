# Lab a6 — Worked Solution and What the Numbers Mean

## Expected results (our runs, 2023-01, global LightGBM, last-week test)

| Measurement | What we got |
|---|---|
| Trips after month filter | ≈ 3.06M (from 3.07M — ~10K glitch rows removed) |
| lag-1h baseline MAE | ≈ 3.9 pickups/zone-hour |
| lag-168h baseline MAE | ≈ 2.7 (weekly seasonality dominates) |
| Honest model MAE | ≈ 2.1–2.4 (10–25% better than lag-168h) |
| **Leaky model MAE** | **≈ 0.9–1.3 (an absurd 50–60% "improvement")** |

The leaky-feature row is the point of the whole lab. A metric improvement that large from one feature is not skill — it's time travel. Burn the number into memory.

## The five lessons hidden in those numbers

1. **Point-in-time correctness is the feature store's whole job.** Your leaky `rolling(24)` computed *at* the target hour includes the target hour. The honest version is `shift(1).rolling(24)` — one method call between a system and a scandal. When Chapter A.1 says feature stores prevent training/serving skew and leakage, this lab is the demonstration it gestures at.
2. **Baselines discipline everything.** lag-168h is hard to beat on urban hourly data. If your fancy model doesn't beat persistence, the honest response is to ship persistence — and *that* answer, in an interview, signals seniority more than any model choice.
3. **Late data is a design constraint, not an edge case.** Trips arrive after the hour closes; the pipeline's grace period is a bias/variance knob: wait longer → fresher, more complete features, but later forecasts. There is no "correct" setting — there is a *monitored trade*, which is why the runbook logs late-arrival percentage.
4. **Backfill order matters.** Fix the aggregator → recompute features chronologically → then (and only then) retrain. Recomputing out of order re-introduces the very leakage you removed, because rolling windows read neighbors. Feature stores formalize this; you now know why from experience.
5. **The dashboard watches pipes, not just the model.** MAE tells you the model's health; %-zones-missing-features tells you the *pipeline's* health. A model served on silently degraded features degrades politely and invisibly — the nastiest production failure in ML (Chapter X.3, and Lab x1 builds exactly this dashboard).

## Common mistakes

- **Filtering dates after aggregation.** The 2008/2032 glitch rows infect your Grouper bins first; filter rows to the month *before* `groupby`, always.
- **`rolling` without `shift`.** Even careful people slip once. The check: for every feature column, ask "could this value contain information from the target hour?" — if yes, shift.
- **Random train/test split on time series.** The lab's mask is the last week; if you `train_test_split(shuffle=True)` you train on the future and report a fantasy. (Same lesson as a2/a4 — recurring because it is the single most common offline-metric lie.)
- **fillna(0) on lag features.** Early hours have no lags; 0 is a lie (there weren't zero pickups, we just don't know). `fillna(-1)` marks "unknown" for trees; better still, drop the first 168 hours (one week) so every row has full lags.

## Interview lines this lab earns you

- "I once 'improved' my demand forecaster's MAE by 50% with one feature — which is how I learned it was leaking the target hour. Now every feature I write gets the same one-second audit: does this value exist at prediction time?"
- "Before I present any forecasting result, I report the persistence baseline next to it. On NYC taxi data, same-hour-last-week is a genuinely strong baseline — if you can't beat it, you ship it."
