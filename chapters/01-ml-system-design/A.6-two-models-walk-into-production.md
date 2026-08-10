---
chapter_id: "A.6"
title: "Two Models Walk Into Production"
topic: "A/B testing & offline/online evaluation"
track: ml
bloom_stage: ["analyze", "evaluate"]
est_read_minutes: 16
prerequisites: ["A.0", "A.2"]
teaching_goal: "Design an A/B test for an ML system, explain why offline metrics lie, and avoid the 'new model won offline' trap."
primary_diagram: assets/diagrams/A.6/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# Two Models Walk Into Production

The new model wins on every offline metric. AUC up 3%. Log loss down. You ship it. A week later, business metrics are down. The new model was better on paper and worse in production. Welcome to the gap between offline and online — the place where good data scientists go to get humbled.

---

## Remember

**Offline evaluation** — metrics computed on historical data (AUC, log loss, precision/recall). **Online evaluation** — A/B testing on real users. **Feedback effects** — the model's predictions change user behavior, which changes the data distribution. **Novelty effects** — users respond to new recommendations differently at first, then settle. **Simpson's paradox** — a trend appears in aggregate but reverses in subgroups.

---

## Understand

Offline metrics measure the past. You trained on historical data; you evaluate on held-out historical data. The model looks great. But the past isn't the future, for three reasons:

**1. Distribution shift.** The production data distribution differs from the training distribution. New users arrive. User behavior changes. The model was optimized for yesterday's data; today's data is different.

**2. Feedback effects.** The model's predictions change what users see, which changes what they click, which changes the data you collect. A model that recommends more engaging content gets more engagement data, which makes it look better — even if the underlying quality is the same. This is a feedback loop, and it can make a worse model look better online.

**3. Novelty effects.** Users respond to novelty. A new model shows different recommendations; users click more because it's new, not because it's better. After two weeks, the novelty wears off, and the new model might be worse than the old one. Offline metrics can't detect this.

**A/B testing** is the only honest test. Split traffic: 50% sees the old model (control), 50% sees the new model (treatment). Measure business metrics (clicks, revenue, retention) for both groups over a statistically meaningful period. If treatment wins, ship it. If not, don't — regardless of what offline metrics said.

---

## Apply

Design an A/B test for a new recommendation model:
1. **Hypothesis**: the new model increases click-through rate by 2%.
2. **Sample size**: compute from the expected effect size and variance. For a 2% effect on a 5% baseline CTR, you need ~1M impressions per group to reach statistical significance.
3. **Duration**: at least 2 weeks, to capture weekly cycles and let novelty effects settle.
4. **Metrics**: primary (CTR), secondary (watch time, retention, revenue), guardrail (latency, error rate — don't let the new model be slower).
5. **Decision rule**: ship if primary metric improves by ≥2% with p<0.05, and no guardrail metric regresses.

---

## Analyze

Common A/B test pitfalls:
- **Underpowered tests**: too few users to detect a real effect. You conclude 'no difference' when there is one.
- **Peeking**: checking results early and stopping if they look good. Inflates false positive rate.
- **Multiple testing**: testing many metrics, finding one that's 'significant' by chance.
- **Simpson's paradox**: the new model wins in aggregate but loses in every subgroup (or vice versa). Always segment by user type.
- **Selection bias**: the users in the test aren't representative of all users.

Each pitfall can make a bad model look good (or a good model look bad). The discipline of A/B testing is as much about avoiding these traps as it is about running the test.

---

## Evaluate

When offline and online disagree, trust online — but understand *why* they disagree. If the new model won offline but lost online, investigate: was it distribution shift? Feedback effects? Novelty? Miscalibration? The investigation teaches you what to fix in the next iteration. Blindly trusting offline metrics ships broken models; blindly trusting online metrics without understanding misses the lesson.

---

## Create

Design an A/B test for a new search ranking model. What's your hypothesis? How do you handle the fact that search quality is subjective? How do you detect novelty effects? What if the new model is better for head queries but worse for tail queries — do you ship it?

---

## A common misconception

**'If the model wins on offline metrics, it's better.'** This is the most expensive misconception in ML. Offline metrics measure the past; production lives in the present. The gap between them is where surprises live — and where careers are made or broken. The only honest test is an A/B test on real users.

---

## Explain it back

Offline metrics lie because _____, _____, and _____. A/B testing works by _____. The common pitfalls are _____, _____, and _____. When offline and online disagree, I should _____, not _____.

---

## Further reading

- **Kohavi, Tang & Xu (2020), *Trustworthy Online Controlled Experiments*** — the canonical A/B testing textbook.
- **Netflix Tech Blog** — A/B testing methodology at scale.
- **Gomez-Uribe & Hunt (2015), "The Netflix Recommender System"** — Netflix's offline/online philosophy.
