---
chapter_id: "B.0"
title: "The Box That Predicts the Next Word"
topic: "What an LLM is at a systems level"
track: genai
bloom_stage: ["remember", "understand"]
est_read_minutes: 15
prerequisites: ["0.0", "0.1"]
teaching_goal: "Describe an LLM as a black box with three ports (prompt in, tokens out, dollars out) and explain context window, KV cache, and what's expensive."
primary_diagram: assets/diagrams/B.0/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Box That Predicts the Next Word

Forget the transformer architecture. Forget attention. Forget backpropagation. For the next 200 pages, you only need to know three things about an LLM: what goes in, what comes out, and what it costs. This chapter is those three things.

---

## Remember

**Token** — the unit of text an LLM processes (~4 characters, ~¾ of a word). **Context window** — how much text the LLM can hold in mind (8K to 1M+ tokens, depending on model). **KV cache** — cached intermediate computations that make generating the 1000th token cheap. **Input tokens** — what you send (prompt + context). **Output tokens** — what the LLM generates (2-5x more expensive per token). **TTFT (Time To First Token)** — latency from request to first response token.

---

## Understand

An LLM, at the systems level, is a black box with three ports: **text in, text out, money out.** You don't need to understand transformers to design systems around LLMs. You need to understand the three ports.

**Text in (input tokens).** Everything you send to the LLM: the system prompt, the user's message, retrieved context (in RAG), conversation history, few-shot examples. You pay for every token. A 4,000-token system prompt costs money on *every single request* — which is why prompt caching matters (see X.4).

**Text out (output tokens).** What the LLM generates. Typically 2-5x more expensive per token than input, because generation is more compute-intensive (each token requires a forward pass through the model, whereas input processing can be batched and cached).

**Money out (cost).** LLMs are priced per token. As of 2026: Claude 3.5 Sonnet is $3/1M input + $15/1M output. GPT-4o is $2.50/$10. Gemini 1.5 Flash is $0.075/$0.30 — 40x cheaper than Sonnet. The 30x cost range between models is the biggest lever in AI system design (see X.4 and B.6).

**Context window.** How much the LLM can 'hold in mind.' GPT-4o: 128K tokens. Claude 3.5: 200K. Gemini 1.5 Pro: 1M+. Bigger windows are more capable (you can stuff more context) but more expensive (attention compute is often quadratic) and quality can degrade ('lost in the middle,' Liu et al. 2023 — the model pays less attention to content in the middle of long contexts).

**KV cache.** The reason generating the 1000th token of a response is cheap, but generating the first token of a long prompt is expensive. The model caches intermediate computations (keys and values) from earlier tokens so it doesn't recompute them. This is also why prompt caching works: if the prompt prefix is the same across requests, the KV cache is reused, and you pay ~10% of normal input cost.

---

## Apply

Read a model's pricing page. For Claude 3.5 Sonnet ($3/1M input, $15/1M output):
- A request with a 2,000-token prompt and a 500-token response: (2000 × $3/1M) + (500 × $15/1M) = $0.006 + $0.0075 = $0.0135.
- At 100K requests/day: $1,350/day, ~$40K/month.
- With prompt caching (90% off the 1,500-token system prompt): (500 × $3/1M × 0.1) + (500 × $3/1M) + (500 × $15/1M) = $0.00015 + $0.0015 + $0.0075 = $0.00915. At 100K/day: $915/day, ~$27K/month. 33% savings from caching alone.

This is the math every AI system designer must be able to do.

---

## Analyze

What's actually expensive in LLM inference? **Long prompts** (you pay for every input token), **long outputs** (you pay more per output token), **long contexts** (attention compute grows with context length), **high concurrency** (you need more GPU capacity), **low latency** (you pay for faster models or dedicated capacity). Understanding the cost structure tells you where to optimize.

---

## Evaluate

When choosing a model, the question isn't 'which is best?' but 'which is best *for this task, at this scale, at this budget*?' A frontier model might be 10x smarter but 20x more expensive. For 80% of requests, a small model is sufficient. For the 20% that need frontier quality, pay the premium. This is model routing (see X.4 and B.6).

---

## Create

You're building a customer support bot. Estimate the monthly cost for 50,000 conversations, average 8 turns each, 500 input tokens + 200 output tokens per turn. Try it for Claude 3.5 Sonnet vs. GPT-4o-mini. What's the cost difference? What would caching save?

---

## A common misconception

**'Bigger context windows solve everything.'** No. Bigger windows let you stuff more in, but they don't mean the model *uses* it well. The 'lost in the middle' problem (Liu et al. 2023) shows that models pay less attention to content in the middle of long contexts. A 200K context window doesn't mean the model reads all 200K tokens carefully — it means it *can* process them, but quality degrades. Often, retrieving fewer, more relevant chunks beats stuffing everything in.

---

## Explain it back

An LLM, at the systems level, has three ports: _____, _____, and _____. A token is approximately _____ characters. The context window is _____. The KV cache is the reason _____. Output tokens are more expensive than input tokens because _____.

---

## Further reading

- **Vaswani et al. (2017), "Attention Is All You Need," NeurIPS** — the transformer paper (for when you want to go deeper than the black box).
- **Anthropic API documentation** — pricing, context windows, prompt caching.
- **Liu et al. (2023), "Lost in the Middle"** — on why bigger contexts don't always mean better.
