# System Design for AI

> **System design for AI, taught like a story — free, from zero to production.**

Most resources that teach AI system design assume you already know what system design *is*. They're reference manuals for people who already have the vocabulary — dense, correct, and useless to a beginner.

This project is the missing on-ramp. It starts at zero, teaches through narrative and analogy the way a good mentor teaches a junior engineer over coffee, and ends at the same depth as the paid, staff-level resources — but reachable by someone starting from nothing.

**Free. Open source. MIT-licensed. No paywall, ever.** That's the entire point of difference from the paid courses that already exist. Free is a product feature here, not an afterthought.

---

## Pick your path

| If you are... | Start here |
|---|---|
| **Totally new** — never heard the words "system design" in a software context | [Module 0: The Friday Night Problem](./00-start-here/0.0-the-friday-night-problem.md) |
| **Know code, not AI** — backend/data/QA engineer moving into AI roles | [Module 0](./00-start-here/) → then [Track A: ML System Design](./01-ml-system-design/) |
| **Know AI, not system design** — touched ML/AI tools, never designed a production system | [Module 0](./00-start-here/) → then [Track B: GenAI System Design](./02-genai-system-design/) |
| **Here for interview prep** — want the question bank | [Question Bank](./06-question-bank/) (and consider [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide) as a complementary staff-level reference) |

---

## What this is

A **free, open-source, beginner-to-expert curriculum** covering how AI systems are actually designed and built — across three tracks:

- **Track A — Classical ML System Design.** Recommendation systems, search & ranking, ad click prediction, fraud detection, the ML lifecycle, the "why did the model get worse in production" mystery.
- **Track B — Generative AI / LLM System Design.** LLMs at a systems level, prompting as a design surface, RAG, vector databases, chunking, reranking, model selection and cost, multimodal, evaluation.
- **Track C — Agentic AI System Design.** What makes something an agent, the agent loop, tool use and MCP, multi-agent collaboration, memory, guardrails, computer-use and coding agents.
- **Cross-Cutting Layer.** Infrastructure & MLOps, multi-tenancy & security, reliability & safety, evaluation & observability, cost/FinOps, real failure patterns.
- **Capstone Design Studio.** End-to-end "design this system" walkthroughs that combine everything.

Every chapter opens with a story, not a definition. Every chapter follows Bloom's Taxonomy — Remember → Understand → Apply → Analyze → Evaluate → Create. Every chapter ends with an "explain it back" checkpoint, because teaching-back is the actual test of understanding.

---

## What this is NOT

(We say this plainly because honesty builds trust — the same way [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide) does.)

- **Not a terse interview cram sheet.** If you want that, [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide) already does it better than we ever could, for free. We link to it as the "graduate to this next" resource.
- **Not a link list.** [Awesome-Agentic-System-Design](https://github.com/gtzheng/Awesome-Agentic-System-Design) is a great one. We're a teaching resource, not a curated bibliography.
- **Not a hands-on coding course.** [TensorTonic](https://github.com/TensorTonic) is excellent for that. We teach system-design thinking and architecture, not LeetCode-for-ML drills.
- **Not a paid course.** [ByteByteGo](https://bytebytego.com) is excellent but paywalled and assumes prior background. We exist specifically to be the free, beginner-first alternative.
- **Not a replacement for the official docs.** When a claim comes from Anthropic, OpenAI, Google, Databricks, or an arXiv paper, we cite it. Read the originals.

---

## The curriculum map

```
Module 0 — Start Here (the on-ramp every competitor skips)
  0.0  The Friday Night Problem               (What is system design)
  0.1  Why AI Breaks Differently              (Why AI needs system design more)
  0.2  Six Words That Unlock Everything       (Vocabulary starter kit)
  0.3  Boxes, Arrows, and What They're Telling You  (How to read a diagram)

Track A — Classical ML System Design
  A.0  The Model That Got Worse on Monday     (ML lifecycle)
  A.1  The Recipe Box Everyone Cooks From     (Feature stores)
  A.2  The Front Page Mind Reader             (Recommendation systems)      ✦ full
  A.3  The Search Bar That Almost Understands You  (Search & ranking)
  A.4  The Penny That Decides a Billion Dollars   (Ad click prediction)
  A.5  The 3am Fraud Alarm                    (Fraud & anomaly detection)
  A.6  Two Models Walk Into Production        (A/B testing & evaluation)
  A.7  Why Did the Model Get Worse?           (Drift, retraining, closing the loop)

Track B — Generative AI / LLM System Design
  B.0  The Box That Predicts the Next Word    (What an LLM is, systems-level)
  B.1  Prompting as a Design Surface          (Context engineering)
  B.2  The Librarian Who Never Forgets        (RAG)                         ✦ full
  B.3  The Index That Speaks in Numbers       (Vector databases)
  B.4  Splitting Knowledge Without Losing It  (Chunking)
  B.5  The Second Pair of Eyes                (Reranking)
  B.6  Picking the Brain You Can Afford       (Model selection & cost)
  B.7  Beyond Text                            (Multimodal generation)
  B.8  "It Sounds Right" Is Not Good Enough   (GenAI evaluation)

Track C — Agentic AI System Design
  C.0  The Bot That Thinks vs the Bot That Talks  (What makes an agent)
  C.1  The Loop That Won't Stop               (The agent loop)              ✦ full
  C.2  The Tools in the Toolbox               (Tool use & MCP)
  C.3  The Team in the Same Room              (Multi-agent & A2A)
  C.4  The Memory That Forgets on Purpose     (Agent memory)
  C.5  The Guardrail Problem                  (When the loop runs away)
  C.6  The Agent That Drives Your Computer    (Computer-use & coding agents)

Cross-Cutting Layer (threaded into all three tracks)
  X.0  The Pipes Behind the Magic             (Infrastructure & MLOps)
  X.1  Two Competitors, One Backend           (Multi-tenancy & security)
  X.2  Confidently Wrong                      (Reliability & safety)
  X.3  The Stethoscope on the System          (Evaluation & observability)
  X.4  The Bill Nobody Warned You About       (Cost / FinOps)               ✦ full
  X.5  When Production Breaks                 (Real failure patterns)

Capstone — Design Studio
  S.1  Design a Customer Support AI
  S.2  Design a Multi-Tenant RAG Platform
  S.3  Design a Coding Agent
  S.4  Design a Voice Assistant
```

✦ = written to full quality (Phase 1 proof-of-voice). Other chapters are structured stubs — see [ROADMAP.md](./ROADMAP.md) for what's built and what's next.

---

## How to read this repo

Two ways:

1. **Read it raw on GitHub.** Every chapter is a standalone `.md` file with YAML frontmatter. Diagrams are Mermaid — GitHub renders them natively.
2. **Read it on the website.** *(Coming in Phase 3 — the interactive site with the System Visualizer, animated request flows, and a searchable question bank. Until then, GitHub is the canonical source.)*

Each chapter file follows this structure:

```markdown
---
chapter_id: B.2
title: "The Librarian Who Never Forgets"
topic: "Retrieval-Augmented Generation (RAG)"
track: genai
bloom_stage: [apply, analyze]
est_read_minutes: 18
prerequisites: [B.0, B.1]
teaching_goal: "..."
status: stable | draft | coming-soon
last_updated: 2026-08-10
---

# The Librarian Who Never Forgets

[story open]

## Remember — ...
## Understand — ...
## Apply — ...
## Analyze — ...
## Evaluate — ...
## Create — ...

## A common misconception
## Explain it back
## Go deeper
```

---

## Repository structure

```
system-design-for-ai/
├── 00-start-here/             # Module 0
├── 01-ml-system-design/       # Track A
├── 02-genai-system-design/    # Track B
├── 03-agentic-system-design/  # Track C
├── 04-cross-cutting/          # Cross-cutting layer
├── 05-design-studio/          # Capstone walkthroughs
├── 06-question-bank/          # Practice questions, by track
├── assets/diagrams/           # Editable Mermaid source for every diagram
├── GLOSSARY.md                # Plain-English glossary, one term = one analogy
├── ROADMAP.md                 # What's built, what's next
├── CONTRIBUTING.md            # How to add a chapter, fix a diagram, propose a Field Note
├── LICENSE                    # MIT
└── README.md                  # You are here
```

---

## Pedagogy contract (the non-negotiables)

Every chapter in this repo obeys:

1. **Bloom's Taxonomy, explicitly, in order.** Remember → Understand → Apply → Analyze → Evaluate → Create. The reader always knows where they are in their own understanding.
2. **Open with a story or concrete scene, never a definition.** The definition arrives *after* the reader already feels the problem.
3. **One idea per paragraph, one analogy per concept, plain words over jargon.** If a term must be introduced, it gets a one-sentence plain-English anchor before it's ever used unexplained again.
4. **No lecture voice.** The way you'd explain it to a sharp friend over coffee, not the way a slide deck reads.
5. **Never assume unstated prerequisites.** If a lesson needs a concept from an earlier module, link it inline.
6. **End with "explain it back," not a multiple-choice quiz.** Teaching-back is the actual test of understanding, not recall.
7. **Memorization is a failure mode.** If a section can only be "gotten right" by memorizing a term, rewrite it until the term is a natural label for something the reader already understands intuitively.

If you find a chapter that doesn't live up to this, that's a bug. Open an issue.

---

## Contributing

Yes, please. See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to:

- Fix a typo, diagram, or technical error
- Write a missing chapter (the stubs are waiting)
- Propose a Field Note (a real production failure pattern, told as a cautionary story)
- Add a question to the bank

All contributions are MIT-licensed.

---

## Acknowledgments

This project stands on the shoulders of, and explicitly complements:

- [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide) by AI Daddy — the best free staff-level reference. We link to it as the "graduate to this next" resource from every chapter.
- [ByteByteGo](https://bytebytego.com) — the paid course whose structural lessons (7-step framework, real case studies, excellent diagrams) shaped our thinking, even though we serve a different audience.
- [Awesome-Agentic-System-Design](https://github.com/gtzheng/Awesome-Agentic-System-Design) — a curated map of agentic systems papers and frameworks.
- [TensorTonic](https://github.com/TensorTonic) — hands-on coding drills for ML, the natural complement to our architecture-first approach.
- The engineering blogs of Anthropic, OpenAI, Google, Databricks, and Meta — cited throughout.

Every explanation, analogy, and diagram in this project is written fresh. We study competitors for structure and gaps; we do not lift their sentences, diagrams, or chapter sequencing.

---

## License

MIT. See [LICENSE](./LICENSE).

Free, open, forever. That's the whole point.
