# The Seniority Ladder — Same Question, Four Depths

"What level do you interview at?" is decided by *how* you answer, not what you've memorized. Below: the question "design a support bot for our docs" answered at four levels. Find yourself; know what the next rung sounds like; calibrate mocks accordingly.

## Junior — the map (accurate, guided)

Draws RAG correctly when prompted. Asks a few clarifying questions, accepts all assumptions given. Components named correctly ("vector database, an LLM API, a cache"). When asked "what if the bot answers wrongly?" — says "add a disclaimer / human review" without cost or mechanics. Needs the interviewer to drive the deep dive.

*Missing:* numbers, initiative in scoping, failure-mode specificity.

## Mid — the machine (complete, quantitative)

Runs the framework unprompted: clarifies users/scale/latency, estimates QPS and tokens/day, draws the two pipelines (ingest + query), chooses pgvector-vs-managed *with a reason*, specifies the eval (hit@k, faithfulness, refusal on adversarial set), mentions monitoring. Handles follow-ups (cache invalidation, freshness) with patterns from experience.

*Missing:* the business frame, proactive risk pricing, and the "why *not* build this" instinct.

## Senior — the system in context (tradeoffs, money, risk)

Everything mid does, plus: opens with the *job* ("deflect 30% of tier-1 tickets — here's what that's worth, which sets our eval bar and cost ceiling"). Prices failure (FN-04 unprompted: liability framing → guardrail layers, legal-visible commitments). Distinguishes must-have v1 from the roadmap (citations v1, HITL escalation v1.1, fine-tuning "not yet, here's the trigger"). Discusses team/process: eval gates in CI, on-call runbooks, what they'd instrument first week one. Says "I'd *not* build X" about something (the interview flex: restraint).

*Missing:* org-level framing and multi-quarter stewardship.

## Staff — the org (strategy, leverage, principles)

Everything senior does, reframed as decisions *other people* will execute: the principles that decide ten future variants ("grounding-first, cite or refuse — that principle survives model changes"); the platform-vs-product fork (build one bot, or the platform that makes ten bots cheap — cap2 economics); build-vs-buy with org reality ("we self-host nothing until an on-call rotation exists"); the two-year failure modes (corpus governance, tenant isolation, provider pricing shifts). Handles the curveball follow-ups ("your CFO kills the budget mid-quarter — what do you cut first?") with *prioritized* frameworks, not just answers.

## How to climb one rung in this course

- Junior→mid: do the labs. Numbers from your own runs replace adjectives.
- Mid→senior: x2's cost tree + the field notes + x4's drill. Risk and money become your vocabulary.
- Senior→staff: cap2 + the mocks *as an interviewer* (grade a friend against the rubric; you'll hear the levels).

## A calibration truth

Levels aren't knowledge, they're *defaults*. Mid defaults to the diagram; senior defaults to the money; staff defaults to the org. Your labs gave you mid-level content — the ladder files tell you which default to rehearse.
