# Estimation Drills — Twelve Problems, Full Solutions

**Do these on paper.** The skill is the *shape* of the reasoning (assumptions → powers of ten → sanity check), not the arithmetic. Units are always visible; every drill ends with a number you could say out loud in an interview.

*Constants: 1 day ≈ 86,400s (round to 100K) · 1M req/day ≈ 12 QPS · 1 token ≈ 4 chars ≈ ¾ word · vector bytes = dims × 4.*

---

## Drill 1 — Chatbot storage and QPS (warm-up)

**Given:** 500K DAU × 10 questions/day. Each question: 200 tokens in, 150 out, stored as a transcript.

- Requests: 500K × 10 = 5M/day ≈ **60 QPS mean, ~150–200 peak** (×3 daily curve)
- Tokens stored: 5M × 350 = 1.75B tokens/day ≈ 7 GB/day text → **~2.5 TB/year** raw, ×3 with indices/replication ≈ 8 TB/year
- *Say it:* "60 QPS mean, 200 peak; about 2.5 TB of transcripts a year, 8 with indexing and replicas — modest storage, the interesting number is next."

## Drill 2 — Embedding index for a corporate corpus

**Given:** 1M documents × 20 pages × 500 words/page. 1,536-dim embeddings.

- Corpus: 1M × 20 × 500 × 4 chars ≈ **40 GB text**
- Chunks (500 tokens each): 1M × 20 × 500 / 500 ≈ **20M chunks**
- Vector storage: 20M × 1,536 × 4B = **123 GB raw**, +HNSW overhead (×1.5–2) ≈ **200–250 GB RAM-class**
- *Say it:* "20M chunks, ~120 GB of vectors, 250 with index overhead — fits a single beefy node today, but filtered search and tenants argue for a distributed store; I'd verify recall at 4-bit PQ to halve it."

## Drill 3 — The RAG bill

**Given:** 200K questions/day. Per request: system 800 + 6 chunks×500 + history 1,200 + question 50 in; 400 out. Mid tier $3/$15 per 1M.

- Input: 5,050 tokens × 200K = **1.01B in/day** → $3.03/day×1000 = $3,030? No — 1.01B/1M = 1,010 × $3 = **$3,030/day**
- Output: 400 × 200K = 80M/day → 80 × $15 = **$1,200/day**
- Total ≈ **$4,200/day ≈ $126K/month** → the routing/cache conversation starts here (my b5/b6 levers: 40% cache hit → ~$75K; route 80% to small tier → ~$25–35K)
- *Say it:* "About $4K/day at mid tier — I'd attack input tokens, which are 92% of it: caching saves ~40%, routing to a small tier for the easy 80% takes the total to roughly $30K/month, with a faithfulness eval gate before either ships."

## Drill 4 — Vector DB memory for 100M images

**Given:** CLIP 512-dim embeddings for 100M images, HNSW index.

- Raw: 100M × 512 × 4B = **205 GB**; +HNSW ~×1.7 ≈ **350 GB RAM**
- 64 GB-node cluster: ~6 nodes minimum, ×2 replication = **12 nodes**
- *Say it:* "350 GB of index — a dozen 64 GB nodes with replication, or PQ-compress to 4-bit vectors and trade ~2–5 recall points for a quarter of the footprint; I'd benchmark PQ on our own recall metric before committing."

## Drill 5 — Training tokens for a small fine-tune

**Given:** 50K examples × 600 tokens = 30M tokens. 3 epochs at $8/GPU-hour, a 7B model processes ~10K tokens/s/GPU fine-tuning (LoRA-class).

- Tokens processed: 30M × 3 = 90M → 90M/10K = 9,000 GPU-seconds ≈ **2.5 GPU-hours ≈ $20** (plus experiment iteration — multiply by your iteration count, honestly ×10)
- *Say it:* "Twenty dollars a run, so two hundred for a realistic iteration week — fine-tuning cost is trivial; the real costs are the labeled data and the eval that proves it helped."

## Drill 6 — p99 budget allocation

**Given:** AI search feature, 800ms p99. Components: retrieval, rerank, generation, network.

- Allocation: network 50 + retrieval 100 + rerank 150 + TTFT 350 + slack 150 = **800ms**
- *Say it:* "150ms of slack because p99 is where queues live — if rerank busts its 150, the fallback is skipping it for the tail (degradation ladder), not blowing the SLO."

## Drill 7 — QPS to GPUs (self-hosted)

**Given:** 50 QPS sustained, each request generates 400 tokens at 40 tok/s/stream on one GPU with continuous batching effective throughput 2,000 tok/s/GPU.

- Demand: 50 × 400 = 20,000 tok/s → 20,000/2,000 = **10 GPUs**, ×2 for peak/redundancy = **20 GPUs**
- Cost: 20 × $2/hr × 730 = **~$29K/month** — compare to API: 20K tok/s ≈ my drill-3 style math…
- *Say it:* "Ten GPUs sustained, twenty with headroom — about $30K/month; the API equivalent at frontier pricing is several times that, which is why the volume question decides build-vs-buy."

## Drill 8 — How many RAG queries fit one Postgres box

**Given:** pgvector, 2M vectors, 512-dim; a query does a sequential-filtered ANN at ~15ms p95; box handles ~64 concurrent connections.

- Theoretical: 64/0.015 ≈ 4,200 QPS — reality at p99 SLO: **~500–1,000 QPS** (connection churn, filter selectivity, cache pressure)
- *Say it:* "Order of a thousand QPS on one box — plenty for internal tools, not for consumer scale; the migration trigger is p99 degradation, which I'd watch from week one."

## Drill 9 — A/B sample size, said fast

**Given:** 5% baseline CTR, expect +2% relative, α=0.05, power 0.8.

- Rule: N ≈ 16 × p(1−p)/δ² per arm (the two-proportion shortcut) → δ = 0.001, p̄ = 0.0505 → 16 × 0.0479 / 0.000001 ≈ **766K per arm**
- *Say it:* "Roughly 800K users per arm — at 50K DAU that's a month-plus, so we either extend, accept less power, or find a bigger effect. Sample size math is a roadmap input, not an afterthought."

## Drill 10 — Agent cost per episode

**Given:** Support agent: mean 6 steps; each step resends ~3K tokens of context + 250 out; small tier $0.15/$0.60.

- Step cost: 3K/1M × 0.15 + 250/1M × 0.6 ≈ $0.00045 + $0.00015 = $0.0006
- Episode: 6 × $0.0006 ≈ **$0.0036** (+ tool latency, amortized)
- 100K episodes/day → **$360/day** — and runaway episodes (200 steps): 33× a normal episode → budget caps are cost controls
- *Say it:* "About four-tenths of a cent per episode, 360 bucks a day at 100K episodes — and the tail is what kills you: one uncapped loop is thirty normal episodes, so per-episode budgets are non-negotiable."

## Drill 11 — Freshness pipeline throughput

**Given:** Corpus of 500K docs; 1% change daily; each change = re-chunk + re-embed 1 doc (~2s CPU) + index upsert.

- Daily: 5,000 docs × 2s = 10,000s ≈ **2.8 CPU-hours** — trivial, so design for the *burst*: a CMS migration re-ingests 100K docs = 56 CPU-hours → parallelize 16 workers = 3.5 hours
- *Say it:* "Steady state is nothing — three CPU-hours a day. The design case is the mass-migration burst: 100K docs needs 16 parallel workers to finish inside an afternoon, and cache invalidation at that scale is the real work."

## Drill 12 — The sanity-check special

**Given:** A vendor claims their vector DB does "500K QPS on one node."

- Walk it: 500K QPS × (even a 0.2ms query) = 100% of… 100 cores at 1 query/core/ms — plausible ONLY for tiny cached results, no filters, no p99 guarantee. Ask: "at what recall, what filter selectivity, what payload size, what p99?"
- *Say it:* "500K QPS is a benchmark shape, not a product claim — the number I need is my workload's p99 at my filter rate, and I'll measure that myself during a POC."

---

**How to practice:** one drill per day, timed 10 minutes, paper only. After two weeks, invent three drills from your own projects — the habit of *deriving* is the skill; the twelve above are just calibration.
