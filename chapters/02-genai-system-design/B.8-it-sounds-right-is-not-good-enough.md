---
chapter_id: "B.8"
title: "It Sounds Right Is Not Good Enough"
topic: "GenAI evaluation"
track: genai
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 17
prerequisites: ["B.0", "B.2"]
teaching_goal: "Design a GenAI evaluation strategy combining human eval, LLM-as-judge, and regression suites, and explain why vibes ship broken products."
status: stable
last_updated: "2026-08-12"
---

# "It Sounds Right" Is Not Good Enough

You read the LLM's output. It sounds right. It looks right. You ship it. Three weeks later, a user finds it confidently explaining that the capital of France is London. "Sounds right" is not an evaluation. This chapter is about building one.

---

## Remember

- **Human evaluation** — humans rate LLM outputs. Gold standard, expensive ($1-10 per eval), slow.
- **LLM-as-judge** — a frontier LLM grades outputs of a smaller LLM. Cheap, fast, biased.
- **Regression suite** — a fixed set of test queries with known-good answers. Run on every change. CI/CD for prompts.
- **Multi-dimensional eval** — factuality, helpfulness, safety, tone. One score is never enough.
- **RAGAS** — a framework for evaluating RAG systems (faithfulness, answer relevance, context precision, context recall).

---

## Understand — why GenAI eval is hard

For traditional ML, you have ground truth: did the model predict the right label? For GenAI, what's the "correct" answer to "write a summary of this article"? Multiple valid answers exist, quality is subjective, and ground truth is expensive to obtain.

**Human evaluation** is the gold standard but expensive and slow. **LLM-as-judge** is cheap and fast but biased (the judge may prefer outputs from similar models, may be fooled by confident-sounding wrong answers). **Regression suites** are the CI/CD for prompts — a fixed set of test queries run on every change.

**Multi-dimensional evaluation:** one score is never enough. An answer can be factual but unhelpful, helpful but unsafe, safe but wrong. Evaluate on multiple dimensions: factuality (is it true?), helpfulness (does it answer the question?), safety (is it harmful?), tone (is it appropriate?).

---

## Apply — build an evaluation pipeline

1. **Regression suite**: 200 test queries with known-good answers. Run on every deploy.
2. **LLM-as-judge**: Claude Opus grades outputs on factuality, helpfulness, tone. Run on 1% of production traffic daily.
3. **Human eval**: 50 random outputs per week, rated by the support team. Calibrate the LLM-as-judge.
4. **Production monitoring**: track user feedback (thumbs up/down), escalation rate, resolution rate.

---

## Analyze — the "vibes" failure mode

Humans are systematically miscalibrated about LLM quality. We're impressed by confident, well-written answers — even when they're wrong. We're harsh on poorly formatted answers — even when they're correct. "It sounds right" is how you ship the capital of France is London.

---

## Evaluate — evaluation is continuous

Evaluation is not a one-time activity — it's a continuous discipline. Build the eval suite once, run it on every change, track metrics over time. If quality degrades, the eval suite catches it before users do.

---

## Create — design an evaluation strategy for a legal research assistant

The stakes are high (wrong advice has legal consequences). What dimensions do you evaluate? How do you get ground truth? How do you handle legal nuance ("it depends on jurisdiction")? What's your acceptable error rate?

---

## A common misconception

**"If the demo looks good, it's ready for production."** No. Demos are cherry-picked. Production is the long tail of edge cases.

---

## Explain it back

> "GenAI evaluation is hard because _____. The four methods are _____, _____, _____, and _____. LLM-as-judge is biased because _____. The 'vibes' failure mode is _____. Evaluation is not one-time; it's _____."

---

## References

- **Es, S., et al. (2023), "RAGAS," arXiv:2309.15217.** https://arxiv.org/abs/2309.15217
- **Zheng, L., et al. (2023), "Judging LLM-as-a-Judge with MT-Bench," NeurIPS 2023.** arXiv:2306.05685 — https://arxiv.org/abs/2306.05685
- **Hendrycks, D., et al. (2021), "Measuring Massive Multitask Language Understanding" (MMLU), ICLR 2021.** arXiv:2009.03300 — https://arxiv.org/abs/2009.03300
- **TruLens Documentation.** https://www.trulens.org/
