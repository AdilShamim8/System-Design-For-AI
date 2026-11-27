# Take-Home Examples — Three Worked Assignments

**Why this file exists:** the takehome guide (10) gives you the process; this file gives you the *reference solutions* — three assignment shapes you're likely to meet, each with the scoping decision, the build order, the deliberate scope cuts, and the defense-call prep. Read the guide first; these are its worked problems.

---

## Example A — "Evaluate Our Support Bot" (the eval-design takehome)

**The assignment (as given):** "Here are 500 transcripts from our support chatbot and its answers. Tell us whether it's good enough to expand from 2 categories to 20."

**The scoping decision (the first hour):** they did NOT ask you to improve it — they asked for a *verdict with evidence*. Scope: an eval, not a rebuild. The trap: manually reading 500 transcripts and writing a report — that's a vibe-check at scale, and it can't be re-run when the prompt changes.

**The build (day 1–3):**
1. Sample 60 transcripts stratified by category and CSAT-band; hand-grade against a written rubric (faithfulness: cited-or-not; resolution: answered-the-question; safety: stayed in scope) — this calibrates YOUR judge.
2. Freeze those 60 as the golden set; write the harness (coding-8's shape): exact retrieval metrics where docs are labeled, LLM-judge for the generation tiers, per-slice reporting.
3. Run the current bot on the 20 target categories' questions (you generate them from the KB — adversarial slice included) — the expansion verdict is a slice table, not a paragraph.
4. One page: the verdict per slice, the top-3 failure modes with example transcripts, the recommended gate for expansion.

**The deliberate cuts (say them in the README):** no retraining/re-prompting (out of scope — you evaluate, they fix); no statistical significance on 60 rows (per-slice with intervals, ±13 points at n=60 — say it); no live A/B (needs their traffic).

**The defense call, pre-loaded:** "why an LLM judge?" — calibrated against your 60 hand-grades, agreement reported. "What would change your verdict?" — the slice-level gates, and the two categories below bar are named. "What would you do with a week more?" — expand the golden set to 150, add the adversarial slice's refusal analysis.

---

## Example B — "Build a Mini Recommender" (the coding-flavored takehome)

**The assignment:** "Here's 1M rows of implicit feedback. Build a recommender. Tell us what you'd do differently at 100x scale."

**The scoping decision:** the deliverable is the *evidence trail*, not the model: baseline → one improvement → honest eval → the scale essay. The trap: spending 3 of 4 days on a neural model that beats the baseline by a point you can't explain.

**The build:**
1. Day 1: popularity baseline + the time-split eval harness (recall@20, coverage). The harness IS the deliverable — everything after is a diff against it.
2. Day 2: item-item CF (coding-2's shape): precomputed similarities, seed-lookup-merge online path. Report the lift: typical +15–25 recall points over popularity.
3. Day 3: the honest-eval pass: cold-start slice (new users), popularity-concentration check (are we just re-ranking the top decile?), the offline/online caveat paragraph.
4. Day 4: the scale essay (one page): precompute-vs-online split, the similarity matrix's memory math (drill 14), feature-store point (Q-ML-6), why the ranker comes next (A.2).

**The cuts, stated:** no deep learning (the lift doesn't justify it at this size — and you can SAY that with the baseline numbers); no serving code (a `rank(user_id)` function with documented latency is enough); diversity re-ranking mentioned as next-step, not built.

**Defense call:** "walk me through the eval split" — time-split, why random leaks (STAR story 1's logic). "Why not matrix factorization?" — at 1M implicit rows, item-item CF gets most of the value at a fraction of the complexity; MF is the next experiment, gated on the cold-start numbers showing it matters.

---

## Example C — "Design + Prototype the Guardrail Layer" (the safety takehome)

**The assignment:** "We're adding a chatbot to our fintech app. Prototype the safety layer: it must never give investment advice, and must escalate crisis mentions to humans."

**The scoping decision:** two hard requirements, one of them (advice-detection) is a classification problem with measurable precision/recall, the other (crisis escalation) is a high-recall-mandatory path with a deterministic handoff. Different shapes — say that in the README's first paragraph.

**The build:**
1. The taxonomy first: what counts as investment advice (recommend/forecast/compare vs educate)? Write the 3-class definition with examples — the classifier and the judge both grade against THIS.
2. Advice-detection layer: a small fine-tuned classifier OR prompted LLM judge (say the trade: the prompt is a day, the fine-tune is a week + better at edge cases; you chose the prompt for the takehome, fine-tune flagged as the path with more data — mock 10's decision shape, in miniature).
3. The escalation layer: crisis-keyword + model-agreement dual trigger (either fires → handoff): the human handoff is a stub with the interface designed (queue, SLA, the message the user sees) — c2's approval grid, wearing fintech clothes.
4. The eval: 100-labeled advisory set + 50 crisis probes; report the confusion matrix and the recall on crisis (the number that matters: anything under ~95% on the probe set is a redesign, not a threshold tweak).
5. One page: the layer diagram, the two rates, the failure analysis of the 5 worst mistakes.

**The cuts:** no multilingual (scope stated: English v1, the taxonomy translates but the classifier doesn't); no latency optimization (correctness first in safety layers; the p95 is reported, not tuned); no adversarial red-team beyond the 50 probes (recommended as the follow-up, x4's drill referenced).

**Defense call:** "your crisis recall is 96% — is that good enough?" — the honest structure: the probe set is 50, so the interval is wide (±8 points at 95%); the DESIGN compensates — the dual trigger means a keyword miss still fires on model agreement, and the failure mode analysis shows which probe class slipped. "What's the worst false-positive cost?" — an unnecessary escalation to a human: annoying, auditable, recoverable — the asymmetry is the design's whole justification.

---

**The meta-lesson across all three:** the winning takehome is the same shape every time — scope stated, baseline/eval first, ONE improvement with honest numbers, deliberate cuts defended in writing, and the defense-call answers pre-loaded. The graders are testing whether you ship like a professional: bounded, evidenced, and clear about what you didn't do.
