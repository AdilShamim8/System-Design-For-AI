---
chapter_id: "A.5"
title: "The 3am Fraud Alarm"
topic: "Fraud & anomaly detection"
track: ml
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 17
prerequisites: ["A.0"]
teaching_goal: "Design a fraud detection system with streaming and batch components, and reason about the precision/recall tradeoff in a UX context."
status: stable
last_updated: 2026-08-12
---

# The 3am Fraud Alarm

3:14 AM. Your phone buzzes. "Did you just attempt a $4,200 purchase in another country?" You didn't. The card gets frozen. The fraud team catches it before you even knew it was happening. That 30-second decision — block or allow — is the entire art of fraud detection.

Fraud detection operates at two speeds: streaming (real-time, milliseconds, blocks transactions before they complete) and batch (post-hoc, hours/days, catches patterns streaming can't see). Both are necessary, and the design challenge is balancing them.

---

## Remember — name it

- **Streaming fraud detection** — real-time, <100ms, blocks transactions before they complete. Feature extraction + model inference + decisioning, all in milliseconds.
- **Batch fraud detection** — post-hoc, hours/days, catches patterns streaming can't see. Graph analysis, network detection, statistical anomalies.
- **Precision/recall tradeoff** — false positives (blocking legitimate transactions) vs. false negatives (letting fraud through). The knife-edge.
- **Adversarial drift** — fraudsters adapt to your models. Your models must adapt faster. An arms race.

---

## Understand — two speeds of fraud

**Streaming (real-time, <100ms):** when a transaction happens, the system must decide: allow, block, or escalate to manual review. Features are extracted in milliseconds (user's transaction history, geographic patterns, device fingerprint, merchant category). The model scores the transaction. A decision is made.

This catches "obvious" fraud — a card used in two countries within an hour, a transaction 10x the user's average, a new device fingerprint.

**Batch (post-hoc, hours/days):** some fraud patterns only emerge over time. A fraud ring might make small, legitimate-looking transactions across thousands of accounts over weeks, then drain them all at once. Streaming can't see this; batch analysis can. Graph algorithms detect networks of connected accounts. Anomaly detection finds outliers in multi-day patterns.

---

## Apply — design fraud detection for a payment processor

1. **Streaming layer**: feature extraction (user history, merchant risk, device, geography) → model inference (GBT or neural net) → decision (allow/block/review) → <100ms.
2. **Batch layer**: nightly graph analysis (connected components of suspicious accounts), anomaly detection (statistical outliers in transaction patterns), model retraining with labeled fraud data.
3. **Human review**: borderline cases escalated to analysts who decide within 24 hours.
4. **Feedback loop**: confirmed fraud labels feed back into training data for the next model.

**The cost asymmetry:** if false positives cost $10 each (customer service, churn) and false negatives cost $500 each (fraud loss), the optimal threshold favors blocking more. If the costs are reversed (high-value customers who churn on false positives), the threshold favors allowing more. The threshold isn't a technical decision — it's a business decision, made with the CFO.

---

## Analyze — adversarial drift

Fraudsters study your models. If you block transactions from new devices, they'll use device fingerprint spoofing. If you block based on geography, they'll use VPNs. Your model must adapt faster than the fraudsters adapt to it. This is an arms race, and the retraining cadence is your weapon.

**Retraining cadence:** weekly for streaming models (fraud patterns shift fast). Monthly for batch models (graph patterns shift slower). Triggered retraining when a new fraud pattern is detected (labeled data from the fraud team).

---

## Evaluate — the human-in-the-loop

Even the best models have uncertain cases. The question isn't "automate or not" — it's "what threshold do we automate above, and what goes to human review?"

- **High-confidence fraud**: auto-block. No human needed.
- **High-confidence legitimate**: auto-allow. No human needed.
- **The uncertain middle**: human review. Analysts decide within 24 hours.

The system designer's job is to set the thresholds so humans see the right cases, not all cases. Too low a threshold → humans are overwhelmed. Too high → fraud slips through.

---

## Create — design fraud detection for a crypto exchange

Transactions are irreversible (no chargebacks). Users are pseudonymous. How do you balance privacy with fraud prevention? What features matter most? How do you handle the adversarial drift when fraudsters can create new wallets instantly?

Consider: crypto fraud is harder because transactions can't be reversed (no chargeback), users are pseudonymous (no credit history), and wallets can be created instantly (no account age signal). The features that work in traditional payments (account age, transaction history, geographic patterns) may not apply. You need different signals: on-chain analysis (wallet connections, transaction graphs), behavioral biometrics, and real-time risk scoring.

---

## A common misconception

**"If the model is good enough, we can fully automate fraud decisions."** No. Even the best models have uncertain cases. The question isn't "automate or not" — it's "what threshold do we automate above, and what goes to human review?"

---

## Explain it back

> "Fraud detection operates at two speeds: _____ (real-time, _____) and _____ (post-hoc, _____). The precision/recall tradeoff is between _____ and _____. False positives are bad because _____; false negatives are bad because _____. The optimal threshold depends on _____."

---

## References

- **Bolton, R. J., & Hand, D. J. (2002), "Statistical Fraud Detection: A Review," Statistical Science 17(3):235-255.** The foundational academic survey. https://projecteuclid.org/euclid.ss/1042727934
- **Stripe Radar Documentation.** Fraud detection in production. https://stripe.com/docs/radar
- **PayPal Engineering Blog.** Real-time fraud detection patterns. https://www.paypal-engineering.com/
- **Gama, J., et al. (2014), "A Survey on Concept Drift Aiming," ACM Computing Surveys 46(4).** https://dl.acm.org/doi/10.1145/2523813
