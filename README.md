# System Design for AI

> **System design for AI, taught like a story — free, from zero to production.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Chapters: 38](https://img.shields.io/badge/Chapters-38-brightgreen)](#the-curriculum-map)
[![Website: included](https://img.shields.io/badge/Website-included-blue)](./website/)

A free, open-source, beginner-to-expert curriculum covering how AI systems are actually designed and built — ML, GenAI, and Agentic AI system design, taught through narrative and analogy. Plus a working Next.js website with an interactive system visualizer.

**Free. Open source. MIT-licensed. No paywall, ever.**

---

## What's in this repo

```
system-design-for-ai/
├── chapters/              # 38 markdown chapters with YAML frontmatter
│   ├── 00-start-here/     # Module 0 (4 chapters)
│   ├── 01-ml-system-design/       # Track A (8 chapters)
│   ├── 02-genai-system-design/    # Track B (9 chapters)
│   ├── 03-agentic-system-design/  # Track C (7 chapters)
│   ├── 04-cross-cutting/          # Cross-cutting (6 chapters)
│   └── 05-design-studio/          # Capstone (4 chapters)
├── website/               # Next.js website (runnable)
│   ├── src/app/           # Pages: home, curriculum, reader, visualizer, questions
│   ├── package.json       # Dependencies
│   └── README.md          # How to run
├── 06-question-bank/      # Practice scenarios
├── assets/diagrams/       # Mermaid diagram sources
├── docs/                  # Citations, pedagogy contract
├── GLOSSARY.md            # Plain-English glossary
├── ROADMAP.md             # What's built, what's next
├── CONTRIBUTING.md        # How to contribute
├── CODE_OF_CONDUCT.md     # Community standards
├── SECURITY.md            # Security policy
└── LICENSE                # MIT
```

---

## The curriculum map

**38 chapters** across 6 tracks. Every chapter follows Bloom's Taxonomy (Remember → Understand → Apply → Analyze → Evaluate → Create), opens with a story, and ends with an "explain it back" checkpoint.

| Track | Chapters | Example |
|---|---|---|
| Module 0 — Start Here | 4 | 0.0 The Friday Night Problem (What is system design) |
| Track A — Classical ML | 8 | A.2 The Front Page Mind Reader (Recommendation systems) |
| Track B — GenAI / LLM | 9 | B.2 The Librarian Who Never Forgets (RAG) |
| Track C — Agentic AI | 7 | C.1 The Loop That Won't Stop (Agent loop) |
| Cross-Cutting | 6 | X.4 The Bill Nobody Warned You About (Cost/FinOps) |
| Capstone Studio | 4 | S.1 Design a Customer Support AI |

---

## How to read the curriculum

**Option 1: Read on GitHub.** Every chapter in `chapters/` is standalone markdown with YAML frontmatter. Diagrams are Mermaid — GitHub renders them natively.

**Option 2: Run the website.** The `website/` directory contains a Next.js app that renders all chapters with an interactive system visualizer, searchable curriculum map, and question bank.

```bash
cd website
npm install
npm run dev
# Open http://localhost:3000
```

---

## The website

The included Next.js website provides:

- **Landing page** — overview, stats, track summaries
- **Curriculum map** — all 38 chapters, searchable and filterable by track
- **Lesson reader** — renders chapter markdown with Mermaid diagram support, sidebar navigation
- **System Visualizer** — interactive RAG pipeline walkthrough (6 steps, click through the request flow)
- **Question bank** — 8+ scenario-framed practice questions with worked answers

Built with Next.js 16, TypeScript, Tailwind CSS, shadcn/ui.

---

## Pedagogy contract

Every chapter obeys:

1. **Bloom's Taxonomy in order** — Remember → Understand → Apply → Analyze → Evaluate → Create
2. **Open with a story**, not a definition
3. **One idea per paragraph, one analogy per concept, plain words over jargon**
4. **No lecture voice** — coffee with a sharp friend, not a slide deck
5. **Never assume unstated prerequisites** — link to earlier chapters inline
6. **End with "explain it back"** — teaching-back is the test of understanding
7. **Cite real sources** — arXiv papers, engineering blogs, official docs
8. **Date-stamp time-sensitive claims** — pricing, model names, protocol versions

---

## Acknowledgments

This project complements (does not duplicate):
- [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide) — the best free staff-level reference
- [ByteByteGo](https://bytebytego.com) — excellent paid course (we're the free alternative)
- [Awesome-Agentic-System-Design](https://github.com/gtzheng/Awesome-Agentic-System-Design) — curated link list

Every explanation, analogy, and diagram is written fresh.

---

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

<p align="center">
</p>

