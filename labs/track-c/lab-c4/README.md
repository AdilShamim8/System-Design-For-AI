# Lab c4 — Memory and State

| | |
|---|---|
| **Prerequisites** | Chapter C.4 (the memory that forgets on purpose) · Lab c1 |
| **You will build** | Three memory strategies — full history, sliding window, summarize-and-carry — and the measurements that pick between them |
| **Est. time** | 2 hours |
| **Cost** | < $0.10 |

**The story.** A support conversation hits turn 30. Your agent's context now holds 29 turns of "okay" and "thanks" — and the bill, the latency, and the "lost in the middle" fog all grow while the *useful* facts (the user's order number, stated once at turn 2) drown. Memory management is deciding **what the model sees each turn** — and the professional answer is a *budget*, not a hoard. Today you build the three standard strategies and measure the tradeoff that defines them all: **recall of early facts vs. tokens per turn.**

## Part 1 — The problem, measured (20 min)

Simulate a 30-turn support conversation (or script one over your b2 corpus: user states facts early — order #12345, "call me Sam" — then wanders). Run every turn through your c1 agent with full history. After each turn, log:

```python
def context_stats(messages):
    toks = sum(len(m["content"]) for m in messages) // 4     # ~4 chars/token
    return {"turn": len(messages)//2, "context_tokens": toks}
```

**Checkpoint 1:** Plot tokens-per-turn against turn number — it grows *linearly* (every turn resends everything; c1 measured this, now you see the curve). Extrapolate to turn 100. Compute the conversation's *total* token spend: the sum makes the case for everything that follows.

## Part 2 — Strategy 2: the sliding window (20 min)

```python
def window_memory(messages, keep_last=6, always_keep_first=2):
    return messages[:always_keep_first] + messages[-keep_last:]
```

**Checkpoint 2:** Tokens/turn is now flat (good) — but ask the agent at turn 30: "what's my order number?" (stated at turn 2). If your `always_keep_first` saved the system prompt + first user turn, you survive; delete it and watch the amnesia. Write the design rule: **window memory needs a "pinned" region** — the facts you cannot afford to lose. Which facts? You can't know in advance — that's the strategy's structural weakness, and the bridge to Part 3.

## Part 3 — Strategy 3: summarize-and-carry (40 min)

```python
def summarize_and_carry(messages, rolling_summary, keep_last=4):
    # every K turns: fold dropped turns into a running summary
    dropped = messages[:-keep_last]
    prompt = ("Summarize this conversation so far as compact bullet facts "
              "the next agent needs (ids, names, decisions, open issues):\n\n"
              + "\n".join(m["content"] for m in dropped))
    new_summary = client.chat.completions.create(
        model=MODEL, messages=[{"role": "user", "content": prompt}],
        max_tokens=150, temperature=0).choices[0].message.content
    return f"CONVERSATION SUMMARY:\n{rolling_summary}\n{new_summary}"
```

**Checkpoint 3:** The memory quiz — at turn 30 ask for: order number, user's name, the issue from turn 5, and the last exchange. Score each strategy (full / window+pinned / summary): expect full = perfect recall at exploding cost; window = cheap but early-fact amnesia without pinning; summary = 80–95% recall at flat, low cost — **and one *corrupted* fact occasionally** (summaries hallucinate too). That last wrinkle is the strategy's tax: a summary is a lossy, occasionally lossy-*and-wrong* compression. Record any corruption you catch in the journal — citing it is a senior-level observation.

## Part 4 — The memory architecture, assembled (20 min)

On paper (this is the interview deliverable):

```
working memory    = last K turns, verbatim          (cheap, exact, short-lived)
episodic memory   = rolling summary                  (compact, lossy, agent-maintained)
semantic memory   = durable user facts, structured   (a database: order ids, preferences)
```

The professional system uses **all three**: verbatim for flow, summary for arc, and *extracted structured facts* (b7's schemas!) stored outside the model entirely — retrieved on demand. The critical design line: **facts that must be exact (IDs, amounts) never live in a summary; they live in a table and get injected verbatim.** Summaries are for narrative, not for numbers.

**Checkpoint 4:** Extend your agent: after each turn, extract `{fact, value}` pairs into a dict ("order_id": "#12345"); inject the dict in the system prompt each turn. Re-run the memory quiz. Perfect ID recall at ~zero marginal tokens — that's the pattern every serious assistant ships.

---

## Explain it back

1. Why does per-turn cost grow linearly with full history, and what does each strategy do to that curve?
2. Window + pinned region: what does pinning cost you, and when does it still fail?
3. Why must exact facts live in a table, not a summary?
4. Your user complains "you forgot what I told you." Which memory layer failed, and how do you know?

## Extensions

- **Compaction triggers:** summarize when context > N tokens rather than every K turns. Adaptive vs. fixed — measure the difference on a conversation with wildly variable turn lengths.
- **Hybrid retrieval memory:** store per-turn summaries as *chunks* in a vector index; retrieve the relevant past by query. You've built conversational RAG — "memory" and "retrieval" turn out to be the same problem wearing different hats.
- **Summary drift:** run a 60-turn conversation; compare the rolling summary at turn 60 vs. a fresh summary of the whole transcript. Measure divergence — the maintenance cost of incremental compression, quantified.

## What you can now claim in an interview

"I manage agent memory as a budget across three layers — verbatim window for flow, rolling summary for arc, structured fact table for exactness — and I've measured each strategy's recall-per-token and its failure mode, including summary hallucination. IDs and amounts never live in a summary; they live in a table and get injected."
