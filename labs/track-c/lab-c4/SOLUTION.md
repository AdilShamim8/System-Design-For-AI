# Lab c4 — Worked Solution and What the Numbers Mean

## Expected results (our runs, scripted 30-turn conversation)

| Strategy | Tokens @ turn 30 | Total cost | Memory quiz (5 facts) |
|---|---|---|---|
| Full history | ≈ 6–10K and growing | ≈ 90–150K conversation-total | 5/5 |
| Window (6), no pinning | ≈ 800–1,200 | ≈ 25–35K | 1–2/5 |
| Window + pinned first 2 | ≈ 900–1,300 | ≈ 28–38K | 3–4/5 |
| Summary + window (4) | ≈ 1,000–1,600 | ≈ 32–45K | 4–5/5 (occasional corruption) |
| Fact table + window | ≈ 900–1,400 | ≈ 30–40K | 5/5 on IDs; narrative occasionally fuzzy |

## The five lessons hidden in those numbers

1. **Memory is a budget allocation problem.** Full history buys perfect recall at linearly-growing cost; every other strategy is a different way to trade recall for flat cost. There is no free memory — only different prices. The architecture (three layers) is how you pay the lowest price per fact.
2. **The sliding window's amnesia is structural.** Without pinning, it *cannot* remember turn 2 at turn 30 — not "usually forgets," *cannot*. Pinned regions patch the known-critical facts; the *unknown*-critical ones (the error code at turn 13) still fall through. That residual risk is what summaries were invented for.
3. **Summaries are lossy and occasionally wrong — plan for both.** 80–95% recall with sporadic single-fact corruption (we watched a summary turn "#12345" into "#1245"). The mitigation isn't better summarization; it's *routing exactness-sensitive facts out of the summary entirely* — the fact table. Compression for narrative, tables for numbers: that separation is the lab's core lesson.
4. **Per-turn cost is the metric users feel; total cost is the metric the business feels.** The curve (Checkpoint 1) drives latency and the "lost in the middle" fog; the sum drives the bill. Both dashboards matter — X.3's stethoscope applied to conversations.
5. **Conversational memory and RAG converge.** The retrieval-memory extension (index per-turn summaries, retrieve on demand) turns "memory" into "retrieval over a conversation corpus." Once you see that, C.4 and B.2 are the same pattern at different time scales — and you can reuse every retrieval insight (chunking, reranking, eval) on memory. That's the kind of unification that makes interviews go well.

## Common mistakes

- **Measuring only the last turn.** The growth curve *is* the finding; one snapshot hides it. Log per turn, plot, extrapolate.
- **Fuzzy-scoring IDs.** "#1245" for "#12345" is a *wrong answer*, not a near-miss — exact facts are exact. Score them binary; score narrative facts fuzzy. Mixing the two hides the exact-fact failure the fact table exists to fix.
- **Summarizing every turn.** Summarize on a trigger (every K turns or token threshold), not every turn — else you pay the summarizer's tax each turn and compound its drift. Fixed-K vs. threshold is the extension; either beats naive.
- **Forgetting the system prompt in the window.** The window keeps the *system* message always — slicing it away breaks tool protocols and persona. Pin it explicitly (your `always_keep_first` does this — know why it's there).

## Interview lines this lab earns you

- "I measured memory strategies on a scripted 30-turn conversation: full history grows linearly to ~8K tokens/turn, windows are flat but structurally amnesic without pinning, and summaries hit 85–95% recall at flat cost — but occasionally corrupt exact facts, which is why IDs and amounts live in a fact table, injected verbatim, never in a summary."
- "Memory is a budget across three layers — verbatim window, rolling summary, structured facts — and conversational memory is really RAG over a conversation corpus: once you see that, all retrieval tooling applies."
