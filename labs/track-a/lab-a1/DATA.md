# Lab a1 — Dataset: UCI Adult Income

Full card in [`datasets/tabular-classification.md`](../../../datasets/tabular-classification.md). Lab-specific notes:

**Getting it:** `sklearn.datasets.fetch_openml("adult", version=2)` (used in the lab) downloads ~4 MB once, or grab `adult.data`/`adult.test` from the [UCI page](https://archive.ics.uci.edu/dataset/2/adult) and read with `pd.read_csv(..., na_values="?", skipinitialspace=True)`.

**Shape:** 48,842 rows × 14 columns; target = income >$50K (≈ 24% positive — notice how "76% accuracy" is trivially achieved by always saying "no"; this is the imbalance warm-up for Lab a3).

**Known quirks you will hit:**

- Missing values appear as `"?"` in raw UCI files (workclass, occupation, native-country). OpenML's version already encodes them as `NaN`. Missingness here is *informative* (people skip fields for reasons) — in the extension, try adding `isna()` flags as features and see if AUC moves.
- `fnlwgt` is a census weight — it describes the *sampling*, not the person. Dropped.
- `education-num` is `education` re-encoded. We drop it to keep the API honest (one representation per concept).
- The data is from **1994**. Any model trained on it encodes 1994's labor market. Fine for learning; never fine for a real lending product — and a great sentence to say in an interview unprompted.

**License:** open (US Census-derived); educational use.
