# Lab a7 — The Drift Detective

| | |
|---|---|
| **Prerequisites** | Chapter A.7 (why did the model get worse) · Chapter X.3 (the stethoscope) |
| **Dataset** | UCI Adult (from Lab a1) + a *deliberately shifted* version of it |
| **You will build** | A drift detector (PSI + KS), an alerting rule that won't page you at 3AM for nothing, and the retraining decision framework |
| **Est. time** | 2 hours |
| **Hardware** | Laptop CPU. No GPU. No API key. |

**The story.** Six months after you ship the income model from Lab a1, AUC has drifted from 0.90 to 0.84. Nothing crashed. No errors. The service is green on every dashboard. The model is just… quietly wrong. Welcome to the defining failure mode of production ML: **models rot while their infrastructure reports perfect health.** Today you build the stethoscope: statistical drift detection on inputs and outputs, thresholds with a rationale, and the discipline of deciding *when retraining actually pays*.

---

## Part 0 — Manufacture a drift incident (20 min)

Real drift is slow; lab drift is instant. Train the same model as Lab a1, then build a *shifted future* where the world changed:

```python
# fit model exactly as in lab a1 (Adult, pipeline, AUC on holdout)
# ...then simulate six months later:

import numpy as np
X_te, y_te = ...   # your holdout from training

shifted = X_te.copy()
# 1. education level of the population rose (more Bachelor's/Masters)
shifted["education"] = shifted["education"].mask(
    np.random.rand(len(shifted)) < 0.25, "Bachelors")
# 2. a recession: hours dropped for many
shifted["hours-per-week"] = shifted["hours-per-week"] * np.where(
    np.random.rand(len(shifted)) < 0.3, 0.8, 1.0)
# 3. data pipeline bug: a category renamed itself
shifted["workclass"] = shifted["workclass"].replace({"Private": "Private-sector"})

from sklearn.metrics import roc_auc_score
p0 = model.predict_proba(X_te)[:, 1]
p1 = model.predict_proba(shifted)[:, 1]
print("AUC before:", round(roc_auc_score(y_te, p0), 3))
print("AUC after shift:", round(roc_auc_score(y_te, p1), 3))
```

**Checkpoint 0:** How much did AUC drop? (With these shifts, expect 0.01–0.05 — small, real, and *silent*: no error is raised anywhere.) Note which of the three shifts is a *data bug* (workclass rename) vs. *the world changing* (education, hours). Drift detection cannot tell them apart — but the *response* differs completely. Hold that thought for Part 3.

---

## Part 1 — Input drift: PSI and KS, feature by feature (40 min)

Two standard tools, one per data type:

```python
from scipy.stats import ks_2samp

def psi(expected, actual, bins=10):
    # bin on the expected (reference) distribution
    edges = np.unique(np.quantile(expected, np.linspace(0, 1, bins + 1)))
    if len(edges) < 3:
        return 0.0                       # degenerate for constant features
    e = np.histogram(expected, edges)[0] / len(expected)
    a = np.histogram(actual,   edges)[0] / len(actual)
    e, a = np.clip(e, 1e-6, None), np.clip(a, 1e-6, None)
    return float(np.sum((a - e) * np.log(a / e)))

report = {}
for col in X_te.columns:
    if X_te[col].dtype == "category" or X_te[col].nunique() < 20:
        # categorical: PSI over category frequencies (chi-square also works)
        e = X_te[col].value_counts(normalize=True)
        a = shifted[col].value_counts(normalize=True).reindex(e.index, fill_value=0)
        report[col] = psi(e.values, a.values)
    else:
        report[col] = psi(X_te[col].astype(float), shifted[col].astype(float))
        report[col + " (KS)"] = ks_2samp(X_te[col].astype(float),
                                         shifted[col].astype(float)).statistic

for k, v in sorted(report.items(), key=lambda kv: -kv[1]):
    print(f"{k:25s} {v:.3f}")
```

**Checkpoint 1:** Your detector should rank `workclass` and `education` at the top. The industry rules of thumb — **PSI < 0.1 stable, 0.1–0.25 watch, > 0.25 investigate** — were invented for credit scoring and are *heuristics, not laws*. Write down: (a) which features PSI flags that KS doesn't, and vice versa; (b) why `hours-per-week`'s PSI (a distribution *shape* change) behaves differently from `workclass`'s (a *category rename*, which PSI sees as massive change). The one-liner to keep: **PSI measures population movement, KS measures distribution distance — on categoricals, PSI is your only tool.**

---

## Part 2 — Output drift: the canary in the coal mine (20 min)

Input drift can be noise; **output drift is always a business event.** When your score distribution moves, either the world moved or your pipeline broke — both page someone.

```python
def score_dist_report(p_reference, p_actual, bins=10):
    print("mean:", round(p_reference.mean(), 3), "->", round(p_actual.mean(), 3))
    print("p90:", round(np.quantile(p_reference, .9), 3), "->",
          round(np.quantile(p_actual, .9), 3))
    print("PSI:", round(psi(p_reference, p_actual, bins), 3))
    print("% predicted >50K:", round((p_reference > .5).mean(), 3), "->",
          round((p_actual > .5).mean(), 3))

score_dist_report(p0, p1)
```

**Checkpoint 2:** The mean predicted probability moved how much? Now the reasoning chain interviewers want: *inputs drifted → scores drifted → but labels are delayed, so we cannot yet know if AUC dropped.* Output drift is your **early-warning** signal; label-arrival is your **confirmation** signal. A dashboard with input PSI + score distribution + (delayed) AUC covers all three time horizons. Sketch it — Lab x1 turns your sketch into code.

---

## Part 3 — The decision: alert, investigate, or retrain? (30 min)

Detection without a response plan is a hobby. Fill in this decision table for *your* drift incident:

| Finding | Likely cause | First response | Retrain? |
|---|---|---|---|
| One categorical feature, PSI huge, new category appeared | Pipeline/schema bug | Fix the pipeline, backfill correct values | No — same world, bad data |
| Many features drifting gradually over weeks | The world changed | Check business context (economy, product launch) | Yes, on fresh labels |
| Inputs stable, output distribution shifted | Serving bug or upstream model change | Diff the serving path: versions, artifacts, features | No — debug, don't retrain |
| Input PSI 0.12 on one numeric feature, stable for a week | Minor population movement | Watch; annotate the dashboard | Only with AUC confirmation |

**Checkpoint 3 (the lab's payoff):** Apply the table to your three injected shifts. The `workclass` rename is a *bug* — the "fix" is data engineering, and retraining on the bug teaches the model garbage. The education/hours shifts are *the world* — retraining is correct *once matured labels arrive*. Write the two paragraphs: "if I only had 30 minutes to respond to a drift alert, I would…" — that paragraph, said out loud in an interview, is a senior-signal.

---

## Part 4 — The retraining economics (10 min)

Retraining is not free: engineering time, evaluation risk, rollout risk (Chapter A.6). One computation to anchor it: if AUC dropped 0.03 and each point of AUC is worth (say) $2K/month in better decisions, the monthly cost of drift is $6K. A retrain-and-rollout costs one engineer-week ($5K). **Decision: retrain quarterly, not daily** — unless economics say otherwise. Compute your version with your numbers; "I size retraining frequency from dollars, not vibes" is the line that closes this topic in any interview.

---

## Explain it back

1. PSI vs KS — what does each measure, and which works on categoricals?
2. Input drift with stable outputs: give two benign explanations and one catastrophic one.
3. Why is output drift an *early* signal while AUC drift is a *late* one? What makes AUC late?
4. You retrain on the workclass-rename data. What did you just teach the model? What happens to it in the next deploy?

## Extensions

- **Seasonality false-alarms:** compute PSI between *adjacent weeks* of the taxi data from Lab a6 (no model involved). Monday-vs-Sunday PSI on pickups is large and *healthy* — now you know why drift detection needs seasonality-aware baselines (compare to same weekday last week).
- **Drift on embeddings:** compute PSI on the *scores* only, for your Lab b2 RAG system — for LLM systems, "input drift" often means query distribution drift; output drift means answer-length/latency distribution drift. The same three-horizon dashboard applies.
- **Champion/challenger:** keep your a1 logistic regression as champion, train HGB as challenger on the shifted data, and route 10% of traffic to the challenger (on paper — the routing design, not the code). Chapter A.6's deployment pattern, now concrete.

## What you can now claim in an interview

"I run PSI and KS per feature with explicit thresholds, monitor output distributions as the early-warning signal, separate data bugs from world-change before touching retraining, and size retraining cadence from a dollar model — because I've run the full loop on a manufactured incident and know where each signal lies."
