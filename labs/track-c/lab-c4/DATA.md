# Lab c4 — Data notes: the scripted conversation

No external dataset. You'll **script a 30-turn support conversation** — and the script is the eval set, so write it with intent:

**Turn plan (the shape that exposes each strategy's failure):**

- Turns 1–3: facts — order #, name, product, stated once, never repeated
- Turns 4–12: diagnosis wandering — mostly filler ("okay", "tried that")
- Turn 13: a *second* fact (error code), mid-conversation
- Turns 14–25: more filler, one long paste (a log dump — tests token spikes)
- Turn 26: reference to turn-5 issue by pronoun only ("is that why *it* failed?")
- Turns 28–30: the memory quiz — order #, name, error code, turn-5 issue, last exchange

Filler turns are the point: real conversations are 70% filler, and memory strategies exist to separate the 30% signal. A conversation without filler tests nothing.

**Measurements to record per strategy:**

- tokens per turn at turns 5/15/30 (the growth curve)
- total conversation cost
- memory quiz: 5 facts, exact-match scored (order # and error code are *exact* — "close" is wrong; names/issues are fuzzy-scored)

**Calibration numbers (small hosted model):**

- Full history at turn 30: ~6–10K context tokens depending on the log dump.
- Sliding window (6): flat ~800–1,200 tokens/turn; early facts lost without pinning.
- Summary + window: flat ~1,000–1,600 tokens/turn including summary overhead; quiz recall 80–95%; occasional single-fact corruption.
- Fact table + window: exact IDs at ~zero cost — the structured layer nearly always pays for itself.

**License:** your script, your license. It's also your c5 material — memory-quiz results become eval cases for the agent-evaluation lab.
