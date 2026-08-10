---
chapter_id: "C.3"
title: "The Team in the Same Room"
topic: "Multi-agent & A2A"
track: agentic
bloom_stage: ["analyze", "evaluate"]
est_read_minutes: 18
prerequisites: ["C.1", "C.2"]
teaching_goal: "Design multi-agent orchestration patterns (supervisor, swarm, hierarchical), describe A2A protocol, and reason about the coordination tax."
primary_diagram: assets/diagrams/C.3/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Team in the Same Room

One agent is powerful. Two agents are complicated. Five agents are a meeting. Multi-agent systems promise the productivity of a team — but they also inherit the coordination overhead of one. This chapter is about when the team is worth the meeting.

---

## Remember

**Multi-agent system** — multiple agents, each specialized, coordinating to achieve a goal. **Orchestration patterns**: supervisor (one boss, many workers), swarm (peer-to-peer), hierarchical (managers of managers). **A2A (Agent-to-Agent) protocol** — a standard for agent communication. **Coordination tax** — the latency, token, and complexity cost of agents talking to each other.

---

## Understand

Why multiple agents? **Specialization.** A researcher agent is good at finding information. A writer agent is good at synthesizing. An editor agent is good at refining. Each is better at its job than a generalist. Multi-agent systems let you compose specialists.

**Orchestration patterns:**

**Supervisor (one boss, many workers).** One agent (the supervisor) receives the task, delegates to specialized workers, monitors progress, decides when the task is done. The supervisor is the brain; the workers are the hands. Pros: clear accountability, simple communication (all through supervisor). Cons: supervisor is a bottleneck and single point of failure.

**Swarm (peer-to-peer).** Agents communicate directly with each other, no central coordinator. Each agent decides who to talk to and when. Pros: no bottleneck, emergent behavior. Cons: hard to reason about, hard to debug, coordination overhead can exceed the work.

**Hierarchical (managers of managers).** A tree structure: top-level supervisor delegates to mid-level supervisors, who delegate to workers. Pros: scales to large numbers of agents. Cons: latency (each layer adds a round-trip), complexity.

**The coordination tax.** Every cross-agent message costs: latency (one agent waits for another), tokens (the message and response consume context), and risk of misunderstanding (the receiving agent misinterprets). For tightly coupled tasks, the coordination tax can exceed the benefit of specialization. For loosely coupled tasks (genuinely separable subtasks), multi-agent wins.

---

## Apply

Design a customer support system with three agents: triage (routes tickets), knowledge (answers from docs), action (executes refunds). Use the **supervisor pattern**: triage is the supervisor. It receives the ticket, routes to knowledge or action, monitors progress, decides when done. All communication goes through triage — no direct knowledge→action calls. This gives clear accountability and a single point of logging and policy enforcement.

---

## Analyze

When does multi-agent win vs. lose?

**Wins**: genuinely separable subtasks (research + write + edit), parallelizable work (process 10 documents simultaneously), specialization that matters (a legal agent + a medical agent for a healthcare compliance task).

**Loses**: tightly coupled tasks (where each step depends on the previous, and splitting adds coordination overhead), small tasks (where the overhead of multi-agent setup exceeds the work), tasks where one good agent suffices.

The default should be single-agent. Add agents only when the task genuinely benefits from specialization or parallelism. More agents ≠ better — more agents = more coordination tax.

---

## Evaluate

Multi-agent systems are the 'microservices of AI.' The same tradeoffs apply: microservices give you independent scaling and deployment, but add coordination overhead, debugging complexity, and operational burden. Multi-agent gives you specialization and parallelism, but adds coordination tax, debugging complexity, and operational burden. The lesson from microservices: start monolithic, split only when the benefits clearly justify the overhead. The same applies to agents: start single-agent, split only when specialization is clearly worth it.

---

## Create

Design a multi-agent system for generating a market research report. What agents do you need (researcher, analyst, writer, editor)? What pattern? How do they communicate? Where's the coordination tax? Could a single agent with good tools do this better?

---

## A common misconception

**'More agents = better.'** No. More agents = more coordination overhead. A single good agent with good tools often outperforms a multi-agent system, because the single agent doesn't pay the coordination tax. Multi-agent is worth it only when specialization or parallelism clearly justifies the overhead. Start single-agent; split only when you've hit the limit.

---

## Explain it back

A multi-agent system is _____. The three orchestration patterns are _____, _____, and _____. The coordination tax is _____. Multi-agent wins when _____; it loses when _____. The default should be _____.

---

## Further reading

- **Wu et al. (2023), "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation," arXiv** — a multi-agent framework.
- **Park et al. (2023), "Generative Agents: Interactive Simulacra of Human Behavior," UIST** — multi-agent simulation.
- **LangChain LangGraph documentation** — a framework for multi-agent orchestration.
