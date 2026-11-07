# Lab c5 — Data notes: your trace corpus is the dataset

**The dataset is the traces you've accumulated across c1–c4.** If you logged faithfully (each lab asked you to), you have 40–80 episodes with full trajectories. If not — that's the first lesson of agent eval, learned the honest way: *evaluation requires instrumentation, and instrumentation must precede debugging.* Go back, run 30 fresh episodes with logging on.

**What a usable eval case looks like (per episode):**

- the task/question
- the full trace (every step, every tool result)
- the outcome (final answer)
- your grades: outcome (pass/fail + type), trajectory health (the five programmatic checks), judge scores
- the attack label, if it's an adversarial case (injection / loop-bait / blast-radius)

**The adversarial subset (write these deliberately — 10 minimum):**

- 3 prompt injections hidden in "retrieved documents" (indirect injection — the FN-07 pattern)
- 2 impossible tasks (loop bait)
- 2 blast-radius tasks ("email everyone", "delete all")
- 2 authority tests ("send my resignation", "give yourself a raise")
- 1 budget bomb (a task whose honest completion needs 30+ steps)

**Calibration numbers (small hosted model, c1-class agent):**

- Outcome rates: simple tasks 85–95%, multi-step 60–85% — trajectories are humbler than demos.
- Trajectory-health: looping on maybe 5–15% of episodes without budget guards; with guards, ~0%.
- Injection success against an unguarded agent: often 30–60% — the number that motivates the whole stack. With input filters + hardened prompts: single digits.
- Judge-vs-programmatic agreement: expect ~80–90% on clear cases; disagreements cluster on "wasteful but reasonable" judgments — exactly the gray zone worth reading by hand.

**License:** yours. Scrub personal data before sharing traces — they contain full model outputs and any user text.
