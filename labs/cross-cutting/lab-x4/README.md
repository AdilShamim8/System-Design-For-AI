# Lab x4 — The Design-Document Drill

| | |
|---|---|
| **Prerequisites** | Chapter X.1, S.1–S.4 (the design studio) · most labs behind you |
| **You will build** | A real one-page design doc for a real prompt, then grade it with the rubric interviewers and architecture reviewers actually use |
| **Est. time** | 3 hours (1 to write, 1 to grade, 1 to rewrite) |

**The story.** The system design interview is a *design doc, spoken*. The on-the-job equivalent — the architecture review — is a design doc, written. Both reward the same skill: **structured judgment under constraints, with numbers.** This lab compresses that skill: you'll pick a prompt from the question bank, write the one-pager you'd present to a senior reviewer, then grade yourself against the rubric — and rewrite once. The artifact you keep is a template you'll reuse for the rest of your career.

## Part 1 — Pick a prompt and write the one-pager (60 min, timer ON)

Choose from `interview-prep/` banks (Mock 1's support bot, Mock 4's gateway, or a question bank scenario). The doc structure — seven sections, one page, no cheating with 6-point fonts:

```
1. Problem & users          — 2 sentences: who, what job, what scale
2. Requirements             — functional (3) + non-functional (3, WITH NUMBERS: p99, RPS, cost/1K)
3. High-level design        — one diagram (boxes/arrows), one paragraph walkthrough
4. Data & model choices     — data stores, index, model tier — each with a one-line WHY
5. The three scariest failures — failure mode → detection → mitigation (this section gets you hired)
6. Evaluation & rollout     — how you'd know it works; A/B plan; guardrails
7. Cost                     — unit economics, one line, from your x2 tree
```

Rules that make the drill real: **every non-functional requirement has a number; every choice has a because; the failures section names detection, not just prevention.** Write it in 60 minutes, timed, no interruptions — interview conditions.

## Part 2 — Grade it with the rubric (45 min)

Score each section 1–5 against what a senior reviewer looks for:

| Section | What 5 looks like | What 2 looks like |
|---|---|---|
| Problem | names users, scale, the actual job to be done | restates the prompt |
| Requirements | numbers, priorities, explicit non-goals | "should be fast and scalable" |
| Design | every box justified, alternatives named and rejected | boxes copied from a template |
| Data/model | choices tied to requirements; one tradeoff each | brand names, no reasons |
| Failures | detection + mitigation + blast radius, ranked | "we'll add monitoring" |
| Eval/rollout | offline gate + online A/B + rollback plan | "we'll test it" |
| Cost | per-unit number, biggest lever named | absent |

**Checkpoint 2:** Score honestly — most first drafts land 2–3 on failures and eval (everyone's weak spot; it's why X.2 exists). Identify your two lowest sections; those are your interview weak spots too, and now you know before the interviewer does.

## Part 3 — The rewrite (45 min)

Fix the two weakest sections. Not polish — *thinking*: for failures, go through your own x1 dashboard and x3 playbook (what alerts, what cliffs?); for eval, your b4 gates and a8 design (what metric, what N, what guardrails?). The rewrite should add *specificity you didn't have in draft one* — real numbers from your own labs. That's the entire difference between a junior doc and a senior one: not better prose, more *measured* claims.

**Checkpoint 3:** Diff the two versions. Show the diff to someone (or your journal) and name the upgrade: "v2 replaced 'monitor for drift' with 'PSI on query embeddings, alert at 0.35 sustained 3h, cache-only degradation mode.'" One such sentence per section and you have a senior-grade document.

## Part 4 — Speak it (30 min)

The interview version: present the doc out loud in 10 minutes — the same structure, spoken, standing at a whiteboard or a blank doc you draw on. Record yourself. Watch for: "um" density in the failures section (uncomfortable material reads as discomfort), missing numbers you "knew" while writing, and whether you draw the diagram in the same order you wrote it. Rehearse until 10 minutes fits with 30 seconds spare — time pressure is the interviewer's stealth test.

**Checkpoint 4:** Keep the recording. It's your baseline; after two mocks in `interview-prep/mock-interviews/`, compare — the improvement you hear is the course working.

---

## Explain it back

1. Why does every non-functional requirement need a number?
2. Why is "we'll add monitoring" a 2 and what does a 5 look like?
3. What did your rewrite add that draft one lacked? Be specific.
4. Why present out loud after writing? What does speaking expose that writing hides?

## Extensions

- **The second prompt:** repeat the drill with a different bank question (aim for one ML-heavy, one GenAI-heavy). The template should feel *faster* the second time — that feeling is the skill forming.
- **The hostile review:** have a friend (or an LLM primed as a skeptical staff engineer — "challenge every number") attack the doc for 15 minutes. Every question you can't answer is a section that isn't done.
- **The real thing:** next time anything needs designing at work or in your project, write this exact one-pager *first* and get it reviewed before building. The doc is the cheapest bug you'll ever fix.

## What you can now claim in an interview

"I write design docs in a fixed seven-section structure — requirements with numbers, choices with reasons, three scariest failures with detection paths, eval gates, and unit cost — and I can present it in ten minutes or defend it for forty-five. I've graded my own docs against a rubric and rewritten the weak sections with numbers from labs I actually ran."
