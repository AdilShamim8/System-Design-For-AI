# Lab c2 — Worked Solution and What the Numbers Mean

## Expected results (our runs, gauntlet of 10 episodes per version)

| Contract version | Pass rate | Dominant remaining failure |
|---|---|---|
| v1 — bare docstring | ≈ 30–50% | invented recipients, email-as-question |
| v2 — full contract + allowlist | ≈ 70–85% | authority violations, ambiguity handling |
| v3 — gates + idempotency | ≈ 85–95% | rare; refusal nuance |

## The five lessons hidden in those numbers

1. **The description IS the API for an LLM.** One sentence of docstring → half the gauntlet fails. Negative-purpose clauses ("NEVER send questions via email"), constrained params, and explicit scope rules → +30–40 points. No model upgrade buys that much for that little — description engineering is the cheapest reliability lever in the agent stack.
2. **Guardrails distribute across layers, and the contract is the innermost.** The gauntlet shows contracts alone can't reach 100% — authority questions ("send my resignation") need system-prompt policy or human gates. Production reality: contract (inner) → system prompt policy (middle) → approval gates / human review (outer). C.5 assembles the full stack; this lab builds the foundation everything else stands on.
3. **Errors-as-data enables self-correction, measured.** Allowlist rejections with the *allowed list in the error message* recover in one step almost every time; bare `ValueError` kills the episode. The pattern is identical to c1 and b7 — it keeps reappearing because it is *the* interface law of LLM systems: **everything returns data; nothing raises at the model.**
4. **Idempotency is not optional once retries exist.** Episode 6 ("send that again") is a *user* retry; network timeouts are *system* retries. Without idempotency keys, both double-send. Every payment API on earth solved this decades ago; agents rediscovered it in 2024 — the rubric exists so you don't rediscover it in production.
5. **The reversibility × cost grid is the governance artifact.** Where a tool lands on the grid decides its gate: none, log-only, token-confirm, or human-approve. When an auditor or exec asks "how do you know the agent won't do something catastrophic?", the grid *is* the answer — a named policy applied per tool, not a vibe about "guardrails."

## Common mistakes

- **Constraints in the description only.** "Max 80 chars" written in prose but not enforced in code — the model mostly obeys, and occasionally doesn't. *Validate in the tool; describe for the model; never confuse the two layers.*
- **Allowlist checked after sending.** Validation order matters: check everything, then act. One misplaced line and your "contract" is a comment.
- **Gates on everything.** Confirmation friction on reversible-cheap tools destroys the agent's usefulness and trains users to rubber-stamp — which destroys the gates that matter. The grid disciplines this; instinct doesn't.
- **Testing tools individually only.** A tool can pass alone and fail in the loop (episode 3: the *agent* misuses a correct tool). Always re-run the gauntlet inside the c1 loop.

## Interview lines this lab earns you

- "Tool descriptions are APIs for a client that can't read docs — I measured a 30–40 point gauntlet improvement from a bare docstring to a full contract, and the remaining failures needed system-prompt policy and approval gates: guardrails are layers, and the contract is the innermost one."
- "I place every tool on a reversibility × cost grid and gate accordingly — token-confirm for irreversible-cheap, human approval for irreversible-expensive, log-only for reversible. It's the same governance instinct as payment APIs, applied to agents."
