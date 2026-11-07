# Mock 6 — Design Search Ranking for a Marketplace

## The prompt

"A marketplace with 50M listings: rentals, services, items. Search today is keyword matching with recency — sellers with better SEO win, buyers bounce. Design the ranking system: relevance-first, but the business needs revenue and sellers need fairness. 100M searches/month."

*45 minutes, paper, timer.*

---

## Candidate-quality walkthrough

**[0:00–5:00 Clarify]** "Whose success? Buyer finds-and-books (conversion), seller gets fair exposure, business gets revenue — those three fight, so I need the weighting stated. What's the serving budget? And is this pure re-ranking of keyword matches, or am I also rebuilding retrieval — because SEO-spam killing relevance is a *retrieval* problem before it's a ranking problem." Interviewer: 150ms p95 end-to-end; retrieval in scope; revenue matters but 'search that feels rigged kills the marketplace.'

**[5:00–10:00 Estimate]** "100M searches/month ≈ 40 QPS mean, 5–10× peak. Candidate pool per query after recall: 500–2,000 listings — ranking must score ~1K listings in ~40ms, which forces a two-stage design immediately: lightweight ranker on the full pool, heavy model on top-50. Training data: clicks/books on logged impressions — billions of events monthly, position-biased (the #1 slot gets clicked regardless — I'll need to correct for that or my labels teach me yesterday's ranking)."

**[10:00–20:00 High-level]** Two planes. **Retrieval:** hybrid — structured filters first (price, location, dates — the hard constraints), then BM25 + listing-embeddings (text, images, reviews) fused by RRF — my lab measured hybrid beating the best single retriever by 3–8 NDCG points; SEO-spam gets diluted because embeddings match *meaning*, not keyword stuffing. **Ranking:** stage 1 — GBT on ~1K candidates (text-match features, quality signals: review history, host-response rate, image quality score, price competitiveness; ~1–3ms). Stage 2 — a heavier neural scorer on top-50 (cross-features: query×listing interactions). **Re-rank:** business rules — diversity (don't show 10 identical units), freshness, exposure fairness quotas, sponsored slots (labeled, capped, priced separately from organic). The learning loop: impressions → clicks/contacts/books → position-corrected training (inverse propensity weighting) → daily retrain → champion/challenger.

**[20:00–35:00 Deep dive — interviewer picks the three-way tension]** "The tension is the design. **Relevance vs. revenue:** sponsored slots are *separate* from organic ranking — interleaved, labeled, capped — because letting payment leak into organic ranking is how a marketplace dies (users detect rigging in weeks; trust doesn't come back). **Relevance vs. fairness:** pure relevance creates winner-take-all — new sellers never rank, never get reviews, never rank (the cold-start death loop; my recommender lab measured top-decile absorbing ~50% of engagement). Structural fix: exposure quotas in re-ranking (x% of slots for quality-qualified-but-low-history listings) — sized by experiment, measured by *seller retention and new-seller survival*, not just buyer conversion. **Short vs. long term:** the position-bias correction is what keeps the loop honest — without it, the model trains on its own rankings forever and calls it ground truth. The metric stack: buyer (contact rate, book rate, refund rate), seller (impressions distribution, time-to-first-booking for new sellers), system (NDCG offline, but 'offline is a rumor' — A/B decides, with guardrails on seller retention and refund rate)."

**[35:00–40:00 Tradeoffs]** "What I gave up: end-to-end learned ranking (interpretability matters — sellers demand 'why don't I rank?', and GBT feature importances answer; a pure neural soup doesn't); real-time personalization in v1 (session signals yes, deep user profiles later — privacy surface and cold-start cost first); and guaranteed fairness (quotas are calibrated experiments, not ideology — the A/B decides the number). The 150ms budget: filters 20 + retrieval 40 + light rank 5 + heavy rank 30 + rules 10 + slack — the slack line matters at p99."

**[40:00–45:00 Operate]** "Dashboards: contact/book rate by query class, position-decay curves (is the model just confirming itself?), seller-exposure Gini (the fairness canary), sponsored CTR + cannibalization, p99 by stage. Rollout: shadow-rank everything (log new ranks, serve old) for two weeks, then 5% traffic with seller-retention guardrails. Drift: query mix moves seasonally (travel!), listing churn is constant — weekly retrains with trigger-based on drift. Riskiest assumption: that contact-rate is the right proxy for satisfaction — refund rate is my truth-check metric."

## The curveballs

- "A big seller pays to always be #1 for 'beach house'." → "Sponsored slot, labeled, capped — and organic ranking untouched. If payment touches organic, every other seller's incentive inverts: SEO arms race instead of quality. The marketplace IS the trust; one payment can't buy the commons."
- "Your ranker is unfair to new listings by construction — no reviews, no clicks. Fix without killing relevance." → "Cold-start features (content quality from images/text, host history across listings), exposure quota sized by experiment, and *measurement* — new-listing time-to-first-booking is on the dashboard. My lab's popularity-spiral numbers made me religious about this."
- "The model learned to downrank listings with 'wheelchair accessible' — filter-bubble by proxy. Walk me through your response." → "Slice-eval caught it (or should've — that's the FN-01/FN-10 lesson: disaggregate by attribute class, in CI). Mitigation: fairness constraints in re-ranking, proxy-feature audit, and the deeper fix — the training signal itself reflects historical accessibility bias; correcting labels/propensity is slower but real."
- "NDCG improved, revenue flat, bookings down. Ship?" → "No — NDCG is offline rumor; bookings are the business. Diagnose: which query class moved? Position bias in the eval? The A/B is the truth-teller and it just told me the offline gain was metric-gaming, not user value."

## Scoring rubric (condensed)

Strong-hire: two-stage ranking *derived from the latency math*; position bias named with its correction; the three-way tension designed, not wished away; fairness as experiments with canary metrics; sponsored/organic separation defended economically. Weak: single magical model; no bias correction; fairness as vibes; no offline/online gap.

**The hire-line:** marketplaces live on *both* sides of the market — candidates who design the seller's loop, not just the buyer's, are the ones who've thought about two-sided systems.
