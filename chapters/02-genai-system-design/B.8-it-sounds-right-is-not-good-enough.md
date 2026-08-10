---
chapter_id: "B.8"
title: '"It Sounds Right" Is Not Good Enough'
topic: "GenAI evaluation"
track: genai
bloom_stage: ["evaluate", "create"]
est_read_minutes: 17
prerequisites: ["B.0", "B.2"]
teaching_goal: "Design a GenAI evaluation strategy combining human eval, LLM-as-judge, and regression suites, and explain why 'vibes' ship broken products."
primary_diagram: assets/diagrams/B.8/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# "It Sounds Right" Is Not Good Enough

You read the LLM's output. It sounds right. It looks right. You ship it. Three weeks later, a user finds it confidently explaining that the capital of France is London. 'Sounds right' is not an evaluation. This chapter is about building one.

---

## Remember

**Human evaluation** — humans rate LLM outputs. Gold standard, expensive, slow. **LLM-as-judge** — a frontier LLM grades outputs of a smaller LLM. Cheap, fast, biased. **Regression suite** — a fixed set of test queries with known-good answers, run on every change. **Multi-dimensional eval** — factuality, helpfulness, safety, tone — one score is never enough. **RAGAS** — a framework for evaluating RAG systems (faithfulness, answer relevance, context precision, context recall).

---

## Understand

GenAI evaluation is hard because outputs are open-ended. For traditional ML, you have ground truth: did the model predict the right label? For GenAI, what's the 'correct' answer to 'write a summary of this article'? Multiple valid answers exist, quality is subjective, and ground truth is expensive to obtain.

**Human evaluation.** The gold standard. Humans rate outputs on dimensions like factuality, helpfulness, safety, and tone. Expensive ($1-10 per evaluation), slow (days to weeks), but the most reliable. Use for: high-stakes applications (medical, legal), final validation before launch, and calibrating automated eval methods.

**LLM-as-judge.** Use a frontier LLM (Claude Opus, GPT-4) to grade outputs of a smaller LLM (Haiku, 4o-mini). Cheap, fast, scalable. But biased: the judge may prefer outputs from models similar to itself, may be fooled by confident-sounding wrong answers, and may not align with human preferences. Use for: rapid iteration, regression testing, initial filtering. Always calibrate against human eval.

**Regression suite.** A fixed set of 50-500 test queries with known-good answers. Run on every prompt change, model change, or retrieval change. If a change makes any test case worse, block the deploy. This is CI/CD for prompts — the discipline that separates demos from products.

**Multi-dimensional evaluation.** One score is never enough. An answer can be factual but unhelpful, helpful but unsafe, safe but wrong. Evaluate on multiple dimensions: factuality (is it true?), helpfulness (does it answer the question?), safety (is it harmful?), tone (is it appropriate?). Weight the dimensions by what matters for your use case.

**RAGAS (for RAG systems).** A framework that measures: faithfulness (is the answer grounded in retrieved context?), answer relevance (does it address the question?), context precision (were retrieved chunks relevant?), context recall (did we retrieve the chunks needed?). These metrics let you iterate on RAG without a human in the loop for every change.

---

## Apply

Build an evaluation pipeline for a customer support bot:
1. **Regression suite**: 200 test queries with known-good answers. Run on every deploy.
2. **LLM-as-judge**: Claude Opus grades outputs on factuality, helpfulness, tone. Run on a sample of production traffic daily.
3. **Human eval**: 50 random outputs per week, rated by the support team. Calibrate the LLM-as-judge against this.
4. **Production monitoring**: track user feedback (thumbs up/down), escalation rate (how often users ask for a human), and resolution rate.

This gives you: pre-deploy quality gate (regression), daily quality monitoring (LLM-as-judge), ground-truth calibration (human eval), and real-world signal (production metrics).

---

## Analyze

The 'vibes' failure mode: humans are systematically miscalibrated about LLM quality. We're impressed by confident, well-written answers — even when they're wrong. We're harsh on poorly formatted answers — even when they're correct. Human gut feelings about LLM quality are not reliable. This is why structured evaluation (with dimensions, rubrics, and ground truth) matters. 'It sounds right' is how you ship the capital of France is London.

---

## Evaluate

Evaluation is not a one-time activity — it's a continuous discipline. Build the eval suite once, run it on every change, and track metrics over time. If quality degrades (because the model changed, the data drifted, or the prompt was tweaked), the eval suite catches it before users do. Without continuous evaluation, you're flying blind — hoping the system still works, with no way to know.

---

## Create

Design an evaluation strategy for a legal research assistant. The stakes are high (wrong advice has legal consequences). What dimensions do you evaluate? How do you get ground truth? How do you handle the fact that legal answers often have nuance ('it depends on jurisdiction')? What's your acceptable error rate?

---

## A common misconception

**'If the demo looks good, it's ready for production.'** No. Demos are cherry-picked. Production is the long tail of edge cases, ambiguous queries, and adversarial inputs. The demo looking good means the system works on the examples you showed. It says nothing about the 10,000 queries you didn't show. Only an evaluation suite — run on a representative sample — tells you if it's production-ready.

---

## Explain it back

GenAI evaluation is hard because _____. The four methods are _____, _____, _____, and _____. LLM-as-judge is biased because _____. A regression suite is _____. The 'vibes' failure mode is _____. Evaluation is not one-time; it's _____.

---

## Further reading

- **Es et al. (2023), "RAGAS: Automated Evaluation of Retrieval Augmented Generation," arXiv** — the RAGAS framework.
- **Zheng et al. (2023), "Judging LLM-as-a-Judge with MT-Bench," NeurIPS** — on LLM-as-judge biases.
- **TruLens documentation** — another RAG evaluation framework.
- **Hendrycks et al. (2021), "Measuring Massive Multitask Language Understanding" (MMLU)** — a benchmark for LLM evaluation.
