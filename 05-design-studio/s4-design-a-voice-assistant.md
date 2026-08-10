---
chapter_id: S.4
title: "Design a Voice Assistant"
topic: "Capstone: voice assistant"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 25
prerequisites: ["B.7", "C.1", "0.2", "X.2"]
teaching_goal: "Learner can design a voice assistant with multimodal input/output, the agent loop, latency budgets, and reliability under non-determinism."
primary_diagram: assets/diagrams/S.4/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#voice-assistants"
status: coming-soon
last_updated: 2026-08-10
---
        # Design a Voice Assistant

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        Voice breaks everything. The user can't see a loading spinner. They can't read a 'thinking...' indicator. They speak, they expect a response, and if it takes more than a second, they assume it's broken. Designing a voice assistant is designing under the tightest latency budget in AI. This capstone walks through it.

        ---

        ## Teaching goal

        Learner can design a voice assistant with multimodal input/output, the agent loop, latency budgets, and reliability under non-determinism.

        ---

        ## What this chapter will cover

        - The brief: a voice assistant for a smart home device. <800ms response time, multi-turn conversation.
- Step 1 — The pipeline: audio in → ASR → LLM → TTS → audio out. The four stages and their latency budgets.
- Step 2 — The agent loop: voice assistants are agents. Plan, act (control devices), observe, respond.
- Step 3 — Latency budget: 800ms total. ASR 150ms, LLM 400ms, TTS 200ms, network 50ms. No slack.
- Step 4 — Reliability: ASR errors, LLM hallucinations, TTS mispronunciations. Each stage can fail.
- Step 5 — The tradeoffs: streaming vs. batch, accuracy vs. latency, autonomy vs. confirmation.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Create.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [B.7](../02-genai-system-design/b7-beyond-text.md), [C.1](../03-agentic-system-design/c1-the-loop-that-wont-stop.md), [0.2](../00-start-here/0.2-six-words-that-unlock-everything.md), [X.2](../04-cross-cutting/x2-confidently-wrong.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#voice-assistants).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: Design a Voice Assistant`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
