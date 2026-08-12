---
chapter_id: "B.6"
title: "Picking the Brain You Can Afford"
topic: "Model selection & cost tradeoffs"
track: genai
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 18
prerequisites: ["B.0", "X.4"]
teaching_goal: "Design a model selection strategy across capability tiers, with routing, caching, and prompt caching, and forecast the bill."
status: stable
last_updated: "2026-08-12"
---

# Picking the Brain You Can Afford

You have five models to choose from. The biggest is 10x smarter and 20x more expensive. The smallest is 10x cheaper and barely passes the bar. Picking the right one — per request, per user, per task — is the difference between a sustainable business and a $47K surprise bill.

---

## Remember

- **Capability tiers**: frontier (Claude Opus, GPT-4), mid (Sonnet, GPT-4o), small (Haiku, GPT-4o-mini, Flash).
- **Model routing** — easy requests to small, hard to large. 70-80% to small, 20-30% to large.
- **Prompt caching** — 90% discount on stable prompt prefixes (Anthropic), 50% (OpenAI).
- **Semantic caching** — serving repeated queries from cache. 40-60% traffic reduction.
- **Forecasting** — per-request cost x expected volume = monthly bill.

---

## Understand — the 30x cost range

The LLM market in 2026 has a 30x cost range: from Gemini Flash at $0.075/1M input to Claude Opus at $15/1M input. This range is the biggest lever in AI system design.

**The capability ladder:**
- **Frontier** (Opus, GPT-4): best quality, highest cost. For complex reasoning, high-stakes decisions.
- **Mid** (Sonnet, GPT-4o): good quality, moderate cost. For most production tasks.
- **Small** (Haiku, GPT-4o-mini, Flash): adequate quality, lowest cost. For simple Q&A, classification, routing.

---

## Apply — model routing

Not every request needs a frontier model. "Hi" doesn't need GPT-4o. A classifier decides: easy -> small, hard -> large. Route 70-80% to small, 20-30% to large. Overall cost drops 5-10x, minimal quality loss.

**The trap:** routing errors are silent. If the router sends a hard request to the small model, the user gets a bad answer. You need observability on routing decisions.

---

## Evaluate — the order of operations for cost optimization

1. **Prompt caching** — free, no quality loss. 90% off system prompt.
2. **Semantic caching** — free, no quality loss. 40-60% fewer LLM calls.
3. **Tighten the system prompt** — free, no quality loss. Cut from 4,000 to 1,500 tokens.
4. **Model routing** — small quality risk, big cost reduction. 5-10x cheaper.
5. **Smaller model for everything** — quality risk, biggest cost reduction.

Apply in order; stop when you've hit your budget.

---

## Create — design model selection for a multi-tenant AI SaaS

Tenants have different quality expectations and budgets. How do you route per tenant? How do you handle the tenant who pays for "frontier quality" vs. "budget" plan? How do you attribute cost per tenant for billing?

---

## A common misconception

**"Just use the cheapest model."** No. Use the cheapest model *that maintains acceptable quality for this specific task*. That requires evaluation.

---

## Explain it back

> "The LLM market has a _____ cost range. The three capability tiers are _____, _____, and _____. Model routing works by _____. The order of operations for cost optimization is _____, _____, _____, _____."

---

## References

- **See chapter X.4 for the full cost optimization framework.**
- **Anthropic Pricing.** https://www.anthropic.com/pricing
- **OpenAI Pricing.** https://openai.com/api/pricing/
- **Google AI Pricing.** https://ai.google.dev/pricing
- **Artificial Analysis.** Independent model benchmarks. https://artificialanalysis.ai/
