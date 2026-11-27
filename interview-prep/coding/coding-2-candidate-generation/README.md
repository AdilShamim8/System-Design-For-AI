# Coding 2 — Build a Candidate Generator Under a Latency Budget

**Time budget: 45 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

Design-screen-meets-code: 'Our recommender's ranker is fine, but candidate generation is a top-10-popular list — 40% of users see nothing new. Build me a better candidate source in 45 minutes.' The dataset is MovieLens-latest-small (100K ratings, 610 users). The latency budget for candidate generation: 50ms. The goal is recall@50 — feed the ranker a bigger, better pool.

## Your task

Recall@50 meaningfully above popularity-only (typical: 0.15–0.30 for popularity, 0.35–0.50 with CF blended — a2's numbers on the full lab). Latency estimate honest: precomputed similarities → a few ms; on-the-fly cosine → seconds (and you say so). The dedupe and the exclusion of already-rated items are handled correctly.

## Success looks like

1. Build a popularity baseline (recall@50 for top-N popular, excluding already-rated).
2. Build an item-item collaborative filter candidate source (cosine on the ratings matrix, top-K similar per seed item).
3. Blend the two sources; dedupe; cap at 50 candidates.
4. Measure recall@50 against the holdout on a time-split, and report generation latency.
5. State the production path: what's precomputed, what's computed at request time.

## Dataset

Dataset: [MovieLens via the recommendation card](../../../datasets/recommendation.md). Same data as Lab a2 — if you did that lab, you have a head start; do not paste the lab solution verbatim, this variant is smaller-scoped.

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
