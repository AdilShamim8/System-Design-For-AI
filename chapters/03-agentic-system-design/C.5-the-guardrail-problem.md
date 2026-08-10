---
chapter_id: "C.5"
title: "The Guardrail Problem"
topic: "When the loop runs away"
track: agentic
bloom_stage: ["evaluate", "create"]
est_read_minutes: 17
prerequisites: ["C.1", "C.2"]
teaching_goal: "Design guardrails (input/output validation, loop budgets, kill switch) and identify failure patterns from real runaway-agent incidents."
primary_diagram: assets/diagrams/C.5/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# The Guardrail Problem

An agent is given a task. It starts well. It loops. It calls a tool that costs $5 per call. It loops. It calls the tool 1,000 times in 20 minutes. It loops. By the time anyone notices, the bill is $5,000 and the task isn't done. This is the guardrail problem — and every agent team learns it the expensive way.

---

## Remember

**Guardrails** — safety rails that prevent agents from doing harm. **Input guardrails** — validate user requests before the agent sees them. **Output guardrails** — validate agent responses before they reach the user or take effect. **Loop budget** — hard cap on iterations, tokens, dollars, wall-clock. **Kill switch** — the ability to stop a running agent immediately. **Runaway loop** — an agent that won't stop, consuming resources until killed.

---

## Understand

Agents can cause harm. A chatbot can waste your time; an agent can spend your money, delete your files, send emails you didn't want. Guardrails are the safety disciplines that prevent this.

**Input guardrails.** Before the agent sees a request, validate it:
- **Rate limiting**: prevent abuse (one user sending 1,000 requests/hour).
- **Prompt injection detection**: scan for malicious inputs ('ignore previous instructions').
- **Content filtering**: block harmful requests.
- **Authentication**: ensure the user is who they say they are, and is authorized for the action.

**Output guardrails.** Before the agent's response reaches the user or takes effect, validate it:
- **PII detection**: block responses containing sensitive data.
- **Harmful content filtering**: block responses that are dangerous, illegal, or against policy.
- **Action validation**: for agents that take actions (refunds, file writes), validate that the action is authorized before executing.
- **Hallucination checks**: for high-stakes outputs, verify claims against ground truth.

**Loop budgets.** Hard caps, enforced by the orchestrator (not the LLM):
- **Max iterations**: e.g., 15. Prevents infinite loops.
- **Max tokens**: e.g., 50K. Prevents context bloat.
- **Max dollars**: e.g., $5. Prevents runaway costs.
- **Max wall-clock**: e.g., 60 seconds. Prevents stuck agents.

The first budget hit terminates the agent. The LLM is told the budget so it can plan; the orchestrator enforces it regardless.

**The kill switch.** A way to stop a running agent immediately — from the user ('cancel'), from a supervisor ('pause'), or automatically (budget exceeded, error threshold). The kill switch must always exist. An agent without a kill switch is a process you can't stop.

---

## Apply

Design guardrails for a customer support agent that can issue refunds:
- **Input**: rate limit (100 requests/user/day), prompt injection detection, authentication.
- **Output**: refund amount validation (max $100 without human approval), PII detection, harmful content filter.
- **Budget**: max 10 iterations, max $2 per ticket, max 30 seconds wall-clock.
- **Kill switch**: user can cancel at any time; supervisor can pause; auto-kill on budget exhaustion.
- **Action validation**: refunds >$100 require human approval. All actions logged for audit.

This gives defense in depth: input prevents abuse, output prevents harm, budget prevents runaway, kill switch provides the final backstop.

---

## Analyze

Real incident patterns:
- **Air Canada chatbot (2024)**: a chatbot hallucinated a refund policy. The airline was held responsible. Lesson: output guardrails — verify claims against ground truth before sending to users.
- **NYC MyCity bot (2024)**: gave legally wrong advice. Lesson: for high-stakes domains, human-in-the-loop for consequential outputs.
- **Runaway agent loops (2024-2025)**: agents looping into five-figure bills. Lesson: hard budgets, enforced by the orchestrator, not the LLM.
- **Prompt injection**: untrusted content in retrieved documents caused agents to override instructions. Lesson: treat all retrieved content as untrusted; validate outputs before acting.

Each incident was preventable. The guardrails existed; they just weren't implemented.

---

## Evaluate

Guardrails aren't optional — they're the price of admission for production agents. An agent without guardrails is a liability. The question isn't 'should we add guardrails?' but 'what guardrails does this specific agent need?' The answer depends on the agent's capabilities: an agent that can issue refunds needs financial guardrails; an agent that can write files needs filesystem guardrails; an agent that can run code needs sandboxing. Match the guardrails to the capabilities.

---

## Create

Design guardrails for a coding agent that can read files, write files, and run tests. What input guardrails? What output guardrails (before a file is written, before a test is run)? What budget? What kill switch? How do you prevent the agent from writing to files outside the project directory?

---

## A common misconception

**'Guardrails slow the agent down.'** They do — and that's the point. An agent without guardrails is fast until it does something catastrophic, then it's out of business. Guardrails are the seatbelts of agents: they add a small friction to normal operation, and they save you when something goes wrong. The teams that skip guardrails ship faster — until they don't.

---

## Explain it back

Guardrails are _____. The four types are _____, _____, _____, and _____. Loop budgets are enforced by _____, not _____. The kill switch is _____. The Air Canada incident teaches _____. Guardrails aren't optional because _____.

---

## Further reading

- **Anthropic (2024), "Building Effective Agents"** — guardrail patterns.
- **NeMo Guardrails (NVIDIA) documentation** — an open-source guardrail framework.
- **Lakera AI** — prompt injection and guardrail research.
