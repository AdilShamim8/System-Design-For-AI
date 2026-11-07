# Lab a4 — Dataset: Criteo Display Advertising (subsample)

Full card in [`datasets/ctr-ads.md`](../../../datasets/ctr-ads.md). Lab-specific notes:

**Getting it:** Kaggle `criteo-display-advertising-challenge` → `train.csv` (~6.5 GB — the one big download in Track A; do it on good Wi-Fi). Build the 500K parquet subsample once (instructions in the lab README), then delete the CSV or keep it for extensions.

**No-bandwidth alternative:** Kaggle `avazu-ctr-prediction` (Avazu, ~40M rows, named features — arguably *nicer* for learning because features have meanings like `banner_position`). All lab code works identically; adjust column names.

**Shape:** `Label` (click), `I1–I13` integer (count-transformed, may be blank), `C1–C26` categorical (hash-encoded, millions of distinct values). No timestamps in the Kaggle release — the "week ordering" is the file's row order (extension).

**Known quirks you will hit:**

- **Positive rate ~3–4%** (compute yours). Every metric is read against this base rate.
- **Hashed categoricals are anonymous.** You can't know if `C1` is advertiser or placement. That's realistic (privacy) but means feature *reasoning* is impossible — a deliberate contrast with Avazu's named features.
- **Blank integer features are information.** Missingness correlates with click behavior; don't drop the rows — let LightGBM handle NaN.
- **Frequency skew:** a handful of categorical values dominate; the long tail is singletons. This is why frequency/target encoding extensions matter and why one-hot is hopeless at this vocabulary size.

**License:** Kaggle competition terms — research use, no commercial redistribution.
