---
chapter_id: "A.0"
title: "The Model That Got Worse on Monday"
topic: "The ML lifecycle"
track: ml
bloom_stage: ["remember", "understand"]
est_read_minutes: 16
prerequisites: ["0.0", "0.1"]
teaching_goal: "Describe the data → training → serving → monitoring loop and explain why it's a loop, not a line."
primary_diagram: assets/diagrams/A.0/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Model That Got Worse on Monday

The model worked on Friday. By Monday, support tickets were spiking. The data science team swore nothing changed. They were right — and wrong. Nothing in the code changed. But the world did, and the model was about to teach everyone why ML is never 'done.'

---

## Remember

The ML lifecycle has four stages: **data collection** → **training** → **serving** (inference) → **monitoring**. The critical insight: it's a *loop*, not a line. Monitoring feeds back into data collection, which feeds back into training, which feeds back into serving. ML systems are never 'done' — they're always in the loop.

---

## Understand

**Stage 1 — Data.** Where it comes from (user interactions, logs, third-party data), why it's never clean (missing values, biases, labeling errors), and why 80% of ML work happens here. The data is the model's only source of truth about the world; if the data is wrong, everything downstream is wrong.

**Stage 2 — Training.** The expensive offline phase. The model learns patterns from historical data. This is where GPU clusters, distributed training frameworks (PyTorch DDP, DeepSpeed), and experiment tracking (MLflow, Weights & Biases) live. Training a large model can take hours to weeks.

**Stage 3 — Serving (inference).** The cheap online phase, but the one users feel. The trained model receives requests and returns predictions. Latency matters (users won't wait 5 seconds for a recommendation), throughput matters (the system handles thousands of requests per second), and the model must be versioned (you need to know which model served which request).

**Stage 4 — Monitoring.** The discipline that catches the 'Monday morning problem' before users do. You monitor: input distribution (has the data shifted?), output distribution (are predictions drifting?), ground-truth latency (how quickly do you learn whether predictions were right?), and business metrics (are users still engaging?).

**Why it's a loop:** monitoring reveals that the model is degrading. That triggers new data collection (label the recent inputs). That triggers retraining. That triggers a new deployment. The loop never stops — the question is whether you're driving it deliberately or being driven by it.

---

## Apply

Map the four stages to a system you know. For Netflix recommendations:
1. **Data**: what you watched, when, how much, skipped or finished.
2. **Training**: offline models that learn 'users who liked X also liked Y.'
3. **Serving**: when you open the app, the model scores each candidate show.
4. **Monitoring**: Netflix tracks whether you actually clicked, watched, finished — and feeds that back into data.

The loop: your behavior on Monday becomes training data for the model that serves you on Wednesday.

---

## Analyze

Where does the loop break? Common break points:
- **Data → Training**: the data is biased, incomplete, or stale. The model learns the wrong patterns.
- **Training → Serving**: training-serving skew. The features used at training time don't match what's available at serving time. The model performs differently in production than in offline tests.
- **Serving → Monitoring**: no logging, or logs that don't capture the right signals. You can't detect drift if you're not measuring it.
- **Monitoring → Data**: you detect drift but have no pipeline to label new data and retrain. The loop stalls.

Each break point is a common production failure. The lifecycle only works if all four stages are connected.

---

## Evaluate

Most ML failures aren't model failures — they're lifecycle failures. The model is fine; the pipeline broke. When diagnosing a production issue, ask: which stage of the loop is broken? Is the data wrong? Is the training pipeline broken? Is serving degraded? Is monitoring blind? The answer determines the fix.

---

## Create

Design the ML lifecycle for a spam filter. What data do you collect? How often do you retrain? How do you serve (real-time or batch)? What do you monitor? Where could the loop break?

---

## A common misconception

**'Once the model is trained, the work is done.'** This is the most dangerous misconception in ML. The model is never done. The world changes, the data changes, the model degrades. The teams that succeed in ML are the ones that build the monitoring and retraining pipeline — not the ones that build the best model once.

---

## Explain it back

The ML lifecycle has four stages: _____, _____, _____, and _____. It's a loop, not a line, because _____. The stage where 80% of the work happens is _____. The stage that catches the 'Monday morning problem' is _____. Without _____, the loop breaks.

---

## Further reading

- **Sculley et al. (2015), "Hidden Technical Debt in Machine Learning Systems," NIPS** — on why ML systems are harder to maintain than to build.
- **Google Cloud (2024), "MLOps: Continuous delivery and automation pipelines in machine learning"** — the operational discipline.
- **Databricks Engineering Blog** — practical ML lifecycle patterns from production.
