---
chapter_id: "B.6"
title: "Picking the Brain You Can Afford"
topic: "Model selection & cost tradeoffs"
track: genai
bloom_stage: ["evaluate", "create"]
est_read_minutes: 18
prerequisites: ["B.0", "X.4"]
teaching_goal: "Design a model selection strategy across capability tiers, with routing, caching, and prompt caching, and forecast the bill."
primary_diagram: assets/diagrams/B.6/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# Picking the Brain You Can Afford

You have five models to choose from. The biggest is 10x smarter and 20x more expensive. The smallest is 10x cheaper and barely passes the bar. Picking the right one — per request, per user, per task — is the difference between a sustainable business and a $47K surprise bill.

---

## Remember

**Capability tiers**: frontier (Claude Opus, GPT-4, Gemini Ultra), mid (Claude Sonnet, GPT-4o, Gemini Pro), small (Claude Haiku, GPT-4o-mini, Gemini Flash). **Model routing**: sending easy requests to small models, hard requests to large. **Prompt caching**: 90% discount on stable prompt prefixes. **Semantic caching**: serving repeated queries from cache. **Forecasting**: per-request cost × expected volume = monthly bill.

---

## Understand

The LLM market in 2026 has a 30x cost range: from Gemini Flash at $0.075/1M input to Claude Opus at $15/1M input. This range is the biggest lever in AI system design. Choosing the right model per request — not globally — is how you build a sustainable unit economics.

**The capability ladder:**
- **Frontier** (Claude Opus, GPT-4): best quality, highest cost. Use for: complex reasoning, high-stakes decisions, tasks where quality matters more than cost.
- **Mid** (Claude Sonnet, GPT-4o): good quality, moderate cost. Use for: most production tasks, customer-facing applications.
- **Small** (Haiku, 4o-mini, Flash): adequate quality, lowest cost. Use for: simple Q&A, classification, routing, high-volume tasks.

**Model routing.** Not every request needs a frontier model. 'Hi' doesn't need GPT-4. A classifier decides: easy → small model, hard → large model. Route 70-80% to small, 20-30% to large. Overall cost drops 5-10x with minimal quality loss.

**Prompt caching.** If your system prompt is the same on every request (and it should be), use your provider's prompt caching for a 90% discount on that portion. This is free money — no quality loss, just lower cost. See X.4 for the math.

**Semantic caching.** Embed each query. Before calling the LLM, check if a similar query is in cache (cosine similarity > 0.95). If yes, return the cached answer. For customer support, 40-60% of queries are repeats. Another free money lever.

**Forecasting.** Before launch, compute: expected daily requests × average tokens per request × cost per token = daily cost. Multiply by 30 for monthly. Add a 2x safety margin for unexpected traffic. If the number scares you, optimize before launching, not after.

---

## Apply

Forecast the bill for a customer support bot:
- 50,000 conversations/month, average 8 turns, 500 input + 200 output tokens per turn.
- Claude 3.5 Sonnet ($3/1M input, $15/1M output).
- Per conversation: (8 × 500 × $3/1M) + (8 × 200 × $15/1M) = $0.012 + $0.024 = $0.036.
- Monthly: 50,000 × $0.036 = $1,800.
- With prompt caching (system prompt is 2000 tokens, 90% off): saves (8 × 2000 × $3/1M × 0.9) = $0.0432 per conversation. Monthly savings: $2,160. Net cost: negative — wait, that can't be right. (It can't — the system prompt is part of the input tokens, not additional. Recalculate: total input per conversation is 8 × (2000 + 500) = 20,000 tokens. Without caching: $0.06. With caching: (8 × 2000 × $0.30/1M) + (8 × 500 × $3/1M) = $0.0048 + $0.012 = $0.0168. Savings: 72%.)

This is the math every AI system designer must be able to do.

---

## Analyze

Model choice is reversible; architecture isn't. If you switch to a cheaper model and quality drops, you can switch back. If you build a model-routing layer, a semantic cache, and a prompt-caching strategy, those architectural choices persist across model swaps — they make every future model cheaper too. The architectural levers compound; the model-choice lever doesn't.

---

## Evaluate

The order of operations for cost optimization: (1) prompt caching — free, no quality loss. (2) semantic caching — free, no quality loss. (3) tighten the system prompt — free, no quality loss. (4) model routing — small quality risk, big cost reduction. (5) smaller model for everything — quality risk, biggest cost reduction. Apply in order; stop when you've hit your budget.

---

## Create

Design a model selection strategy for a multi-tenant AI SaaS. Tenants have different quality expectations and budgets. How do you route per tenant? How do you handle the tenant who pays for 'frontier quality' vs. the one on the 'budget' plan? How do you attribute cost per tenant for billing?

---

## A common misconception

**'Just use the cheapest model.'** No. Use the cheapest model *that maintains acceptable quality for this specific task*. That requires knowing your quality bar, which requires evaluation, which most teams haven't built. Without an eval, 'use a cheaper model' is just guessing — and guessing in production is how you ship broken products.

---

## Explain it back

The LLM market has a _____ cost range. The three capability tiers are _____, _____, and _____. Model routing works by _____. The order of operations for cost optimization is _____, _____, _____, _____. The architectural levers (caching, routing) compound; the model-choice lever _____.

---

## Further reading

- **See X.4 for the full cost optimization framework.**
- **Anthropic, OpenAI, Google pricing pages** — always verify current pricing.
- **Artificial Analysis (artificialanalysis.ai)** — independent model benchmarks and pricing comparisons.
