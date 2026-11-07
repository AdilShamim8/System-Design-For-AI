# Curveball Follow-Ups — The Questions After Your Answer

Interviewers grade the follow-ups harder than the original: anyone can rehearse an architecture; **thinking under a shove** is the signal. Each item: the shove, why it's asked, the strong reply's *shape*.

## Scale shoves

**"Your design handles today. What breaks first at 100×?"**
Expected: a *specific* component, not "we'd scale." Strong shape: "the vector index first — 2M to 200M vectors is 30× memory and the single-node answer dies; then the gateway's token-bucket Redis becomes the hot key. Here's the migration order…" Name the breaking component, why, and the fix sequence.

**"And at 0.1× — you're losing money on every request?"**
The scale-down question (nobody rehearses it). "At this volume I'd collapse tiers: drop the reranker, single region, batch everything, the small model — the architecture simplifies when the constraint is cost, not scale."

**"Your p99 doubled overnight. Walk me through your morning."**
The debugging script: dashboards first (which horizon moved — x1), then logs GROUP BY (model/prompt/corpus versions — the a7/x1 habit), then segment (one tenant? one region? one query class?). "Latency is load- or content-shaped; my first five minutes decide which."

## Model-behavior shoves

**"The model provider is down. All of it. Go."**
They want the degradation ladder, cold: cache-only mode (b5 becomes availability — my favorite sentence from x3), queue with honest ETAs, human fallback for the critical slice, status comms. "We serve degraded-but-useful, we don't retry-storm a dead provider, and we pre-negotiated the second provider for exactly this."

**"Marketing wants it to say YES more. Engineering wants fewer wrong answers. Pick."**
The precision/recall conversation in a business costume — answer with the cost matrix (a3), never with a side. "Both are threshold choices; give me the dollar cost of a wrong YES and a missed YES and I'll show you the optimal dial — and if we can't measure those, that's the first project."

**"What's your hallucination rate?"**
The FN-04 question. "Measured, per release, on a versioned adversarial set — mine ran ~10% out-of-corpus compliance before prompt hardening, low single digits after, and the residue is why the output guardrails and citation requirement exist. Zero is not a number I'll claim."

**"A prompt tweak improved answers for English, degraded them for German. Ship?"**
The slice-eval question (FN-10's shape): "No — my eval set is multilingual exactly for this; the aggregate hid a subgroup regression, so the tweak iterates until it's Pareto-neutral or we gate by locale."

## System-design shoves

**"Where does the data come from?"**
The unglamorous probe that fails most LLM candidates. Have the ingestion story: sources, CDC, validation, corpus versioning, freshness SLA (ai-stack/data-pipelines). If your answer starts with "the docs team uploads…" you've lost the architecture question.

**"What are you NOT building?"**
The seniority ladder's flex. Have a real "no": "No fine-tuning this year — the eval bar doesn't demand it (b6's matrix); no multi-region while we're single-jurisdiction; no agent autonomy over money — the grid says human approval, full stop."

**"How would you know it's working — in one sentence, for the CEO?"**
One metric, product-level: "30% of tier-1 tickets deflected at equal-or-better CSAT, trending four weeks." Everything else is engineering detail; can you compress?

**"Cut the budget 70%. What survives?"**
Prioritization under constraint: keep evals and logging (they're cheap and everything depends on them — b4/x1), keep the cache (it IS the cost fix), drop the reranker, collapse to one model tier, batch what's async-able. "The system gets simpler, not worse — constraint is clarifying."

## The meta-shoves

**"You just contradicted yourself from ten minutes ago."**
Two acceptable moves: (1) "You're right — and it changes X too, so let me revise…" (adaptability scores HIGH — 12-common-mistakes #5), (2) "Let me reconcile — I meant A in that context, B in this one, and the difference is…" Never the third move (defending the contradiction).

**"Why should we not build this at all?"**
The restraint question. The strongest answer in any AI interview: "We shouldn't if [condition] — if the eval bar can't be met at the liability the product carries (FN-04), if the volume doesn't clear the unit economics (x2), or if a rules-based 80% solution gets 80% of the value this quarter. Here's the cheapest test of that…" Teams hire people who can kill their own project.

---

**Drill:** pick five of these and have a partner (or a recording) throw them at you *during* a mock — the curveballs are where the mock's realism comes from. The [mock interviews](./mock-interviews/) embed these deliberately.
