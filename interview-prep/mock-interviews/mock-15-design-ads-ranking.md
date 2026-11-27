# Mock 15 — Design the Ad-Ranking System for a Marketplace

**45 minutes.** Interviewer reads the prompt, candidate drives. Timer segments: 10 clarify + scope · 20 architecture · 10 deep dive · 5 curveballs. The interviewer's job is to push ONE level past the candidate's comfort — the deep dive is where levels are decided.

## The prompt

A marketplace (30M users, 2M sellers, 180M listings) wants ads: sellers bid for placement in search results. You design ranking and auction. Constraints: 80ms p99 for the whole ads path inside a 300ms search budget; ad-quality matters (a bad ad experience costs search retention — the flywheel that actually pays for everything); no per-request human review; and the cold-start problem is brutal (new advertisers have no click history). Also: the legal team says ad slots must be labeled, and the ranking must be explainable when a seller asks 'why did my ad lose.'

## Candidate-quality walkthrough

This mock is really two systems — the ML quality stack and the auction — plus the governance glue. Candidates who only do one lose; the winning answer composes them.

**Clarify:** ad load (how many slots per search — this is the retention-vs-revenue dial the business owns, say that); the objective (click? conversion? long-term GMV — 'click' optimizes clickbait and everyone knows it); billing (CPC/CPA — affects the whole design: CPA needs conversion attribution, which has a delay and a fraud problem).

**The quality stack (the ML half):**
1. **Candidate generation:** retrieval from the ads pool keyed by query intent — the same three-stage discipline as organic search (A.2's pattern, transferred): text/behavioral matching narrows 2M active ads to ~500 in a few ms.
2. **Quality model (pCTR x pCVR):** GBT or shallow-net on features (query-ad text match, seller history, ad creative quality, user context), calibrated — because the auction MULTIPLIES by these probabilities (A.4's lesson verbatim: ranking is not enough, calibration is the money bug; miscalibrated pCTR mis-prices the auction for everyone).
3. **The re-rank layer:** diversity (no two ads from one seller), frequency capping (the same user sees an ad N times/week max), and the quality floor: ads below a predicted-experience threshold don't serve regardless of bid (the retention argument made mechanical).

**The auction (the economics half):** second-price (GSP or VCG — name one, say why: second-price-ish mechanisms make truthful bidding rational, which keeps advertisers' trust; a first-price auction with no floor is a bidding-war churn machine). Score = bid x quality (the calibrated pCTR) — 'relevance-weighted' auction: a high-quality ad wins at a lower bid, which ALIGNS seller incentives with user experience — this is the one-sentence insight the interview exists for.

**The cold-start:** new advertisers get (a) a quality prior from their organic-listing reputation (the marketplace's advantage — the seller is not a stranger, their products already have reviews), (b) exploration budget: a guaranteed small share of impressions to LEARN (bandit-logic, a8's exploration quota in auction clothing), (c) faster-feedback reporting so they can iterate creatives in days not weeks. The honest framing: cold-start cost is a subsidy the marketplace pays for its future ad inventory.

**The 80ms:** retrieval ~10ms, feature fetch ~10ms (precomputed online features in a feature store, x1), model score ~5-10ms (GBT on ~200 features), auction + re-rank ~10ms, the rest is serialization and leaves headroom for p99 spikes — plus the DEGRADED path (Q-BR-11's ladder): if the ads path blows its budget, serve NO ads rather than delay search — the flywheel outranks the revenue on any single request, and you say that in exactly those words.

**Explainability ('why did my ad lose'):** the per-auction log — your bid, your quality score components, the winner's effective score — is BOTH the support ticket answer and the debugging tool for the ranking team (X.3's traces-are-the-product, in an auction costume).

## The curveballs

1. **"An advertiser finds the exploit: low bid, but their ad creative is a near-duplicate of a top organic listing, so the quality model scores it high and it rides organic intent. What breaks, and what's the fix?"** — The ad-vs-organic duplication attack: it free-rides the marketplace's own relevance. Fix: a duplication/distance check between ad creative and organic candidates for the same query (an embedding-similarity gate at re-rank), a policy line (ads must not clone organic listings), and the detection loop (sellers WILL report this — route those reports into the eval set). The deeper answer: quality models optimize what they measure, and adversaries optimize the model — the re-rank layer needs adversarial review quarterly.
2. **"The CFO wants revenue +20 percent this quarter. Your only lever is ad load. Walk me through the conversation."** — The flywheel tradeoff made quantitive: ad load up X percent yields revenue roughly linearly short-term, but experience degradation compounds (search retention is the denominator of EVERY future ad). The strong answer: propose the experiment — ad-load A/B with a long enough horizon to see retention (a8's discipline: optional stopping would read the short-term revenue win and miss the retention loss), pre-register the guardrails (search-frequency DAU, complaint rate), and bring the CFO a curve with a confidence band, not a promise. The staff-level sentence: 'I can buy you 20 percent this quarter; I'm showing you what it costs next year, and the decision is yours with eyes open.'
3. **"EU regulator: 'ads ranking must be auditable — explain why THIS user saw THIS ad.' Your logs today keep 7 days for debugging. Go."** — Q-AG-11's audit trail at consumer scale: the per-impression decision log (query, candidates, scores, auction result, model version) becomes a compliance artifact — 18-24 month retention in cold storage (the storage math: 180M listings but ad IMPRESSIONS are the unit — 30M users x a few searches x a few ads = billions/month; cold-tier economics and sampling rules for non-regulated traffic), the feature snapshot at decision time (explainability requires WHAT THE MODEL SAW, not what the features are now — point-in-time again, coding-3's rule in its governance costume), and the export path for auditors. The weak answer: 'we can regenerate it' — no, you cannot regenerate a past model's past inputs.

## Scoring rubric (grade yourself honestly)

- **Junior:** pCTR model, auction as 'highest bid wins.' Misses: calibration, second-price logic, the quality floor, cold-start, the 80ms plan.
- **Mid:** calibrated pCTR x pCVR, relevance-weighted second-price, feature-store latency math, frequency capping, exploration for cold-start. Handles curveball 2 with the pre-registered experiment when pushed.
- **Senior:** the incentive-alignment insight (quality-weighted auction aligns sellers with user experience — stated as the design's centerpiece), the no-ads-beats-slow-search degradation stance, the organic-reputation prior for cold-start, and the per-auction explainability log as support + debugging + compliance in one artifact.
- **Staff:** everything senior, plus: the market-design view (advertiser lifetime value vs short-term revenue; the marketplace's take-rate across organic vs paid), the regulator-readiness as architecture (audit by construction, not by scramble), and the two-year question: as models personalize more, the explainability burden grows — build the decision-log abstraction now, because retrofitting audit onto a personalized auction is a multi-year migration.

**Grounding:** Chapters A.2, A.4, X.2–X.4 · Labs a2, a4, a8, x2 · Q-ML-3 · Mock 2/6 · FN-11
