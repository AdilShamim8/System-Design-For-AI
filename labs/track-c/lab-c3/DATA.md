# Lab c3 — Data notes: 5 tasks, 2 systems, blind ratings

No external dataset. You need **5 research-brief tasks** over your b2 SQuAD corpus (or any docs you have): pick topics with (a) 1–3 clear sources, (b) sources requiring synthesis, (c) sparse/no coverage (tests REQUEST behavior), (d) ambiguous topics (tests routing), (e) a topic needing >1 research pass.

**The measurement discipline (this lab's "data"):**

- **Blind rating:** shuffle team/baseline outputs, rate each 1–5 on faithfulness + usefulness *before* unblinding. Your own bias toward the fancy architecture is the confound; blinding is the control.
- **Full cost accounting:** tokens *summed across all agents* (handoffs resend context — the overhead teams hide), latency wall-clock, handoff count.
- **Repeatability:** 3 runs per task at temperature 0 where possible; multi-agent systems amplify variance (errors compound across hops, c1's chaining law).

**Calibration numbers (small hosted models):**

- Simple tasks: single agent wins or ties on quality ~60–80% of the time, at ~half the tokens.
- 20K-token context tasks: team wins quality ~70%+ (context isolation is real).
- Mixed-model routing: 30–60% cost cut at ≈ equal quality when roles differ in difficulty.
- Handoff budget exhaustion on sparse topics: common without explicit REQUEST limits — cap round trips at 2.

**License:** your tasks and traces are yours; keep them — they extend directly into c5's evaluation set.
