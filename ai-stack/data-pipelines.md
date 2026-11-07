> Reference landscape, current as of **late 2026**. Tools change; the *categories* and the selection questions are durable. Every file leads with the questions you should ask before picking anything in its category.


# Data Pipelines for AI Systems

## The freshness problem (why this file exists)

Your RAG corpus, feature tables, and agent memory all share one requirement: **change must reach the index predictably.** Stale corpora serve wrong answers confidently (FN-04 family); stale features leak or degrade (Lab a6). Everything here serves freshness with correctness.

## The patterns by scale

| Pattern | Tools | When |
|---|---|---|
| **Batch re-ingest** | cron + scripts; **Airflow**/**Dagster**/**Prefect** for lineage | corpora that change daily+; simplest correct thing |
| **CDC (change data capture)** | **Debezium** (DB logs → streams), vendor streams (confluent) | corpus = a database others mutate; you need row-level freshness |
| **Streaming** | **Kafka** (the standard), **Flink**/Spark Structured Streaming (processing) | events in motion: clicks, transactions, agent events |
| **Transform layers** | **dbt** (SQL transformations, tested), **Spark** (big), pandas/polars (small) | the feature engineering that must be *point-in-time correct* (Lab a6's law) |
| **EL(T) sync** | Fivetran/Airbyte-class | getting SaaS data into your warehouse before any of the above |

## The design rules the labs established

1. **Point-in-time correctness or bust** (Lab a6): every feature must be computable *as of* the prediction moment. Backfills run in order; rolling windows shift.
2. **Corpus versioning** (Labs b3/b5, x1): the index is a function of (source, chunker, embedder); hash it; caches and alerts key on it. Re-chunking without a version bump is a quiet outage.
3. **CDC for RAG freshness** (the production pattern): DB row changes → event → re-embed *that chunk* → upsert index → invalidate cache entries by chunk-lineage. The codebasics "AI system design" reference architecture in your research list is exactly this loop — you can now draw it from memory.
4. **Late data has a policy, not a hope** (Lab a6): grace periods, late-arrival % on a dashboard, and a decision about who pays for freshness.
5. **Schema is a contract** (Lab c2/b7): producers and consumers agree; violations alert (Great Expectations-class checks) before they poison the index.

## The anti-patterns

- **The nightly-full-reindex** at corpus sizes where incremental works (waste multiplied by churn rate).
- **The pipeline that only you can run** (undocumented, laptop-shaped — your labs should each be a script in git; that discipline *is* the lesson).
- **Feature logic duplicated** between training and serving code (Chapter A.1's skew law; the fix is one definition, two runtimes — the feature store's actual job: Feast/Tecton-class or a disciplined Postgres + dbt equivalent).
