# Mock 1 — Design a RAG Customer-Support Bot

## The prompt (read aloud, start the clock)

You're the founding engineer at a 40-person company selling project-management software. Support volume is drowning the team: 3,000 tickets/month, 60% of them repeat questions already answered in the help docs. Design an AI support assistant. The CEO wants it live in six weeks, and legal has opinions.

*45 minutes. Paper or a blank doc. Timer ON. Attempt cold before reading the walkthrough — the walkthrough is the grading key, and reading first is rehearsal-shaped cheating.*

---

## Candidate-quality walkthrough (time-marked)

**[0:00–5:00 Clarify]** "Before drawing anything: who's the user — paying customers, on what channels? What's the *job* — full deflection, or draft-replies-for-agents? What's the volume and any latency expectation? And the legal constraint — can it discuss billing and refunds, or only product how-tos?" Interviewer: web widget, live-chat latency expectations, billing is in scope, legal is nervous about wrong answers. "Last two questions: what counts as success, and what happens when it's wrong — who pays?" Success = 30% of tier-1 deflected at equal CSAT; wrong answers are brand/legal risk. "Then my non-goals: no voice, no email channel, no autonomous refunds — anything touching money escalates to a human."

**[5:00–10:00 Estimate]** "3,000 tickets, 60% repeat ≈ 1,800 deflectable/month ≈ 60/day ≈ 2–5 QPS peak — tiny load. The interesting number is cost: ~4.5K input tokens per RAG request × maybe 200 conversations/day after launch growth… at small-tier pricing that's dollars a day; even mid-tier is tens. Cost is not the constraint here — *wrongness* is, so I'm going to spend my complexity budget on evaluation and guardrails, not on scale."

**[10:00–20:00 High-level]** Draws two pipelines. Ingest: help docs → section-aware chunking with metadata (article, section, product area, updated-at) → embeddings → index (pgvector at this scale — "we already run Postgres; 5K chunks doesn't earn a new system"). Query: chat widget → orchestrator → retrieve top-6 hybrid (BM25+vector, RRF) → rerank (cross-encoder, small) → generate with citations → guardrail checks → reply. Escalation path: low confidence → hand to agent with the transcript. Ops ring: request logging with versions, eval set in CI, semantic cache, freshness job when docs change. Walks ONE request end-to-end: "user asks 'how do I bulk-move tasks' → embed → hybrid retrieve → the bulk-actions article ranks → answer with [1] citation → guardrail passes → reply, ~1.5s p95."

**[20:00–35:00 Deep dive — the interviewer picks evaluation and failure]** "Evaluation is my centerpiece, because 'it sounds right' is how Air Canada happened — a tribunal held the airline responsible for its chatbot's invented refund policy. Two tiers: retrieval graded exactly — hit@4 on a labeled set, free, in CI — and generation judged — faithfulness and relevance, temp-0 LLM judge, plus a *refusal rate* on an adversarial set of out-of-scope and billing-risk questions. My lab numbers: refusal on out-of-corpus questions went from ~60% to ~90% with prompt structure alone; the residual is why the output guardrails exist. Failure modes I'm designing against, in order: retrieval misses (fix: hybrid + rerank — my lab showed a 15–25 point hit-rate gain from structure-aware chunking), grounding drift (fix: strict cite-or-refuse prompt), stale docs (fix: docs CMS → webhook → re-embed that article → cache invalidation keyed on corpus version), and injection attempts in user chat (fix: input filters + the model never holds refund authority — money decisions route to humans, period)."

**[35:00–40:00 Tradeoffs]** "What I gave up: no fine-tuning — the corpus changes weekly and citations are the point; prompting + retrieval earns the eval bar first (my fine-tune-vs-RAG lab: the few-shot baseline came within a point of a fine-tune at zero training cost). No multi-agent — one loop with good tools beats a team on a task this size. Latency: I chose rerank (+150ms) for answer quality — at 2 QPS, we have latency to burn. At 100× traffic, the reranker flips to top-20-only and the index moves off Postgres."

**[40:00–45:00 Operate]** "Dashboards: hit@k, faithfulness (sampled daily), refusal rate, escalation rate, CSAT on deflected vs. human tickets. Rollout: shadow mode two weeks — draft answers logged, agents send the real ones — then 10% of widget traffic, then full, with auto-fallback to plain FAQ search if faithfulness dips. The riskiest assumption is that CSAT survives deflection; the six-week plan spends weeks 5–6 measuring exactly that." 

## The curveballs (expect 2–3)

- "Legal wants a guaranteed-accurate bot. Your response?" → "Guarantees don't exist; bounds do. I'd commit to: measured faithfulness ≥85% on a versioned eval, 100% citation on product answers, zero autonomous commitments on billing — every money statement is retrieval-verified or escalated. Then we show legal the eval report and the transcript audit trail."
- "The bot confidently cites the WRONG article — right format, wrong source. What failed?" → "Reranking or the distractor problem — my miss taxonomy from the labs: vocabulary mismatch, distractor twins, multi-hop. I'd pull the trace, classify the miss, and the fix differs per type — this is why retrieval is graded separately from generation."
- "Six weeks is now four. What do you cut?" → "The reranker (quality −2 points, still above bar), the semantic cache (cost is trivial anyway), voice-of-customer analytics. I do NOT cut: eval set, logging, escalation path, shadow mode — those are the parts that make it safe to ship, and shipping without them is how month two becomes a legal memo."
- "The CEO's cousin says 'just use ChatGPT'." → "Use its model, maybe — but the company's answers, citations, and liability are ours. The architecture isn't about the model; it's about grounding, measuring, and escalating. Air Canada's bot was 'just a chatbot' too — until the tribunal said it was the airline." 

## Scoring rubric (grade yourself honestly)

| Dimension | Strong hire | Borderline | Weak |
|---|---|---|---|
| Clarifying | Asked the success metric AND the wrongness cost; stated non-goals | Asked scale/latency only | Drew immediately |
| Estimation | Cost per request unprompted; "cost isn't the constraint, wrongness is" | QPS only | Skipped |
| Architecture | Two pipelines + one walked request; boring-right store choice | Boxes without a walk-through | Brand-name collage |
| Deep dive (eval) | Two-tier eval, refusal metric, FN-04 cited by name and lesson | "We'd test some questions" | "Add a disclaimer" |
| Tradeoffs | Named the fine-tuning non-choice WITH the lab rationale | Generic "depends" | None offered |
| Operate | Shadow rollout + fallback + the CSAT risk named | "Monitor it" | Nothing |

**The hire-line:** candidates who treat evaluation as the centerpiece of a support-bot design read as having shipped one. Candidates who treat it as an afterthought read as having demoed one.

## After the mock

- Record your run's minute-20 state: did you have a diagram yet?
- Which curveball broke you? That's your next study block (bank/cheatsheet refs above).
- Re-attempt the *same* mock in 3 days; the delta is your actual progress.
