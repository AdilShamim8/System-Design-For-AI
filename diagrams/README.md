# Reference Diagrams — Nine Architectures You Should Draw From Memory

Mermaid renders natively on GitHub. Each diagram: the architecture, the one request you should be able to walk through it, and the failure modes the boxes are hiding. **Study by redrawing** — paper, no peeking, then diff against the original. The diffs are your study plan.

| # | Diagram | The interview that asks for it |
|---|---|---|
| [1](./01-classical-ml-serving.md) | Classical ML serving & retraining loop | "Design a fraud/forecast/churn system" |
| [2](./02-rag-reference.md) | RAG, full pipeline | "Design a docs bot" (Mock 1) |
| [3](./03-llm-gateway.md) | LLM API gateway | "Fix our LLM mess" (Mock 4) |
| [4](./04-agent-loop.md) | Agent loop with guardrails | "Design an agent" (Mock 5) |
| [5](./05-multi-agent.md) | Orchestrator + specialists | "When do we go multi-agent?" (c3) |
| [6](./06-feature-store.md) | Feature store, offline & online | "Training/serving skew" questions |
| [7](./07-streaming-inference.md) | Streaming/event-driven AI | "Real-time features" (X.0) |
| [8](./08-eval-loop.md) | The evaluation & rollout loop | "How do you know it works?" (every interview) |
| [9](./09-vector-db-service.md) | Multi-tenant vector service | "Vector DB as a service" (Mock 7) |

*These diagrams intentionally use role names ("queue", "KV store", "ANN index") with tool families in the notes — the pattern survives tool churn, and so should your whiteboard.*
