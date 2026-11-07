# Lab a6 — A Demand Forecasting Pipeline

| | |
|---|---|
| **Prerequisites** | Chapter A.1 (feature stores) · Chapter X.0 (the pipes behind the magic) |
| **Dataset** | NYC TLC Yellow Taxi — one month of real trip records ([card](../../datasets/time-series-geo.md)) |
| **You will build** | An hourly demand forecaster with point-in-time-correct features — and you'll watch a leakage bug corrupt your metrics before your eyes |
| **Est. time** | 3–4 hours |
| **Hardware** | Laptop CPU. No GPU. No API key. |

**The story.** Uber-eats-of-taxis wants to pre-position drivers before demand spikes: forecast pickups per taxi zone, per hour, 1–24 hours ahead. The model is the easy part. The *hard* part — and the entire reason this lab exists — is **features that exist at prediction time**: your model may only know what the system knew *at the moment the forecast was made*. That single constraint ("point-in-time correctness") is what feature stores (Chapter A.1) exist to enforce, and today you'll enforce it by hand, break it on purpose, and learn to smell it in any dataset.

---

## Part 0 — Get the data (15 min)

Download **one month** of yellow taxi trips (parquet, ~25–50 MB per month): `https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-01.parquet` (any month works; we used 2023-01) into `labs/data/`.

```python
import pandas as pd

df = pd.read_parquet("labs/data/yellow_tripdata_2023-01.parquet",
                     columns=["tpep_pickup_datetime", "PULocationID"])
print(df.shape)   # ~3.07M trips for 2023-01
hourly = (df.groupby([pd.Grouper(key="tpep_pickup_datetime", freq="h"), "PULocationID"])
            .size().rename("pickups").reset_index())
print(hourly.shape)   # ~260 zones x 744 hours
```

**Checkpoint 0:** Plot pickups summed across all zones by hour for the whole month. Identify: the daily rhythm (two peaks? one?), the weekday/weekend difference, and one anomaly (Jan 1 counts close to zero in some zones; also check for the occasional data glitch — hours with implausible trip counts). Real city data has real holidays. Note them; they become features or exclusions, never surprises.

---

## Part 1 — The naive baselines you must beat (30 min)

Forecasting without baselines is self-deception. Build two:

```python
hourly = hourly.sort_values(["PULocationID", "tpep_pickup_datetime"])
g = hourly.groupby("PULocationID")["pickups"]

hourly["lag_1h"]     = g.shift(1)
hourly["lag_168h"]   = g.shift(168)                    # same hour last week
hourly["roll_24h"]   = g.shift(1).rolling(24).mean()   # yesterday's mean (lagged!)

eval_mask = hourly.tpep_pickup_datetime >= "2023-01-25"   # last week of the month = test
import numpy as np
mae = lambda a, b: np.mean(np.abs(a - b))
print("lag-1h baseline MAE:",   mae(hourly[eval_mask].pickups, hourly[eval_mask].lag_1h))
print("lag-168h baseline MAE:", mae(hourly[eval_mask].pickups, hourly[eval_mask].lag_168h))
```

**Checkpoint 1:** Which baseline wins? (Usually lag-168h on hourly urban data — weekly seasonality is strong.) Write both MAEs down; your model must beat the better one or it ships *nothing*. "My model beats persistence by X%" is a sentence interviewers rarely hear and always respect.

---

## Part 2 — The model, honest features only (45 min)

Add calendar features and lag features, then train one LightGBM per zone (or one global model with zone as a categorical — the modern choice; do global, it's fewer lines and a better design):

```python
import lightgbm as lgb

hourly["hour"] = hourly.tpep_pickup_datetime.dt.hour
hourly["dow"]  = hourly.tpep_pickup_datetime.dt.dayofweek
for lag in [1, 2, 3, 24, 48, 168]:
    hourly[f"lag_{lag}"] = g.shift(lag)
hourly["roll_3h"]  = g.shift(1).rolling(3).mean()
hourly["roll_72h"] = g.shift(1).rolling(72).mean()
hourly["zone"]     = hourly.PULocationID.astype("category")

feats = [c for c in hourly.columns if c.startswith(("lag_", "roll_", "hour", "dow", "zone"))]
train, test = hourly[~eval_mask], hourly[eval_mask]

m = lgb.LGBMRegressor(n_estimators=300, learning_rate=0.05, num_leaves=63)
m.fit(train[feats].fillna(-1), train.pickups)
pred = m.predict(test[feats].fillna(-1))
print("model MAE:", mae(test.pickups, pred))
```

**Checkpoint 2:** Did you beat the lag-168h baseline? (Expect 10–25% better.) Now the *design* question this lab exists for: every feature above uses `shift(1)` or earlier — data from *before* the forecast hour. **Why?** Answer in terms of what the system knows at 23:00 when it forecasts hour 00:00. If any feature peeks at the target hour, it's leakage — which brings us to Part 3.

---

## Part 3 — Break it: the leakage demo (30 min)

Add the *tempting* feature — the current hour's rolling mean *including* the target hour:

```python
hourly["roll_24h_leaky"] = g.rolling(24).mean()          # includes the current hour!
feats_bad = feats + ["roll_24h_leaky"]
m.fit(train[feats_bad].fillna(-1), train.pickups)
print("MAE with leaky feature:", mae(test.pickups, m.predict(test[feats_bad].fillna(-1))))
```

**Checkpoint 3 (the money shot):** The MAE will drop *dramatically* — often 30–60%. Your model now looks brilliant and is worthless: at forecast time, the "current hour" hasn't happened yet. Compute the gap between honest and leaky MAE and write it in your journal as a percentage. **This number is your vaccine.** Every time a Kaggle result looks too good, or a colleague's offline metric doubles after "adding a feature," you'll ask: *does this feature exist at prediction time?* That question — point-in-time correctness — is the feature store's entire reason for existing (Chapter A.1), and you have now *seen* it, not just read it.

---

## Part 4 — The pipeline: batch scoring, scheduled (30 min)

The model is 20% of the system; the pipeline is the rest (Chapter X.0). Sketch the production flow on paper, then implement a miniature batch version:

```python
# batch_forecast.py — imagine this runs hourly, triggered by a scheduler
def forecast_next_hour(asof: pd.Timestamp) -> pd.DataFrame:
    # 1. read features that exist as of `asof` (from your feature tables)
    # 2. build the feature row for hour asof+1 for every zone
    # 3. predict and write to a forecasts table
    ...
```

Then answer in writing (this is the system-design deliverable of the lab):

1. **What writes the feature tables?** A streaming job aggregating trips in near-real-time. What's its SLA if forecasts run at :00 for :00+1?
2. **Late data.** Trips arrive minutes late (phone uploads, batch corrections). Your 23:00 features are wrong when computed at 23:00:05. What do you do — wait? recompute? forecast with stale features? (Real answer: wait a fixed grace period, log late-arrival %, and monitor the trade.)
3. **Backfills.** You fix a bug in the aggregation logic. What must be re-computed? In what order? (Feature stores call this *backfill*; getting it wrong poisons every downstream model silently.)
4. **Monitoring.** Which two numbers go on the dashboard: MAE on matured truth, and % of zones with missing features. Why those two? (Chapter X.3's stethoscope: one for the model, one for the pipes.)

**Checkpoint 4:** Draw the whole thing — trip events → stream aggregator → feature table → batch forecaster → forecasts table → driver app — and mark on it *where late data hurts* and *where a bug would be silent*. That diagram is a complete answer to "design a demand forecasting system."

---

## Explain it back

1. What is point-in-time correctness, and what does it prevent?
2. Why does the leaky feature help offline metrics and hurt in production?
3. Your model's MAE degraded 40% on the 3rd week of March. Give three hypotheses involving the *pipeline*, not the model.
4. Why must every rolling/lag feature in your table be shifted by at least one hour?

## Extensions

- **Two zones, two stories:** train separate models for JFK airport (zone 132) and a residential zone. Which is easier, and what does that say about global-vs-per-zone models?
- **Weather joins:** NOAA hourly weather for NYC (Central Park station, free) — join on timestamp, add temperature/precipitation. Does MAE move? (Careful: weather *forecasts* are what exist at prediction time, not weather *truth* — the same leakage lesson in a new costume.)
- **Quantile forecasts:** `lgb.LGBMRegressor(objective="quantile", alpha=0.1)` — predict a lower bound and watch a driver-placement scenario change. Point forecasts answer "what"; quantiles answer "how sure" — and dispatch systems need the second one.

## What you can now claim in an interview

"I built a demand forecaster on real taxi data with point-in-time-correct features, demonstrated a leakage bug that inflated metrics by [your number]%, and can design the streaming-feature-to-batch-forecast pipeline with its late-data and backfill failure modes — because I wrote the miniature version myself."
