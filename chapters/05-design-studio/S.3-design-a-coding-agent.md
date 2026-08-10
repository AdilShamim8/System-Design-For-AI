---
chapter_id: "S.3"
title: "Design a Coding Agent"
topic: "Capstone: coding agent"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 25
prerequisites: ["C.1", "C.2", "C.4", "C.5", "C.6"]
teaching_goal: "Design a coding agent with tool use, memory, guardrails, and sandboxing."
primary_diagram: assets/diagrams/S.3/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# Design a Coding Agent

An agent that writes code. An agent that runs tests. An agent that fixes its own bugs. This isn't speculative — it's the actual frontier of agentic AI, and the design patterns from Track C are exactly what you need to build one. This capstone walks through the design, with the reasoning shown.

---

## Remember

This capstone combines: the agent loop (C.1), tool use (C.2), memory (C.4), guardrails (C.5), and computer-use/sandboxing (C.6).

---

## Understand

**The brief**: an agent that takes a GitHub issue, writes a fix, runs tests, opens a PR. Target: 70% of issues auto-resolvable.

**The architecture:**

**Tools:**
- `read_file(path)`: read a file in the repo.
- `grep(pattern)`: search the codebase.
- `write_file(path, content)`: modify a file. Scoped to the project directory.
- `run_tests()`: run the test suite in a sandboxed container.
- `open_pr(diff, description)`: open a pull request.

**The loop (C.1):**
1. **Plan**: read the issue. Understand what's being asked. Plan the approach.
2. **Act**: read relevant files. Search for related code. Write the fix.
3. **Observe**: run tests. Read the output. If tests fail, diagnose and fix.
4. **Repeat** until tests pass.
5. **Finish**: open a PR with the diff and description.

**Memory:**
- **Short-term**: the current issue's context — files read, changes made, test results.
- **Long-term**: the repo's structure, conventions, past PRs. Stored in a vector DB, retrieved at the start of each task.

**Guardrails (C.5):**
- **write_file scoped**: can only write to the project directory. Cannot modify `.github/`, `package.json`, or production config without human approval.
- **run_tests sandboxed**: runs in a container with no network access, no access to sensitive files.
- **Budget**: max 30 iterations, max $5 per task, max 10 minutes wall-clock.
- **Human review**: all PRs require human review before merge. The agent opens the PR; a human merges it.
- **Adversarial defense**: file contents treated as untrusted. No executing instructions found in code comments.

**Sandboxing (C.6):**
- Code execution in a Docker container: no network, no host filesystem access, resource limits.
- API keys scoped: read-only repo access, no production access.
- PR opening: the agent can open PRs but cannot merge them.

---

## Apply

**Step 1 — Tools.** The minimal set: read, search, write, test, PR. Don't add more tools than needed — each tool is a failure surface. The agent should be able to do its job with these five.

**Step 2 — The loop.** read issue → explore code → write fix → run tests → iterate → open PR. The loop terminates when tests pass or budget is exhausted. If budget is exhausted, the PR is opened with 'work in progress' and a human takes over.

**Step 3 — Memory.** Short-term: sliding window of last 10 actions + summary. Long-term: repo structure (file tree, module dependencies, test patterns) embedded and retrieved. This helps the agent navigate unfamiliar codebases faster.

**Step 4 — Guardrails.** Scope write_file. Sandbox run_tests. Human review for PRs. Budget enforcement by the orchestrator. These are non-negotiable — an agent that can write code and run it without limits is a security liability.

**Step 5 — Evaluation.** What % of issues does the agent resolve? Of PRs opened, what % pass review without changes? Of PRs that pass review, what % introduce bugs? Track these metrics over time. The agent improves with iteration; the eval suite tells you if it's actually improving.

---

## Analyze

The trust boundary: the agent can write code and run tests, but it cannot deploy, cannot access production, cannot merge PRs. The human is always in the loop for the final merge. This is the right boundary for 2026 — autonomous enough to be useful, controlled enough to be safe. As trust builds, the boundary can expand (auto-merge PRs that pass all tests, for low-risk changes).

---

## Evaluate

A coding agent that resolves 70% of issues is transformative — it doubles engineering throughput for the routine work, freeing humans for the complex 30%. But the 30% it can't handle must escalate gracefully (open a 'needs human' PR, not a broken PR). The system's quality is measured as much by its failure mode as by its success rate.

---

## Create

Redesign this for a DevOps agent that manages infrastructure. It can modify Terraform configs, run `terraform plan`, and open PRs for infrastructure changes. What additional guardrails (production infrastructure is sensitive)? What sandboxing (terraform plan can have side effects)? What's the human-in-the-loop policy for production changes?

---

## A common misconception

**'A coding agent should be fully autonomous.'** No. The agent should be autonomous enough to be useful, controlled enough to be safe. Full autonomy — writing and merging code without human review — is too dangerous for 2026. The right design: agent does the heavy lifting, human reviews and merges. This is the same principle as autopilot in aviation: the machine does 95% of the flying, the pilot handles takeoff, landing, and emergencies.

---

## Explain it back

The coding agent combines _____, _____, _____, _____, and _____. The five tools are _____, _____, _____, _____, and _____. The loop terminates when _____ or _____. The guardrails are _____, _____, _____, and _____. The trust boundary is _____.

---

## Further reading

- **See chapters C.1, C.2, C.4, C.5, C.6 for the component patterns.**
- **Devin / Cognition Labs** — an early autonomous coding agent.
- **GitHub Copilot Workspace** — GitHub's coding agent.
- **SWE-bench** — a benchmark for coding agents.
