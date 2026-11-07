# Glossary

Plain-English definitions. One term = one analogy.

Last updated: 2026-08-10.

---

## Foundations

**Client** — The thing asking for something. Your browser, your phone. The customer in a restaurant.

**Server** — The thing answering. The computer in a data center. The kitchen in a restaurant.

**Request / Response** — A single round trip: client asks, server answers.

**Latency** — How long one request takes. Low latency = fast.

**Throughput** — How many requests a system handles at once. High throughput = handles many.

**Scaling** — Vertical = buy a bigger server. Horizontal = add more servers.

**Tradeoff** — The central act. Fast, cheap, reliable — pick two.

**Load balancer** — A traffic cop that distributes requests across servers.

**Cache** — Small, fast storage for recent/popular answers. The specials board at a restaurant.

**Asynchronous (async)** — "I'll get back to you." Fire-and-forget.

---

## Classical ML

**Model** — A function learned from data. The recipe a kitchen develops by cooking 10,000 dishes.

**Training** — Building a model from data. Showing the kitchen 10,000 plates.

**Inference (serving)** — Using a trained model on new inputs.

**Feature** — A measurable input. For house prices: square footage, bedrooms.

**Feature store** — Shared registry of features for training and serving.

**Training-serving skew** — When training features don't match serving features.

**A/B test** — Two versions, different users, measure which wins.

**Cold start** — Predicting for a new user or item with no history.

**Candidate generation** — First stage of recommendation: fast, lossy, reduces millions to hundreds.

**Ranking** — Second stage: slow, precise, orders candidates.

**Drift** — When the world changes and the model's patterns stop being accurate.

---

## GenAI / LLM

**LLM** — A model trained to predict the next word, scaled to billions of parameters.

**Token** — The unit of text an LLM processes (~4 characters). You pay per token.

**Context window** — How much text the LLM can hold in mind.

**Prompt** — The input text. Instructions, question, context.

**Hallucination** — When an LLM confidently states something false.

**Embedding** — A vector representation of text. GPS coordinates of meaning.

**Vector database** — Optimized for storing and searching embeddings.

**RAG** — Retrieval-Augmented Generation. Retrieve docs, stuff into prompt, generate.

**Chunking** — Splitting documents into retrievable pieces.

**Reranking** — Second-pass scoring with a cross-encoder.

**KV cache** — Cached computations that make generating token N cheap.

---

## Agentic AI

**Agent** — An AI system that takes actions, not just produces text.

**Agent loop** — plan → act → observe → repeat, until done or budget exhausted.

**Tool** — A function the agent can call (search, run code, query DB).

**MCP** — Model Context Protocol. A standard for connecting LLMs to tools.

**ReAct** — The pattern of interleaving reasoning with acting.

**Memory** — Short-term (context window) vs. long-term (persistent store).

**Guardrails** — Safety rails: input/output validation, loop budgets, kill switches.

**Computer-use agent** — An agent that operates a GUI (clicks, types, reads screen).

**Budget** — Cap on iterations, tokens, dollars, wall-clock. The kill switch.

---

## Cross-cutting

**MLOps** — Operating ML in production. DevOps for models.

**Multi-tenancy** — One system, many customers, strict isolation.

**Observability** — Understanding what's happening inside from the outside.

**Eval** — Measuring whether an AI system is actually good.

**FinOps** — Managing cloud costs. Especially important for AI.

**Prompt injection** — Untrusted text that overrides LLM instructions.

**Latency budget** — Total time you'll make a user wait, broken down across components.

**Calibration** — When predicted probabilities match actual accuracy.

**TTFT** — Time To First Token. Key metric for streaming applications.


---

## Terms added in the production-grade expansion (2026)

**TTFT (time to first token)** — how long until an LLM's first streamed token arrives; the metric chat users feel as "thinking." (Lab b1)

**Tokens per second (TPS)** — streaming generation speed; humans read ≈5 words/s ≈ 7 tokens/s. (Lab b1)

**Semantic cache** — a cache whose key is a query's embedding (meaning, not bytes); hits serve in ~50–100ms vs. seconds for full generation. Threshold trades hit rate against wrong hits. (Lab b5)

**PSI (population stability index)** — drift statistic comparing a feature's current distribution to a reference; bands <0.1 / 0.1–0.25 / >0.25 are heuristics to calibrate, not laws. (Lab a7)

**KS test (Kolmogorov–Smirnov)** — two-sample distribution-distance test; the numeric-feature companion to PSI. (Lab a7)

**RRF (reciprocal rank fusion)** — combining ranked lists by score Σ 1/(k+rank); wins over score-fusion because scores from different systems aren't comparable. (Lab a5)

**Hit@k / MRR** — retrieval metrics: does the gold item appear in the top-k; 1/rank of the first gold hit. Free, exact, CI-runnable. (Lab b2)

**Faithfulness / relevance** — RAG generation metrics: every answer claim supported by retrieved context (trust) / the answer addresses the question asked (usefulness). (Lab b4)

**LLM-as-judge** — using a model to grade outputs; requires temperature 0, randomized comparison order, and calibration against hand labels. (Lab b4)

**Point-in-time correctness** — every feature value must be knowable at the prediction moment; the feature-store law against leakage. (Lab a6)

**Training/serving skew** — the same feature computed differently offline and online, drifting apart until serving breaks. (Chapter A.1)

**Champion/challenger** — deployment pattern where a new model runs alongside the incumbent (shadow or partial traffic) and promotes only on evidence. (Chapter A.6)

**Label maturity** — the delay before labels are trustworthy (chargebacks, defaults); comparing windows of different maturity is a classic dashboard lie. (Lab a3)

**Calibration / ECE** — predicted probabilities matching observed frequencies; expected calibration error summarizes the reliability-diagram gap. Vital for bidders, free for rankers. (Lab a4)

**Agent loop** — while budget: model decides (tool call or final answer), code executes, result returns. Budgets (steps/tokens/cost) live outside the model. (Lab c1)

**Tool contract** — the full specification of an agent tool: purpose (stated negatively too), constrained params, errors-as-data, declared side effects, idempotency. (Lab c2)

**Reversibility × cost grid** — tool-gating matrix: reversible-cheap (no gate) → irreversible-cheap (token confirm) → irreversible-expensive (human approval). (Lab c2)

**Prompt injection (direct/indirect)** — user text or *retrieved content* overriding system instructions; the Chevy/Air Canada family of failures. Defense is the layer stack. (FN-07, Lab c5)

**Trajectory grading** — evaluating an agent's path (steps, loops, tool choices), not just its outcome; catches right-answers-via-garbage-paths. (Lab c5)

**Degradation ladder** — the pre-built sequence of degraded modes (shed batch → cache-only → honest queueing) that keeps a system useful under stress. (Lab x3)

**Noisy neighbor** — one tenant's load degrading others' performance; fixed by per-tenant rate and concurrency caps. (Capstone cap2)

**Cost per successful answer** — request cost divided by end-to-end success rate; prices quality into unit economics. (Lab x2)

**Attack-to-layer table** — the security artifact mapping each known attack to the guardrail layer that catches it. (Lab c5)

**Eval gate** — the CI check blocking any prompt/model/tool change that regresses the versioned eval set. (Lab b4, c5)
