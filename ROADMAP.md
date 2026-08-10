# Roadmap

This is a living document. It exists to keep the project honest about what's built, what's in progress, and what's next — the same way `ai-system-design-guide`'s research radar keeps that project feeling alive.

Last updated: 2026-08-10.

---

## Status legend

| Status | Meaning |
|---|---|
| ✅ **stable** | Written to full quality, reviewed, meets the pedagogy contract. Ready to read. |
| 🚧 **draft** | Written but not yet reviewed, or in active revision. Readable but expect changes. |
| ⏳ **coming-soon** | Stub only — frontmatter, story hook, and outline are in place; the full chapter is waiting to be written. |
| 🔬 **researching** | Topic claimed by a contributor; outline being finalized before writing begins. |

---

## Phase 1 — Proof of voice (current)

Five chapters written to full quality to lock the storytelling voice before scaling. These are the calibration set — every subsequent chapter is held to this bar.

| Chapter | Status | Notes |
|---|---|---|
| 0.0 The Friday Night Problem | ✅ stable | Proves the "non-AI first" rule. |
| A.2 The Front Page Mind Reader (Recommendation Systems) | ✅ stable | Proves the classical-ML track. |
| B.2 The Librarian Who Never Forgets (RAG) | ✅ stable | Spec's own named example. Source of truth for the Phase-3 visualizer. |
| C.1 The Loop That Won't Stop (Agent Loop) | ✅ stable | Proves the agentic track. |
| X.4 The Bill Nobody Warned You About (Cost / FinOps) | ✅ stable | Proves the cross-cutting layer and the "genuinely practical" promise. |

---

## Phase 2 — Repository scaffold ✅

The repo structure, README, CONTRIBUTING, LICENSE, glossary skeleton, and Phase-1 chapters are in place. The repo is pushable to GitHub as-is.

---

## Phase 3 — Website MVP (next)

Static-first React site, content compiled from this repo's markdown. Core pages:

- [ ] **Landing** — one sentence of who this is for, one interactive diagram (the RAG pipeline mini-simulator), one CTA.
- [ ] **Curriculum map** — the full 38-chapter spine as an explorable, zoomable map.
- [ ] **Lesson reader** — renders Phase-1 chapters with inline interactive diagrams.
- [ ] **System Visualizer** — one working architecture (RAG pipeline), animated request flow, click-any-component explainer panels.
- [ ] Question Bank and Field Notes render the existing repo content.

Visual identity locked in Phase 3 from the frontend-design SKILL. Vibe anchors: Apple product-page rhythm, Stripe Docs typography, Linear motion philosophy. One accent color, doing real work.

---

## Phase 4 — Scale the curriculum

Fill out the remaining 33 chapters across all tracks, batch by batch, against the Phase-1 quality bar.

### Track A — Classical ML (7 chapters remaining)

| Chapter | Status |
|---|---|
| A.0 The Model That Got Worse on Monday | ⏳ coming-soon |
| A.1 The Recipe Box Everyone Cooks From | ⏳ coming-soon |
| A.3 The Search Bar That Almost Understands You | ⏳ coming-soon |
| A.4 The Penny That Decides a Billion Dollars | ⏳ coming-soon |
| A.5 The 3am Fraud Alarm | ⏳ coming-soon |
| A.6 Two Models Walk Into Production | ⏳ coming-soon |
| A.7 Why Did the Model Get Worse? | ⏳ coming-soon |

### Track B — GenAI / LLM (8 chapters remaining)

| Chapter | Status |
|---|---|
| B.0 The Box That Predicts the Next Word | ⏳ coming-soon |
| B.1 Prompting as a Design Surface | ⏳ coming-soon |
| B.3 The Index That Speaks in Numbers | ⏳ coming-soon |
| B.4 Splitting Knowledge Without Losing It | ⏳ coming-soon |
| B.5 The Second Pair of Eyes | ⏳ coming-soon |
| B.6 Picking the Brain You Can Afford | ⏳ coming-soon |
| B.7 Beyond Text | ⏳ coming-soon |
| B.8 "It Sounds Right" Is Not Good Enough | ⏳ coming-soon |

### Track C — Agentic (6 chapters remaining)

| Chapter | Status |
|---|---|
| C.0 The Bot That Thinks vs the Bot That Talks | ⏳ coming-soon |
| C.2 The Tools in the Toolbox | ⏳ coming-soon |
| C.3 The Team in the Same Room | ⏳ coming-soon |
| C.4 The Memory That Forgets on Purpose | ⏳ coming-soon |
| C.5 The Guardrail Problem | ⏳ coming-soon |
| C.6 The Agent That Drives Your Computer | ⏳ coming-soon |

### Cross-Cutting (5 chapters remaining)

| Chapter | Status |
|---|---|
| X.0 The Pipes Behind the Magic | ⏳ coming-soon |
| X.1 Two Competitors, One Backend | ⏳ coming-soon |
| X.2 Confidently Wrong | ⏳ coming-soon |
| X.3 The Stethoscope on the System | ⏳ coming-soon |
| X.5 When Production Breaks | ⏳ coming-soon |

### Module 0 (3 chapters remaining)

| Chapter | Status |
|---|---|
| 0.1 Why AI Breaks Differently | ⏳ coming-soon |
| 0.2 Six Words That Unlock Everything | ⏳ coming-soon |
| 0.3 Boxes, Arrows, and What They're Telling You | ⏳ coming-soon |

### Capstone — Design Studio (4 walkthroughs)

| Chapter | Status |
|---|---|
| S.1 Design a Customer Support AI | ⏳ coming-soon |
| S.2 Design a Multi-Tenant RAG Platform | ⏳ coming-soon |
| S.3 Design a Coding Agent | ⏳ coming-soon |
| S.4 Design a Voice Assistant | ⏳ coming-soon |

---

## Phase 5 — Question bank, Field Notes, polish pass, launch

- [ ] Question bank: 5+ scenario-framed questions per track, with worked answers cross-linked to curriculum chapters.
- [ ] Field Notes: 6+ dated entries (real production failure patterns), each ending in "the design pattern that would have prevented this."
- [ ] Polish pass: every chapter re-read against the pedagogy contract.
- [ ] Launch checklist: README "what this is NOT" honest, links to competitors as further reading, MIT license loudly stated, mobile performance check on the website.

---

## Phase 6+ — Stretch features

- [ ] "Ask the System" tutor chat — built on FastAPI + LangGraph + a retrieval layer over the repo's own content via MCP. Honestly described as "a small example of an agentic system, not a product feature." Not Phase 1. Not even Phase 5 — this is a v2 feature once the core is solid.
- [ ] Three.js flagship visualizations — 2–3 only, where literal 3D depth genuinely helps (candidates: distributed request flow, agent memory/tool graph, multi-agent orchestration).
- [ ] Community translations.

---

## How to claim a chapter

1. Pick a `coming-soon` chapter above.
2. Open an issue: `Claim: <chapter title>`.
3. Read 1–2 of the Phase-1 chapters first to calibrate voice.
4. Follow [CONTRIBUTING.md](./CONTRIBUTING.md).
5. Open a PR with `status: draft`; we'll move it to `stable` after review.

---

## What "done" looks like for the project

Per the spec's Definition of Done:

> The project as a whole is done-for-launch when: Module 0 through at least one full track is complete at the quality bar, the repo is clean and star-worthy on first impression, the website's landing page and curriculum map alone are enough to make a stranger think "whoever built this actually cared," and nothing is paywalled.

We're not there yet. Phase 1 is done; Phase 2 is done; Phase 3 is next. After Phase 3, the project is launchable with the Phase-1 chapters as the proof and the rest of the map visibly in progress.
