# System Design for AI

> **Free, open-source, production-grade: learn AI system design by *building* it — not by watching it.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Chapters: 38](https://img.shields.io/badge/Chapters-38-brightgreen)](#the-curriculum-map)
[![Labs: 27](https://img.shields.io/badge/Hands--on_Labs-27-blue)](#the-curriculum-map)
[![Interview mocks: 8](https://img.shields.io/badge/Interview_Mocks-8-orange)](#the-curriculum-map)

A complete curriculum for designing AI systems that survive production — classical ML, GenAI/RAG, and agentic systems — built on one philosophy: **learning by doing.** Read a chapter, build the lab on a real-world dataset, study a real production failure, then perform it in a mock interview. 38 chapters · 27 labs · 12 documented production incidents · a full interview-prep layer.

**Free. Open source. MIT-licensed. No paywall, ever.**

---

## Start here

1. **Read [docs/PHILOSOPHY.md](./docs/PHILOSOPHY.md)** — the Read → Do → Break → Perform → Review loop, and why every lab runs on real data.
2. **Pick your on-ramp** in [paths/](./paths/) — backend engineer, data scientist, ML engineer, data analyst, student, or product manager, each with a week-by-week plan.
3. **Track yourself** in [PROGRESS.md](./PROGRESS.md) (fork the repo and tick boxes).

## The learning loop

| Step | Where | What you do |
|---|---|---|
| **Read** | `chapters/` | 38 narrative chapters — Bloom's-ordered, story-first, plain words |
| **Do** | `labs/` | 24 labs + 3 capstones on real datasets (MovieLens, NYC TLC, ULB fraud, SQuAD, SEC 10-K, Flickr8k, Criteo…) |
| **Break** | `field-notes/` | 12 documented production AI failures — Amazon's biased recruiter, Zillow's $500M write-down, the Air Canada ruling — each with the design lesson |
| **Perform** | `interview-prep/` | 6-step framework, 42+ scenario questions, 8 full mock interviews, seniority ladder, study plans, 100+ flashcards |
| **Review** | `cheatsheets/`, `flashcards/`, `diagrams/` | 11 one-page references, 9 architectures to draw from memory |

## The curriculum map

```
system-design-for-ai/
├── chapters/            READ    38 chapters (foundations · ML · GenAI · agents · cross-cutting · studio)
├── labs/                DO      27 labs: Track A (ML) · B (GenAI) · C (agents) · cross-cutting · 3 capstones
├── datasets/            DO      real-world dataset catalog: sizes, licenses, quirks, lab mapping
├── paths/               NAV     6 role-based on-ramps with week-by-week plans
├── field-notes/         BREAK   12 documented production AI failures with design lessons
├── interview-prep/      PERFORM framework · 42+ questions · 8 mocks · plans · flashcards
├── cheatsheets/         REVIEW  11 dense reference cards
├── ai-stack/            REVIEW  the tool landscape (models, vector DBs, frameworks, serving, GPUs)
├── diagrams/            REVIEW  9 reference architectures (Mermaid)
├── docs/                        philosophy, citations
├── PROGRESS.md                  your personal checklist
└── website/                     the Next.js companion site
```

**The tracks** (each chapter pairs with its labs):

| Track | Chapters | Labs | You can build… |
|---|---|---|---|
| Module 0 — Start Here | 4 | setup | the vocabulary: latency, throughput, tradeoffs, four questions |
| Track A — Classical ML | 8 | 8 | recommenders, fraud, CTR, search, forecasting, drift, A/B tests |
| Track B — GenAI/LLM | 9 | 8 | RAG from scratch, chunking, eval, semantic cache, multimodal |
| Track C — Agentic | 7 | 5 | agent loops, tool contracts, multi-agent, memory, guardrails |
| Cross-Cutting | 6 | 4 | monitoring, cost dashboards, load tests, design docs |
| Capstone Studio | 4 | 3 | a shipped support bot, a multi-tenant platform, a coding agent |

## Every lab uses real data

MovieLens ratings · NYC TLC taxi trips · ULB credit-card fraud · Criteo CTR · ANTIQUE search · SQuAD · SEC 10-K filings · Flickr8k · IMDB — full cards with sizes, licenses, and gotchas in [datasets/](./datasets/). No synthetic toy data, ever: real datasets have the imbalance, leakage traps, and licensing reality that dominate real system design.

## The interview layer

Everything in [interview-prep/](./interview-prep/) converts the learning into performance: the [6-step framework](./interview-prep/01-the-framework.md), 42+ scenario questions with worked answers across [ML](./interview-prep/02-ml-questions.md), [GenAI](./interview-prep/03-genai-questions.md), [agents](./interview-prep/04-agentic-questions.md), [cross-cutting](./interview-prep/05-cross-cutting-questions.md), and the [classical-to-AI bridge](./interview-prep/06-classical-bridge-questions.md), 12 [estimation drills](./interview-prep/07-estimation-drills.md), 8 [timed mock interviews](./interview-prep/mock-interviews/) with rubrics, the [seniority ladder](./interview-prep/11-seniority-ladder.md), and 30/60/90-day [study plans](./interview-prep/study-plans/).

## The website

The `website/` directory contains a Next.js app that renders the chapters with an interactive system visualizer:

```bash
cd website && npm install && npm run dev   # http://localhost:3000
```

## Acknowledgments

This project complements (does not duplicate): [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide), [ByteByteGo](https://bytebytego.com), [Awesome-Agentic-System-Design](https://github.com/gtzheng/Awesome-Agentic-System-Design), and [Stanford CS 329S](https://stanford-cs329s.github.io/) (Chip Huyen). Every explanation, analogy, lab, and diagram here is written fresh; every production incident in `field-notes/` is cited to its primary reporting.

## License

MIT. See [LICENSE](./LICENSE). Free, open, forever.

---

## Developer
Built by **Adil Shamim**.

## Connect With Me
<p align="center">
  <a href="https://www.adilshamim.me/">
    <img src="https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=About.me&logoColor=white" />
  </a>
  <a href="https://adilshamim8.medium.com/">
    <img src="https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white" />
  </a>
  <a href="https://linkedin.com/in/adilshamim8">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://twitter.com/adil_shamim8">
    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" />
  </a>
  <a href="https://www.kaggle.com/adilshamim8">
    <img src="https://img.shields.io/badge/Kaggle-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white" />
  </a>
  <a href="https://leetcode.com/u/AdilShamim8">
    <img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" />
  </a>
</p>
