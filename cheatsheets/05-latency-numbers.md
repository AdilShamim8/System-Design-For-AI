# 5 — Latency Numbers Every Engineer Should Know

*Classic numbers popularized by Dean (2007) and Norvig; the AI column is this course's (late-2026, verify per setup). Memorize the magnitudes, not the digits.*

## The classic ladder (same order, human scale)
| Operation | Time | Human scale |
|---|---|---|
| L1 cache ref | ~1 ns | |
| Mutex lock/unlock | ~15–25 ns | |
| Main memory ref | ~100 ns | a hardware beat |
| SSD random read | ~100–150 µs | blink of a CPU's eye |
| Read 1 MB from memory | ~250 µs | |
| Same-datacenter round trip | ~0.5–1 ms | |
| Cross-continent RTT | ~50–150 ms | you feel this one |
| Disk seek (spinning rust) | ~10 ms | |

## The AI ladder (the new memorize-these)
| Operation | Time |
|---|---|
| Redis / in-memory cache get | ~0.2–1 ms |
| Postgres point query (warm) | ~1–5 ms |
| ANN search, 100K–1M vectors (in RAM) | ~1–10 ms |
| BM25 over a real index (ES-class) | ~5–50 ms |
| Single-row ML predict (sklearn/LightGBM) | ~0.1–2 ms |
| **LLM first token (TTFT), hosted** | **~300 ms – 2 s** |
| LLM streaming generation | ~30–150 tok/s hosted; 5–30 local-8B |
| Full RAG request (retrieve→generate) | ~1–4 s |
| Embedding one query (CPU, small model) | ~10–50 ms |

## Human perception (the budget anchors)
- < 100 ms: feels instant
- < 1 s: flow preserved (the chat "thinking" line)
- ~1–3 s: TTFT budget for most chat products (streaming buys you this)
- > 10 s: abandonment begins (batch UIs only)

## The interview uses
- Budget math: "RAG p95 ≤ 2 s → retrieval 100 ms + rerank 200 ms + TTFT 700 ms + generation 800 ms + slack" — *show the allocation, defend the slack.*
- The p99 rule: users are the tail. p50 can lie all it wants; p99 is the SLO (Lab a1/x3).
- Cache economics: a 10 ms cache-hit path replacing a 3 s RAG path is *both* the cost fix and the availability plan (x3's ladder).
