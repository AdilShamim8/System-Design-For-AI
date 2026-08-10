---
chapter_id: "A.7"
title: "Why Did the Model Get Worse?"
topic: "Drift, retraining, closing the loop"
track: ml
bloom_stage: ["evaluate", "create"]
est_read_minutes: 18
prerequisites: ["A.0", "A.1", "A.6"]
teaching_goal: "Diagnose data drift vs. concept drift, design detection signals, and implement a shadow-and-promote retraining pattern."
primary_diagram: assets/diagrams/A.7/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# Why Did the Model Get Worse?

We started this track with a mystery: the model worked Friday, failed Monday. We've spent six chapters building the vocabulary to solve it. This chapter is the resolution — and the design patterns that prevent it from happening again.

---

## Remember

**Data drift** — the input distribution changes (users behave differently, new user types arrive). **Concept drift** — the relationship between inputs and outputs changes (what was 'good' yesterday isn't 'good' today). **Shadow deployment** — run the new model in parallel without serving it, compare outputs. **Champion/challenger** — the production model (champion) vs. a candidate replacement (challenger), continuously evaluated. **Retraining trigger** — the signal that says 'time to retrain' (scheduled, drift-detected, or performance-degraded).

---

## Understand

Back to the Monday morning mystery. The model worked Friday, failed Monday. What happened?

**Possibility 1: Data drift.** The input distribution shifted over the weekend. Maybe a marketing campaign brought new users with different behavior. Maybe a competitor launched a feature that changed how people use your product. The model was trained on the old distribution; the new distribution is different. The model's predictions are still 'correct' for the old data, but the old data no longer represents reality.

**Possibility 2: Concept drift.** The relationship between inputs and outputs changed. Maybe user preferences shifted — what was a 'good recommendation' on Friday isn't on Monday. Maybe the definition of success changed (a new product launch made certain recommendations more valuable). The model learned the old relationship; the new relationship is different.

**Possibility 3: Code or data pipeline bug.** A deploy on Friday changed how features are computed. The model sees different features than it was trained on. This isn't drift — it's a bug. But it manifests as 'the model got worse.'

**Detection signals:**
- **Input distribution monitoring**: track feature statistics over time. Alert when they shift significantly (KL divergence, population stability index).
- **Output distribution monitoring**: track prediction statistics. If the model suddenly predicts more 'positive' outcomes, something changed.
- **Ground-truth latency**: how quickly do you learn whether predictions were right? For ads, you know if a click happened within seconds. For loan defaults, it takes months. Long latency means slow drift detection.
- **Business metrics**: the ultimate signal. If engagement, revenue, or conversion drop, something is wrong — even if model metrics look fine.

---

## Apply

Design a drift detection and retraining pipeline:
1. **Monitoring**: daily jobs compute feature statistics, prediction distributions, and business metrics. Alerts fire on significant changes.
2. **Diagnosis**: when an alert fires, determine if it's data drift, concept drift, or a bug. Compare current feature distributions to training distributions. Check recent deploys.
3. **Retraining**: if drift is confirmed, retrain on recent data. Use the shadow-and-promote pattern: train the new model, run it in shadow (parallel to production, not serving users), compare its outputs to the champion's, promote if better.
4. **Champion/challenger**: always have a challenger running. Don't wait for drift to retrain — continuously evaluate whether a newer model would be better.

---

## Analyze

Retraining isn't always the answer. Sometimes the fix is:
- **Feature engineering**: add features that capture the new pattern (e.g., a 'days since last visit' feature if user behavior shifted toward more casual usage).
- **Model architecture**: switch to a model that handles the new distribution better (e.g., a neural net that can learn non-linear patterns the GBT missed).
- **Data collection**: collect more labeled data for the new distribution.
- **Rollback**: if the drift is from a bug, roll back the deploy, don't retrain.

Retraining is the hammer; not every problem is a nail. Diagnose first, fix second.

---

## Evaluate

The deeper lesson: ML systems are never 'done.' The model that works today will degrade tomorrow. The teams that succeed build the monitoring, detection, and retraining pipeline — not just the model. The model is 10% of the work; the lifecycle is 90%. The Monday morning problem is preventable, but only if you built the defenses before Monday.

---

## Create

Design the full ML lifecycle for a content moderation system. What drift signals do you monitor? How do you handle the fact that 'what's harmful' is a moving target? How do you retrain without taking the system offline? How do you handle adversarial drift (bad actors adapting to your moderation)?

---

## A common misconception

**'Retraining fixes everything.'** No. Retraining fixes drift, but it doesn't fix bugs, architecture problems, or feature engineering gaps. Diagnose the problem before applying the fix. A model retrained on the same broken features will have the same broken behavior, just with fresher data.

---

## Explain it back

The two types of drift are _____ (the _____ changed) and _____ (the _____ changed). The detection signals I'd monitor are _____, _____, and _____. The shadow-and-promote pattern works by _____. The lesson is that ML systems are never _____, and the teams that succeed build _____, not just _____.

---

## Further reading

- **Gama et al. (2014), "A Survey on Concept Drift Aiming," ACM Computing Surveys** — the foundational survey.
- **Databricks Engineering Blog** — production drift detection patterns.
- **Google Cloud (2024), "ML monitoring and alerting"** — practical implementation guide.
