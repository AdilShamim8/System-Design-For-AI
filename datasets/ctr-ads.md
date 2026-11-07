> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# CTR & Advertising Datasets

Click-through-rate prediction is where ML meets hard latency budgets and calibration requirements (Chapter A.4, Lab a4). Two Kaggle competition datasets dominate practice.

### Criteo Display Advertising Challenge (2014)

**What:** ~45M ad impressions over 7 days from Criteo's traffic: 13 integer features (already count-hashed) and 26 categorical features (hashed for privacy), plus the click label.

**Size:** ~45M rows, 40 columns (~6.5 GB uncompressed; use a subsample for labs)

**Get it:** https://www.kaggle.com/c/criteo-display-advertising-challenge/

**License:** Kaggle competition terms; research use.

**Quirks & gotchas:** Positive rate is a few percent (compute it from your subsample — never assume). Hashed categories are anonymous (feature `C1` might be advertiser, might be placement — you can't know). The full 45M rows force you to think about streaming training and memory budgets.

**Used in:** Lab a4 — CTR + calibration.

---
### Avazu CTR Prediction (Kaggle 2014)

**What:** 10 days of mobile ad impressions from Avazu: device, position, site/app, and hour-level timestamps, 24 columns, with click labels.

**Size:** ~40M rows (~6 GB; subsample for labs)

**Get it:** https://www.kaggle.com/c/avazu-ctr-prediction/

**License:** Kaggle competition terms; research use.

**Quirks & gotchas:** Unlike Criteo, features are *named* (device_type, C1, banner_position…) so you can reason about them. Timestamps enable the time-based split every CTR project needs (random splits leak future into past).

**Used in:** Lab a4 alternative.

---
### Taobao User Behavior (Tianchi, 2018)

**What:** Behavior logs (click, cart, favorite, purchase) of ~1M random users on Taobao over 24 days: user, item, category, behavior type, timestamp.

**Size:** ~100M events (~3.5 GB; 20M-row subsets available)

**Get it:** https://tianchi.aliyun.com/dataset/649

**License:** Research (Alibaba Tianchi).

**Quirks & gotchas:** Sequential behavior data — the right dataset when you want to practice session features and the 'recency' half of the feature-store conversation (A.1). Purchases are ~2% of events.

**Used in:** Optional Lab a4/a2 extension.

---
