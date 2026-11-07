# Lab b1 — Worked Solution and What the Numbers Mean

## Expected results (our runs; a hosted small model, US region, late 2026)

| Measurement | What we got |
|---|---|
| English prose chars/token | ≈ 3.9–4.2 |
| Chinese chars/token | ≈ 1.1–1.6 |
| ALL-CAPS + long words | ratio drops to ~2.5–3 |
| TTFT p50 / p99 (hosted small) | ≈ 0.5 s / 1.5–2.5 s |
| TPS (hosted small) | ≈ 60–120 |
| ChatDocs cost, small tier | ≈ $0.0011/req → ≈ $340/mo at 10K/day |
| ChatDocs cost, mid tier | ≈ $0.015/req → ≈ $4,600/mo |
| ChatDocs cost, frontier tier | ≈ $0.07/req → ≈ $22,000/mo |

*(We used 4,550 input / 400 output tokens and the illustrative prices in DATA.md — recompute with your table; the *ratios* are the lesson, not our dollars.)*

## The five lessons hidden in those numbers

1. **RAG is an input-token business.** 4,550 in vs. 400 out means cost ≈ 92% input-price. This single arithmetic fact drives real architecture: context trimming, chunk right-sizing (b3), caching (b5), and routing (b6) all attack *input*. A team that only optimizes "make answers shorter" is tuning the 8%.
2. **The tier decision is the biggest cost lever you have.** Same request, ~60–100× price spread between small and frontier tiers. The routing pattern — "small model first, escalate the hard 20%" — is worth more than every micro-optimization combined, which is why Mock 4 (the LLM gateway) spends half its time on routing.
3. **Latency and cost are different axes.** Padding the prompt with 2K tokens barely moves TTFT (prefill is parallel and fast) but moves the bill linearly. Teams that only watch latency quietly bleed money; teams that only watch cost ship slow products. The SLO paragraph from Checkpoint 4 is where both live together.
4. **Your p99 is the provider's problem — until you make it yours.** Multi-tenant APIs have noisy neighbors; a p99 at 2–5× p50 is normal. The design responses (timeout+fallback, pre-emptive retry, tier escalation) are the beginnings of the gateway pattern — you'll build it for real in Mock 4's design and Lab b5's cache.
5. **Tokenization is model-specific.** The same sentence is a different number of tokens per family — so context budgets, cost models, and even "does it fit" checks must be run per model. Porting a prompt between models silently changes your economics; re-measure (the lab harness exists so this is a 30-second check, not a re-audit).

## Common mistakes

- **Averaging latency over 5 calls.** LLM latency is heavy-tailed; 5 samples is an anecdote. 30+ or don't quote a p99 at all.
- **Measuring non-streamed calls and reporting "latency."** Non-streamed total hides TTFT entirely — you'll design the wrong fix (model swap) for the wrong symptom (queueing before first token).
- **Using the provider's price page from memory.** Prices move; date-stamp the table. Interviewers who've been burned will ask "as of when?"
- **Forgetting the system prompt in cost math.** It's charged on *every* request; 800 tokens of instructions × 10K requests/day is 8M tokens/day of invisible spend.

## Interview lines this lab earns you

- "For a typical RAG request — 4.5K input, 400 output — input price dominates cost at ~92%, so my optimization order is context trimming, caching, then routing; making answers shorter is the last lever I pull."
- "I promise SLOs in three clocks: TTFT p50/p99 for perceived speed, TPS for reading flow, total for batch. My fallback on TTFT breach is timeout-and-escalate to the smaller tier — usually cheaper *and* faster, which surprises people until they see the numbers."
