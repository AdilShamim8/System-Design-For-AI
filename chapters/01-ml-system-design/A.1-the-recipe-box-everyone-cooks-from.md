---
chapter_id: "A.1"
title: "The Recipe Box Everyone Cooks From"
topic: "Feature stores"
track: ml
bloom_stage: ["understand", "apply"]
est_read_minutes: 15
prerequisites: ["A.0"]
teaching_goal: "Explain what a feature store is, why it solves training-serving skew, and when you do vs. don't need one."
primary_diagram: assets/diagrams/A.1/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Recipe Box Everyone Cooks From

Two cooks. Same recipe. One uses fresh tomatoes from the garden, the other uses canned. Same recipe, very different dish. That's training-serving skew — and the feature store is the shared recipe box that prevents it.

---

## Remember

**Feature store** — a shared registry of features (model inputs) used identically at training and serving time. **Training-serving skew** — when the features used at training time don't match the features used at serving time, causing the model to perform differently in production. **Online feature store** — low-latency lookup for real-time serving. **Offline feature store** — batch compute for training.

---

## Understand

The problem: during training, you compute features from historical data in a batch pipeline (Spark, BigQuery). During serving, you compute features on-the-fly from real-time data. If the two computations differ — different aggregations, different time windows, different handling of missing values — the model sees different inputs at training vs. serving time. This is training-serving skew, and it silently degrades model performance.

The feature store solves this by being the single source of truth. Features are defined once, computed once, and served from the same store for both training and inference. The training pipeline reads from the offline store (batch, historical). The serving pipeline reads from the online store (low-latency, current). Both stores contain the same features, computed the same way — just at different latencies and for different time ranges.

**Feature freshness** matters. Some features are timeless (user's country, account age). Some decay in minutes (last 5 pages viewed, items in cart). The feature store must handle both: durable features in the offline store, real-time features in the online store with short TTLs.

When do you need a feature store? When you have multiple models sharing features, when you've hit training-serving skew in production, or when your team is large enough that feature duplication is a problem. For a single model with simple features, a feature store is overkill.

---

## Apply

Consider a fraud detection model. Features include: user's account age, transaction history (last 30 days), average transaction amount, geographic patterns. At training time, these are computed from historical data. At serving time, they must be computed for the current transaction in <100ms. Without a feature store, the training pipeline computes 'average transaction amount' as a 30-day average ending at the transaction date, while the serving pipeline computes it as a 30-day average ending at 'now.' If the training data is from 6 months ago, the two computations differ — skew. With a feature store, both pipelines read from the same feature definitions, and skew is eliminated.

---

## Analyze

Feature stores add complexity. They're another system to operate, monitor, and keep consistent. The tradeoff: they eliminate skew and enable feature reuse across models, but they add infrastructure. For small teams with one or two models, the overhead may not be worth it. For large teams with many models sharing features, the feature store pays for itself in reduced skew and faster model development.

---

## Evaluate

Popular feature store options (as of 2026): **Feast** (open-source, cloud-native), **Tecton** (managed, enterprise), **Hopsworks** (open-source, full-featured), **AWS SageMaker Feature Store** (managed, AWS-native). The choice depends on your cloud, your team size, and your need for managed vs. self-hosted.

---

## Create

Design the feature store for a ride-sharing app. What features do you need (user's ride history, driver's rating, time of day, weather)? Which are online (real-time) vs. offline (batch)? How do you handle feature freshness for real-time features like 'driver's current location'?

---

## A common misconception

**'Feature stores are just databases.'** No. A feature store is a *system* that manages feature definitions, computes features, serves them at low latency for inference and high throughput for training, tracks feature lineage, and monitors feature freshness. A database stores data; a feature store manages the entire feature lifecycle.

---

## Explain it back

A feature store is _____. The problem it solves is _____, which happens when _____. The two types of feature stores are _____ (for serving) and _____ (for training). You need a feature store when _____.

---

## Further reading

- **Uber Engineering (2017), "Michelangelo: Uber's Machine Learning Platform"** — the origin of the modern feature store concept.
- **Feast documentation** — the leading open-source feature store.
- **Tecton Engineering Blog** — production feature store patterns at scale.
