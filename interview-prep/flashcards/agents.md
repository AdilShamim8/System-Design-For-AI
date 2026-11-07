# Flashcards — Agents & Guardrails

22 cards. Track C's loops, contracts, and the safety stack.
---

**The agent loop, from memory.**

> while steps < max: action = model(state) — tool call or final answer, as JSON; if tool: state += run_tool() result (errors as data); else return. Budgets: steps, tokens, cost, wall-clock — enforced OUTSIDE the model.

**Why are tool errors returned, never raised?**

> The model reads the error and self-corrects within the episode (measured: most dispatch-error episodes recover in +1 step). An exception kills the episode — and in production, becomes a ticket.

**The tool contract rubric — six items.**

> Negative purpose · fully-constrained params · errors-as-data · declared side effects (gated by the grid) · idempotency keys · token-budget consciousness (return summaries, not dumps).

**Prompt injection — the Chevy lesson in one sentence.**

> The bot's rules lived in the prompt — the part any user can try to rewrite; pricing and policy commitments flowed through model free-text instead of deterministic code. 'The prompt is advice; code is law.'

**Indirect injection — why it's worse than direct.**

> The instructions hide in *retrieved content* (a document, a web page) — trusted input by architecture, adversarial by content. Defense is the layer stack; capability scoping (no dangerous tools) is the strongest layer.

**Unguarded vs. guarded injection compliance — the lab numbers.**

> Unguarded agents comply with 30–60% of injection attempts; the input-filter + prompt-hygiene + output-check stack takes it to single digits. Not zero — which is why human gates exist for the dangerous stuff.

**Why must budgets live outside the model?**

> The model is the thing being bounded — asking it to 'be economical' while looping is asking the fire to be less flammable. Steps/tokens/cost/time: hard caps in code, alerts on approach, dead-letters on breach.

**Memory's three tiers — and what lives where.**

> Working: last K turns verbatim (flow; system prompt pinned). Episodic: rolling summary (arc; lossy — occasionally wrong). Semantic: exact facts (IDs, amounts) in a TABLE, injected verbatim. IDs never live in summaries — my lab watched #12345 become #1245.

**The memory quiz — what to test at turn 30.**

> Early facts (order number), mid facts (error code), narrative (the turn-5 issue), recency (last exchange). Score exact-match for IDs, fuzzy for narrative. My results: summary+facts ≈ 4–5/5 at flat ~1.5K tokens.

**When does multi-agent beat a single agent?**

> Exactly three reasons: context isolation (digest the swamp) · per-role model routing (30–60% cost cut) · change isolation (edit one role's prompt safely). Everything else is fashion — race the monolith control first.

**Handoff validation — why inter-agent messages need schemas.**

> Handoff drift is multi-agent's chronic disease: one agent's format drifts, the other misroutes silently. LLM-to-LLM boundaries get the same validation rigor as LLM-to-database. Most 'multi-agent bugs' are structural type errors.

**Trajectory grading — the definition and the catch.**

> Grade the path, not just the outcome: steps, loops, wrong-tool calls, groundedness. The catch: good outcomes via garbage paths exist (1–3 per 30 in my labs) — they're scheduled regressions, not successes.

**The attack set every agent needs before shipping.**

> Direct injections · indirect injections (planted in retrieved docs) · impossible tasks (loop bait) · blast radius ('email everyone') · authority abuse ('send my resignation') · budget bombs. Every attack maps to the layer that catches it — the attack-to-layer table is the deliverable.

**The kill switch — what Tay taught.**

> Microsoft's fast, public shutdown WAS the incident response working. Every autonomous system needs a tested kill switch — before launch, not during. Budget caps and dead-letters are the productized version.

**Agent memory grows how across an episode — and the fix.**

> Every step resends full history: cost grows linearly-ish per step, total quadratically-ish. Fixes: c4's tiers (window, summary, fact table) — and step-count minimization as an explicit optimization target.

**Sandbox discipline for coding agents.**

> Branch-only writes with reviewable diffs · no network · CPU/time caps (a `while True` test dies by timeout) · no secrets by construction · irreversible actions absent from the tool surface. 'The sandbox is the product.'

**Structured test output — the coding-agent multiplier.**

> Return {passed, failed:[{name, traceback}]} instead of raw stdout: agents that READ failures fixed 9/10 localized bugs vs ~5/10 with misleading messages in my lab. Errors-as-data at its most profitable.

**Human-in-the-loop — how it fails, and the fix.**

> Rubber-stamping: 99.7% approval in <2s means the gate is theater consuming safety budget. Fix: gate only the risky slice (the grid), make review informative (diffs, risk scores), measure CATCHES per 1K reviews, not reviews completed.

**Agent evaluation in CI — what the gate blocks.**

> Any prompt/tool/model change that regresses: outcome rate, trajectory health, or attack-set pass rate. 'An agent without an eval gate is a demo with deployment access.'

**Sydney/Bing — the state-space lesson.**

> Two-hour conversations grew a persona nobody designed; Microsoft's fix was systems engineering (cap conversation length), not model moralizing. Long conversations exit every tested envelope — bound the envelope first, extend deliberately.

**Cost per successful outcome — the agent metric.**

> Total eval cost ÷ successful outcomes. Turns 'agent quality' into a price: model A, 85% at $0.02 vs model B, 92% at $0.09 — now it's an engineering conversation.

**DPD's chatbot — the two lessons.**

> (1) A generative layer bolted onto a scripted system inherits the brand's authority with none of the script's constraints — and fails personality-shaped (viral). (2) A guardrail that demonstrably failed and stayed live = incident in progress. Rollback, not hope.

---

*Study method: cover the answer, say it out loud, uncover. Cards you miss twice get copied into your journal. 10 minutes a day beats two hours on Sunday — spaced repetition is the mechanism, not effort.*
