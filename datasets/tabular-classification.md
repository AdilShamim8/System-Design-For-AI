> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# Tabular Classification Datasets

For learning the ML-system fundamentals — training/serving splits, feature stores, drift — you don't need exotic data. You need data with known quirks you can point at.

### UCI Adult Income (1996)

**What:** 48,842 rows from the 1994 US Census. 14 attributes (age, education, occupation, hours-per-week, …); task: predict whether income exceeds $50K/yr.

**Size:** 48,842 rows, 14 columns (~4 MB)

**Get it:** https://archive.ics.uci.edu/dataset/2/adult (also `sklearn.datasets.fetch_openml('adult')`)

**License:** Open (US Census-derived).

**Quirks & gotchas:** Missing values encoded as `'?'` (workclass, occupation, native-country); the `fnlwgt` column is census weighting noise (drop it or explain it); gender/race columns make it the standard dataset for the fairness conversation (see FN-01, FN-05).

**Used in:** Lab a1 (first prediction service), Lab a7 (drift).

---
### UCI Bank Marketing (2014)

**What:** 45,211 rows of Portuguese bank telemarketing calls. Task: predict whether the client subscribes to a term deposit. Comes with an additional 41,792-row version adding economic indicators.

**Size:** 45,211 rows, 16 columns (~4 MB)

**Get it:** https://archive.ics.uci.edu/dataset/222/bank+marketing

**License:** Open (Moro et al., research).

**Quirks & gotchas:** Imbalance (~11% positives); the 'duration' column leaks the label (calls that end in a subscription last longer) — the dataset's most famous trap: drop it for any realistic model, or explain why you kept it.

**Used in:** Reading for X.2 (metric traps).

---
### Home Credit Default Risk (Kaggle 2018)

**What:** 307,511 loan applications from Home Credit Group, plus 7 auxiliary tables (bureau, previous applications, credit card balance, installments…). Task: probability of default (target ≈ 8%).

**Size:** 307K rows main table; ~2.5 GB all tables

**Get it:** https://www.kaggle.com/c/home-credit-default-risk/

**License:** Kaggle competition terms.

**Quirks & gotchas:** The real exercise is the multi-table feature joins — a miniature feature-store problem. Class imbalance + delayed ground truth (defaults take months to materialize) make evaluation non-trivial.

**Used in:** Optional Lab a6 extension.

---
### HIGGS (UCI, 2014)

**What:** 11,000,000 Monte-Carlo-simulated particle-collision events. 28 features; task: distinguish a signal process (Higgs → ττ) from background.

**Size:** 11M rows, 28 columns (~11 GB CSV, also 10K/100K samples)

**Get it:** https://archive.ics.uci.edu/dataset/280/higgs

**License:** Open (CC BY 4.0).

**Quirks & gotchas:** Big enough to make batch/streaming choices matter; low-level physics features with no semantic meaning — trains you to design *systems* around features you don't understand (a real production condition).

**Used in:** Reading for X.0 (pipelines at scale).

---
### IBM Telco Customer Churn

**What:** 7,043 telecom customers with demographics, services, contract type, tenure, and monthly charges; 26.5% churned.

**Size:** 7,043 rows, 21 columns (<1 MB)

**Get it:** https://www.kaggle.com/datasets/blastchar/telco-customer-churn (IBM sample data)

**License:** Open (IBM sample).

**Quirks & gotchas:** Small and clean — sometimes a virtue: this is the dataset to use when you're practicing *deployment*, not modeling. `TotalCharges` has blank strings that must be coerced; `tenure`/contract-type interplay is the classic leakage discussion.

**Used in:** Alternative base for Lab a1.

---
