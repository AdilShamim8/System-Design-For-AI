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
