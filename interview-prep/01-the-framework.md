# The Answer Framework — Six Steps, Forty-Five Minutes

Synthesized from the interview-prep traditions (KodeKloud's six-step course, the five-step senior-engineer framing, the field guide's time allocations), adapted for AI system design. **Learn the skeleton until it's automatic** — the skeleton is what frees your working memory for the actual problem.

## The six steps

| Step | Minutes | What you do | What it signals |
|---|---|---|---|
| **1. Clarify** | 5 | Users, scale, read/write, latency, cost, the *actual* job to be done; state non-goals | You build the right thing |
| **2. Estimate** | 5 | QPS, storage, $/day — powers of ten, assumptions aloud | You think in numbers |
| **3. High-level** | 10 | Boxes and arrows; walk one request end-to-end; name the data stores and *why* | You can architect |
| **4. Deep dive** | 15 | The interviewer's chosen corner: data model, failure modes, the ML/LLM specifics | You have depth |
| **5. Tradeoffs** | 5 | What you gave up, what changes at 10×, what you'd revisit | You design, not recite |
| **6. Operate** | 5 | Monitoring, eval gates, rollout (shadow→canary→full), the riskiest assumption | You ship and own |

**Timing truth:** steps 1–3 are pass/fail hygiene; the interview is won or lost in 4–5; step 6 is the senior tell. If you're at minute 20 without a diagram, you're losing.

## Step 1 — the clarify checklist (ask 4–6, not 20)

- Who's the user and what's the job? (a support bot *deflects tickets* — it doesn't "answer questions")
- Scale: DAU? Requests/day? (→ you compute QPS in step 2)
- Read/write ratio? Peak/mean? (caches exist because of this question)
- Latency budget? p50 or p99? (cheatsheet #5 anchors)
- Cost constraints? Who pays per request?
- The ML-specific one: **"what happens when it's wrong?"** — who notices, who pays, how wrong is tolerable. This question alone separates AI-system candidates from system-design tourists.
- Then: "Here's what I'm *not* going to design: …" — non-goals earn respect.

## Step 2 — estimation patterns

`DAU × actions × fraction → req/day ÷ 86,400 → QPS ×2–3 for peak`. Storage: `writes × bytes × replication × growth`. Cost: `tokens/day × price` (cheatsheet #6/#7). Always: assumptions aloud, round to powers of ten, sanity-check against a known system.

## Step 3 — the AI system skeletons (draw the one that fits)

- **Classical ML**: events → feature store (offline/online) → training pipeline → registry → serving (batch/realtime) → monitoring → retraining loop (diagrams/1)
- **RAG**: ingest (parse→chunk→embed→index) + query (retrieve→rerank→generate→cite) + ops (eval, cache, freshness) (diagrams/2)
- **Agent**: loop + tools + memory + guardrails + traces (diagrams/3-4)
- **Gateway/platform**: auth → rate limit → route (cache→small→big) → fallback → log/observe (Mock 4)

Name components by *role* ("a queue here — Kafka-class"), not brand-first. Brand names answer *what*, roles answer *why*.

## Step 4 — the deep-dive menu (know two cold)

Data model & consistency · feature/prompt versioning · failure modes & degradation (the ladder!) · evaluation (offline gates + online A/B) · drift & monitoring · cost at scale · isolation/multi-tenancy · security layers (cheatsheet #10). For every failure you name: **detection first, then mitigation** — "how would you know" is the question behind the question.

## Step 5 — tradeoff sentences that work

"I'm choosing X for <requirement>; it costs me <drawback>; if <condition> changed I'd switch to Y." Every architecture is three of these sentences. If you can't name what a choice costs, you didn't make a choice — you made a citation.

## Step 6 — the operating close

"My dashboard watches <3 metrics from cheatsheet #8>; rollout is shadow→canary 5%→full with a rollback on <guardrail>; the riskiest assumption is <X> and the experiment that tests it is <Y>." Interviewers write down candidates who close like this.

## The skeleton in one breath

*Clarify who and how much → estimate in tens → draw the boxes and walk one request → dive where they point, failure-first → say what it cost → say how you'd run it.* Now go make it automatic: [the mocks](./mock-interviews/).
