---
chapter_id: "X.0"
title: "The Pipes Behind the Magic"
topic: "Infrastructure & MLOps basics"
track: cross-cutting
bloom_stage: ["understand", "apply"]
est_read_minutes: 16
prerequisites: ["0.0", "A.0"]
teaching_goal: "Describe the substrate of an AI system (compute, serving, registries, pipelines) and the deploy/monitor/retrain loop."
primary_diagram: assets/diagrams/X.0/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Pipes Behind the Magic

The model gets the glory. The infrastructure gets the bill. Behind every 'AI-powered feature' is a layer of compute, storage, pipelines, and operational discipline that determines whether the feature ships and whether it survives. This chapter is that layer.

---

## Remember

**Compute**: CPU (cheap, general), GPU (expensive, parallel, for training and some inference), TPU (Google-specific, for large-scale training). **Serving patterns**: real-time (low latency, high cost), batch (high latency, low cost), streaming (in between). **Model registry** — versioned storage for models, with metadata and lineage. **Pipeline** — the DAG of data → train → evaluate → deploy. **Deploy/monitor/retrain loop** — production is never 'done.'

---

## Understand

**Compute.** AI workloads have different compute needs:
- **Training**: GPU-heavy, can take hours to weeks, expensive (a large model training run can cost $1M+).
- **Real-time inference**: latency-sensitive, needs fast GPUs or dedicated inference hardware.
- **Batch inference**: less latency-sensitive, can run on cheaper hardware.
- **Data processing**: CPU-heavy, parallelizable, uses Spark or similar.

**Serving patterns.**
- **Real-time**: the model responds to each request immediately. Low latency (<1s), high cost (always-on GPU). Use for: user-facing features.
- **Batch**: the model processes many requests at once, periodically. High latency (hours), low cost. Use for: nightly recommendations, daily forecasts.
- **Streaming**: the model processes requests as they arrive, but not necessarily immediately. Medium latency (seconds), medium cost. Use for: near-real-time features.

**Model registry.** A versioned store for trained models, like git for models. Each model version has: the model artifact (weights), metadata (training data, hyperparameters, metrics), and lineage (which data was it trained on? which code version?). Without a registry, you can't reproduce results, can't roll back, and can't reason about what's in production.

**Pipelines.** The DAG (directed acyclic graph) of ML operations: data ingestion → preprocessing → training → evaluation → deployment → monitoring. Tools: Airflow, Kubeflow, Dagster, Prefect. The pipeline is the 'CI/CD for ML' — it automates the path from data to production.

**The deploy/monitor/retrain loop.** Deploy the model. Monitor its performance (drift, accuracy, business metrics). When performance degrades, retrain. Deploy the new model. Repeat. This loop is the operational discipline that keeps ML alive in production. Without it, the model degrades silently until someone complains.

---

## Apply

Design the infrastructure for a recommendation system:
1. **Training**: nightly batch job on GPU cluster. Trains on the previous day's data. Outputs a new model version to the registry.
2. **Evaluation**: the new model is evaluated on a holdout set. If metrics improve by >1%, it's a candidate for deployment.
3. **Deployment**: shadow deployment — the new model runs in parallel, not serving traffic. If its outputs look good for 24 hours, promote to production.
4. **Serving**: real-time inference on GPU servers. <100ms per request.
5. **Monitoring**: daily jobs track input drift, output drift, click-through rate. Alerts fire on significant changes.
6. **Retraining**: triggered by drift detection or scheduled weekly.

This is the full MLOps loop — the operational discipline that keeps the system alive.

---

## Analyze

MLOps vs. DevOps: what's the same, what's different. Same: CI/CD, monitoring, incident response, versioning. Different: ML adds data pipelines (DevOps doesn't deal with training data), model drift (code doesn't drift; models do), evaluation complexity (code is correct or not; models are 'good enough' or not), and reproducibility challenges (the same code + same data should produce the same model, but GPU non-determinism can break this). Traditional SREs often underestimate these differences.

---

## Evaluate

The infrastructure is not the glamorous part — but it's where production AI lives or dies. A great model on bad infrastructure will fail. A mediocre model on great infrastructure will survive and improve. Invest in the pipes: they carry the water.

---

## Create

Design the MLOps infrastructure for a fraud detection system. What compute (real-time for blocking, batch for analysis)? What registry? What pipeline? What monitoring? How do you handle the fact that fraud patterns change weekly?

---

## A common misconception

**'MLOps is just DevOps with models.'** No. MLOps adds data pipelines, model drift, evaluation complexity, and reproducibility challenges that DevOps doesn't have. Treating ML like 'just code' leads to models that degrade silently, can't be reproduced, and can't be rolled back safely. MLOps is a distinct discipline.

---

## Explain it back

The three compute types are _____, _____, and _____. The three serving patterns are _____, _____, and _____. A model registry is _____. The deploy/monitor/retrain loop is _____. MLOps differs from DevOps because _____.

---

## Further reading

- **Google (2020), "MLOps: Continuous delivery and automation pipelines in machine learning"** — the canonical MLOps reference.
- **Databricks Engineering Blog** — production MLOps patterns.
- **MLflow documentation** — open-source model registry and experiment tracking.
