# Coding 1 — Train a Churn Model Without Leaking the Future

**Time budget: 40 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

An interview screen: 'Here is 12 months of customer data with a churn label. Train a model, show me a metric you'd stand behind, and tell me the threshold you'd deploy.' The trap: the dataset is a *snapshot* — several columns were computed with knowledge of the churn decision window (support tickets *after* the churn date, 'days_since_last_order' as-of *today* rather than as-of the prediction date). The naive model scores 0.91 AUC. The honest one scores 0.78.

## Your task

A time-based split (train on months 1–10, validate on 11, test on 12) — the split itself is the answer to half the screen. Leakage columns identified and dropped with a one-line reason each. Calibration checked (reliability curve or ECE), not just AUC. Threshold justified with a cost matrix, not 0.5.

## Success looks like

1. Load and split — but defend your split choice in one sentence before writing it.
2. Train a gradient-boosted classifier (LightGBM/XGBoost or sklearn's HistGradientBoosting — no deep nets in a 40-minute screen).
3. Report a metric you'd stand behind, plus calibration behavior.
4. Identify and justify the operating threshold.
5. Name the columns you'd drop and why (this is where the screen is actually won).

## Dataset

The dataset: any churn dataset works — the [`tabular-classification`](../../../datasets/tabular-classification.md) card lists two; Telco Customer Churn (7K rows) is the right size. Label: `churned_within_30d`.

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
