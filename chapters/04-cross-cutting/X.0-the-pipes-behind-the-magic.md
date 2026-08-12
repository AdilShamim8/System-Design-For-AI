---
chapter_id: "X.0"
title: "The Pipes Behind the Magic"
topic: "Infrastructure & MLOps basics"
track: cross-cutting
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 18
prerequisites: ["0.0", "A.0"]
teaching_goal: "Describe the substrate of an AI system (compute, serving, registries, pipelines) and the deploy/monitor/retrain loop."
status: stable
last_updated: 2026-08-12
---

# The Pipes Behind the Magic

The model gets the glory. The infrastructure gets the bill. Behind every "AI-powered feature" is a layer of compute, storage, pipelines, and operational discipline that determines whether the feature ships and whether it survives.

This chapter is about that layer — the plumbing that makes AI work in production. It's not glamorous, but it's where production AI lives or dies. A great model on bad infrastructure will fail. A mediocre model on great infrastructure will survive and improve.

---

## Remember — name it

- **Compute**: CPU (cheap, general-purpose), GPU (expensive, parallel, for training and some inference), TPU (Google-specific, for large-scale training). A single A100 GPU costs ~$2/hour on AWS. A training run on 8 A100s for 24 hours costs ~$384.
- **Serving patterns**: real-time (low latency, high cost — user-facing), batch (high latency, low cost — nightly jobs), streaming (in between — near-real-time).
- **Model registry** — versioned storage for models, with metadata and lineage. Like git for models. MLflow Model Registry, SageMaker Model Registry.
- **Pipeline** — the DAG of data to train to evaluate to deploy. Tools: Airflow, Kubeflow, Dagster, Prefect.
- **Deploy/monitor/retrain loop** — production is never "done." The loop that keeps ML alive.

---

## Understand — the substrate

### Compute

AI workloads have different compute needs:
- **Training**: GPU-heavy. A 70B parameter model takes ~1,000 GPU-hours on A100s. At $2/GPU-hour, that's ~$2,000 per training run. Large models (GPT-4 scale) cost millions to train.
- **Real-time inference**: latency-sensitive. Needs fast GPUs or dedicated inference hardware (NVIDIA TensorRT, Google TPU). Typical: 1-10ms per inference for small models, 500-3000ms for LLMs.
- **Batch inference**: less latency-sensitive. Can run on cheaper hardware or spot instances. Example: nightly recommendation scoring for all users.
- **Data processing**: CPU-heavy. Spark, Dask, Ray. Processing terabytes of training data.

### Serving patterns

- **Real-time**: the model responds to each request immediately. Low latency (<1s for recommendations, <3s for LLMs), high cost (always-on GPU). Use for: user-facing features.
- **Batch**: the model processes many requests at once, periodically. High latency (hours), low cost. Use for: nightly recommendations, daily forecasts, bulk classification.
- **Streaming**: the model processes requests as they arrive, but not immediately. Medium latency (seconds), medium cost. Use for: near-real-time features (fraud detection, content moderation).

### Model registry

A versioned store for trained models. Each model version has: the model artifact (weights), metadata (training data, hyperparameters, metrics), and lineage (which data was it trained on? which code version?).

Without a registry, you can't: reproduce results, roll back to a previous model, or reason about what's in production. It's the ML equivalent of source control.

### Pipeline

The DAG (directed acyclic graph) of ML operations: data ingestion, preprocessing, training, evaluation, deployment, monitoring. Each node is a task; edges are dependencies. Tools: Airflow (general-purpose), Kubeflow (Kubernetes-native), Dagster (data-aware), Prefect (Python-native).

The pipeline automates the path from data to production. Without it, every step is manual — slow, error-prone, and impossible to reproduce.

### The deploy/monitor/retrain loop

1. Deploy the model (shadow or canary).
2. Monitor its performance (drift, accuracy, business metrics).
3. When performance degrades, retrain on fresh data.
4. Deploy the new model.
5. Repeat.

This loop is the operational discipline that keeps ML alive in production. Without it, the model degrades silently until someone complains.

---

## Apply — design the infrastructure for a recommendation system

1. **Training**: nightly batch job on a GPU cluster (4 A100s, ~4 hours). Trains on the previous day's data. Outputs a new model version to the registry.
2. **Evaluation**: the new model is evaluated on a holdout set. If metrics improve by >1%, it's a candidate for deployment.
3. **Deployment**: shadow deployment — the new model runs in parallel, not serving traffic. If its outputs look good for 24 hours, promote to production.
4. **Serving**: real-time inference on GPU servers. <100ms per request. Load-balanced across 4 instances.
5. **Monitoring**: daily jobs track input drift, output drift, click-through rate. Alerts fire on significant changes.
6. **Retraining**: triggered by drift detection or scheduled weekly.

---

## Analyze — MLOps vs. DevOps

Same: CI/CD, monitoring, incident response, versioning.
Different: ML adds data pipelines (DevOps doesn't deal with training data), model drift (code doesn't drift; models do), evaluation complexity (code is correct or not; models are "good enough" or not), and reproducibility challenges (the same code + same data should produce the same model, but GPU non-determinism can break this).

Traditional SREs often underestimate these differences. MLOps is a distinct discipline — not just "DevOps with models."

---

## Evaluate — invest in the pipes

The infrastructure is not the glamorous part — but it's where production AI lives or dies. A great model on bad infrastructure will fail. A mediocre model on great infrastructure will survive and improve. Invest in the pipes: they carry the water.

---

## Create — design the MLOps infrastructure for fraud detection

What compute (real-time for blocking, batch for analysis)? What registry? What pipeline? What monitoring? How do you handle the fact that fraud patterns change weekly?

Consider: fraud detection needs both real-time (block the transaction now) and batch (analyze patterns post-hoc). The real-time path has a 100ms budget. The batch path runs nightly. The registry tracks which model blocked which transaction (for audit). The monitoring tracks fraud rate, false positive rate, and drift.

---

## A common misconception

**"MLOps is just DevOps with models."** No. MLOps adds data pipelines, model drift, evaluation complexity, and reproducibility challenges that DevOps doesn't have. Treating ML like "just code" leads to models that degrade silently, can't be reproduced, and can't be rolled back safely.

---

## Explain it back

> "The three compute types are _____, _____, and _____. The three serving patterns are _____, _____, and _____. A model registry is _____. The deploy/monitor/retrain loop is _____. MLOps differs from DevOps because _____."

---

## References

- **Google (2020), "MLOps: Continuous delivery and automation pipelines in machine learning."** https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning
- **Databricks Engineering Blog.** https://www.databricks.com/blog/category/engineering
- **MLflow Documentation.** https://mlflow.org/docs/latest/
- **Kubeflow Documentation.** https://www.kubeflow.org/docs/
- **Sculley, D., et al. (2015), "Hidden Technical Debt in Machine Learning Systems," NeurIPS 2015.** https://proceedings.neurips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html
