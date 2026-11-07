# Lab a3 — Dataset: ULB Credit Card Fraud

Full card in [`datasets/fraud-anomaly.md`](../../../datasets/fraud-anomaly.md). Lab-specific notes:

**Getting it:** Kaggle, `mlg-ulb/creditcardfraud` → `creditcard.csv` (~144 MB, free account needed). Place in `labs/data/`.

**Shape:** 284,807 rows × 31 columns over **two days (Sept 2013)** of European cardholder activity. Columns: `Time` (seconds since first transaction), `Amount`, `Class` (0/1), and `V1…V28` — PCA components of confidential original features.

**Known quirks you will hit:**

- **0.173% positive rate** — 492 frauds among 284K transactions. Every "99.8% accurate" joke lives here.
- **The PCA wall:** V1–V28 are uninterpretable. You cannot build "transactions per hour" or "new merchant category" features — the two most powerful fraud features in production. The dataset teaches thresholds and metrics; it *cannot* teach feature engineering. Know which one you're practicing.
- **`Time` is elapsed, not wall-clock.** No dates, no day-of-week. You can still time-split (first day vs. second) — the extension does exactly that.
- **Severely skewed `Amount`:** mostly <$100, a tail to ~$25,691. Average fraud amount ≈ $122 (compute it; use your number in the cost matrix).
- **Not the whole picture:** real fraud systems join 10+ tables (device fingerprints, merchant history, velocity counters). This is one table, deliberately.

**License:** open for analysis (published by ULB/Worldline researchers via Kaggle). The *original* features are confidential — which is itself a lesson: production datasets you share are the ones you can't fully explain.
