---
chapter_id: "A.6"
title: "Two Models Walk Into Production"
topic: "A/B testing & offline/online evaluation"
track: ml
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 16
prerequisites: ["A.0", "A.2"]
teaching_goal: "Design an A/B test for an ML system, explain why offline metrics lie, and avoid the new model won offline trap."
status: stable
last_updated: "2026-08-12"
---

# Two Models Walk Into Production

The new model wins on every offline metric. AUC up 3%. Log loss down. You ship it. A week later, business metrics are down. The new model was better on paper and worse in production. Welcome to the gap between offline and online.

---

## Remember

- **Offline evaluation** — metrics computed on historical data (AUC, log loss, precision/recall).
- **Online evaluation** — A/B testing on real users. The only honest test.
- **Feedback effects** — the model's predictions change user behavior, which changes the data distribution.
- **Novelty effects** — users respond to new recommendations differently at first, then settle.
- **Simpson's paradox** — a trend appears in aggregate but reverses in subgroups.

---

## Understand — why offline metrics lie

Offline metrics measure the past. You trained on historical data; you evaluate on held-out historical data. The model looks great. But the past isn't the future, for three reasons:

1. **Distribution shift** — production data differs from training data. New users, new behavior, new content.
2. **Feedback effects** — the model's predictions change what users see, which changes what they click, which changes the data you collect. A feedback loop.
3. **Novelty effects** — users respond to novelty. A new model shows different recommendations; users click more because it's new, not because it's better. After two weeks, novelty wears off.

**A/B testing** is the only honest test. Split traffic: 50% control (old model), 50% treatment (new model). Measure business metrics for both groups over a statistically meaningful period. If treatment wins, ship it. If not, don't — regardless of offline metrics.

---

## Apply — design an A/B test

1. **Hypothesis**: the new model increases CTR by 2%.
2. **Sample size**: for a 2% effect on a 5% baseline CTR, you need ~1M impressions per group to reach statistical significance.
3. **Duration**: at least 2 weeks (to capture weekly cycles and let novelty effects settle).
4. **Metrics**: primary (CTR), secondary (watch time, retention, revenue), guardrail (latency, error rate).
5. **Decision rule**: ship if primary improves by >=2% with p<0.05, and no guardrail regresses.

---

## Analyze — common A/B test pitfalls

- **Underpowered tests**: too few users to detect a real effect. You conclude "no difference" when there is one.
- **Peeking**: checking results early and stopping if they look good. Inflates false positive rate.
- **Multiple testing**: testing many metrics, finding one that's "significant" by chance.
- **Simpson's paradox**: the new model wins in aggregate but loses in every subgroup. Always segment by user type.

---

## Evaluate — when offline and online disagree

Trust online — but understand *why* they disagree. Was it distribution shift? Feedback effects? Novelty? Miscalibration? The investigation teaches you what to fix in the next iteration.

---

## Create — design an A/B test for a new search ranking model

What's your hypothesis? How do you handle subjective search quality? How do you detect novelty effects? What if the new model is better for head queries but worse for tail queries?

---

## A common misconception

**"If the model wins on offline metrics, it's better."** This is the most expensive misconception in ML. Offline metrics measure the past; production lives in the present.

---

## Explain it back

> "Offline metrics lie because _____, _____, and _____. A/B testing works by _____. The common pitfalls are _____, _____, and _____. When offline and online disagree, I should _____."

---

## References

- **Kohavi, R., Tang, D., & Xu, Y. (2020), *Trustworthy Online Controlled Experiments*, Cambridge University Press.** https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/
- **Netflix Tech Blog.** A/B testing methodology at scale. https://netflixtechblog.com/
- **Gomez-Uribe, C. A., & Hunt, N. (2015), "The Netflix Recommender System," ACM TMIS.** https://dl.acm.org/doi/10.1145/2843948
