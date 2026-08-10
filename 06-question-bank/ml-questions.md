# ML System Design — Questions

## Q-ML-1 — The Stale Podcast Homepage

**Scenario:** You're a new engineer at a podcast app with 500K podcasts and 1M users. The "For You" row has 10 slots and a 300ms budget. The existing system was built 3 years ago using a single collaborative-filtering model, and engagement has been declining for two quarters.

**Track:** ml | **Difficulty:** medium | **Read first:** A.2

**Your task:** Walk through your redesign. What questions do you ask first? What does the new architecture look like?

### Worked answer

Start by *not* reaching for a model. Diagnose first: why is engagement declining? Has candidate generation stopped surfacing relevant podcasts? Has ranking gotten worse? Has the user base shifted?

Then redesign toward the three-stage pattern (Covington et al., 2016): candidate generation (blended sources), ranking (a model that scores each candidate), re-ranking (diversity, freshness). Validate with an A/B test — offline metrics will lie. Build drift detection to prevent the next two-year decline.

---

## Q-ML-2 — The 10ms Ad Bid

**Scenario:** You're designing CTR prediction for real-time bidding. 10ms from ad slot available to bid submission. The model has 80% AUC offline but the business suspects miscalibration — bids too aggressive on cheap inventory.

**Track:** ml | **Difficulty:** hard | **Read first:** A.2, A.4

### Worked answer

Two problems: calibration and latency. Tackle calibration first — AUC measures ranking, not calibration. Compute calibration curves, apply Platt scaling. Then optimize latency: GBT instead of neural net, pre-compute features in a feature store. Fix calibration first (one-day fix, biggest business impact), then latency.

---

## Q-ML-3 — The Fraud Surge

**Scenario:** 3x spike in fraud losses over a weekend. The fraud detection model is still running, still producing scores, but scores don't correlate with actual fraud anymore.

**Track:** ml | **Difficulty:** hard | **Read first:** A.5, A.7

### Worked answer

This is drift. First hour: contain — tighten thresholds, escalate to manual review, look at the actual transactions. First day: diagnose — concept drift (relationship changed) or data drift (input distribution changed)? Longer-term: build drift detection (input, output, ground-truth latency), retraining pipeline triggered by drift, champion/challenger setup.
