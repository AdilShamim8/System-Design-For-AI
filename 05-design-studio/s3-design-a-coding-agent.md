---
chapter_id: S.3
title: "Design a Coding Agent"
topic: "Capstone: coding agent"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 25
prerequisites: ["C.1", "C.2", "C.4", "C.5", "C.6"]
teaching_goal: "Learner can design a coding agent with tool use, memory, guardrails, and sandboxing, and reason about the frontier of computer-use."
primary_diagram: assets/diagrams/S.3/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#coding-agents"
status: coming-soon
last_updated: 2026-08-10
---
        # Design a Coding Agent

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        An agent that writes code. An agent that runs tests. An agent that fixes its own bugs. This isn't speculative — it's the actual frontier of agentic AI, and the design patterns from Track C are exactly what you need to build one. This capstone walks through the design, with the reasoning shown.

        ---

        ## Teaching goal

        Learner can design a coding agent with tool use, memory, guardrails, and sandboxing, and reason about the frontier of computer-use.

        ---

        ## What this chapter will cover

        - The brief: an agent that takes a GitHub issue, writes a fix, runs tests, opens a PR. 80% of issues auto-resolvable.
- Step 1 — Tools: read_file, grep, write_file, run_tests, open_pr. The minimal set.
- Step 2 — The loop: read issue → explore code → write fix → run tests → iterate → open PR.
- Step 3 — Memory: short-term (the current issue's context), long-term (the repo's structure, conventions).
- Step 4 — Guardrails: sandbox the code execution, scope the file writes, require human review of the PR.
- Step 5 — The tradeoffs: autonomy vs. safety. Where to draw the line for v1, v2, v3.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Create.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [C.1](../03-agentic-system-design/c1-the-loop-that-wont-stop.md), [C.2](../03-agentic-system-design/c2-the-tools-in-the-toolbox.md), [C.4](../03-agentic-system-design/c4-the-memory-that-forgets-on-purpose.md), [C.5](../03-agentic-system-design/c5-the-guardrail-problem.md), [C.6](../03-agentic-system-design/c6-the-agent-that-drives-your-computer.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#coding-agents).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: Design a Coding Agent`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
