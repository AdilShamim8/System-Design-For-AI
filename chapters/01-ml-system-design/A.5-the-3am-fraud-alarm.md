---
chapter_id: "A.5"
title: "The 3am Fraud Alarm"
topic: "Fraud & anomaly detection"
track: ml
bloom_stage: ["apply", "evaluate"]
est_read_minutes: 17
prerequisites: ["A.0"]
teaching_goal: "Design a fraud detection system with streaming and batch components, and reason about the precision/recall tradeoff."
primary_diagram: assets/diagrams/A.5/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The 3am Fraud Alarm

3:14 AM. Your phone buzzes. 'Did you just attempt a $4,200 purchase in another country?' You didn't. The card gets frozen. The fraud team catches it before you even knew it was happening. That 30-second decision — block or allow — is the entire art of fraud detection.

---

## Remember

**Streaming fraud detection** — real-time, milliseconds, blocks transactions before they complete. **Batch fraud detection** — post-hoc, hours/days, catches patterns streaming can't see. **Precision/recall tradeoff** — false positives (blocking legitimate transactions) vs. false negatives (letting fraud through). **Adversarial drift** — fraudsters adapt to your models, so your models must adapt faster.

---

## Understand

Fraud detection operates at two speeds, and both are necessary.

**Streaming (real-time, <100ms).** When a transaction happens, the system must decide: allow, block, or escalate to manual review. Features are extracted in milliseconds (user's transaction history, geographic patterns, device fingerprint, merchant category). The model scores the transaction. A decision is made. This catches 'obvious' fraud — a card used in two countries within an hour, a transaction 10x the user's average.

**Batch (post-hoc, hours/days).** Some fraud patterns only emerge over time. A fraud ring might make small, legitimate-looking transactions across thousands of accounts over weeks, then drain them all at once. Streaming can't see this; batch analysis can. Graph algorithms detect networks of connected accounts. Anomaly detection finds outliers in multi-day patterns.

**The precision/recall knife-edge.** False positives are a UX emergency — blocking a legitimate transaction angers customers and costs business. False negatives are a money emergency — letting fraud through loses money and erodes trust. There's no 'right' balance; it depends on the cost of each error type. For a $5 transaction, err toward allowing (low cost of fraud). For a $50,000 wire transfer, err toward blocking (high cost of fraud).

**Adversarial drift.** Fraudsters study your models. If you block transactions from new devices, they'll use device fingerprint spoofing. If you block based on geography, they'll use VPNs. Your model must adapt faster than the fraudsters adapt to it. This is an arms race, and the retraining cadence is your weapon.

---

## Apply

Design fraud detection for a payment processor:
1. **Streaming layer**: feature extraction (user history, merchant risk, device, geography) → model inference (GBT or neural net) → decision (allow/block/review) → <100ms.
2. **Batch layer**: nightly graph analysis (connected components of suspicious accounts), anomaly detection (statistical outliers in transaction patterns), model retraining with labeled fraud data.
3. **Human review**: borderline cases escalated to analysts who decide within 24 hours.
4. **Feedback loop**: confirmed fraud labels feed back into training data for the next model.

---

## Analyze

The cost asymmetry drives the design. If false positives cost $10 each (customer service, churn) and false negatives cost $500 each (fraud loss), the optimal threshold favors blocking more. If the costs are reversed (high-value customers who churn on false positives), the threshold favors allowing more. The threshold isn't a technical decision — it's a business decision, made with the CFO.

---

## Evaluate

How do you know if fraud detection is working? **Fraud rate** (fraud $ / total $) — should trend down. **False positive rate** — should be low enough not to anger customers. **Catch rate** (fraud caught / total fraud) — should be high. **Time to detection** — should be fast (seconds for streaming, hours for batch). The challenge: you only know about fraud you caught or that was reported. Unreported fraud is invisible — and may be the biggest category.

---

## Create

Design fraud detection for a crypto exchange. Transactions are irreversible (no chargebacks). Users are pseudonymous. How do you balance privacy with fraud prevention? What features matter most? How do you handle the adversarial drift when fraudsters can create new wallets instantly?

---

## A common misconception

**'If the model is good enough, we can fully automate fraud decisions.'** No. Even the best models have uncertain cases. The question isn't 'automate or not' — it's 'what threshold do we automate above, and what goes to human review?' High-confidence fraud: auto-block. High-confidence legitimate: auto-allow. The uncertain middle: human review. The system designer's job is to set the thresholds so humans see the right cases, not all cases.

---

## Explain it back

Fraud detection operates at two speeds: _____ (real-time, _____) and _____ (post-hoc, _____). The precision/recall tradeoff is between _____ and _____. False positives are bad because _____; false negatives are bad because _____. The optimal threshold depends on _____.

---

## Further reading

- **Stripe Engineering Blog** — fraud detection at scale.
- **PayPal Engineering Blog** — real-time fraud detection patterns.
- **Bolton & Hand (2002), "Statistical Fraud Detection: A Review," Statistical Science** — the foundational academic survey.
