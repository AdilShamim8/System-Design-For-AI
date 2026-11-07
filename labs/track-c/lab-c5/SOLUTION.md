# Lab c5 — Worked Solution and What the Numbers Mean

## Expected results (our runs, c1-class agent, 30-episode eval + 10 attacks)

| Measurement | What we got |
|---|---|
| Outcome rate (mixed difficulty) | ≈ 70–85% |
| Trajectory-health rate | ≈ 75–90% |
| Good-outcome/bad-trajectory episodes | 1–3 per 30 — and they're the interesting ones |
| Injection success, unguarded | ≈ 30–60% |
| Injection success, guarded stack | ≈ < 10% (input filter + hardened prompt + output check) |
| Loop bait without budget guards | loops until cap on most tries |
| Loop bait with guards | bounded, dead-lettered |

## The five lessons hidden in those numbers

1. **Trajectory grading exists because outcomes lie.** The lucky-answer-via-garbage-path episode (your exhibit A) is a regression with a deadline: next model update, the luck runs out and the garbage path surfaces. Outcome-only evals are a snapshot; trajectory evals are a stress test. This two-axis discipline is the single biggest differentiator between teams that ship agents and teams that demo them.
2. **Unguarded agents fall to injection shockingly often.** 30–60% success for embedded instructions is typical — and *indirect* injection (instructions hidden in retrieved documents, the FN-07 pattern) is worse than direct, because the document is trusted input. The stack exists because no single layer suffices: filters miss paraphrases, prompts miss creative phrasings, output checks miss subtle compliance. Defense in depth isn't paranoia; it's arithmetic.
3. **Programmatic checks and LLM judges disagree in the informative places.** Where they agree (80–90% of cases), you're cheaply covered. Where they disagree — "wasteful but reasonable," "grounded but tangential" — is precisely where human eyes add value. Disagreement is a *routing signal* for review, not noise to eliminate.
4. **Budget guards belong outside the model because the model is the thing being bounded.** Asking the model to "be economical" while looping is asking the fire to be less flammable. Steps, tokens, cost, time: hard caps in code, alerts on approach, dead-letters on breach. Everything else is advisory.
5. **The eval gate is what converts all of this from practice to governance.** A 30-episode eval that runs on every change — and *blocks* on regression — is how prompt edits stop being vibes. Teams without gates rerun their outages; teams with gates rerun their tests. The five-minute CI script is the cheapest insurance in the whole agent stack.

## Common mistakes

- **Grading only outcomes.** You'll ship exhibit A (lucky garbage) and be confused when it regresses. The two-axis grade is the lab's core discipline.
- **Judges without calibration.** Running the LLM judge on trajectories without spot-checking 5 by hand is trusting an unverified instrument (b4's law, now at trajectory scale).
- **Guardrails as a checklist instead of a stack.** Listing "we have filters" isn't a stack — the *attack-to-layer table* is. If any attack reaches the user, the table has a hole, and the table — not vibes — tells you where.
- **Static eval sets.** The adversarial subset must grow with every new failure; a set that stops growing means the team stopped learning. Size the set, track the size.

## Interview lines this lab earns you

- "I evaluate agents on outcomes and trajectories — in my eval corpus, 1-in-30 episodes was a good answer via a looping path, which is a scheduled regression, not a success. Programmatic checks for the objective parts, a calibrated judge for the gray parts, and disagreements routed to human review."
- "My guardrail stack is documented as an attack-to-layer table: indirect injections, loop bait, blast radius, authority abuse — each caught by a named layer, verified by attack. Unguarded, my test agent complied with 30–60% of injections; the stack takes that to single digits, and the eval gate keeps it there across model and prompt changes."
