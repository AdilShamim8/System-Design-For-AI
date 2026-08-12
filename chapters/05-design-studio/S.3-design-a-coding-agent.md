---
chapter_id: "S.3"
title: "Design a Coding Agent"
topic: "Capstone: coding agent"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 22
prerequisites: ["C.1", "C.2", "C.4", "C.5", "C.6"]
teaching_goal: "Design a coding agent with tool use, memory, guardrails, and sandboxing, and reason about the frontier of computer-use."
status: stable
last_updated: "2026-08-12"
---

# Design a Coding Agent

An agent that writes code. An agent that runs tests. An agent that fixes its own bugs. This isn't speculative — it's the actual frontier of agentic AI. The design patterns from Track C are exactly what you need to build one.

---

## The brief

- An agent that takes a GitHub issue, writes a fix, runs tests, opens a PR
- Target: 70% of issues auto-resolvable
- All PRs require human review before merge

---

## The architecture

**Tools:** read_file, grep, write_file (scoped to project directory), run_tests (in sandboxed container), open_pr (with human review).

**The loop:** read issue -> explore code -> write fix -> run tests -> iterate -> open PR.

**Memory:** short-term (current issue context), long-term (repo structure, conventions, past PRs).

**Guardrails:** write_file scoped to project directory. run_tests in sandbox (no network, no sensitive files). Budget: max 30 iterations, max $5, max 10 minutes. All PRs require human review.

**Sandboxing:** code execution in a Docker container with no network access, no host filesystem access, resource limits. API keys scoped: read-only repo access, no production access.

---

## The trust boundary

The agent can write code and run tests, but it cannot deploy, cannot access production, cannot merge PRs. The human is always in the loop for the final merge. This is the right boundary for 2026 — autonomous enough to be useful, controlled enough to be safe.

---

## A common misconception

**"A coding agent should be fully autonomous."** No. The agent should be autonomous enough to be useful, controlled enough to be safe. Full autonomy — writing and merging code without human review — is too dangerous.

---

## Explain it back

> "The coding agent combines _____, _____, _____, _____, and _____. The five tools are _____. The loop terminates when _____. The guardrails are _____. The trust boundary is _____."

---

## References

- **See chapters C.1, C.2, C.4, C.5, C.6 for component patterns.**
- **Devin / Cognition Labs.** An early autonomous coding agent. https://devin.ai/
- **GitHub Copilot Workspace.** https://githubnext.com/projects/copilot-workspace/
- **SWE-bench.** Benchmark for coding agents. https://arxiv.org/abs/2310.06770
