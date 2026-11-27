# The Interviewer's Guide — How to Run the Mocks (and Grade Like a Bar-Raiser)

**Why this file exists:** the fastest way to level up is to run mocks as the *interviewer* — grading others forces the rubric into your bones (the seniority ladder says the same: "grade a friend against the rubric; you'll hear the levels"). This guide is how to do it well: the structure, the probing technique, and the calibration.

## Setup (5 minutes before)

1. Pick the mock; re-read its prompt and rubric.
2. Set the timer segments: 10 clarify · 20 architecture · 10 deep dive · 5 curveballs. Say them out loud — structure is part of what you're modeling.
3. Decide your persona: *interested peer*, not gatekeeper. You're simulating a good interviewer; the candidate should feel pushed, not ambushed.

## Running each segment

**Clarify (10 min):** give the prompt, then stay quiet. A strong candidate asks 3–6 questions (scale? latency budget? failure cost? who's the user?). *Your job:* answer consistently — write your answers down as you give them; inconsistent facts are an interviewer failure, not a candidate test. If they ask nothing and start drawing, note it (the #1 process mistake in the mistakes file) but let them run — the architecture will expose the cost of skipped clarification.

**Architecture (20 min):** listen for the *spine* first (the request path, the data path), then the failure modes. Do NOT correct or hint — your silence is the test's integrity. When they go quiet or loop, one neutral prompt only: "What would you do next?" If they're stuck on a detail, table it: "Park that — what's the biggest open risk?" Note the moments where they made a *choice with a reason* vs. listed options — choices are the signal.

**Deep dive (10 min):** pick ONE thing from their design and go two levels down — a number ("where did 50ms come from?"), an alternative ("why not a queue here?"), or a failure ("what happens when this dies?"). The [deep-dive guide](./09b-deep-dive-defense.md)'s five attack patterns are your menu. Follow the answer, don't script it — if their answer opens a better thread, take it.

**Curveballs (5 min):** pick 1–2 from the mock's list. The curveball is passed by *structure under surprise* (reframe, mechanism, tradeoff), not by a correct answer — grade the recovery, not the stumble.

## Grading (10 minutes after)

Score against the mock's rubric. Four calibration rules:

1. **Grade the level, not the points.** A mid candidate who nails every box is a high-mid; a senior candidate who skips two boxes but reframes the problem and prices the tradeoffs is still senior. The rubric rows are evidence, the level is the verdict.
2. **Evidence over impression.** Write the exact sentence that earned the level call ("she said 'the eval set is the launch gate' unprompted — that's the senior tell"). If you can't quote it, don't claim it.
3. **The two-question check for level inflation:** Could this candidate *teach* the junior version of this design (senior+)? Could they *decide what not to build* and defend it to a VP (staff)? If yes, the level calls stand.
4. **Deliver the verdict with one strength and one gap.** "Strong on the layered safety design; the gap was cost — no numbers until I asked. That gap is the mid-to-senior line in this rubric." Feedback they can act on beats a score.

## The meta-protocol

Run each mock twice: once as candidate (with a friend interviewing from this guide), once as interviewer. The asymmetry is the point — as candidate you practice producing; as interviewer you practice *recognizing*, and recognition is what you'll do to yourself under pressure.
