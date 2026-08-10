---
chapter_id: X.1
title: "Two Competitors, One Backend"
topic: "Multi-tenancy & security"
track: cross-cutting
bloom_stage: ["analyze", "evaluate"]
est_read_minutes: 17
prerequisites: ["0.0", "B.2"]
teaching_goal: "Learner can design multi-tenant AI isolation, reason about data residency, and treat prompt injection as a security boundary."
primary_diagram: assets/diagrams/X.1/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#security"
status: coming-soon
last_updated: 2026-08-10
---
        # Two Competitors, One Backend

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        Two rival companies use the same AI SaaS. They trust the provider with their data. They do not trust each other. The provider must build a system where Company A literally cannot affect Company B — not through data, not through prompts, not through model behavior. This is multi-tenancy, and in AI it's harder than it looks.

        ---

        ## Teaching goal

        Learner can design multi-tenant AI isolation, reason about data residency, and treat prompt injection as a security boundary.

        ---

        ## What this chapter will cover

        - Multi-tenancy: one system, many customers, strict isolation between them.
- Tenant isolation: separate databases, separate vector indexes, separate prompts. The cost-vs-isolation tradeoff.
- Data residency: where data lives, where it's processed, where it's allowed to go. The legal dimension.
- The 'shared model, private data' problem: the same LLM serves all tenants. How do you keep prompts from leaking?
- Prompt injection as a security boundary: untrusted text in retrieved documents or user messages can attempt to override instructions.
- The Air Canada precedent: a chatbot's promise is the company's promise. Multi-tenancy means owning every output.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Analyze → Evaluate.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [0.0](../00-start-here/0.0-the-friday-night-problem.md), [B.2](../02-genai-system-design/b2-the-librarian-who-never-forgets.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#security).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: Two Competitors, One Backend`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
