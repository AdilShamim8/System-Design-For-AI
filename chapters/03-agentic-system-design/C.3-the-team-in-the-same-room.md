---
chapter_id: "C.3"
title: "The Team in the Same Room"
topic: "Multi-agent & A2A"
track: agentic
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 18
prerequisites: ["C.1", "C.2"]
teaching_goal: "Design multi-agent orchestration patterns (supervisor, swarm, hierarchical), describe A2A protocol, and reason about the coordination tax."
status: stable
last_updated: 2026-08-12
---

# The Team in the Same Room

One agent is powerful. Two agents are complicated. Five agents are a meeting. Multi-agent systems promise the productivity of a team — but they also inherit the coordination overhead of one.

This chapter is about when the team is worth the meeting. The key insight: multi-agent is the microservices of AI. The same tradeoffs apply, and the same lesson holds — start monolithic (single agent), split only when the benefits clearly justify the overhead.

---

## Remember — name it

- **Multi-agent system** — multiple agents, each specialized, coordinating to achieve a goal.
- **Orchestration patterns**: supervisor (one boss, many workers), swarm (peer-to-peer), hierarchical (managers of managers).
- **A2A (Agent-to-Agent) protocol** — a standard for agents to communicate. Like HTTP for services.
- **Coordination tax** — the latency, token, and complexity cost of agents talking to each other. Every cross-agent message costs latency, tokens, and risk of misunderstanding.

---

## Understand — orchestration patterns

### Supervisor (one boss, many workers)

One agent (the supervisor) receives the task, delegates to specialized workers, monitors progress, decides when done. The supervisor is the brain; the workers are the hands.

**Pros:** clear accountability, simple communication (all through supervisor), easy to reason about.
**Cons:** supervisor is a bottleneck and single point of failure.

**When to use:** when the task has a natural routing structure (triage → knowledge/action/human). Most customer support systems.

### Swarm (peer-to-peer)

Agents communicate directly with each other, no central coordinator. Each agent decides who to talk to and when.

**Pros:** no bottleneck, emergent behavior, naturally scalable.
**Cons:** hard to reason about, hard to debug, coordination overhead can exceed the work.

**When to use:** research and exploration tasks where agents need to share findings dynamically. Rarely the right choice for production — too unpredictable.

### Hierarchical (managers of managers)

A tree structure: top-level supervisor delegates to mid-level supervisors, who delegate to workers.

**Pros:** scales to large numbers of agents. Each layer handles a subset of coordination.
**Cons:** latency (each layer adds a round-trip), complexity.

**When to use:** large-scale systems with 10+ agents. Overkill for 3-4 agents.

---

## Apply — design a customer support system with 3 agents

Use the **supervisor pattern**: triage agent is the supervisor.

1. Ticket arrives → triage classifies it (informational / billing / technical / escalation).
2. Routes to knowledge agent (answers from docs) or action agent (executes refunds).
3. Action agent requests approval from triage before destructive operations.
4. All communication goes through triage — no direct knowledge→action calls.

**Why through triage:** one place to log, one place to enforce policy, one place to intervene. Direct agent-to-agent communication creates coupling and makes the system hard to reason about.

**Budget:** $2/ticket, 30 seconds wall-clock. Triage is the kill switch.

---

## Analyze — when multi-agent wins vs. loses

**Wins:**
- Genuinely separable subtasks (research + write + edit — each is a distinct skill).
- Parallelizable work (process 10 documents simultaneously).
- Specialization that matters (a legal agent + a medical agent for a healthcare compliance task).

**Loses:**
- Tightly coupled tasks (where each step depends on the previous, and splitting adds coordination overhead).
- Small tasks (where the overhead of multi-agent setup exceeds the work).
- Tasks where one good agent with good tools suffices.

**The default:** single agent. Add agents only when specialization or parallelism clearly justifies the coordination tax. More agents ≠ better — more agents = more overhead.

---

## Evaluate — the microservices analogy

Multi-agent systems are the "microservices of AI." The same tradeoffs apply:
- Microservices give you independent scaling and deployment, but add coordination overhead, debugging complexity, and operational burden.
- Multi-agent gives you specialization and parallelism, but adds coordination tax, debugging complexity, and operational burden.

The lesson from microservices: **start monolithic, split only when the benefits clearly justify the overhead.** The same applies to agents: start single-agent, split only when you've hit the limit of what one agent can do.

---

## Create — design a multi-agent system for market research

Design a system that generates a market research report. What agents do you need (researcher, analyst, writer, editor)? What pattern? How do they communicate? Where's the coordination tax? Could a single agent with good tools do this better?

Consider: market research involves finding sources (researcher), analyzing data (analyst), writing the report (writer), and refining it (editor). Each is a distinct skill. But a single agent with web search, code execution, and file writing tools might handle the whole task — at lower coordination cost. The tradeoff: specialization vs. overhead.

---

## A common misconception

**"More agents = better."** No. More agents = more coordination overhead. A single good agent with good tools often outperforms a multi-agent system, because the single agent doesn't pay the coordination tax. Multi-agent is worth it only when specialization or parallelism clearly justifies the overhead.

---

## Explain it back

> "A multi-agent system is _____. The three orchestration patterns are _____, _____, and _____. The coordination tax is _____. Multi-agent wins when _____; it loses when _____. The default should be _____."

---

## References

- **Wu, Q., et al. (2023), "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation," arXiv:2308.08155.** https://arxiv.org/abs/2308.08155
- **Park, J. S., et al. (2023), "Generative Agents: Interactive Simulacra of Human Behavior," UIST 2023.** arXiv:2304.03442 — https://arxiv.org/abs/2304.03442
- **LangChain LangGraph Documentation.** Multi-agent orchestration framework. https://langchain-ai.github.io/langgraph/
- **Li, S., et al. (2023), "Multi-Agent Collaboration: Harnessing the Power of Intelligent LLM Agents," arXiv:2306.03314.** https://arxiv.org/abs/2306.03314
