# Lab a7 — Dataset: Adult (reused) + manufactured shift

Full card in [`datasets/tabular-classification.md`](../../../datasets/tabular-classification.md). This lab reuses Lab a1's dataset and model — no new download.

**Why simulate drift instead of finding a drifted dataset?** Because a manufactured incident is *labeled*: you know exactly what changed (education mix, hours, a renamed category), so you can grade your detector against ground truth. Real drift incidents come unlabeled — which is the production experience the lab's Part 3 decision table prepares you for.

**The three injected shifts (make sure you can name them cold):**

1. **Education mix shift** — 25% of rows re-labeled "Bachelors": a *gradual world change* proxy (educational attainment rose over decades). Categorical PSI catches it.
2. **Hours reduction** — 30% of rows scaled ×0.8: a *recession* proxy. Numeric PSI + KS catch it; the *shape* changes (mass piles at 40 → spreads lower).
3. **Category rename** — "Private" → "Private-sector": a *pipeline bug* proxy. PSI screams; the correct response is a data fix, not a model retrain. This one exists to teach you that **drift detection cannot diagnose cause — only you can.**

**If you want real (not simulated) drift in a second pass:** the Elliptic bitcoin dataset (see [`datasets/fraud-anomaly.md`](../../../datasets/fraud-anomaly.md)) is time-stamped in waves with real concept drift — train on early waves, test on later ones, and run this lab's detector on the transition. Expect genuinely humbling results.

**License:** as Lab a1 (open, US Census-derived).
