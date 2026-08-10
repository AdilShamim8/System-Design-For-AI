---
chapter_id: S.1
title: "Design a Customer Support AI"
topic: "Capstone: customer support AI"
track: capstone
bloom_stage: ["create"]
est_read_minutes: 25
prerequisites: ["B.2", "B.6", "B.8", "C.5", "X.1", "X.4"]
teaching_goal: "Learner can combine RAG, model selection, evaluation, guardrails, multi-tenancy, and cost optimization into one end-to-end design, solved live and out loud."
primary_diagram: assets/diagrams/S.1/
common_misconception: "(to be filled in the full chapter)"
go_deeper: "https://github.com/ombharatiya/ai-system-design-guide#case-studies"
status: coming-soon
last_updated: 2026-08-10
---
        # Design a Customer Support AI

        > **Status: coming-soon.** This chapter is a structured stub — the story hook, outline, and teaching goal are locked. The full chapter is waiting to be written. See [ROADMAP.md](../ROADMAP.md) for the writing queue, or [claim it](../CONTRIBUTING.md#3-write-a-missing-chapter).

        ---

        ## The story (the hook — full chapter opens here)

        You're the tech lead. The CEO wants a customer support AI shipped in eight weeks. The support team handles 50,000 tickets a month, mostly repetitive. The legal team is nervous. The CFO is nervous. Your job is to design the system — out loud, on a whiteboard, in a way that survives the design review. This is that whiteboard.

        ---

        ## Teaching goal

        Learner can combine RAG, model selection, evaluation, guardrails, multi-tenancy, and cost optimization into one end-to-end design, solved live and out loud.

        ---

        ## What this chapter will cover

        - The brief: 50K tickets/month, 8-week timeline, multi-tenant (two business units), strict cost ceiling.
- Step 1 — Requirements: what does 'good' look like? Auto-resolve rate, customer satisfaction, cost-per-ticket.
- Step 2 — Architecture: RAG over the knowledge base, model routing (cheap for easy, frontier for hard), guardrails.
- Step 3 — The hard parts: multi-tenancy, escalation to humans, evaluation, cost control.
- Step 4 — The tradeoffs: what we're giving up to hit the timeline. What we'll add in v2.
- Step 5 — The launch checklist: what must be true before we ship. The 'definition of done' for an AI feature.

        ---

        ## Bloom's Taxonomy stages this chapter will move through

        Create.

        (See [README.md § Pedagogy contract](../README.md#pedagogy-contract-the-non-negotiables) for why every chapter follows Bloom's stages in order.)

        ---

        ## Prerequisites

        Read these first: [B.2](../02-genai-system-design/b2-the-librarian-who-never-forgets.md), [B.6](../02-genai-system-design/b6-picking-the-brain-you-can-afford.md), [B.8](../02-genai-system-design/b8-it-sounds-right-is-not-good-enough.md), [C.5](../03-agentic-system-design/c5-the-guardrail-problem.md), [X.1](../04-cross-cutting/x1-two-competitors-one-backend.md), [X.4](../04-cross-cutting/x4-the-bill-nobody-warned-you-about.md).

        ---

        ## Go deeper (when this chapter is written)

        For the staff-level reference version, graduate to [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide#case-studies).

        ---

        ## Want to write this chapter?

        This is one of 33 chapters waiting for a contributor. If you've read 1–2 of the [Phase-1 full chapters](../ROADMAP.md#phase-1--proof-of-voice-current) and want to write this one:

        1. Open an issue: `Claim: Design a Customer Support AI`.
        2. Read [CONTRIBUTING.md](../CONTRIBUTING.md).
        3. Write the chapter following the pedagogy contract.
        4. Open a PR with `status: draft`; it'll move to `stable` after review.
