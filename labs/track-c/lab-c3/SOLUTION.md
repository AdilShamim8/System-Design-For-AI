# Lab c3 — Worked Solution and What the Numbers Mean

## Expected results (our runs, 5 tasks × 3 runs)

| Task type | Quality winner | Token cost (team / single) | Latency |
|---|---|---|---|
| Simple (1–2 sources) | tie or single | ≈ 1.5–2.5× | team slower |
| Synthesis | team by a nose | ≈ 1.5–2× | team slower |
| Sparse coverage | tie (both struggle) | team higher (REQUEST loops) | team slower |
| 20K-token context | **team, clearly** | ≈ 0.7–1× (writer never sees swamp) | team faster per-step |
| Ambiguous | single (fewer misroutes) | ≈ 2× | team slower |

## The five lessons hidden in those numbers

1. **Multi-agent is not an upgrade; it's a trade.** Handoffs cost tokens, latency, and reliability (c1's compounding: each hop multiplies in ~0.9-ish step success). The team must *buy* something specific — isolation, routing, or testability — or it's theater. Your table is the artifact that keeps architecture honest.
2. **Context isolation is the strongest legitimate win.** The researcher compresses 20K tokens into 300; the writer gets signal, not swamp. That's not just cost — it's quality, because attention dilutes over long contexts ("lost in the middle"). When someone asks "why multi-agent?", context isolation is the defensible first answer.
3. **Model routing is a cost tool first.** Small-model researcher + big-model writer cut 30–60% of cost at equal quality in our runs. The team is an *organizational* structure for b6's routing economics — one system prompt per price tier.
4. **Change isolation is the quiet benefit.** Editing WRITER_SYS cannot break retrieval; editing the monolith's prompt can break everything. In systems with weekly prompt changes, blast-radius reduction is worth real tokens. (This is just good software engineering — module boundaries — arriving late to prompts.)
5. **Handoffs are contracts, and drift is the chronic disease.** The moment one agent's output format drifts, the other misroutes — silently. Schema-validated inter-agent messages (b7 patterns) are the cure; the trace is the diagnostic. Teams that skip validation spend their debugging hours on what is structurally a type error.

## Common mistakes

- **No single-agent baseline.** Then every comparison is vibes. The control is 20 lines of c1 code; there's no excuse.
- **Clever free-form orchestrators.** At lab scale, an explicit two-step protocol beats an improvised router almost always (the extension *proves* this to you). Save cleverness for where it pays — task understanding — not for control flow.
- **Counting only the writer's tokens.** Multi-agent cost is the *sum* across agents including resent context at every hop. Teams that report "the writer is cheap" while the orchestrator resends everything are doing accounting fraud on themselves.
- **Unblinded ratings.** You built the team; you root for the team. Shuffle, rate, unblind — 10 minutes that saves you from your own enthusiasm.

## Interview lines this lab earns you

- "I race every multi-agent design against a monolith control. Teams win on context isolation, per-role model routing, and change isolation; on simple tasks they lose on all three axes. Most 'multi-agent' pitches I've measured would be better monoliths."
- "Inter-agent messages are contracts with schemas and validation, because handoff drift is the chronic disease of multi-agent systems — my traces catch it, my schemas prevent it."
