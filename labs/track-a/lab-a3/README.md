# Lab a3 — Fraud Detection Under Extreme Imbalance

| | |
|---|---|
| **Prerequisites** | Chapter A.5 (the 3AM fraud alarm) · Lab a1 |
| **Dataset** | ULB Credit Card Fraud — 284,807 real transactions, 492 frauds ([card](../../../datasets/fraud-anomaly.md)) |
| **You will build** | A fraud scorer with a threshold chosen by *money*, not by F1; plus the monitoring story that keeps it honest |
| **Est. time** | 2–3 hours |
| **Hardware** | Laptop CPU. No GPU. No API key. |

**The story.** Your classifier reports **99.83% accuracy** on credit card fraud. Your manager is thrilled. You are not — because 99.83% is the accuracy of a coin that always says "not fraud," and this coin approves every fraudulent transaction in the building. Today you learn the two moves that separate a fraud *system* from a fraud *model*: **measure with PR curves, decide with money.**

---

## Part 0 — Get the data (10 min)

From Kaggle: `https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud` (Download → `creditcard.csv` → put in `labs/data/`). Kaggle requires a free account; that's also where you'll get Criteo in Lab a4, so the account is a good investment.

```python
import pandas as pd
df = pd.read_csv("labs/data/creditcard.csv")
print(df.shape)
print(df.Class.value_counts(normalize=True))
```

**Checkpoint 0:** Write down the exact positive rate (0.173%). Now compute what accuracy a model gets by always predicting "legit." Stare at that number until it stops looking like a joke. This single computation is why fraud interviews start with "why not accuracy?"

---

## Part 1 — The baseline and the right curve (30 min)

Train/test split — **stratified**, and later (extension) by time, since the file is two days ordered by `Time`:

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import average_precision_score, roc_auc_score, precision_recall_curve

X = df.drop(columns=["Class"])
y = df.Class
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

clf = HistGradientBoostingClassifier(max_iter=200).fit(X_tr, y_tr)
p = clf.predict_proba(X_te)[:, 1]
print("AUC-ROC:", round(roc_auc_score(y_te, p), 3))
print("AVG precision (PR-AUC):", round(average_precision_score(y_te, p), 3))
```

Now plot both curves (matplotlib): ROC and precision-recall. On this dataset ROC looks glorious (AUC ≈ 0.97) while the PR curve shows precision collapsing as recall grows. **The PR curve is the honest one** — ROC's false-positive-rate denominator (a sea of negatives) flatters you; PR's denominator (your own positive calls) does not. Fraud has 578 negatives per positive; ROC lives in a world where that ratio is 1:1.

**Checkpoint 1:** At what recall does precision drop below 50%? Below 10%? Mark the three points on your PR curve: "catch everything" (recall 1.0), "only sure things" (precision ≥ 0.9), and the knee. You will choose between them with money in Part 2 — and the right answer is *not always the knee*.

---

## Part 2 — Decide with money: the cost matrix (40 min)

A threshold is a business decision wearing a math costume. Given:

- A false negative (missed fraud) costs the **transaction amount** (assume average fraud = `$122` — the dataset's fraud `Amount` mean, compute it yourself and use *your* number).
- A false positive (frozen card) costs **`$5`** of support/agent time and customer goodwill.

```python
import numpy as np

amt = df.loc[X_te.index, "Amount"].to_numpy()
is_fraud = y_te.to_numpy()

def cost_at(threshold):
    flag = p >= threshold
    fn = (is_fraud == 1) & ~flag          # missed frauds
    fp = (is_fraud == 0) & flag           # wrongly frozen
    return amt[fn].sum() + 5 * fp.sum()

thresholds = np.linspace(0.001, 0.999, 200)
costs = [cost_at(t) for t in thresholds]
best = thresholds[int(np.argmin(costs))]
print(f"cheapest threshold: {best:.3f}, cost: ${min(costs):,.0f}")
print(f"cost of always-approve: ${amt[is_fraud==1].sum():,.0f}")
print(f"cost of flag-everything: ${5 * (is_fraud==0).sum():,.0f}")
```

**Checkpoint 2 (the lab's core):** Compare three costs: always-approve, your optimal threshold, flag-everything. Compute the savings of your system against always-approve. Now the kicker: **the optimal threshold moves** if the average fraud is $500 instead of $122, or if the FP cost is $25 (imagine a premium customer). Recompute. Write one paragraph: "Our threshold is 0.xx because…", citing your numbers. *That paragraph is a complete answer to the interview question "how do you pick a threshold for fraud?"*

---

## Part 3 — The production story: labels arrive late (30 min)

The dirty secret of fraud: **labels are delayed.** A transaction looks fine, ships, and only days later (chargeback, customer call) does it become a "1." Sketch what this does to your system — on paper first:

1. Your test set in Part 1 had instant labels. Real ones arrive with a distribution over days. What does that do to retraining? (You train on stale labels; your model learns last month's fraud.)
2. Your precision *estimate* is also delayed. Day-1 "precision" is optimistic (frauds haven't surfaced yet). Fraud teams call this **label maturity**; if your day-1 precision is 0.9, matured precision might be 0.6.
3. Now the design question: your dashboard shows precision 0.92 yesterday, 0.61 for "30 days ago." Is the model degrading — or are labels maturing? **How would you tell the difference?** (Hint: fix the label window, compare like with like — this is Chapter X.3's "stethoscope" applied to labels, and it's the difference between a calm Tuesday and a pointless retrain.)

**Checkpoint 3:** Write the three rules you'd put in a runbook: (a) when to retrain, (b) which metric windows to compare, (c) when to page a human instead of the model.

---

## Part 4 — Break it: the adversary (20 min)

Fraud isn't weather; it *responds* to your model. Two adversarial realities, one demo:

- **Demo — amount sensitivity:** sort test frauds by Amount. Plot the model's recall separately for frauds above and below $100. Small frauds are likely worse caught (card testing). An adversary who learns this will make many small frauds. Your countermeasure? Velocity features (transactions per card per hour) — which *this dataset lacks* (only PCA features) — which is exactly why real fraud systems live on stream-joined features (Chapter X.0).
- **On paper:** adversarial adaptation → concept drift → Chapter A.7's monitoring loop. Connect the three: which PSI-monitored features would move when fraudsters change tactics, if you had real features instead of V1–V28?

**Checkpoint 4:** In your journal: "The three reasons my 0.97 AUC would not survive contact with production" — delayed labels, adversarial drift, feature absence. That list is worth more in an interview than any AUC.

---

## Explain it back

1. Why is average precision a better headline number than AUC-ROC here? Give the one-line denominator explanation.
2. Your threshold from Part 2 — what two business inputs would change it most, and in which direction?
3. Day-1 precision 0.92, matured 0.61. Explain to a non-technical VP what happened, in three sentences, without the word "label."
4. Why does oversampling the fraud class *before* the train/test split invalidate your whole evaluation?

## Extensions

- **Time-based split:** train on the first day, test on the second (`Time` column, 172,792 / 111,986 rows). Watch AP drop vs. the random split — that gap is your first real drift measurement, and a preview of Lab a7.
- **Cost-sensitive training:** `class_weight` in the model vs. threshold tuning after — implement both, compare cost curves. Two philosophies, same goal.
- **Anomaly detection baseline:** IsolationForest trained *only on legit* transactions. When would an unsupervised approach beat supervised, and what does it cost you in calibration?

## What you can now claim in an interview

"I pick thresholds from a cost matrix, not from F1; I evaluate fraud with PR curves and time-based splits; and I can explain label maturity, adversarial drift, and why my offline metrics overstate production performance — with a cost curve I computed myself."
