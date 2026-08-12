---
chapter_id: "A.0"
title: "The Model That Got Worse on Monday"
topic: "The ML lifecycle"
track: ml
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 20
prerequisites: ["0.0", "0.1"]
teaching_goal: "Describe the data → training → serving → monitoring loop, explain why it's a loop not a line, and identify where each stage breaks."
status: stable
last_updated: 2026-08-12
---

# The Model That Got Worse on Monday

The model worked on Friday. By Monday, support tickets were spiking. The data science team swore nothing changed. They were right — and wrong. Nothing in the code changed. But the world did, and the model was about to teach everyone why ML is never "done."

This is the story that every ML engineer lives through eventually. You ship a model. It works. Weeks or months later, it stops working — silently, without any code change, without any deploy. The model didn't break. Reality drifted away from it. And nobody noticed until users complained.

This chapter is about the ML lifecycle — the loop that prevents this story from happening to you.

---

## Remember — name it

The ML lifecycle has four stages, and the critical insight is that it's a *loop*, not a line:

1. **Data collection** — gathering the raw material: user interactions, logs, third-party data, labels. 80% of ML work happens here. The data is the model's only source of truth about the world; if the data is wrong, everything downstream is wrong.
2. **Training** — the model learns patterns from historical data. The expensive offline phase. GPU clusters, distributed training (PyTorch DDP, DeepSpeed), experiment tracking (MLflow, Weights & Biases). Training a large model can take hours to weeks and cost thousands of dollars.
3. **Serving (inference)** — the trained model receives requests and returns predictions. The online phase users feel. Latency matters (users won't wait 5 seconds for a recommendation), throughput matters (the system handles thousands of requests per second), and the model must be versioned (you need to know which model served which request, for debugging).
4. **Monitoring** — tracking the model's performance in production. Input distribution (has the data shifted?), output distribution (are predictions drifting?), ground-truth latency (how quickly do you learn whether predictions were right?), and business metrics (are users still engaging?).

**Why it's a loop:** monitoring reveals that the model is degrading. That triggers new data collection (label the recent inputs). That triggers retraining. That triggers a new deployment. The loop never stops — the question is whether you're driving it deliberately or being driven by it.

---

## Understand — explain it in plain words

### Stage 1: Data

Data is where 80% of ML work happens, and where 80% of ML problems originate. The data is the model's only source of truth about the world. If the data is biased, incomplete, stale, or mislabeled, the model will learn the wrong patterns — no amount of training will fix a data problem.

Common data issues:
- **Selection bias** — the training data doesn't represent the production population. You trained on daytime users; production has nighttime users who behave differently.
- **Label noise** — human labelers make mistakes. If 5% of labels are wrong, the model's accuracy ceiling is ~95%.
- **Data leakage** — features that won't be available at serving time sneak into training. You trained with "time to purchase" as a feature; at serving time, you don't know if the user will purchase.
- **Staleness** — the data is old. User behavior has shifted since the data was collected. The model learns yesterday's patterns.

Data quality is a system design problem, not just a data science problem. You need pipelines (Airflow, Dagster), validation (Great Expectations, pandas-profiling), and lineage tracking (what data went into which model?).

### Stage 2: Training

Training is where the model learns from data. The model is a function that maps inputs to outputs, and training is the process of finding the right parameters for that function.

Key concepts:
- **Loss function** — measures how wrong the model is. Training minimizes the loss. For classification: cross-entropy. For regression: mean squared error. For ranking: NDCG.
- **Optimization** — gradient descent and its variants (Adam, SGD with momentum). The learning rate is the most important hyperparameter — too high and training diverges, too low and it's slow.
- **Overfitting** — the model memorizes the training data but doesn't generalize to new data. Fix: regularization (dropout, L2), more data, early stopping.
- **Underfitting** — the model is too simple to capture the patterns. Fix: bigger model, more layers, train longer.

Training infrastructure: PyTorch (research-friendly, dynamic graphs), TensorFlow (production-friendly, static graphs), JAX (high-performance, functional). For distributed training: PyTorch DDP, DeepSpeed, FSDP. For experiment tracking: MLflow, Weights & Biases, Neptune.

Training a large model is expensive. A 70B parameter model takes ~1,000 GPU-hours on A100s. At ~$2/GPU-hour, that's ~$2,000 per training run. This is why teams experiment with smaller models first and only scale up when the architecture is proven.

### Stage 3: Serving

Serving is where the trained model meets real users. The model is deployed as a service that receives requests and returns predictions.

Key serving concerns:
- **Latency** — users won't wait. A recommendation must appear in <200ms. A search result in <100ms. An LLM response in <3 seconds. If the model is too slow, users abandon.
- **Throughput** — the system must handle peak load. Black Friday, product launch, viral moment. You need enough GPU/CPU capacity to handle spikes.
- **Versioning** — you need to know which model version served which request. If a user complains, you need to reproduce the exact prediction. Model registry (MLflow Model Registry, SageMaker Model Registry) tracks this.
- **A/B testing** — you don't just deploy a new model and hope. You A/B test it: 50% of traffic sees the old model, 50% sees the new. If the new model wins on business metrics, promote it. If not, roll back.

Serving infrastructure: TorchServe (PyTorch), TensorFlow Serving, Triton Inference Server (NVIDIA, multi-framework), Ray Serve, BentoML. For LLMs: vLLM, TGI (Text Generation Inference), TensorRT-LLM.

### Stage 4: Monitoring

Monitoring is the stage that catches the "Monday morning problem" before users do. Without monitoring, the model degrades silently — you only find out when business metrics drop.

What to monitor:
- **Input distribution** — has the data shifted? Track feature statistics over time. Use KL divergence, population stability index (PSI), or KS test. Alert when PSI > 0.2 (significant shift).
- **Output distribution** — are predictions drifting? If the model suddenly predicts more "positive" outcomes, something changed. Track the mean and variance of predictions over time.
- **Ground-truth latency** — how quickly do you learn whether predictions were right? For ads, you know if a click happened within seconds. For loan defaults, it takes months. Long latency means slow drift detection — you might not know the model degraded for 6 months.
- **Business metrics** — the ultimate signal. Engagement, conversion, revenue, churn. If these drop, something is wrong — even if model metrics look fine. Business metrics are the ground truth that model metrics approximate.

Monitoring infrastructure: Prometheus + Grafana (metrics), ELK stack (logs), Jaeger (traces), Arize (ML-specific), Evidently (drift detection).

---

## Apply — map the lifecycle to Netflix recommendations

1. **Data**: what you watched, when, how much, skipped or finished, device, time of day. Netflix collects billions of events per day.
2. **Training**: offline models learn "users who liked X also liked Y." Trained nightly on the previous day's data. Each training run takes hours on GPU clusters.
3. **Serving**: when you open the app, the model scores each candidate show in <100ms. Netflix serves millions of requests per second at peak.
4. **Monitoring**: Netflix tracks click-through rate, watch time, completion rate. If CTR drops, they investigate — is it the model, the content, or a bug?

The loop: your behavior on Monday becomes training data for the model that serves you on Wednesday. The model is never "done" — it's always being retrained on fresher data.

---

## Analyze — where the loop breaks

Each stage has characteristic failure modes:

- **Data → Training**: the data is biased, incomplete, or stale. The model learns the wrong patterns. Example: a hiring model trained on historical hiring data inherits historical biases.
- **Training → Serving**: training-serving skew. The features used at training time don't match what's available at serving time. The model performs differently in production than in offline tests. Example: training uses "user's full browsing history"; serving only has "last 5 pages."
- **Serving → Monitoring**: no logging, or logs that don't capture the right signals. You can't detect drift if you're not measuring it. Example: you log the model's prediction but not the input features, so you can't tell if the input distribution shifted.
- **Monitoring → Data**: you detect drift but have no pipeline to label new data and retrain. The loop stalls. Example: you know the model degraded, but labeling new data takes weeks of human effort.

Each break point is a common production failure. The lifecycle only works if all four stages are connected — and if the loop time (from detecting drift to deploying a fix) is short enough to matter.

---

## Evaluate — the loop time matters

The loop time — from detecting drift to deploying a fix — determines how much damage drift does. If your loop time is 1 day, drift is caught and fixed quickly. If your loop time is 1 month, the model degrades for a month before the fix ships.

Loop time depends on:
- **Data labeling speed** — how quickly can you label new data? Automated labeling (weak supervision, programmatic labeling) is faster than human labeling.
- **Training speed** — how long does a training run take? Smaller models train faster. Distributed training (multiple GPUs) speeds things up but costs more.
- **Deployment speed** — how quickly can you deploy a new model? CI/CD for ML (MLOps) automates this. Shadow deployment (run new model in parallel, compare) adds safety but takes time.
- **A/B test duration** — how long do you need to run the A/B test to reach statistical significance? For high-traffic features, days. For low-traffic features, weeks.

The best teams have loop times of hours to days. The worst have loop times of months. The difference is not the model — it's the pipeline.

---

## Create — design the ML lifecycle for a content moderation system

Design the full lifecycle for a content moderation system that classifies user-uploaded images as safe/unsafe/borderline.

Consider:
- What data do you collect? (images, user reports, moderator decisions)
- How often do you retrain? (daily? weekly? triggered by drift?)
- How do you serve? (real-time, batch, or streaming?)
- What do you monitor? (input distribution — image types; output distribution — classification rates; ground-truth — moderator decisions, which arrive hours later)
- Where could the loop break? (labeling bottleneck, training-serving skew, deployment risk)
- What's your loop time target? (for content moderation, you need fast iteration — new abuse patterns emerge daily)

The key challenge: "what's harmful" is a moving target. New abuse patterns emerge daily. Your model must adapt faster than the abusers. This is the adversarial drift problem — covered in chapter A.5 (Fraud Detection) and A.7 (Drift & Retraining).

---

## A common misconception

**"Once the model is trained, the work is done."** This is the most dangerous misconception in ML. The model is never done. The world changes, the data changes, the model degrades. The teams that succeed in ML are the ones that build the monitoring and retraining pipeline — not the ones that build the best model once. A mediocre model with a great pipeline will outperform a great model with no pipeline, because the first adapts and the second doesn't.

---

## Explain it back

> "The ML lifecycle has four stages: _____, _____, _____, and _____. It's a loop, not a line, because _____. The stage where 80% of the work happens is _____. The stage that catches the 'Monday morning problem' is _____. The loop time is _____, and it matters because _____. Without _____, the loop breaks."

---

## References

- **Sculley, D., et al. (2015), "Hidden Technical Debt in Machine Learning Systems," NeurIPS 2015.** The foundational paper on why ML systems are harder to maintain than to build. https://proceedings.neurips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html
- **Google Cloud (2020), "MLOps: Continuous delivery and automation pipelines in machine learning."** The canonical MLOps reference. https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning
- **Databricks Engineering Blog.** Production ML lifecycle patterns. https://www.databricks.com/blog/category/engineering
- **MLflow Documentation.** Open-source model registry and experiment tracking. https://mlflow.org/docs/latest/
- **Gama, J., et al. (2014), "A Survey on Concept Drift Aiming," ACM Computing Surveys 46(4):1-37.** The foundational survey on drift. https://dl.acm.org/doi/10.1145/2523813
