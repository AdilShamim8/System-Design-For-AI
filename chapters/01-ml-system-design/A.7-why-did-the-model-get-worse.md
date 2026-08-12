---
chapter_id: "A.7"
title: "Why Did the Model Get Worse?"
topic: "Drift, retraining, closing the loop"
track: ml
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 18
prerequisites: ["A.0", "A.1", "A.6"]
teaching_goal: "Diagnose data drift vs. concept drift, design detection signals, and implement a shadow-and-promote retraining pattern."
status: stable
last_updated: "2026-08-12"
---

# Why Did the Model Get Worse?

We started this track with a mystery: the model worked Friday, failed Monday. We've spent six chapters building the vocabulary to solve it. This chapter is the resolution — and the design patterns that prevent it from happening again.

---

## Remember

- **Data drift (covariate shift)** — the input distribution changes. Users behave differently, new user types arrive.
- **Concept drift** — the relationship between inputs and outputs changes. What was "good" yesterday isn't "good" today.
- **Shadow deployment** — train new model, run it in parallel without serving it, compare outputs.
- **Champion/challenger** — the production model (champion) vs. a candidate replacement (challenger), continuously evaluated.
- **Retraining trigger** — the signal that says "time to retrain" (scheduled, drift-detected, or performance-degraded).

---

## Understand — diagnosing the Monday morning problem

**Possibility 1: Data drift.** The input distribution shifted. Maybe a marketing campaign brought new users. The model was trained on the old distribution; the new distribution is different.

**Possibility 2: Concept drift.** The relationship between inputs and outputs changed. User preferences shifted. The model learned the old relationship; the new relationship is different.

**Possibility 3: Code or pipeline bug.** A deploy changed how features are computed. The model sees different features than it was trained on. This isn't drift — it's a bug.

**Detection signals:**
- **Input distribution monitoring** — track feature statistics over time. Alert when they shift (PSI > 0.2).
- **Output distribution monitoring** — track prediction statistics. If the model suddenly predicts more "positive" outcomes, something changed.
- **Ground-truth latency** — how quickly do you learn whether predictions were right? For ads, seconds. For loan defaults, months.
- **Business metrics** — the ultimate signal. If engagement drops, something is wrong.

---

## Apply — design a drift detection and retraining pipeline

1. **Monitoring**: daily jobs compute feature statistics, prediction distributions, and business metrics. Alerts fire on significant changes.
2. **Diagnosis**: when an alert fires, determine if it's data drift, concept drift, or a bug. Compare current feature distributions to training distributions. Check recent deploys.
3. **Retraining**: if drift is confirmed, retrain on recent data. Use the shadow-and-promote pattern: train new model, run it in shadow (parallel to production, not serving), compare outputs, promote if better.
4. **Champion/challenger**: always have a challenger running. Don't wait for drift to retrain.

---

## Analyze — retraining isn't always the answer

Sometimes the fix is:
- **Feature engineering**: add features that capture the new pattern.
- **Model architecture**: switch to a model that handles the new distribution better.
- **Data collection**: collect more labeled data for the new distribution.
- **Rollback**: if the drift is from a bug, roll back the deploy.

Retraining is the hammer; not every problem is a nail. Diagnose first, fix second.

---

## Evaluate — the deeper lesson

ML systems are never "done." The model that works today will degrade tomorrow. The teams that succeed build the monitoring, detection, and retraining pipeline — not just the model. The model is 10% of the work; the lifecycle is 90%.

---

## Create — design the full ML lifecycle for a content moderation system

What drift signals do you monitor? How do you handle "what's harmful" being a moving target? How do you retrain without taking the system offline? How do you handle adversarial drift (bad actors adapting)?

---

## A common misconception

**"Retraining fixes everything."** No. Retraining fixes drift, but it doesn't fix bugs, architecture problems, or feature engineering gaps. Diagnose the problem before applying the fix.

---

## Explain it back

> "The two types of drift are _____ and _____. The detection signals are _____, _____, and _____. The shadow-and-promote pattern works by _____. The lesson is that ML systems are never _____."

---

## References

- **Gama, J., et al. (2014), "A Survey on Concept Drift Aiming," ACM Computing Surveys 46(4).** https://dl.acm.org/doi/10.1145/2523813
- **Databricks Engineering Blog.** Production drift detection patterns. https://www.databricks.com/blog/category/engineering
- **Google Cloud (2024), "ML monitoring and alerting."** https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning
