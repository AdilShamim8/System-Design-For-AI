# 7 — Capacity Estimation (the interview math)

## The standard units
1M req/day ≈ **12 req/s** (÷ 86,400) · 1B/day ≈ 12K/s · QPS×86,400 = daily · 1 GB ≈ 10⁹ bytes; a photo ≈ 1–5 MB; a doc page ≈ 2 KB

## The five-step drill (07-estimation-drills.md trains it)
1. **Users → requests**: DAU × actions/user/day (state assumptions!)
2. **Read/write split**: reads usually 10–100× writes (cacheable!)
3. **Storage**: writes/day × bytes × growth; ×2 for replication, ×1.5 index overhead
4. **Bandwidth/QPS**: peak = mean × 2–3 (daily curve); p99 ≠ mean
5. **Sanity-check against known systems** — "that would be 40 MB/s per user; no."

## Worked micro-example — "RAG for 100K employees"
- 20% daily active = 20K users × 5 questions = 100K questions/day ≈ **1.2 QPS mean, ~4 peak**
- Corpus: 50M pages × 2 KB = 100 GB text → ~25M chunks × 500 tokens... embeddings at 1,536-d: 25M × 6 KB ≈ **150 GB + index ≈ 300 GB** → multi-node vector DB, filtered by tenant
- Generation: 100K × 4.5K in/400 out → 450M in + 40M out tokens/day → at $3/$15: **~$1,950/day, ~$60K/month** → routing + caching conversation starts *here*
- Latency: 2 s p95 budget → allocate (cheatsheet #5)

## The AI-specific twists interviewers probe
- **GPU memory**: weights (params × bytes) + KV-cache (context × concurrency) — see ai-stack/gpu-compute.md
- **Vector index memory** ≈ vectors × dims × 4 × 1.5–2 (HNSW overhead)
- **Cost is capacity**: at LLM prices, the *dollar* ceiling often binds before the server one — budget like a resource (X.4)
- **Peak vs mean for bursty AI traffic**: one viral feature = 10× Thursday

## Style rules
State assumptions out loud, round to powers of 10, keep units visible, end with "so we'd need roughly N of X" — a number, not a paragraph.
