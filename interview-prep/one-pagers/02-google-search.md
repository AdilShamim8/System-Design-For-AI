# 02 — Google Search (the hybrid retrieval answer)

**The system in three sentences.** Crawl the web, index it, answer in 200ms. The architecture every search question descends from: crawlers → an inverted index (lexically) plus a vector layer (semantically), fused ranking, and a freshness loop that keeps the index inside the staleness budget. The AI-era answer to 'how does search work' is hybrid: lexical nails entities, embeddings nail meaning, and fusion beats either alone.

## The spine (draw it in 60 seconds)

```
web → crawler → parsing/cleaning → inverted index (BM25)  ─┐
                                        → embeddings → ANN ─┤→ fusion (RRF) → ranking → page
queries → query understanding (spell, intent) ──────────────┘        ↑ freshness: CDC into both indexes
```

## The numbers to carry

a5 lab: hybrid + RRF beat the best single system by 3-8 NDCG points · BM25 and vectors fail on DIFFERENT queries (vocabulary mismatch vs rare entities) — that's WHY fusion wins · rerank on top-20 at 40-150ms is the quality/latency dial (B.5) · 200ms is the classic Google budget to cite

## The failure modes that get probed

Index staleness (CDC or recrawl windows — stale citations are a legal exposure now, Q-BR-9) · embedding versioning (migrate = re-embed = rebuild — Q-GEN-10) · adversarial content (SEO spam is the original injection attack) · query ambiguity (intent models, disambiguation UI)

**Interviews this arms you for:** Q-BR-5, Mock 6, coding-11 · the 'what's the 2026 answer' version of the classic

**The AI-era twist (say it before they ask):** The inverted index survived every hype cycle; what changed is the SECOND index (vectors) and the fusion — plus eval becoming a standing asset (NDCG in CI) rather than a launch-day scramble.
