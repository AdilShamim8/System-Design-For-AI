---
chapter_id: "X.2"
title: "Confidently Wrong"
topic: "Reliability & safety"
track: cross-cutting
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 16
prerequisites: ["B.0", "B.8"]
teaching_goal: "Design reliability under model non-determinism: fallbacks, confidence thresholds, human-in-the-loop, and the confidently wrong failure mode."
status: stable
last_updated: "2026-08-12"
---

# Confidently Wrong

The model says it's 99% sure. It's wrong. The user trusts the 99%. The system has no fallback. This is the "confidently wrong" failure mode — the single most dangerous pattern in production AI, and the one traditional software reliability practices don't address.

---

## Remember

- **Non-determinism** — the same input can produce different outputs. Breaks traditional testing.
- **Calibration** — when the model says "90% confident," is it actually right 90% of the time? Often, no. Models are systematically overconfident (Guo et al., 2017).
- **Fallback** — what happens when the model is uncertain or fails. Static response, human handoff, retry.
- **Confidence threshold** — only auto-respond above X% confidence; below, escalate.
- **Human-in-the-loop** — the most reliable AI system is often one that knows when to ask a human.

---

## Understand — calibration

When the model says "90% confident," is it actually right 90% of the time? Often, no. Models are systematically overconfident — they say "99% confident" when they're right only 85% of the time. This is miscalibration.

A miscalibrated model that says "99% confident" on a wrong answer is the "confidently wrong" failure mode. Users trust confident answers. Downstream systems auto-act on them. A confidently wrong answer propagates faster and causes more harm than an obviously uncertain one.

**The fix:** measure calibration (predicted probabilities vs. actual accuracy, binned). Apply Platt scaling or isotonic regression as a post-hoc calibration layer. And set confidence thresholds — only auto-respond above 95%; below, escalate to a human.

---

## Apply — design reliability for a medical AI assistant

1. **Calibration**: measure predicted probabilities vs. actual accuracy. Apply Platt scaling if miscalibrated.
2. **Confidence threshold**: only auto-respond to administrative questions (scheduling, billing) above 95% confidence. Medical questions always go to a human.
3. **Fallback**: "I'm not qualified to answer this. Let me connect you with a doctor."
4. **Human-in-the-loop**: for any medical recommendation, a doctor reviews before it reaches the patient.
5. **Audit**: all interactions logged for review. Weekly sampling by medical professionals.

---

## Analyze — the "confidently wrong" detection

Detecting "confidently wrong" requires:
- **Calibration monitoring** — are predicted probabilities matching actual rates?
- **Output validation** — does the answer match ground truth?
- **Anomaly detection** — is this answer unusual for this query type?

---

## Evaluate — reliability in AI is about managing errors

Reliability in AI is not about eliminating errors — it's about *managing* them. The model will be wrong sometimes. The question is: when it's wrong, does the system fail gracefully (fallback, human review) or catastrophically (confident wrong answer reaches the user)?

---

## Create — design reliability for an AI-powered legal research tool

Lawyers use it to find relevant cases. What's your confidence threshold for "this case is relevant"? How do you handle subjective legal relevance? What's the fallback when the model is uncertain? When do you require human review?

---

## A common misconception

**"If the model is confident, it's probably right."** No. Models are systematically overconfident. Always calibrate, always set thresholds, always have a fallback.

---

## Explain it back

> "The 'confidently wrong' failure mode is _____. Calibration is _____. The four fallback types are _____, _____, _____, and _____. Human-in-the-loop is needed when _____. Reliability in AI is about _____, not _____."

---

## References

- **Guo, C., et al. (2017), "On Calibration of Modern Neural Networks," ICML 2017.** arXiv:1706.04599 — https://arxiv.org/abs/1706.04599
- **Platt, J. C. (1999), "Probabilistic Outputs for Support Vector Machines."** Platt scaling. https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/platt-proba.pdf
- **Air Canada Chatbot Case (2024), *Moffatt v. Air Canada*, 2024 BCCRT 149.** https://decisions.civlresolutiontb.ca/crt/crtd/en/item/522164/index.do
