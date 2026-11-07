# Lab a4 — CTR Prediction and Calibration

| | |
|---|---|
| **Prerequisites** | Chapter A.4 (the penny that decides a billion dollars) · Lab a3 |
| **Dataset** | Criteo Display Advertising — ~45M ad impressions; you'll use a 500K-row subsample ([card](../../../datasets/ctr-ads.md)) |
| **You will build** | A CTR model whose *probabilities mean what they say*, plus the argument for why an ad bidder needs calibration, not just ranking |
| **Est. time** | 2–3 hours |
| **Hardware** | Laptop CPU (500K rows trains in ~1–2 min with LightGBM). No GPU. |

**The story.** Your CTR model has great AUC — it ranks ads correctly. The bidding system multiplies predicted CTR by value and bids. Weeks later, revenue is down and nobody knows why. The bug isn't in the ranking; it's in the *scale*. A model that predicts 2% everywhere will rank perfectly on a 1%-CTR world and **bid 2× too high on cheap inventory and 2× too low on premium**. In advertising, an uncalibrated model with perfect AUC loses money — silently. Today you build the model, catch the miscalibration with two plots, and fix it with one line.

---

## Part 0 — Get the data (15 min)

Full Criteo is 6.5 GB — overkill for the lesson. Kaggle's `criteo-display-advertising-challenge` `train.csv` has 45M rows; download it once (free account), then build a working subsample you can iterate on in seconds:

```python
import pandas as pd
# after downloading train.csv to labs/data/ (45M rows, ~6.5 GB — takes a while)
# stream and keep every 90th row to get ~500K, preserving class balance
rows = pd.read_csv("labs/data/criteo_train.csv", chunksize=1_000_000)
keep = []
for i, chunk in enumerate(rows):
    keep.append(chunk.iloc[::90])
df = pd.concat(keep)
df.to_parquet("labs/data/criteo_500k.parquet")   # your working file from now on
```

(No Kaggle bandwidth? The Avazu alternative subsamples the same way — see DATA.md. The lab is dataset-agnostic.)

Columns: `Label` (click), `I1–I13` (integer, already count-transformed), `C1–C26` (categorical, already hashed). The positive rate is a few percent — **compute it and write it down**; every metric in this lab is interpreted against that base rate.

---

## Part 1 — The model, feature-honestly (30 min)

Categoricals have millions of distinct values (hashed). Don't one-hot them — that explodes memory. Use LightGBM's native categorical handling with frequency-encoding for the rarest values:

```python
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, log_loss

df = pd.read_parquet("labs/data/criteo_500k.parquet")
y = df.pop("Label")
for c in df.filter(like="C").columns:
    df[c] = df[c].astype("category")

X_tr, X_te, y_tr, y_te = train_test_split(df, y, test_size=0.25, stratify=y, random_state=42)

model = lgb.LGBMClassifier(n_estimators=400, learning_rate=0.05, num_leaves=63)
model.fit(X_tr, y_tr, categorical_feature="auto")
p = model.predict_proba(X_te)[:, 1]

print("positive rate:", round(y_te.mean(), 4))
print("AUC:", round(roc_auc_score(y_te, p), 4))
print("log loss:", round(log_loss(y_te, p), 4))
print("baseline log loss (predict base rate):", round(log_loss(y_te, [y_tr.mean()]*len(y_te)), 4))
```

**Checkpoint 1:** Record AUC (expect 0.78–0.82 on a subsample) and the log-loss gap vs. the constant baseline. Now the two-kingdoms question: if you could improve AUC by 0.01 *or* log loss by 0.01 — which helps (a) a ranking feed that shows the top ad, (b) a bidder that multiplies pCTR × value? Write your answer; Part 2 tests it.

---

## Part 2 — Catch the liar: reliability diagrams (30 min)

A calibrated model's "2%" should click ~2% of the time. Test it:

```python
import numpy as np
import matplotlib.pyplot as plt

def reliability(y, p, bins=20):
    edges = np.linspace(0, 1, bins + 1)
    idx = np.clip(np.digitize(p, edges) - 1, 0, bins - 1)
    pred, obs = [], []
    for b in range(bins):
        m = idx == b
        if m.sum() > 50:
            pred.append(p[m].mean()); obs.append(y[m].mean())
    return np.array(pred), np.array(obs)

pred, obs = reliability(y_te.to_numpy(), p)
plt.plot([0, 0.2], [0, 0.2], "k--", label="perfect")
plt.plot(pred, obs, "o-", label="model")
plt.xlabel("predicted CTR"); plt.ylabel("observed CTR"); plt.legend()
plt.savefig("reliability.png", dpi=120)
```

**Expected sight:** the curve bends *below* the diagonal at higher probabilities — the model overestimates CTR on the impressions it likes most (typical for boosted trees on rare positives). Compute the summary statistic:

```python
def ece(y, p, bins=20):
    edges = np.linspace(0, 1, bins + 1)
    idx = np.clip(np.digitize(p, edges) - 1, 0, bins - 1)
    tot = 0
    for b in range(bins):
        m = idx == b
        if m.sum():
            tot += m.mean() * abs(p[m].mean() - y[m].mean())
    return tot
print("ECE:", round(ece(y_te.to_numpy(), p), 4))
```

**Checkpoint 2:** ECE of 0 means perfectly calibrated; on this data expect 0.002–0.02 depending on your subsample. Find the bin with the worst |predicted − observed|. Multiply that gap by the bid: if you bid `pCTR × $2.00` and pCTR is 1.5× too high in that bin, you overpay by what percentage? (Write the number. This is Chapter A.4's "penny" made personal.)

---

## Part 3 — Fix it: Platt scaling / isotonic regression (20 min)

```python
from sklearn.linear_model import LogisticRegression
from sklearn.isotonic import IsotonicRegression

Xc_tr, Xc_cal, yc_tr, yc_cal = train_test_split(X_tr, y_tr, test_size=0.2, random_state=1)
# (refit model on Xc_tr if you're being rigorous — calibration set must be unseen)
platt = LogisticRegression().fit(p[:len(yc_cal)//1].reshape(-1, 1) if False else
                                 model.predict_proba(Xc_cal)[:, 1].reshape(-1, 1), yc_cal)
p_cal = platt.predict_proba(p.reshape(-1, 1))[:, 1]
print("ECE after Platt:", round(ece(y_te.to_numpy(), p_cal), 4))
```

(The middle line is deliberately clumsy — it says: *calibrate on a held-out split's predictions, not on the test set.* Clean it up; that cleanup is the exercise.)

**Checkpoint 3:** Compare ECE before/after, and re-plot the reliability curve. Now the payoff from Checkpoint 1: **AUC before vs. after calibration.** Platt scaling is monotonic — it cannot change the ranking. Write the sentence: "Calibration changes ______, not ______, which is why it's free for ranking systems and mandatory for bidders."

---

## Part 4 — The 10ms question (20 min)

Chapter A.4's budget: real-time bidding gets ~10–100ms from slot to bid. Your LightGBM model at 500K-row batch speed is not the same as single-row latency. Measure:

```python
import time
row = X_te.iloc[[0]]
model.predict_proba(row)                      # warm-up
t0 = time.perf_counter()
for _ in range(200):
    model.predict_proba(row)
print("single-row predict:", (time.perf_counter() - t0) / 200 * 1000, "ms")
```

Expect 0.5–3 ms for a single row on a laptop — fine for 100ms, uncomfortable for 10ms with feature fetching on top. On paper (this is the design part): where do the other milliseconds go in a real bidder — feature store lookup (1–5 ms), candidate ads (1–2 ms), model (0.5–3 ms), auction math (<0.1 ms), network (~1–10 ms)? Which would you attack first, and would you choose a smaller model, precomputed features, or co-location?

**Checkpoint 4:** Write your latency budget table for a 10ms bidder. Total it. Defend the biggest line item.

---

## Explain it back

1. Why does a ranker tolerate miscalibration but a bidder doesn't? (Use the words "monotonic transform" in your answer.)
2. What is ECE, in plain English, to a product manager?
3. Why must the calibration set be held out from training?
4. Your model's ECE doubles after a week in production. Give two hypotheses (one data-side, one model-side).

## Extensions

- **Isotonic vs. Platt:** fit both; isotonic fits bins with a staircase (no shape assumption, needs more data), Platt fits one sigmoid (robust, assumes shape). Compare ECE at your subsample size and at 100K rows — watch isotonic degrade first. Now you know why small systems ship Platt.
- **Frequency encoding vs. target encoding:** replace LightGBM categoricals with out-of-fold target encoding; compare AUC and training time. You've just rehearsed the #1 tabular-feature debate.
- **Time-split reality:** Criteo is one week ordered by time — split by day (first 5 days train, last 2 test) and compare AUC with the random split. The drop you see is the A.7 preview.

## What you can now claim in an interview

"I can diagnose miscalibration with reliability diagrams and ECE, fix it with Platt or isotonic on a held-out set, and explain why calibration is invisible to AUC but decisive for bid economics — because I've measured both."
