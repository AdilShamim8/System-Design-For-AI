---
chapter_id: "B.0"
title: "The Box That Predicts the Next Word"
topic: "What an LLM is at a systems level"
track: genai
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 18
prerequisites: ["0.0", "0.1"]
teaching_goal: "Describe an LLM as a black box with three ports (prompt in, tokens out, dollars out) and explain context window, KV cache, and what is actually expensive."
status: stable
last_updated: 2026-08-12
---

# The Box That Predicts the Next Word

Forget the transformer architecture. Forget attention. Forget backpropagation. For the next 200 pages, you only need to know three things about an LLM: what goes in, what comes out, and what it costs. This chapter is those three things.

You don't need to understand how a transformer works to design systems around LLMs — just like you don't need to understand TCP/IP to build a web app. You need to understand the interface: the inputs, the outputs, the cost, and the failure modes. That's what this chapter covers.

---

## Remember — name it

- **Token** — the unit of text an LLM processes. Roughly 4 characters of English, or 3/4 of a word. "Hamburger" might be one token; "antidisestablishmentarianism" might be three. LLMs are priced per token — both for input (what you send) and output (what you get back).
- **Context window** — how much text the LLM can hold in mind at once. Like a person's working memory. GPT-4o: 128K tokens (~96,000 words). Claude 3.5 Sonnet: 200K tokens (~150,000 words). Gemini 1.5 Pro: 1M+ tokens (~750,000 words — an entire book series). Bigger windows are more capable but more expensive.
- **KV cache** — cached intermediate computations that make generating the 1000th token cheap, but generating the first token of a long prompt expensive. The reason prompt caching works.
- **Input tokens** — what you send to the LLM. Includes the system prompt, the user message, retrieved context (in RAG), conversation history, few-shot examples. Often 10x larger than output.
- **Output tokens** — what the LLM sends back. Usually 2-5x more expensive per token than input, because generation is more compute-intensive.
- **TTFT (Time To First Token)** — the latency from request to the first token of the response. A key metric for streaming applications. Typical: 200-1000ms.

---

## Understand — the three ports

An LLM, at the systems level, is a black box with three ports: **text in, text out, money out.**

### Port 1: Text in (input tokens)

Everything you send to the LLM:
- **System prompt** — instructions to the LLM about persona, rules, and constraints. "You are a helpful support agent. Never invent policies." Typically 500-4000 tokens. Paid on every request (unless cached — see Port 3).
- **User message** — the actual question or request. "How do I reset my password?" Typically 50-500 tokens.
- **Retrieved context (in RAG)** — document chunks retrieved from a vector database. Typically 2,000-8,000 tokens.
- **Conversation history** — previous turns in a multi-turn conversation. Grows with each turn.
- **Few-shot examples** — example inputs/outputs in the prompt to guide the model. Each example costs tokens.

You pay for every input token. A 4,000-token system prompt costs money on *every single request* — which is why prompt caching matters (see chapter X.4).

### Port 2: Text out (output tokens)

What the LLM generates. Typically 100-1,000 tokens for a response. You pay more per output token than per input token (usually 2-5x more), because generation is more compute-intensive — each token requires a forward pass through the model, whereas input processing can be batched and cached.

### Port 3: Money out (cost)

LLMs are priced per token. As of August 2026:

| Model | Input $/1M tokens | Output $/1M tokens | Context window |
|---|---|---|---|
| Claude 3.5 Sonnet | $3.00 | $15.00 | 200K |
| Claude 3.5 Haiku | $0.80 | $4.00 | 200K |
| GPT-4o | $2.50 | $10.00 | 128K |
| GPT-4o-mini | $0.15 | $0.60 | 128K |
| Gemini 1.5 Pro | $1.25 | $5.00 | 1M+ |
| Gemini 1.5 Flash | $0.075 | $0.30 | 1M |

The cost range from frontier to small is ~40x. That's the routing opportunity — use the cheap model when you can, the expensive model when you must.

### Context window

How much the LLM can "hold in mind." Bigger windows are more capable (you can stuff more context) but more expensive (attention compute grows with context length) and quality can degrade ("lost in the middle" — Liu et al., 2023, found that LLMs pay less attention to content in the middle of long contexts).

The "lost in the middle" finding is critical for RAG: if you retrieve 10 chunks and stuff them all in, the LLM might miss the one in the middle. The fix: put the most relevant chunks at the *start* and *end* of the context, not the middle.

### KV cache

The reason generating the 1000th token of a response is cheap, but generating the first token of a long prompt is expensive. The model caches intermediate computations (keys and values in the attention mechanism) from earlier tokens so it doesn't recompute them.

This is also why **prompt caching** works: if the prompt prefix is the same across requests, the KV cache is reused, and you pay ~10% of normal input cost for the cached portion. Anthropic and OpenAI both offer this — see chapter X.4 for the full economics.

---

## Apply — calculate the cost of a RAG query

A RAG query with:
- System prompt: 2,000 tokens
- Retrieved context: 4,000 tokens (8 chunks × 500 tokens)
- User question: 50 tokens
- LLM response: 300 tokens

Total input: 6,050 tokens. Total output: 300 tokens.

With Claude 3.5 Sonnet ($3/$15 per 1M):
- Input: 6,050 × $3/1M = $0.01815
- Output: 300 × $15/1M = $0.00450
- **Total: $0.02265 per query**

With GPT-4o-mini ($0.15/$0.60 per 1M):
- Input: 6,050 × $0.15/1M = $0.0009075
- Output: 300 × $0.60/1M = $0.000180
- **Total: $0.001088 per query**

At 10,000 queries/day:
- Sonnet: $226.50/day, ~$6,795/month
- GPT-4o-mini: $10.88/day, ~$326/month

The 21x cost difference is why model routing matters. If 70% of queries can use GPT-4o-mini and only 30% need Sonnet, the blended cost drops dramatically.

---

## Analyze — what is actually expensive?

- **Long prompts** — you pay for every input token. A 10,000-token prompt costs 5x more than a 2,000-token prompt. If most of those tokens are irrelevant context, you're paying for noise that degrades quality.
- **Long outputs** — you pay more per output token. A 1,000-token response costs 5x more than a 200-token response. Use stop sequences and structured output to keep responses concise.
- **Long contexts** — attention compute grows with context length. A 100K-token context is much more expensive than a 10K-token context, both in compute and in quality degradation.
- **High concurrency** — you need more GPU capacity. Each concurrent request occupies a GPU for the duration of generation. 100 concurrent requests need 100x the capacity of 1 request.
- **Low latency** — you pay for faster models or dedicated capacity. A frontier model with 500ms TTFT costs more than a small model with 200ms TTFT.

---

## Evaluate — choosing the right model

The question isn't "which is best?" but "which is best *for this task, at this scale, at this budget*?" A frontier model might be 10x smarter but 20x more expensive. For 80% of requests, a small model is sufficient. For the 20% that need frontier quality, pay the premium. This is model routing (see chapter B.6 and X.4).

---

## Create — estimate the monthly cost

You're building a customer support bot. Estimate the monthly cost for 50,000 conversations, average 8 turns each, 500 input + 200 output tokens per turn. Try it for Claude 3.5 Sonnet vs. GPT-4o-mini. What's the cost difference? What would prompt caching save (system prompt is 2,000 tokens, 90% off)?

---

## A common misconception

**"Bigger context windows solve everything."** No. Bigger windows let you stuff more in, but they don't mean the model *uses* it well. The "lost in the middle" problem shows that models pay less attention to content in the middle of long contexts. A 200K context window doesn't mean the model reads all 200K tokens carefully — it means it *can* process them, but quality degrades. Often, retrieving fewer, more relevant chunks beats stuffing everything in.

---

## Explain it back

> "An LLM has three ports: _____, _____, and _____. A token is approximately _____ characters. The context window is _____. The KV cache is the reason _____. Output tokens are more expensive than input tokens because _____. The cost range from frontier to small models is about _____x."

---

## References

- **Vaswani, A., et al. (2017), "Attention Is All You Need," NeurIPS 2017.** The transformer paper. arXiv:1706.03762 — https://arxiv.org/abs/1706.03762
- **Liu, N. F., et al. (2023), "Lost in the Middle," TACL.** arXiv:2307.03172 — https://arxiv.org/abs/2307.03172
- **Anthropic API Documentation.** Pricing, context windows, prompt caching. https://docs.anthropic.com/
- **OpenAI API Documentation.** Pricing, models, function calling. https://platform.openai.com/docs/
- **Google AI / Gemini Documentation.** https://ai.google.dev/docs
