# Mock 2 — Design YouTube Recommendations

## The prompt (read aloud, start the clock)

Design the recommendation system for a short-video app: 100M users, 40M new videos uploaded daily, infinite scroll feed. Average session 25 minutes. The current system's watch-time has plateaued and the CEO wants 'something with AI' — you're the architect who has to make it not just work but not destroy the platform.

*45 minutes. Paper or a blank doc. Timer ON. Attempt cold before reading the walkthrough — the walkthrough is the grading key, and reading first is rehearsal-shaped cheating.*

---

## Candidate-quality walkthrough (time-marked)

**[0:00–5:00 Clarify]** "Success metric first — watch time? And is there a guardrail concern: creator ecosystem, content quality, addiction-adjacent engagement? Volume: uploads vs. users. Latency: this is a feed, so I'm assuming a few hundred ms budget server-side. And cold-start matters at 40M daily uploads — most videos will never have engagement data. One more: is search-and-browse in scope or feed only?" Interviewer: watch-time primary but 'don't radicalize the teens' is an explicit constraint; feed only.

**[5:00–10:00 Estimate]** "100M DAU × ~100 videos/session-day… call it 10B impressions/day ≈ 120K QPS mean, ~300K+ peak — real scale. Retrieval must hold this at ~100ms and can't be a single model scoring 40M videos per request — that math dies immediately: even 1µs per score is 40 seconds. So the architecture is forced: funnel. Corpus: 40M daily × ~60s avg × 10MB/min ≈ 400TB/day of video, but the *recommendation* corpus is embeddings and stats, not the media — ~100M vectors/day at 512-dim ≈ 200GB/day of new vectors, which is itself a serious indexing problem."

**[10:00–20:00 High-level]** Draws the funnel: (1) **candidate generation** — multiple blended sources: collaborative filtering (co-watch), content-based (video/user embeddings from a two-tower model), session-based (recent watches), social/follow graph, trending with personalization; each source must be cheap, ANN-indexed, and return ~1K candidates. (2) **Ranking** — a heavy model (deep GBDT-neural hybrid) on ~1K candidates scoring expected watch-time + engagement signals, calibrated-ish, ~10–50ms on the 1K. (3) **Re-ranking** — diversity (don't show 5 videos of the same thing), freshness, creator fairness quotas, dedup against session history, exploration slots. The feedback loop wraps everything: impressions → watch events → streaming training data → nightly/hourly model updates. "The one-line version: cast a wide cheap net, rank expensively, polish with rules, learn from everything — the three-stage pattern that YouTube's own papers formalized."

**[20:00–35:00 Deep dive — interviewer picks the feedback loop and freshness]** "This is where systems like this die. Watch-time-optimization has known pathologies — my lab ran a miniature: popularity spirals (the top decile absorbed ~50% of engagement; coverage collapsed), clickbait drift (watch-time rewards thumbnails that lie), and tunnel-vision (the model trains on what it showed — it never sees counterfactuals). Structural answers: (1) **exploration quota** — x% of slots for new/small creators, sized by an actual experiment, because 'no impressions → no data → no impressions' is a death loop for new videos; (2) **counterfactual features and propensity correction** — the ranker learns what *would* have happened, not just what did; (3) **value definition beyond watch-time** — satisfaction signals (surveys, shares, rewatches vs. skips-in-3s) as training targets, which is where the 'don't radicalize' constraint actually gets enforced — not by a filter bolted on, but by what the model is trained to want; (4) **freshness** — new-video embeddings from content features only at upload (cold-start path), replaced by behavioral embeddings as data arrives — a two-stage embedding life. Drift monitoring on *the model's own footprint* — if the creator distribution of impressions shifts 20% in a month, that's a system event, not noise."

**[35:00–40:00 Tradeoffs]** "What this design costs: it's a big system — two-tower training, multiple indexes, streaming pipelines, a ranker fleet. At startup scale I'd collapse it to one embedding source + a GBDT and the rules layer. What I chose deliberately: heavy ranker at 1K (compute for quality), exploration slots (short-term watch-time for long-term ecosystem), and NO end-to-end 'one giant model' — the funnel is debuggable stage by stage, and my lab experience says that's worth real points of accuracy."

**[40:00–45:00 Operate]** "North-star dashboard: watch-time/user AND the guardrails — creator coverage (what % of uploads get ≥100 impressions), satisfaction proxy (skip-rate in 3s), extreme-content exposure rate. Rollout for any ranker change: offline time-split eval first, then 1% A/B with guardrails — my sample-size math: at these volumes a +0.5% watch-time effect is measurable in days, which is exactly why this system CAN drift fast — the experiment velocity is also the pathology velocity. Retraining is trigger-based on drift metrics, not calendar. The riskiest assumption: that watch-time remains the right target — I'd instrument satisfaction from day one." 

## The curveballs (expect 2–3)

- "An advertiser wants their videos boosted in-feed. Where does that slot in?" → "As a candidate source with explicit priority and labeling — ads enter the funnel as a source, the ranker has an ad-slots constraint in re-ranking, and it's measured separately (ad CTR + user retention guardrail — ads that tank retention are failing their own payback)."
- "Your A/B shows +3% watch-time and −1% retention. Ship?" → "No — retention is a guardrail, and guardrails are one-sided. +3% watch with −1% retention is the clickbait-tunnel signature my deep-dive described. I'd investigate what content class drove the watch-time before touching the rollout."
- "A celebrity video goes nuclear — 50M views/hour. What breaks?" → "Hot-key problems: the candidate cache for that video, its embedding stats, the counter writes. Standard fan-out mitigation: shard the hot entity, cache aggressively, and the trending source is *already* designed for concentration — that's its job. The thing I'd actually watch is the feedback loop over-weighting the event."
- "Where does LLM-based ranking fit?" → "Honest answer: today it doesn't, at 300K QPS and 1K candidates — LLM reranking of 20 finalists for *explanation* or *quality* is plausible for premium surfaces; the core feed is a latency-bound two-tower world. I'd pilot LLM reranking on a small surface and A/B it like anything else." 

## Scoring rubric (grade yourself honestly)

| Dimension | Strong hire | Borderline | Weak |
|---|---|---|---|
| Clarify | Named the guardrail ecosystem unprompted | Asked scale only | Drew immediately |
| Estimation | Proved the funnel is *forced* by the scoring math | Guessed funnel | No funnel math |
| Architecture | Three-stage + blended sources + feedback loop drawn | Stages without the loop | "A big neural net" |
| Deep dive | Pathologies named with mechanisms (spiral, counterfactual, cold-start embedding life) | Mentions cold-start vaguely | Only talks models |
| Tradeoffs | Funnel debuggability argued; startup-collapse version offered | Generic | None |
| Operate | Guardrail dashboard + experiment-velocity insight | Basic A/B mention | Nothing |

**The hire-line:** the feedback loop is the interview. Candidates who design the model get mid; candidates who design the *loop the model lives in* — exploration, counterfactuals, guardrail metrics — get hired.

## After the mock

- Record your run's minute-20 state: did you have a diagram yet?
- Which curveball broke you? That's your next study block (bank/cheatsheet refs above).
- Re-attempt the *same* mock in 3 days; the delta is your actual progress.
