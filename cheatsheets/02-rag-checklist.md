# 2 — RAG System Checklist (B.2–B.5, Labs b2–b4)

## The pipeline (draw from memory)
```
ingest: parse → chunk → embed → index (+ metadata + version)
query:  embed → retrieve (top-k) → [rerank → top-k'] → prompt → generate → cite
ops:    eval gates · corpus versioning · cache · freshness (CDC) · monitoring
```

## Ingestion
- [ ] Exploit the corpus's existing structure (sections > recursive > fixed) — Lab b3
- [ ] Chunk size = measured knee (quality vs prompt cost; ours ~450 tokens), overlap for boundaries
- [ ] Metadata on every chunk: source, date, section, tenant — filters are what make it a product
- [ ] Corpus version hash; re-chunk = re-embed = cache flush (b5's invalidation law)

## Retrieval
- [ ] Hybrid (BM25 + vectors, RRF fusion) beats either alone — Lab a5/b2 extensions
- [ ] k is a budget dial: rerank to keep quality at lower k, don't crank k
- [ ] Filtered search verified end-to-end (tenant/date filters must not silently break ANN)

## Generation
- [ ] Grounding instructions + citations [n] + explicit refusal line, all three (b2 Part 5)
- [ ] Prompt versions logged per request (b4/x1)

## Evaluation (the non-negotiables)
- [ ] Retrieval graded separately: hit@k, MRR — free, exact, in CI
- [ ] Faithfulness + relevance via temp-0 judge, bias-tested (position/length), calibrated vs. hand labels
- [ ] Refusal rate on adversarial set (FN-04 is the cost of skipping this)
- [ ] Eval set versioned with pipeline; CI gate blocks regressions

## Ops
- [ ] Semantic cache (threshold tuned; wrong-hit < wrong-answer) — b5
- [ ] Freshness: CDC → re-embed changed chunks → lineage-based cache invalidation
- [ ] Dashboard: hit rate, faithfulness, refusal, TTFT, cost/1K, query-drift (x1)

## The debugging order (b2's law)
Gold chunk retrieved? → no: retrieval problem (miss taxonomy: vocab / distractor / multi-hop).
Yes → generation problem (prompt/model). Attribute first, fix second.
