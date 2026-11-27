# Estimation Drills — Round 2: The AI-Native Twelve

**Harder, more AI-specific.** Round 1 built the reflexes (QPS, storage, tokens/day). Round 2 estimates the things that actually get asked at AI-native companies: the cost of a feature, the memory of an index, the eval set you can defend, the GPU fleet behind a fine-tune. Same discipline: state assumptions, show the arithmetic, land on a number you can say out loud with a straight face.

*Method reminder: quantities you KNOW (prices, sizes, rates) vs quantities you ASSUME (flag them); derive everything else; end with the sanity check — 'is this number believable?'*

---

## Drill 13 — The Monthly Bill for a Support Bot

**Ask:** 200K conversations/month, average 6 turns, 4K input + 500 output tokens per turn, mid-tier model at $3/M input and $15/M output. What is the monthly generation bill, before and after a 30% cache hit rate?

**Worked path:** tokens in = 200K × 6 × 4K = 4.8B input; out = 200K × 6 × 500 = 600M output. Cost = 4,800 × $3/M... wait — $3/M means $3 per million: 4.8B / 1M = 4,800 units × $3 = $14,400 input; 600 × $15 = $9,000 output; total ≈ **$23,400/month**. With a 30% cache hit on the input side at ~10% effective cost: input ≈ $14,400 × (0.7 + 0.3 × 0.1) ≈ $10,500 → total ≈ **$19,500** — say "~$23K, ~$19-20K with caching; routing the simple 70% down-tier is the bigger lever (b6)."

## Drill 14 — The Vector Index That Doesn't Fit

**Ask:** 40M documents, 6 chunks each, 1,536-dim embeddings, float32. Raw vector memory? With HNSW overhead (×1.5–2)? How many 64-GB nodes?

**Worked path:** vectors = 240M; bytes each = 1,536 × 4 ≈ 6KB; raw = 240M × 6KB ≈ **1.4 TB**; with HNSW graph overhead ≈ **2.2–2.9 TB**; ÷ 64 GB/node ≈ 35–45 nodes for the index alone — "call it 40 nodes, plus replicas for availability: ~80. That's the sentence: 40M docs is an 80-node cluster before you serve a single query (Mock 7's opening math)."

## Drill 15 — The Eval Set You Can Defend

**Ask:** You can afford 20 engineer-hours to build a golden set. Grading rate: 30 questions/hour with rubric. What set size? What can you claim statistically?

**Worked path:** 20 × 30 = **600 gradable rows** — stratify: 200 retrieval-labeled, 200 faithfulness-judged, 200 adversarial. Statistical honesty: at n=200/slice, your error on a proportion is ±7 points at 95% — "so I report per-slice with intervals and gate on 5-point regressions, which n=200 detects reliably; I do NOT claim sub-point precision (Q-GEN-14's v1 scope, quantified)."

## Drill 16 — The Fine-Tune's GPU Fleet

**Ask:** 3B-parameter model, LoRA fine-tune, 500K examples × 1K tokens. How many GPU-hours on an A100-class node?

**Worked path:** training tokens = 500M; LoRA throughput on a 3B ≈ 8–15K tokens/sec on one A100 with batching; time ≈ 500M / 12K ≈ 42K sec ≈ **11–12 GPU-hours** — one node, one afternoon, including two restarts. The follow-up math: full fine-tune (not LoRA) needs ~4–8x that plus memory for optimizer states: "LoRA: an afternoon on one node. Full: a week and a fleet — that's why 'fine-tune it' is a scoping decision (Mock 10), not a default."

## Drill 17 — The Human Review Queue

**Ask:** An agent handles 10K decisions/day; 2% are routed to human review, 90 seconds each, reviewers work 5 productive hours/day. How many reviewers?

**Worked path:** reviews/day = 200; time = 200 × 90s = 5 hours — **one full-time reviewer**, before PTO/peaks: "staff one, contract surge capacity, and watch the review latency SLO — the queue's latency is the agent's latency for those 2% (c2's approval grid, priced)."

## Drill 18 — The Reranker's Latency Budget

**Ask:** Cross-encoder rerank of top-50 candidates at ~15ms per pair on CPU, 40ms on a small GPU batch of 8. Budget: 150ms. Feasible?

**Worked path:** CPU serial = 50 × 15ms = 750ms — blown. GPU batched = ceil(50/8) × 40ms ≈ 280ms — still blown. The actual design: rerank top-20 not top-50 → ceil(20/8) × 40 = 120ms — inside budget with 30ms headroom. "The answer isn't faster hardware; it's reranking fewer, better candidates — retrieval did the first cut (B.5's tradeoff, with numbers)."

## Drill 19 — The Embedding Backfill

**Ask:** Re-embed 80M chunks at 1,500 chunks/sec per worker; workers cost $1.20/hour each; you can run 100 workers. Time and cost?

**Worked path:** throughput = 150K/sec aggregate; time = 80M / 150K ≈ 533 sec ≈ **9 minutes**?! Sanity check: that's API-rate-limit fantasy — provider caps bite first at ~50–100K/min. Honest path: ~800K–1M chunks/hour effective → 80–100 hours → **$120–150 at 100 workers**... the real cost is the queue orchestration and the index swap, not the embed calls. "The math says cheap; the migration plan says careful (Q-GEN-10's dual-write, priced)."

## Drill 20 — The Drift Monitor's Storage

**Ask:** 500 features, PSI daily on 90-day reference; each daily snapshot per feature ≈ 2KB (histograms). Storage for 2 years?

**Worked path:** per day = 500 × 2KB = 1MB; per year ≈ 365MB; 2 years ≈ **~750MB** — trivial. The insight: "the monitor's cost isn't storage, it's the alert noise — 500 features × 365 days × a 0.1 threshold produces thousands of false investigations/year. Tier the features (a7): the storage is bytes; the oncall attention is the budget (Q-ML-10's alert-SLO point, quantified)."

## Drill 21 — The Agent's Worst-Case Token Spend

**Ask:** Agent with max 15 steps × 3K tokens context per step, tool results capped at 2K, frontier model at $15/M. Worst case per episode? At 5K episodes/day?

**Worked path:** worst case per step ≈ 3K in + 2K tool + 0.5K out ≈ 5.5K tokens; × 15 steps = **~80K tokens/episode** ≈ $0.0012 — trivial? NO: the context RE-SENDS and grows: Σ(3K + k×2K) for k=0..14 ≈ 3K×15 + 2K×(105) ≈ 255K ≈ **$0.004/episode worst case**. At 5K/day: $20/day, $600/month — "the budget isn't the model, it's the un-capped loop; the same system with disciplined context truncation runs 3–5x cheaper (c1's contract item 6, priced)."

## Drill 22 — The Multilingual Coverage Gap

**Ask:** Your product supports 30 languages; eval sets cost ~$800 each to grade properly. Budget: $10K. Which languages?

**Worked path:** 30 × $800 = $24K — over budget 2.4x. Triage: top-8 by traffic (must-have, $6.4K) + worst-5 by CSAT ($4K) = 13 languages, $10.4K — trim one mid-priority: **12 sets, ~$9.6K**. The insight: "coverage follows the Pareto slice: 8 languages carry ~80% of traffic; the broken 5 are where the liability lives (Q-GEN-11's whole lesson as a budget exercise)."

## Drill 23 — The Latency Budget, Voice Edition

**Ask:** A voice assistant: ASR 300ms, LLM TTFT 500ms, TTS first-audio 250ms, network 100ms round. Perceived response time? User tolerance for voice?

**Worked path:** serial = 300 + 500 + 250 + 100 ≈ **1.15s** — acceptable (voice tolerance ~1–2s, vs 300ms for chat-text). The lever most people miss: streaming — ASR partials let the LLM start early (speculative), TTS streams sentence-by-sentence: effective perceived ≈ 600–700ms. "Voice latency is a pipeline-parallelism problem (Mock 9's spine, with the numbers that unlock it)."

## Drill 24 — The Champion/Challenger's Canary Cost

**Ask:** Canary at 2% of 50M requests/month; challenger is 20% slower and 2x compute cost; base cost $0.002/request. What does the two-week canary cost beyond normal?

**Worked path:** canary requests = 1M; extra cost = 1M × $0.002 (the challenger's own serve) ≈ $2K; the latency cost: 2% of traffic × 20% slower — negligible UX risk at p95 if monitored. **Total experiment cost ≈ $2–3K**. The frame: "a $3K canary against a 15%-better-claim model making 50M monthly decisions — this is the cheapest insurance in the stack (Q-ML-14's gate, priced)."
