> Reference landscape, current as of **late 2026**. Tools change; the *categories* and the selection questions are durable. Every file leads with the questions you should ask before picking anything in its category.


# Models and Providers

## The selection questions (ask in this order)

1. **Task shape:** classification/extraction (cheap, small, fine-tunable), grounded Q&A (mid tier + retrieval), hard reasoning/agents (frontier tier)?
2. **Context budget:** how many tokens does your *worst* request need — and what does that cost at your volume (Lab b1's tree)?
3. **Latency profile:** TTFT-bound (chat) or total-bound (batch)? Streaming support?
4. **Data sensitivity:** can prompts leave your perimeter (SOC2, data residency, on-prem/self-host requirement)?
5. **Lock-in tolerance:** OpenAI-compatible endpoint? Abstracted client? Migration cost measured?

## The tiers (late 2026, illustrative — always check current pricing)

| Tier | Typical use | Cost shape | Examples (families) |
|---|---|---|---|
| Small/fast | extraction, classification, routing, high-volume chat | ~$0.1–0.6 /1M in | GPT-4o-mini class, Claude Haiku class, Gemini Flash class, Llama 3.x 8B class |
| Mid | grounded assistants, RAG generation, most products | ~$2–5 /1M in | GPT-4o class, Claude Sonnet class, Gemini Pro class |
| Frontier | hard reasoning, agents, complex code | ~$10–25 /1M in | GPT-class flagship, Claude Opus class, Gemini flagship |
| Open weights | self-host: privacy, cost at volume, fine-tuning | GPU-hours, not tokens | Llama 3.x, Qwen 2.5, Mistral, DeepSeek families |

**Routing is the real pattern** (Lab b6, Mock 4): small model first, escalate the hard 20%. In our lab economics this cut costs 60–80% at ±1pp quality. Providers also ship *mini* variants of tooling (embeddings, rerankers, judges) — price those separately from generation.

## Embedding models (the other half of the stack)

`text-embedding-3-small/large` (OpenAI), `voyage-*` (Voyage AI), open: `bge-*`, `gte-*`, `e5-*`, `all-MiniLM-L6-v2` (the course's workhorse — small, CPU-friendly). Selection: MTEB gives you the league table; **your domain gives you the answer** — rerun a 50-pair eval on your corpus (Lab b2's habit) before committing. Model-specific tokenizers mean re-tuning cache thresholds if you swap (Lab b5).

## Switching costs, honestly

- **API → API:** days (prompt migration + eval re-run). Your b4 eval set is the safety net; without one you're migrating blind.
- **API → open weights:** weeks (serving infra — see [serving-infra.md](./serving-infra.md) — plus quality re-eval and guardrail re-tuning).
- **The trap:** provider-specific features (native tool schemas, JSON modes, prompt caching quirks) creep in silently. Wrap the client (b7's pattern) and keep the wrapper thin.

**Read next:** [frameworks.md](./frameworks.md) (what sits between you and the model), [gpu-compute.md](./gpu-compute.md) (when self-hosting pays).
