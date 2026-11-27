# Coding 1 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

The screen's hidden test is the split: any answer using `train_test_split(shuffle=True)` is already wrong — churn prediction is a *temporal* problem, and a random split lets the model see the future of customers it's predicting (Chapter A.1's point, in code).

```python
import pandas as pd
from lightgbm import LGBMClassifier
from sklearn.metrics import roc_auc_score

df = pd.read_csv("churn.csv", parse_dates=["snapshot_date"])

# 1. Time split — the sentence to say: "I train on the past and validate on the
# future, because that's the direction the production system will run in."
train = df[df.snapshot_date < "2026-09-01"]
valid = df[(df.snapshot_date >= "2026-09-01") & (df.snapshot_date < "2026-10-01")]
test  = df[df.snapshot_date >= "2026-10-01"]

# 2. Leakage audit — drop anything computed AFTER the prediction date:
#    tickets_after_churn (by name), days_since_last_order as-of-today (recompute
#    as-of snapshot_date, or drop). The one-liner: "if the production system
#    couldn't know this column at prediction time, it doesn't train on it."
LEAK = ["tickets_after_churn", "refund_amount_post_churn"]
feats = [c for c in df.columns if c not in LEAK + ["churned_within_30d", "snapshot_date", "customer_id"]]

m = LGBMClassifier(n_estimators=400, learning_rate=0.05, class_weight="balanced")
m.fit(train[feats], train.churned_within_30d)

# 3. Metrics: AUC on the time-split test, plus calibration — AUC says the model
#    ranks; calibration says the *probabilities* mean what they claim.
p = m.predict_proba(test[feats])[:, 1]
print("AUC:", roc_auc_score(test.churned_within_30d, p))
# reliability curve: bin p into deciles, compare mean-predicted vs actual rate

# 4. Threshold from a cost matrix, not 0.5:
#    retention offer costs $30; a churned customer costs $200 in LTV.
#    act if p * 200 > (1 - p) * 30  ->  p > 30/230 ≈ 0.13
#    The sentence: "the business sets this number; I make choosing it possible"
#    (Q-ML-8's answer, standing next to code).
```

The honest AUC (0.78-ish after dropping leaks) is the *correct* answer. Quoting the leaky 0.91 without comment is the failing move — the interviewer built the leak in on purpose.

## Complexity and cost

n_samples × n_features × n_trees: LightGBM on 7K rows trains in ~2 seconds. The screen is not compute-bound — every minute should go to the split, the leaks, and the threshold story.

## Self-check

- [ ] Split is temporal, with one sentence defending it
- [ ] At least 2 leakage columns named with reasons
- [ ] AUC reported on a *future* period, not a random holdout
- [ ] Calibration mentioned (curve or ECE) alongside AUC
- [ ] Threshold derived from costs, not 0.5
