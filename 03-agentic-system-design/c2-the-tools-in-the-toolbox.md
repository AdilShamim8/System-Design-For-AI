---
chapter_id: C.2
title: "The Tools in the Toolbox"
topic: "Tool use & MCP"
track: agentic
bloom_stage: ["apply", "analyze"]
est_read_minutes: 17
prerequisites: ["C.1"]
teaching_goal: "Learner can design a tool interface for an agent, explain tool schemas, and describe why MCP matters as a standard."
primary_diagram: assets/diagrams/C.2/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#mcp"
status: coming-soon
last_updated: 2026-08-10
---
        # The Tools in the Toolbox

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        An agent without tools is just a chatbot that talks to itself. Tools are what let an agent actually do things — search the web, run code, query a database, send an email. The Model Context Protocol is what stops every team from reinventing the tool interface, badly, every time.

        ---

        ## Teaching goal

        Learner can design a tool interface for an agent, explain tool schemas, and describe why MCP matters as a standard.

        ---

        ## What this chapter will cover

        - Tools as the agent's hands: without them, the agent can only talk. With them, it can act.
- Tool schemas: JSON descriptions of what a tool does, what inputs it takes, what it returns. The LLM reads these to decide what to call.
- The call-and-return contract: LLM emits a tool call, orchestrator executes it, result goes back into context.
- The Model Context Protocol (MCP): Anthropic's 2024 standard for connecting LLMs to external tools and data. 'USB-C for AI.'
- Why MCP matters: one standard connector instead of N custom integrations. The network effects.
- Designing good tools: small, composable, well-named, well-documented. Bad tool design makes even smart agents fumble.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Apply → Analyze.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [C.1](../03-agentic-system-design/c1-the-loop-that-wont-stop.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#mcp).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Tools in the Toolbox`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
