# Coding 4 — A Semantic Cache With a Wrong-Hit Budget

**Time budget: 40 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

Platform screen: 'Our support LLM gets 40% repeat-question traffic. Build a semantic cache: embed the query, if a cached query is close enough, return the cached answer. But wrong hits are unacceptable — a customer who gets an answer to a *different* question loses trust permanently.' You have a sentence-transformers model and a dict. 40 minutes.

## Your task

Hit rate and wrong-hit rate measured *separately* across the sweep. Operating τ in the 0.85–0.92 band with the trust justification. Two hardening steps named: corpus-version flush (staleness) and stampede protection (coalescing concurrent misses) — from b5's runbook.

## Success looks like

1. Implement exact-match caching first (normalized string → answer). Report its hit rate on your traffic sample.
2. Add the semantic layer: embed query, cosine against cached queries, return if above threshold τ.
3. Sweep τ from 0.75 to 0.95; plot hit-rate vs. wrong-hit-rate.
4. Pick the operating τ and defend it with the trust argument (b5's band: 0.85–0.92 on support traffic).
5. State the two production hardening steps you'd add first.

## Dataset

Use any small embedding model (`all-MiniLM-L6-v2`, the b3/b5 default) and 50–100 hand-written question pairs (or sample from SQuAD via the [qa-knowledge card](../../datasets/qa-knowledge.md)). No vector DB — this screen is about the policy, not the index.

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
