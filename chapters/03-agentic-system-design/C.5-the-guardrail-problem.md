---
chapter_id: "C.5"
title: "The Guardrail Problem"
topic: "When the loop runs away"
track: agentic
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 17
prerequisites: ["C.1", "C.2"]
teaching_goal: "Design guardrails (input/output validation, loop budgets, kill switch) and identify failure patterns from real runaway-agent incidents."
status: stable
last_updated: "2026-08-12"
---

# The Guardrail Problem

An agent is given a task. It starts well. It loops. It calls a tool that costs $5 per call. It loops. It calls the tool 1,000 times in 20 minutes. By the time anyone notices, the bill is $5,000 and the task isn't done. This is the guardrail problem — and every agent team learns it the expensive way.

---

## Remember

- **Guardrails** — safety rails: input validation, output validation, loop budgets, kill switch.
- **Input guardrails** — validate user requests before the agent sees them. Rate limiting, prompt injection detection, content filtering.
- **Output guardrails** — validate agent responses before they reach the user or take effect. PII detection, harmful content filter, action validation.
- **Loop budget** — hard cap on iterations, tokens, dollars, wall-clock. Enforced by the orchestrator, not the LLM.
- **Kill switch** — the ability to stop a running agent immediately. Must always exist.

---

## Understand — defense in depth

**Input guardrails:** before the agent sees a request, validate it. Rate limiting (prevent abuse), prompt injection detection (scan for "ignore previous instructions"), content filtering (block harmful requests), authentication (ensure the user is authorized).

**Output guardrails:** before the agent's response reaches the user, validate it. PII detection (block responses containing sensitive data), harmful content filtering, action validation (for agents that take actions — verify the action is authorized before executing).

**Loop budgets:** hard caps enforced by the orchestrator. Max iterations (e.g., 15). Max tokens (e.g., 50K). Max dollars (e.g., $5). Max wall-clock (e.g., 60 seconds). The first budget hit terminates the agent.

**Kill switch:** a way to stop a running agent — from the user ("cancel"), from a supervisor ("pause"), or automatically (budget exceeded). Must always exist. An agent without a kill switch is a process you can't stop.

---

## Apply — design guardrails for a customer support agent

- **Input**: rate limit (100 requests/user/day), prompt injection detection, authentication.
- **Output**: refund amount validation (max $100 without human approval), PII detection, harmful content filter.
- **Budget**: max 10 iterations, max $2 per ticket, max 30 seconds wall-clock.
- **Kill switch**: user can cancel; supervisor can pause; auto-kill on budget exhaustion.
- **Action validation**: refunds >$100 require human approval. All actions logged for audit.

---

## Analyze — real incident patterns

- **Air Canada chatbot (2024)**: hallucinated refund policy. Lesson: output validation — verify claims against ground truth.
- **NYC MyCity bot (2024)**: gave legally wrong advice. Lesson: human-in-the-loop for high-stakes domains.
- **Runaway agent loops (2024-2025)**: agents looping into five-figure bills. Lesson: hard budgets enforced by orchestrator.
- **Prompt injection**: untrusted content overrode instructions. Lesson: treat all retrieved content as untrusted.

Each was preventable. The guardrails existed; they just weren't implemented.

---

## Evaluate — guardrails are the price of admission

Guardrails aren't optional — they're the price of admission for production agents. An agent without guardrails is a liability. The question isn't "should we add guardrails?" but "what guardrails does this specific agent need?"

---

## Create — design guardrails for a coding agent

Tools: read_file, grep, write_file, run_tests, open_pr. What input guardrails? What output guardrails (before a file is written, before a test is run)? What budget? What kill switch? How do you prevent the agent from writing to files outside the project directory?

---

## A common misconception

**"Guardrails slow the agent down."** They do — and that's the point. An agent without guardrails is fast until it does something catastrophic. Guardrails are the seatbelts of agents.

---

## Explain it back

> "Guardrails are _____. The four types are _____, _____, _____, and _____. Loop budgets are enforced by _____, not _____. The Air Canada incident teaches _____. Guardrails aren't optional because _____."

---

## References

- **Anthropic (2024), "Building Effective Agents."** https://www.anthropic.com/research/building-effective-agents
- **NeMo Guardrails (NVIDIA).** https://github.com/NVIDIA/NeMo-Guardrails
- **OWASP Top 10 for LLM Applications (2024).** https://owasp.org/www-project-top-10-for-large-language-model-applications/
- **Air Canada Chatbot Case (2024), *Moffatt v. Air Canada*, 2024 BCCRT 149.** https://decisions.civlresolutiontb.ca/crt/crtd/en/item/522164/index.do
