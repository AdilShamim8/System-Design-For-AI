> Reference landscape, current as of **late 2026**. Tools change; the *categories* and the selection questions are durable. Every file leads with the questions you should ask before picking anything in its category.


# The AI Engineering Stack — A Field Map

Know the categories cold and any tool conversation becomes easy; know only tools and every conversation becomes a vendor pitch. This folder maps the stack so you can place any tool — today's or next year's — in one glance.

## The map

```
                        ┌──────────────────────────────────────────┐
   your data ──────────▶│  data & pipelines                        │
   (docs, events, DBs)  │  Airflow · Spark · Kafka · Debezium · dbt│
                        └───────────────┬──────────────────────────┘
                                        ▼
                        ┌──────────────────────────────────────────┐
                        │  retrieval & memory                      │
                        │  pgvector · Qdrant · Weaviate · Pinecone │
                        │  Milvus · Vespa · Elasticsearch          │
                        └───────────────┬──────────────────────────┘
                                        ▼
   ┌────────────────┐   ┌──────────────────────────────────────────┐
   │ models         │◀──▶│  orchestration & frameworks              │
   │ OpenAI · Anthropic  │  LangChain · LlamaIndex · LangGraph      │
   │ Google · Meta Llama │  smolagents · Haystack · DSPy            │
   │ Mistral · Qwen      └───────────────┬──────────────────────────┘
   └────────────────┘                   ▼
                        ┌──────────────────────────────────────────┐
                        │  serving & inference                     │
                        │  vLLM · TGI · Triton · BentoML · Ray     │
                        └───────────────┬──────────────────────────┘
                                        ▼
                        ┌──────────────────────────────────────────┐
                        │  observability & evaluation              │
                        │  Langfuse · LangSmith · W&B · MLflow     │
                        │  Evidently · RAGAS · OpenLLMetry         │
                        └──────────────────────────────────────────┘
```

## The files

| File | The category | The one question it answers |
|---|---|---|
| [models-and-providers.md](./models-and-providers.md) | LLMs & APIs | Which tier for which job, and what switching costs? |
| [vector-databases.md](./vector-databases.md) | Retrieval stores | Managed vs. embedded vs. reusing Postgres? |
| [frameworks.md](./frameworks.md) | Orchestration | When a framework helps — and what it hides from you |
| [serving-infra.md](./serving-infra.md) | Self-hosted inference | When to self-host, and what it actually takes |
| [gpu-compute.md](./gpu-compute.md) | Hardware math | VRAM, tokens/sec, and the rent-vs-buy line |
| [observability-eval.md](./observability-eval.md) | Traces, evals, drift | What to instrument and in what order |
| [data-pipelines.md](./data-pipelines.md) | Data in motion | How corpora stay fresh (CDC, streams, batches) |

## How to use this in interviews

Never say "I'd use X." Say "the *category* I need here is X-type — for this scale and team, the right choice is Y because Z, and I'd swap it for W if [condition] changed." That sentence pattern — category, choice, reason, swap condition — is the difference between tool fluency and system thinking, and it survives every tool's sunset.
