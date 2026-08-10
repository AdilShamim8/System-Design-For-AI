# Agentic AI System Design — Questions

## Q-AGT-1 — The Research Agent That Won't Stop

**Scenario:** Your research agent loops on ambiguous queries — searching, reading, never deciding it has enough. Average cost crept from $0.30 to $2.10 per query.

**Track:** agentic | **Difficulty:** medium | **Read first:** C.1, C.5

### Worked answer

Root cause: the termination condition is implicit. The agent is told to "write a summary when you have enough" but "enough" is undefined. LLMs are biased toward continuation. Immediate fix: hard iteration cap (e.g., 10). Better fix: explicit stopping rules. Longer-term: tell the agent the budget up front so it can plan. Deeper: calibrate budgets per task.

---

## Q-AGT-2 — The Coding Agent That Breaks Tests

**Scenario:** Coding agent opens PRs that break existing tests. Tests pass locally before the PR, but CI fails. The agent is modifying files it shouldn't touch.

**Track:** agentic | **Difficulty:** hard | **Read first:** C.1, C.2, C.6

### Worked answer

Two problems: scope (modifying wrong files) and environment (local tests ≠ CI tests). Fix scope: scope the `write_file` tool — it refuses to write outside the allowed set. Fix environment: make the agent's test run match CI exactly (same command, same Docker image, latest main). Make test results loud and structured.

---

## Q-AGT-3 — The Multi-Agent Support System

**Scenario:** Design a customer support system with three agents: triage, knowledge, action. They need to collaborate.

**Track:** agentic | **Difficulty:** hard | **Read first:** C.1, C.3, C.5

### Worked answer

Use the supervisor pattern: triage is the supervisor. All communication goes through triage — no direct knowledge→action calls. Action agent has the tightest guardrails: destructive operations require triage approval. Hard cap on actions per ticket. All actions logged. Shared budget: $2/ticket, 30 seconds wall-clock.
