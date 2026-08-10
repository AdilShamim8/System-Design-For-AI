---
chapter_id: B.6
title: "Picking the Brain You Can Afford"
topic: "Model selection & cost tradeoffs"
track: genai
bloom_stage: ["evaluate", "create"]
est_read_minutes: 18
prerequisites: ["B.0", "X.4"]
teaching_goal: "Learner can design a model selection strategy across capability tiers, with routing, caching, and prompt caching, and forecast the bill that arrives 30 days later."
primary_diagram: assets/diagrams/B.6/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#model-selection"
status: coming-soon
last_updated: 2026-08-10
---
        # Picking the Brain You Can Afford

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        You have five models to choose from. The biggest is 10x smarter and 20x more expensive. The smallest is 10x cheaper and barely passes the bar. Picking the right one — per request, per user, per task — is the difference between a sustainable business and a $47K surprise bill.

        ---

        ## Teaching goal

        Learner can design a model selection strategy across capability tiers, with routing, caching, and prompt caching, and forecast the bill that arrives 30 days later.

        ---

        ## What this chapter will cover

        - The capability ladder: small (Haiku, 4o-mini), medium (Sonnet, 4o), frontier (Opus, GPT-4, Gemini Ultra).
- The cost ladder: 20x range from small to frontier. The unit economics that follow.
- Model routing: easy requests to small, hard requests to large. The classifier that decides.
- Prompt caching: the 90% discount on stable prompt prefixes. Free money.
- Semantic caching: serving repeated queries from cache. The 40-60% traffic reduction.
- Forecasting the bill: per-request cost × expected volume. The math you must do before launch.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Evaluate → Create.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [B.0](../02-genai-system-design/b0-the-box-that-predicts-the-next-word.md), [X.4](../04-cross-cutting/x4-the-bill-nobody-warned-you-about.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#model-selection).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: Picking the Brain You Can Afford`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
