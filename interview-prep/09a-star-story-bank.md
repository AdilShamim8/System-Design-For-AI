# The STAR Story Bank — Your Labs, Told as Stories

**Why this file exists:** the behavioral round is where candidates with real project work beat candidates with memorized answers — but only if the work is *packaged* as stories. This bank takes the labs you built in this course and turns each into a STAR-structured story (Situation, Task, Action, Result) with the follow-up questions you should expect. You did the work; this file makes it tellable in 90 seconds.

**How to use it:** pick the 5 stories that fit your target role. Rehearse each out loud until the 90-second version is smooth and the numbers are exact. Every story here is *true of the course's labs* — if you ran them, these are your stories; adapt numbers to your actual runs.

---

## Story 1 — "A model that looked great and wasn't" (Lab a6 / a3)

**Situation:** In a forecasting lab, my gradient-boosted model showed excellent offline error — too excellent. A model that beats its baseline by a suspicious margin usually isn't smarter; it's leaking.

**Task:** Find the leak before trusting a single number downstream.

**Action:** I audited the feature pipeline and found a rolling statistic computed with knowledge of the target's own window — the feature had seen the future. I rebuilt the join with point-in-time semantics (strictly-prior snapshots, `merge_asof` with no same-day matches) and re-trained.

**Result:** Apparent skill dropped — the honest number. The leaky feature had inflated error metrics by 50–60%. I added a null-shuffle check to my workflow: any unexplained jump in metric gets the shuffle test before anyone celebrates.

**Likely follow-ups:**
- "How would you catch this in a team setting, not a lab?" — *Point-in-time correctness as a feature-store guarantee, not a per-scientist virtue; null-shuffle checks in CI.*
- "What if the leaky feature is the strongest one and the business loves the number?" — *You show the leak with the shuffle test; a number you can't defend in production is a liability with a deadline.*

---

## Story 2 — "The A/B test that would have shipped a ghost" (Lab a8)

**Situation:** An offline metric showed a new ranker at +3%. The team wanted to ship. My job was to say what the offline number was worth.

**Task:** Design the experiment that would actually answer the question.

**Action:** I ran an AA test first — same model against itself — and watched the false-positive rate: optional stopping (peeking at results and calling it early) took the false-positive rate from 5% to about 20%. Then I computed the required sample size for a +1% relative effect (~780K users per arm) and gave the business the honest menu: extend the test, target a bigger effect, or accept being wrong 40% of the time.

**Result:** We extended the test two weeks. The effect was real but half the size — the offline +3% was directionally right, magnitude-wrong. The AA test became a standard step for the team.

**Likely follow-ups:**
- "What's an AA test?" — *A null experiment: A vs A. If it "wins," your experiment machinery is broken; it's the cheapest debugger in experimentation.*
- "How do you explain sample size to a PM?" — *N scales with 1/lift-squared; detecting small effects on low-variance metrics requires enormous samples — "we can decide Friday if we're willing to be wrong 40% of the time."*

---

## Story 3 — "The chatbot that refused to answer — on purpose" (Lab b2)

**Situation:** A RAG support bot answered everything, including questions it had no business answering. The risk: a confident wrong answer is a liability, not a bug (the Air Canada tribunal made that real — FN-04).

**Task:** Make refusal a designed behavior with a measured rate, not a temperament.

**Action:** I restructured the prompt around cite-or-refuse: answer only from retrieved context, refuse otherwise, and built an adversarial eval set — out-of-corpus questions, billing-risk questions, injection attempts — to measure the refusal rate rather than guess it.

**Result:** Refusal on out-of-corpus questions rose from about 60% to about 90% from prompt structure alone. The residual is why output guardrails and human escalation exist — refusal is a layer, not a wall.

**Likely follow-ups:**
- "Doesn't 90% mean 10% wrong answers?" — *The 90% is *appropriate* refusal on questions that should be refused; the residual gets guardrails and sampled human audit, not another prompt iteration.*
- "How do you evaluate a refusal without a human?" — *Adversarial set with known-should-refuse labels; refusal-appropriateness is exact-graded, like retrieval.*

---

## Story 4 — "The agent that wouldn't stop" (Lab c1)

**Situation:** My first agent loop worked beautifully — and then hit a case where the model called the same tool repeatedly, burning tokens in a circle.

**Task:** Make the loop safe to run without supervision.

**Action:** I moved all budgets outside the model: max steps, token budget, wall-clock — enforced in the loop, not requested in the prompt. I made tool errors return as data instead of raising, so the model could self-correct within the episode — and measured that most dispatch-error episodes recover in one extra step.

**Result:** A looping episode terminates with a named stop reason (BUDGET_STEPS) and a full trace, instead of an unbounded bill. The stop-reason taxonomy lets ops alert differently on "design smell" vs "latency incident."

**Likely follow-ups:**
- "Why outside the model?" — *The model is the advocate for continuing — it will always believe one more step is worth it. The loop is the adult in the room (C.1).*
- "How do you size the budgets?" — *From traces: p95 steps-to-completion plus headroom; budgets are monitored and tuned like any SLO.*

---

## Story 5 — "I made the system say no to a feature" (Lab c2 / Q-AG-12)

**Situation:** A stakeholder wanted an "agent" for invoice processing — five steps, three document types, a $500 approval line. The word "agent" was doing all the work in that sentence.

**Task:** Decide and defend: agent or workflow.

**Action:** I enumerated the path — parse, extract, validate, route, approve — and found the variance lived entirely in extraction, not routing. I proposed a deterministic workflow spine with LLM calls at exactly the two fuzzy steps, and human gates at the money boundary. I priced the alternative: LLM at every step meant roughly triple the monthly cost and three more non-determinism surfaces in an audit-relevant process.

**Result:** Workflow + two LLM steps. Faster, cheaper, auditable — and the "no" was received as engineering, not obstruction, because it came with the decision framework: *agentify only the steps whose cases you cannot enumerate.*

**Likely follow-ups:**
- "When WOULD you use a full agent?" — *When the path is genuinely unpredictable and failure cost is bounded — support triage across hundreds of intents, not a five-step invoice flow.*
- "How did the stakeholder react?" — *They got the same outcome, faster, and the framework for the next request — which is the actual deliverable.*

---

## Story 6 — "The eval that caught the regression before users did" (Lab b3 / Q-GEN-14)

**Situation:** A chunking change was about to ship — "better boundaries," no eval, just a spot-check that looked fine.

**Task:** Decide whether it ships.

**Action:** I ran the frozen eval set — retrieval graded exactly (hit@k on labeled pairs) — and the numbers said the change helped most queries but broke one slice: short factual queries lost 6 points because the new chunking split the answer's source table from its header.

**Result:** The change shipped *after* fixing the table-splitting edge case. Without the frozen set, we'd have traded a visible gain for an invisible loss and found out from users. The eval became the gate for every chunking and prompt change.

**Likely follow-ups:**
- "Where did the golden set come from?" — *Sampled from real queries, stratified by intent, graded against a written rubric by engineers — started with the transcripts we already had.*
- "What if the eval disagrees with your intuition?" — *The eval wins, then we debug the eval — either the data or my intuition is wrong, and only one of them is falsifiable.*

---

## The six questions, mapped to stories

| Behavioral question | Story to tell |
|---|---|
| "Tell me about a failure" | Story 1 (the leak) — a failure that became a permanent check |
| "Disagreement about architecture" | Story 5 (the workflow case) — no, with a framework |
| "How do you evaluate AI systems?" | Story 3 or 6 — measured refusal / eval gates |
| "Explain something complex to non-technical people" | Story 2 — sample size as a business decision |
| "Most complex system you've built" | Story 4 (the agent platform) — budgets, errors-as-data, traces |
| "Why us / why AI engineering?" | Your own — the labs gave you the evidence, the story is yours |

**Delivery rules:** 90 seconds per story, numbers exact ("60% to 90%," not "way better"), one sentence of reflection at the end — what you changed permanently, not what you learned to say.
