# 10 — PageRank (the original ML-meets-systems design)

**The system in three sentences.** The original 'the model IS the product' system: rank pages by who links to whom, computed offline as a giant eigenvector problem, served as one number per page. Every modern lesson is already in it — the offline/online split (compute the model nightly, serve lookups), the adversarial feedback loop (link farms — the first 'model gaming' war), and the proxy-metrics trap (PageRank measured importance, not quality; the war between the metric and the goal has run 25 years).

## The spine (draw it in 60 seconds)

```
crawl → web graph (pages as nodes, links as edges) → PageRank iteration
  (the random-surfer: rank ∝ incoming links weighted by THEIR rank)
offline batch (the eigenvector solve) → rank stored per page → lookup at query time
modern: PageRank is ONE feature among hundreds in the ranker (say this — it's the punchline)
```

## The numbers to carry

The random-surfer intuition in one sentence (a surfer clicking randomly lands on important pages) · the damping factor (~0.85 — the number to name) · PageRank alone is query-INdependent (it's about pages, not queries — the reason it became one feature, not the ranker) · the link-farm arms race is the canonical adversarial-feedback story (FN-02's ancestor)

## The failure modes that get probed

Link farms (the adversarial loop — farms sell rank; search adds countermeasures; the first SEO war) · the offline compute (iterative convergence over the web graph — a batch-scaling story) · query-independence (the flaw that made it a feature, not the answer)

**Interviews this arms you for:** Q-BR-5 (search bridge), the 'how would you rank X' family · the historical anchor that makes any ranking answer sound grounded

**The AI-era twist (say it before they ask):** Say the arc out loud: PageRank → learned ranking (hundreds of features) → neural ranking → LLM-assisted ranking — and the constant: the adversarial loop never ended, it moved from links to content to prompts. That one sentence compresses 25 years of search into an interview answer.
