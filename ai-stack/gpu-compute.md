> Reference landscape, current as of **late 2026**. Tools change; the *categories* and the selection questions are durable. Every file leads with the questions you should ask before picking anything in its category.


# GPU Compute — The Math That Decides Rent vs. Buy

## The only formula you need first

**VRAM ≈ parameters × bytes-per-param + KV-cache + activation overhead.**

| Precision | Bytes/param | 8B model | 70B model |
|---|---|---|---|
| fp16 | 2 | 16 GB | 140 GB |
| 8-bit | 1 | 8 GB | 70 GB |
| 4-bit | 0.5 | 4 GB | 35 GB |

So: a 70B at 4-bit (~35 GB weights + cache) fits an 80 GB A100/H100-class card; at fp16 it needs two-plus. An 8B at 4-bit fits *many gaming laptops* — the fact behind "run Llama 8B locally." KV-cache grows with context × concurrent requests — long-context serving dies on cache before it dies on compute (why prefix caching matters, [serving-infra.md](./serving-infra.md)).

## Throughput sanity numbers (ballpark, late-2026 hardware — verify for your setup)

| Setup | Rough generation speed |
|---|---|
| 7–8B quantized, modern laptop | 10–40 tok/s |
| 7–8B, single A10G/L4-class GPU | 100–500 tok/s batched (vLLM) |
| 70B quantized, single 80 GB GPU | 20–80 tok/s |
| Frontier API | 30–150 tok/s (their problem, your bill) |

Batching is the multiplier: single-stream vs. continuous-batched throughput on the same card differs 5–20×. When someone quotes "tokens/sec" without concurrency, they've quoted a car's speed in neutral.

## Rent vs. buy (the actual decision)

- **Spot/preemptible GPUs:** 60–80% cheaper; fine for training/batch, hostile for serving (X.5).
- **Reserved/on-demand cloud GPUs:** the default for production self-hosting; $1–4/GPU-hour is the planning band for common cards (prices move — date-stamp).
- **Own hardware:** pays at high, steady utilization (>60–70%); idle GPUs are the most expensive furniture in the building.
- **The crossover from APIs:** from Lab b6 — roughly when daily token spend × 30 exceeds (GPU-hours needed × price + ops hours × salary). At small scale APIs always win; the economics flip somewhere between 10M–100M tokens/day for mid-tier models. Your x2 dashboard computes *your* number.

## The interview patterns

- "How much VRAM to serve 70B to 100 concurrent users with 8K context?" — walk it: weights (4-bit ≈ 35 GB) + KV-cache (~0.5–2 GB per active 8K session × concurrent) → 2× 80 GB cards, comfortably. Showing the *structure* of the estimate beats the exact answer (07-estimation-drills.md trains this).
- "Why is GPU utilization 30%?" — usually batch size (under-batching) or a data-path bottleneck feeding a starving GPU (Lab x3's per-stage diagnosis, in a new costume).
