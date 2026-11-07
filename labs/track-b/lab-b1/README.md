# Lab b1 — Tokens, Latency, and Money

| | |
|---|---|
| **Prerequisites** | Chapter B.0 (the box that predicts the next word) · Chapter X.4 (the bill) · [setup with API key](../../setup/) |
| **Dataset** | Real published API prices + your own prompt corpus (built here) |
| **You will build** | A token-accounting and cost/latency harness — the numbers you'll quote in every Track B lab and most interviews |
| **Est. time** | 1–2 hours |
| **Cost** | < $0.50 with a small model; free with local Ollama (pricing part uses published prices, not your spend) |

**The story.** LLM APIs bill by the **token** — roughly ¾ of a word — and price *input* and *output* differently. Latency has three distinct clocks: time-to-first-token (TTFT), tokens-per-second (TPS) while streaming, and total time. Almost every bad LLM system decision — over-long prompts, chatty models, wrong model tier — comes from not knowing these numbers. Today you build the harness that measures them, then compute the unit economics of a fictional product until per-request cost feels like a *design material*, the way latency did in Lab a1.

---

## Part 1 — Tokens are not words (20 min)

Count tokens with the same tokenizer family the APIs use:

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")          # the GPT-4o-family tokenizer

texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Do NOT use ALL CAPS; tokenizers handle SHORT words cheaply but SUPERCALIFRAGILISTICEXPIALIDOCIOUS is expensive.",
    "北京是世界上最大的城市之一。",                    # non-Latin scripts
    "for i in range(10):\n    print(i**2)",           # code
]
for t in texts:
    toks = enc.encode(t)
    print(f"{len(t)} chars -> {len(toks)} tokens "
          f"(ratio {len(t)/max(len(toks),1):.2f} chars/token)")
```

**Checkpoint 1:** Record chars/token for each text. English prose runs ~4 chars/token; ALL-CAPS and rare words fragment; Chinese runs ~1–2 chars/token (fewer chars, similar or more tokens per *idea*); code is its own dialect. The rule to internalize: **token count is a property of the tokenizer, not the text** — different model families tokenize differently, so "how many tokens is that prompt?" is only answerable *per model*.

---

## Part 2 — The three clocks of LLM latency (30 min)

```python
import os, time
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

client = OpenAI(api_key=os.environ["LLM_API_KEY"],
                base_url=os.environ.get("LLM_BASE_URL"))

PROMPT = "Explain why the sky is blue, in exactly 200 words."

def timed_call(stream=True, max_tokens=300):
    t0 = time.perf_counter()
    stream_obj = client.chat.completions.create(
        model=os.environ.get("LLM_MODEL", "gpt-4o-mini"),
        messages=[{"role": "user", "content": PROMPT}],
        stream=stream, max_tokens=max_tokens)
    first_tok = None; n_tok = 0
    for chunk in stream_obj:
        if chunk.choices[0].delta.content:
            if first_tok is None:
                first_tok = time.perf_counter()
            n_tok += 1
    t_end = time.perf_counter()
    return {
        "ttft_s": round(first_tok - t0, 3),
        "total_s": round(t_end - t0, 3),
        "chunks": n_tok,
        "tps": round(n_tok / (t_end - first_tok), 1),
    }

for _ in range(5):
    print(timed_call())
```

**Checkpoint 2:** Record TTFT (expect 0.3–2 s), TPS (expect 30–100+ chunks/s on hosted models; 5–30 on small local models), total. The three-clock model, and what each one means for product: **TTFT** is what the user feels as "thinking" (chat feels alive under ~1 s); **TPS** is reading speed (humans read ~5 words/s ≈ 7 tokens/s — anything above that outruns the eye); **total** is what batch jobs pay. A summarization batch cares about total; a chat UI lives and dies by TTFT. Sketch which two of your favorite AI products are TTFT-bound vs. TPS-bound.

---

## Part 3 — The cost table and unit economics (40 min)

Fill in this table with **published prices from your provider's pricing page** (date-stamp them; X.4's rule):

| Model tier (your provider) | Input $/1M tokens | Output $/1M tokens | Date checked |
|---|---|---|---|
| small/mini | | | |
| mid | | | |
| large/frontier | | | |

Now compute unit economics for **"ChatDocs"** — a chatbot that answers questions over company docs with RAG. Assumptions (write a script; don't do this in your head — X.4's law):

```python
def cost_per_request(in_tokens, out_tokens, p_in, p_out):
    return in_tokens / 1e6 * p_in + out_tokens / 1e6 * p_out

# ChatDocs assumptions
SYSTEM_PROMPT = 800      # tokens of instructions
RETRIEVED    = 6 * 500   # 6 chunks x 500 tokens
HISTORY      = 1200      # recent turns
USER_Q       = 50
ANSWER       = 400
requests_per_day = 10_000

in_toks  = SYSTEM_PROMPT + RETRIEVED + HISTORY + USER_Q
out_toks = ANSWER
for name, p_in, p_out in [("small", 0.15, 0.60),     # replace with YOUR table
                          ("mid",   3.00, 15.00),
                          ("large", 15.00, 75.00)]:
    c = cost_per_request(in_toks, out_toks, p_in, p_out)
    print(f"{name:6s} ${c:.5f}/req  ${c*requests_per_day:,.0f}/day  ${c*requests_per_day*30:,.0f}/mo")
```

**Checkpoint 3 (the lab's payoff):** Three numbers, one per tier, monthly. Notice: (a) the **input tokens dwarf output** in RAG (4,550 in vs 400 out) — so RAG cost is *input-price*-sensitive, the opposite of chat-with-no-context; (b) the tier spread is enormous — same request, 100× price range; (c) at 10K requests/day, a "large" tier can cost more than an engineer. Now the design moves, in order of leverage: **trim context** (drop to 4 chunks: −30% input), **cache** (b5 will show hit rates), **route** (only 20% of questions need the big model — b6's router), **quantize/self-host** (a stack discussion, not a knob). Recompute after each move. Which single move cut cost most?

---

## Part 4 — The p99 you promise vs. the p99 you measure (20 min)

Run the same call 30 times and compute p50/p95/p99 of TTFT and total (reuse Lab a1's percentile code). API providers have multi-tenant variance — your p99 will be several times your p50. Design question (write, don't code): your product promises "answers in under 3 seconds" on the box. Your measured TTFT p99 is 2.8 s. What are your options? (Timeout + fallback to a smaller model; retry on slow TTFT *before* answer starts; pre-warm/persistent connections; negotiate enterprise tier; soften the promise.) Rank them by engineering cost and say which you'd do first.

**Checkpoint 4:** Write the one-paragraph SLO you'd actually ship: TTFT p50 ≤ X, p99 ≤ Y, at cost ≤ $Z per 1K requests, with the fallback behavior when p99 breaches. You have just written the three numbers every LLM product team argues about weekly.

---

## Explain it back

1. Why does RAG cost scale with *input* price while pure chat scales with *output*?
2. TTFT vs TPS vs total — which matters for: a chat UI, a document summarizer, an agentic loop with 10 model calls?
3. Your monthly bill tripled. Name four diagnostic queries you'd run on *request logs* before changing anything.
4. Why is "tokens" a better billing unit than "words" or "characters" — and where does that break down (non-Latin scripts)?

## Extensions

- **Prompt-size sensitivity:** repeat Part 2 with the prompt padded by 2K tokens of irrelevant context. Does TTFT move? (Prefill is fast — expect small moves. The cost moves *linearly* though; latency ≠ cost is the point.)
- **Streaming vs. not:** measure non-streamed total time vs. streamed total. Similar? The win of streaming is TTFT-perceived, not total — prove it.
- **Embedding costs:** price the b2 RAG index build: 20K chunks × avg 400 tokens × your embedding model's $/1M input. Now price *re-embedding* after a chunking change — the hidden cost of B.4 decisions.

## What you can now claim in an interview

"I measure LLM latency in three clocks — TTFT, TPS, total — and compute cost per request from real published prices. For a typical RAG workload I can tell you input tokens dominate, which tier to route to, and the four levers in order of leverage — because I've run the numbers, not read them."
