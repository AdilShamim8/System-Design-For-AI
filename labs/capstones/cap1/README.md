# Capstone cap1 — Ship a Customer Support AI

| | |
|---|---|
| **Prerequisites** | Labs b1–b5, c2, x1–x2 (the RAG + guardrail + monitoring stack) |
| **Time** | 15–25 hours over 1–2 weeks |
| **You ship** | A working support bot over a real corpus, with guardrails, eval gates, monitoring, and a cost dashboard — deployable to a free tier |

This is the course's first "real thing": the S.1 design-studio chapter, built with your own hands. Every component already exists in your labs — the capstone is *integration*, and integration is where systems thinking actually gets learned. **The bar is not complexity; it is production discipline**: every decision numbered, every failure mode handled, every claim measured.

## The spec (hold yourself to it)

**Product:** a support bot for a real public corpus — pick one with genuine support content: a well-documented open-source project (FastAPI, scikit-learn, DuckDB docs), the Python docs for stdlib modules, or MDN Web Docs excerpts. Requirements:

- RAG answers with citations over ≥500 chunks
- Refuses out-of-corpus questions (measured refusal rate on an adversarial set)
- Semantic cache (b5) with corpus-versioned keys
- Guardrail stack (c5): input filter, output validation, banned-content check
- One dashboard (x1) with the three horizons
- Cost model (x2) with cost-per-successful-answer
- Deployed somewhere reachable (any free tier; a ngrok URL counts)

## Milestone 1 — Corpus & retrieval (est. 4 h)

Build the pipeline from b2/b3: scrape/parse the docs (polite: check the site's terms; prefer official doc dumps), chunk section-aware, embed, index, retrieve with measured hit-rate on a **20-question eval set you write first** (before building — a8's pre-registration discipline, applied to RAG).

**Gate to pass:** hit@4 ≥ 0.7 on your eval set; refusal behavior specified (b2 Part 5's prompt discipline).

## Milestone 2 — Generation, citations, refusal (est. 3 h)

Cited answers (b2), out-of-corpus refusal, and the b4 two-tier eval: 50 questions graded on faithfulness + relevance with a temperature-0 judge. **Gate:** faithfulness ≥ 0.85, relevance ≥ 0.8, refusal ≥ 0.8 on a 15-question adversarial set.

## Milestone 3 — Cache + guardrails (est. 3 h)

Wire the b5 cache (corpus-hash key — you *will* re-index at least once; the key is what saves you) and the c5 stack: injection filter on inputs, schema/content checks on outputs, budget caps per session. **Gate:** the attack-to-layer table from c5, re-run against *this* system — every attack caught by a named layer.

## Milestone 4 — Observability + cost (est. 3 h)

Log per request (x1's schema: query, chunks, answer, timings, versions). Build the mini-dashboard and the cost model (x2) with your real usage. **Gate:** you can answer, from your own artifacts: "what did the last 100 requests cost, what % were cache hits, and what's your cost per successful answer?"

## Milestone 5 — Deploy + one real user (est. 3 h)

Ship to any free tier. Then the step almost everyone skips: **get one real human to use it** — a friend, a Discord, a Reddit thread (politely). Watch three real sessions. Real users ask things eval sets never predict; log what breaks, fix one thing, and note it. This is the loop: usage → logs → eval-set growth → fix. That loop, not any single component, is the capstone's lesson.

**Final gate (the definition of done):**

- [ ] 20-question eval: hit@4 ≥ 0.7, faithfulness ≥ 0.85, relevance ≥ 0.8, refusal ≥ 0.8
- [ ] Attack table: every attack caught by a named layer
- [ ] Dashboard + cost model answer the three questions above
- [ ] Live URL, one real user, one improvement cycle documented
- [ ] README in your repo with the design one-pager (x4) and all numbers

## What this capstone earns you

A portfolio artifact with *teeth*: not "I built a RAG bot" (thousands can say that) but "I built one with measured hit rates, faithfulness gates, an attack-to-layer guardrail table, and cost-per-successful-answer — here are the numbers." In interviews, the follow-up questions you *want* are exactly the ones this capstone answers.
