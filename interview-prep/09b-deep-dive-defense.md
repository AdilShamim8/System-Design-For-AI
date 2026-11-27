# Defending Your Stories — The Deep-Dive Survival Guide

**What this is:** behavioral interviews no longer end at the story. Every STAR answer invites 5–15 minutes of drilling — and the drilling is where seniority is actually assessed. This file maps the five most common deep-dive attack patterns to this course's labs, with the answer that survives and the answer that collapses.

## The five attack patterns

### 1. "Go deeper on the number"

Your story said "refusal went from 60% to 90%." The drill: how was it measured? On what set? What's the confidence interval?

- **Survives:** the eval set's size and construction (adversarial, hand-labeled, stratified by risk type), the exact metric (appropriate-refusal rate on should-refuse questions), and honest bounds ("it's 50 questions per slice — directional, not statistically tight; the CI matters before I bet the quarter on it").
- **Collapses:** "we tested it" — no set, no metric, no size. A number without a denominator is a vibe.

### 2. "What else did you consider?"

Your story chose a workflow over an agent. The drill: name the alternatives and why they lost.

- **Survives:** two named alternatives with the specific disqualifier ("full agent: triple the cost and three extra non-determinism surfaces in an audited flow; pure rules: extraction quality on 40 formats was the blocker — that's why the LLM sits there").
- **Collapses:** defensiveness. If your choice can't survive its own alternatives, you didn't make a decision — you made a default.

### 3. "It worked. Why?"

Your story's fix improved things. The drill: what's the causal story — and how do you know it wasn't something else?

- **Survives:** mechanism + evidence ("structure-aware chunking keeps tables with their headers; hit@k on the table-query slice moved while others were flat — the slice isolation is the causal fingerprint"). This is a8's discipline wearing a behavioral hat: one variable, a control, slice-level reads.
- **Collapses:** "we shipped it and metrics went up" during a week when three other things shipped.

### 4. "Now change a constraint"

Your design served 1M users. The drill: what breaks at 100x? What if the budget halves?

- **Survives:** the scaling instinct from the labs — which component saturates first (the vector store's memory math at 2B vectors, the provider's rate limit on your gateway), what degrades gracefully (routing ladder, cache, refusal under load), what you'd cut first ("at half the budget: route 70% of traffic down-tier — b6 measured no quality loss on the eval set").
- **Collapses:** multiplying your architecture by 100 without touching a component list. The drill is testing whether you know *which* piece is load-bearing.

### 5. "What would you do differently?"

- **Survives:** a real answer with a reason ("I'd build the eval set before the second prompt iteration — the first week of prompt tuning was unfalsifiable; the golden set retro-fitted would have saved it").
- **Collapses:** "nothing, honestly" (arrogance) or "I'd communicate more" (a non-answer from a template).

## The meta-rule

Every deep-dive is the same question: *did you understand your own system, or did you drive it?* The labs in this course were built so you'd have mechanisms, alternatives, measurements, and constraints in memory — the stories are just where you show them.
