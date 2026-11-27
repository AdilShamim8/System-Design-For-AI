# Behavioral Questions — Round 2: AI-Specific Screens

**Ten more, harder.** Where round 1 covered the classics, round 2 covers the behavioral questions that only AI companies ask — the ones probing how you think about non-determinism, liability, eval culture, and saying no. Each has the question, what's really being probed, and the shape of a strong answer (STAR structure per the [story bank](./09-behavioral-questions.md); delivery rules at its end).

---

## BQ-7 — "Tell me about a time you shipped something you couldn't fully test."

**Probing:** risk calibration — not recklessness, not paralysis.

**Strong shape:** name the untestable residue precisely (long-tail failure modes of a generative system: you cannot enumerate inputs), then the containment (guardrails, sampled human audit, rollback path, the metric that would tell you it was going wrong — b7's layer stack). The failure answer is "we shipped and prayed"; so is "we refused to ship for six weeks." The strong answer ships *the smallest thing that learns*.

## BQ-8 — "Describe a time you had to say 'this model isn't good enough' to the business."

**Probing:** whether you can deliver bad news with a decision attached.

**Strong shape:** the number that wasn't good enough, the bar it missed, and the three options you brought (ship narrower scope, fix the specific slice, or don't ship and here's what we learn first). From the course: a3's threshold story — the business owns the operating point; you make choosing it possible. Saying no without options is obstruction; saying yes with a bad model is worse.

## BQ-9 — "Tell me about a time a metric you owned misled you."

**Probing:** epistemic humility with evidence.

**Strong shape:** a8's AA test — a metric machinery that manufactured false positives; or the global NDCG that averaged away ten broken languages (Q-GEN-11). The structure: the metric, what it hid, how you caught it (slice cut, null test), what changed permanently (per-slice dashboards, null checks in CI).

## BQ-10 — "How do you make decisions when the model can't be verified before launch?"

**Probing:** whether you have an eval culture or a hope culture.

**Strong shape:** the pre-launch/pre-registration discipline (declare the metric and the bar BEFORE the run — X.2's lesson, FN-11's Netflix-Prize echo: optimizing the visible metric isn't optimizing the goal), plus the post-launch loop (canary, guardrails, the rollback trigger written down before launch, not during the incident). Anchor: "the eval set is the contract with my future self."

## BQ-11 — "Tell me about a time you disagreed with a more senior person about an AI system decision."

**Probing:** backbone with respect; evidence over rank.

**Strong shape:** the disagreement (they wanted the frontier model everywhere; you had routing data — b6: 70% of traffic routed down-tier with no measurable quality loss), how you surfaced it (a one-page experiment, not a meeting fight), and the outcome either way (they were right — say what you learned; you were right — say how they came around). The collapse: "I just did what they said" or "I went around them."

## BQ-12 — "What's the first thing you'd do in your first week here?"

**Probing:** initiative pattern — do you instrument, ask, or build?

**Strong shape:** instrument before build — read the incident history, run the null checks (are the dashboards' numbers real? — BQ-9's humility, applied), find the eval set or note its absence, and ship one small thing (a slice cut on an existing metric) to earn the right to propose bigger ones. From the course: x3's first-week instrumentation answer. The collapse: a 90-day rearchitecture proposal on day 3.

## BQ-13 — "Tell me about a time you had to explain an AI system's limits to a non-technical stakeholder."

**Probing:** translation without condescension, honesty without fear.

**Strong shape:** the Air Canada frame (FN-04): liability follows deployment — so the explanation was about exposure, not architecture ("the system answers from these documents only; when it doesn't know, it says so; here's the measured rate; here's who catches the rest"). Numbers the stakeholder can repeat to THEIR boss. The collapse: analogies that break under the first follow-up question.

## BQ-14 — "Describe a time you killed your own project."

**Probing:** whether you optimize for outcomes or for being right.

**Strong shape:** the sunk-cost moment (weeks into a custom chunker, the frozen eval said a simpler structure-aware version won — b3), what you did (killed it, kept the eval), and what the eval saved you from shipping. The collapse: "I've never had to" — either too junior or not honest; every builder has a project that deserved to die.

## BQ-15 — "How do you handle it when your system causes a real incident?"

**Probing:** incident maturity — blamelessness with ownership.

**Strong shape:** the 3 AM structure from Q-AG-10 — detection (the metric that fired), mitigation (the rollback that was designed in), diagnosis (trace-first), and the systemic fix (what changed so this class of failure can't recur — not "I'll be more careful"). Own the system, fix the class. The collapse: blame the model, the provider, or the user.

## BQ-16 — "Why should we not hire you?"

**Probing:** self-knowledge under pressure.

**Strong shape:** a real gap adjacent to the role ("I haven't fine-tuned a frontier model at scale — I've built the systems around them: retrieval, routing, eval, guardrails; if the job is pretraining-adjacent research, I'm not your candidate") plus the honest counterweight (what that gap means in practice, and what you've done about it — the course's labs exist because of that gap). The collapse: a humble-brag ("I work too hard").

---

**Practice protocol:** for each, write YOUR situation in one line, tell it in 90 seconds out loud, then have a friend run the five attack patterns from [the deep-dive guide](./09b-deep-dive-defense.md) for 10 minutes. The story is the entry ticket; the drill is the interview.
