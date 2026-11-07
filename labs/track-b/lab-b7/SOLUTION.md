# Lab b7 — Worked Solution and What the Numbers Mean

## Expected results (our runs, small hosted model, temperature 0)

| Stage | Format success | Notes |
|---|---|---|
| Naive prompt + `json.loads` | ≈ 60–85% | markdown fences, prose preambles, trailing commas |
| + JSON mode | ≈ 95–98% | fences gone; rare truncation at max_tokens |
| + Pydantic validation | format ≈ same, contract violations *caught* | string prices, invented fields now visible |
| + repair round 1 | ≈ 98–99% | error feedback fixes most contract misses |
| + repair round 2 | ≈ 99%+ | diminishing; dead-letter the rest |

## The five lessons hidden in those numbers

1. **The failure table drives the design.** Part 1's taxonomy (fences, commas, string prices, invented fields, refusals) maps one-to-one onto mechanisms (JSON mode, validation, coercion rules, strict schemas, temperature 0). Building the table *before* the fixes is the difference between engineering and superstition — and it's the same debugging discipline as b2's miss taxonomy, applied to format.
2. **Validation is a trust boundary, not a formality.** The moment an LLM writes into your database, its output is *untrusted user input* — treat it like you'd treat a public API payload. Pydantic at the boundary catches what the model "promised" and didn't deliver; the database never sees the difference.
3. **Repair loops are a patch with a budget.** Error-feedback retries rescue most failures at 2–3× cost — fine at 5% failure rate, pathological at 40% (your prompt or model changed; fix upstream). The circuit breaker (Part 4) exists precisely because repair can *hide* a regression long enough to become an outage. Measure repair-rate as a first-class metric, not just success-rate.
4. **Dead-letters beat silent guesses.** A `None` that routes to human review is honest; a "best-effort" default row in your database is a lie with a schema. Every production extraction pipeline has a queue of last resort — design it deliberately, monitor its depth (its growth rate is your early-warning signal, a7-style).
5. **Everything versions together.** Prompt + schema + model form one contract; log all three per call (b4's discipline). When extraction quality drifts, your first question is "what version is this?" — and the answer is in the logs, not in someone's memory.

## Common mistakes

- **`temperature=0` forgotten.** Extraction wants determinism; default temperature adds run-to-run variance to a *database write path*.
- **Validators that silently coerce everything.** Mapping every unknown category to "other" is safe; mapping every bad price to 0.0 is data corruption. Decide coercion vs. rejection per field, on purpose.
- **Unbounded repair loops.** Without `max_attempts`, a pathological input costs unlimited tokens and your latency p99 dies. Bounded retries + dead-letter, always.
- **Truncation failures mistaken for format failures.** If long descriptions hit `max_tokens`, JSON mode returns *valid-but-truncated* JSON — the fix is a bigger budget or shorter inputs, not more repair rounds. Check `finish_reason` before retrying.

## Interview lines this lab earns you

- "I ran a hostile-corpus extraction test and built the mechanism per failure mode: JSON mode for format, schema validation at the trust boundary, bounded repair with error feedback, dead-letter queues, and a circuit breaker on failure-rate spikes. My repair rate is a dashboard metric — because a repair loop that grows is a prompt regression hiding in plain sight."
