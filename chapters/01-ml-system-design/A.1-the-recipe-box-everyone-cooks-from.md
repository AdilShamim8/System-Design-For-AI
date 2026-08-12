---
chapter_id: "A.1"
title: "The Recipe Box Everyone Cooks From"
topic: "Feature stores"
track: ml
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 16
prerequisites: ["A.0"]
teaching_goal: "Explain what a feature store is, why it solves training-serving skew, and when you do vs. don't need one."
status: stable
last_updated: 2026-08-12
---

# The Recipe Box Everyone Cooks From

Two cooks. Same recipe. One uses fresh tomatoes from the garden, the other uses canned. Same recipe, very different dish. That's training-serving skew — and the feature store is the shared recipe box that prevents it.

In ML, this isn't a metaphor. It's a silent killer of model quality. The model was trained on features computed one way; at serving time, the features are computed slightly differently. The model sees different inputs than it was trained on, and its accuracy drops — silently, without any error, without any alert. The model doesn't crash. It just gets worse. And nobody knows why.

---

## Remember — name it

- **Feature** — a measurable input to a model. For predicting house prices: square footage, number of bedrooms, zip code. Each one is an "ingredient" the model uses to make its prediction.
- **Feature store** — a shared registry of features, used identically at training and serving time. The "recipe box" that ensures both kitchens use the same ingredients.
- **Training-serving skew** — when the features used at training time don't match the features used at serving time. The model learns one recipe; the kitchen serves another.
- **Online feature store** — low-latency lookup for real-time serving. Redis, DynamoDB, or a dedicated feature store's online layer. Latency: <10ms.
- **Offline feature store** — batch compute for training. Spark, BigQuery, Snowflake. High throughput, high latency.
- **Feature freshness** — some features are timeless (user's country), some decay in minutes (last 5 pages viewed). The feature store must handle both.

---

## Understand — the problem and the solution

### The problem: training-serving skew

During training, you compute features from historical data in a batch pipeline (Spark, BigQuery). During serving, you compute features on-the-fly from real-time data. If the two computations differ — different aggregations, different time windows, different handling of missing values — the model sees different inputs at training vs. serving time.

Example: A fraud detection model uses "average transaction amount in the last 30 days" as a feature.
- At training time: computed as a 30-day average ending at the transaction date, from historical data.
- At serving time: computed as a 30-day average ending at "now," from a real-time stream.

If the training data is from 6 months ago, the 30-day windows don't overlap. The feature values are different for the same logical concept. The model learned patterns with one set of values; it's serving with another. This is skew, and it silently degrades model performance.

### The solution: feature store

The feature store solves this by being the single source of truth. Features are defined once, computed once, and served from the same store for both training and inference.

- **Training pipeline** reads from the offline store (batch, historical). "Give me the 30-day average for all users as of January 1, 2026."
- **Serving pipeline** reads from the online store (low-latency, current). "Give me the 30-day average for user 12345 right now."
- Both stores contain the same features, computed the same way — just at different latencies and for different time ranges.

### Feature freshness

Some features are timeless (user's country, account age). Some decay in minutes (last 5 pages viewed, items in cart). The feature store must handle both:
- **Durable features** stored in the offline store, updated daily or weekly.
- **Real-time features** stored in the online store with short TTLs (time-to-live), updated by streaming pipelines (Kafka, Flink).

---

## Apply — when do you need a feature store?

You need a feature store when:
1. **You have multiple models sharing features.** Without a feature store, each team recomputes the same features differently, leading to inconsistency.
2. **You've hit training-serving skew in production.** The model performs well offline but poorly online. You investigate and discover the features are computed differently.
3. **Your team is large enough that feature duplication is a problem.** Multiple teams building overlapping features without knowing it.

You do NOT need a feature store when:
1. **You have one model with simple features.** If your features are just "user's country" and "time of day," a feature store is overkill.
2. **Your features are all real-time (computed from the request).** If you don't use historical aggregations, there's no skew risk.
3. **You're a small team with one model.** The operational overhead of a feature store isn't worth it yet.

---

## Analyze — popular feature store options

- **Feast** (open-source, cloud-native) — the leading open-source option. Works with Redis (online) and BigQuery/Snowflake (offline). Good for teams that want control. https://feast.dev
- **Tecton** (managed, enterprise) — built by the Uber Michelangelo team. Fully managed, expensive, but removes operational burden. https://www.tecton.ai
- **Hopsworks** (open-source, full-featured) — includes feature store, training pipeline, and serving. Good for teams that want an integrated platform. https://www.hopsworks.ai
- **AWS SageMaker Feature Store** (managed, AWS-native) — integrated with SageMaker. Good if you're already on AWS. https://docs.aws.amazon.com/sagemaker/latest/dg/feature-store.html
- **Vertex AI Feature Store** (managed, GCP-native) — integrated with Vertex AI. Good if you're on GCP.

The choice depends on your cloud, your team size, and your need for managed vs. self-hosted.

---

## Evaluate — the tradeoff

Feature stores add complexity. They're another system to operate, monitor, and keep consistent. The tradeoff:
- **Benefit**: eliminates skew, enables feature reuse across models, provides feature lineage (which data went into which model).
- **Cost**: infrastructure overhead, learning curve, potential performance bottleneck (if the online store is slow, serving latency increases).

For small teams with one or two models, the overhead may not be worth it. For large teams with many models sharing features, the feature store pays for itself in reduced skew and faster model development.

---

## Create — design a feature store for fraud detection

Design the feature store for a fraud detection system. What features do you need?
- User features: account age, transaction history (30/90/365 day aggregates), average transaction amount, geographic patterns.
- Transaction features: amount, merchant category, time of day, device fingerprint.
- Context features: IP address, geographic distance from usual location.

Which are online (real-time) vs. offline (batch)?
- Online: current transaction amount, device, IP, geographic distance (computed from the request).
- Offline: 30-day transaction history, average amount, geographic patterns (pre-computed, updated daily).

How do you handle feature freshness for real-time features like "last 5 transactions"? (Stream them via Kafka into the online store with a 24-hour TTL.)

---

## A common misconception

**"Feature stores are just databases."** No. A feature store is a *system* that manages feature definitions, computes features, serves them at low latency for inference and high throughput for training, tracks feature lineage, and monitors feature freshness. A database stores data; a feature store manages the entire feature lifecycle.

---

## Explain it back

> "A feature store is _____. The problem it solves is _____, which happens when _____. The two types of feature stores are _____ (for serving) and _____ (for training). You need a feature store when _____. You don't need one when _____."

---

## References

- **Uber Engineering (2017), "Michelangelo: Uber's Machine Learning Platform."** The origin of the modern feature store concept. https://www.uber.com/blog/michelangelo-machine-learning-platform/
- **Feast Documentation.** The leading open-source feature store. https://feast.dev
- **Tecton Engineering Blog.** Production feature store patterns at scale. https://www.tecton.ai/blog/
- **Gojek Engineering (2020), "Feast: Feature Store for ML."** How Gojek uses Feast in production. https://gojek.engineering/
