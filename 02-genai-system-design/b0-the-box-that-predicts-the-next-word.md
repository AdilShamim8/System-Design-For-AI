---
chapter_id: B.0
title: "The Box That Predicts the Next Word"
topic: "What an LLM is at a systems level"
track: genai
bloom_stage: ["remember", "understand"]
est_read_minutes: 15
prerequisites: ["0.0", "0.1"]
teaching_goal: "Learner can describe an LLM as a black box with three ports (prompt in, tokens out, dollars out) and explain context window, KV cache, and what's actually expensive."
primary_diagram: assets/diagrams/B.0/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#llm-fundamentals"
status: coming-soon
last_updated: 2026-08-10
---
        # The Box That Predicts the Next Word

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        Forget the transformer architecture. Forget attention. Forget backpropagation. For the next 200 pages, you only need to know three things about an LLM: what goes in, what comes out, and what it costs. This chapter is those three things.

        ---

        ## Teaching goal

        Learner can describe an LLM as a black box with three ports (prompt in, tokens out, dollars out) and explain context window, KV cache, and what's actually expensive.

        ---

        ## What this chapter will cover

        - The black box: text in, text out, money out. Three ports, no math.
- Tokens: the unit of text and the unit of cost. Roughly 4 characters per token.
- Context window: how much the LLM can hold in mind. Why bigger is more capable but more expensive.
- KV cache: the reason generating the 1000th token is cheap, but generating the first token of a long prompt is expensive.
- What's actually expensive: input tokens (pay for every prompt token), output tokens (pay more for every generated token), long contexts (often quadratic in attention compute).
- The pricing shape: per-token, per-1M-tokens, per-minute of GPU time. Reading a model's pricing page fluently.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Remember → Understand.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [0.0](../00-start-here/0.0-the-friday-night-problem.md), [0.1](../00-start-here/0.1-why-ai-breaks-differently.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#llm-fundamentals).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: The Box That Predicts the Next Word`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
