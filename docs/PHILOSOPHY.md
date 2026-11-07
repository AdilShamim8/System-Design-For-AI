# The Learning Philosophy

> "Tell me and I forget, teach me and I may remember, involve me and I learn."
> — attributed to Benjamin Franklin

Most AI courses fail for one boring reason: **you watch them, you nod, and you learn nothing you can use.** Watching someone design a RAG system is like watching someone swim. You need to get in the water. This course is built around that single belief, and every structural decision in this repo traces back to it.

This document explains how the course works, why it is organized the way it is, and how to use it so that six months from now you can actually design AI systems — and defend your designs in an interview.

---

## 1. Learning by doing is the spine, not the garnish

Every module in this course follows the same five-step loop. We call it **Read → Do → Break → Perform → Review**.

| Step | Where | What you do | Why it works |
|---|---|---|---|
| **Read** | `chapters/` | Read one narrative chapter that makes a concept *click* | Understanding needs a story before it needs a spec |
| **Do** | `labs/` | Build the thing yourself, on a **real-world dataset** | Knowledge you have used once is yours; knowledge you have only read is rented |
| **Break** | `field-notes/` | Study a real production AI failure that lost real money | You learn more from one postmortem than ten tutorials |
| **Perform** | `interview-prep/` | Answer scenario questions, then attempt a full mock interview | Explaining under pressure is the real test of understanding |
| **Review** | `cheatsheets/`, `flashcards/` | Condensed references and spaced-repetition recall | Interview day rewards fast, structured recall — not re-reading |

If you only do one step, do **Do**. The labs are where the course earns its keep. Every lab uses a public, real-world dataset — MovieLens ratings, NYC taxi trips, Kaggle credit-card fraud records, SQuAD questions, SEC filings — because synthetic toy data teaches you to ignore the messiness that dominates real system design: class imbalance, drift, leakage, bad labels, and cost.

---

## 2. What "production-like" means here

A $10k-style course is not defined by video hours. It is defined by whether the content survives contact with production. This course commits to five production habits:

1. **Real datasets, always.** Every lab names its dataset, its size, its license, and its known quirks (see `datasets/`). No `data = [1,2,3]` placeholders.
2. **Real numbers, date-stamped.** Latency budgets, token prices, model context sizes — anything that changes over time is marked with the date it was true (for example: *"GPT-4o context: 128K tokens, as of its 2024 release"*). When you quote a number in an interview, you should know how fresh it is.
3. **Real failures, cited.** `field-notes/` covers twelve documented production AI incidents — Amazon's biased recruiting tool, Zillow's $500M+ pricing-model write-down, the Air Canada chatbot that lost in court — each mapped to the design principle that would have prevented it, with sources.
4. **Cost is a first-class citizen.** Most courses ignore money. This course treats unit economics (cost per 1,000 requests, GPU-hour math, cache hit rates) as a design input equal to latency and accuracy. The bill is a design surface.
5. **No tool worship.** Tools are named so you can recognize them, but every lesson teaches the *pattern* first and the tool second. Tools get you hired for the wrong reasons; patterns get you through the interview and the on-call rotation.

---

## 3. How the repo is organized

```
system-design-for-ai/
├── chapters/          READ  — 38 narrative chapters (the "understand" layer)
├── labs/              DO    — 24 labs + 3 capstones on real datasets
├── datasets/          DO    — catalog of every real-world dataset the labs use
├── field-notes/       BREAK — 12 documented production AI failures
├── interview-prep/    PERFORM — framework, 9 question banks, 8 mock interviews,
│                                   seniority ladder, study plans, flashcards
├── cheatsheets/       REVIEW — 11 one-page references
├── ai-stack/          REVIEW — the modern AI engineering tool landscape
├── diagrams/          REVIEW — 9 reference architectures (Mermaid)
├── paths/             Navigation — 6 role-based on-ramps into the course
├── PROGRESS.md        Your personal checklist (fork the repo and tick boxes)
└── website/           The Next.js companion site
```

**Start in this order:** pick your path in `paths/` → follow it through `chapters/` and `labs/` → check off `PROGRESS.md` as you go → finish with `interview-prep/`.

---

## 4. The skills, by priority

Not everything in this course is equally important. If you are time-constrained, work down this list. (Percentages are directional emphasis, not exam weights.)

### Must have (the 20% that covers 80% of interviews and work)

- **The four questions** every system design answers — parts, communication, failure, growth (Chapter 0.0)
- **Latency vs. throughput vs. cost** — and how to reason about all three at once (X.0, X.4, Lab b1)
- **The three-stage recommendation pattern** — candidate generation → ranking → re-ranking (A.2, Lab a2)
- **RAG end-to-end** — chunking, embeddings, retrieval, reranking, evaluation (B.2–B.4, Labs b2–b4)
- **Evaluation** — offline metrics vs. online A/B tests, and why offline metrics lie (X.2, Labs a8, b4)
- **Drift and monitoring** — what changes after launch, and how you detect it (A.7, X.3, Lab a7)

### High value (separates strong candidates from passable ones)

- Class imbalance, thresholds, and the cost of errors (A.5, Lab a3)
- Calibration for decision systems (A.4, Lab a4)
- Semantic caching and the LLM unit economics (B.6, X.4, Lab b5)
- Agent loops, tool contracts, and guardrails (C.1, C.2, C.5, Labs c1–c2, c5)
- Capacity estimation from memory (interview-prep/07-estimation-drills.md)

### Differentiators (what makes interviewers lean forward)

- Multi-tenant isolation for AI platforms (S.2, Capstone cap2)
- Trace-level agent evaluation (C.5, Lab c5)
- Fine-tuning vs. RAG vs. prompting — a decision you can defend with numbers (B.6, Lab b6)
- Real incident postmortems you can cite from memory (field-notes/)

---

## 5. How to know you are actually learning

Each chapter ends with an **"explain it back"** checkpoint. This is not decoration — it is the cheapest known test of understanding (the Feynman technique). The rules:

1. After finishing a chapter, close it and explain the core idea out loud, as if to a smart friend who has not read it.
2. If you stall or hand-wave, you have found exactly what to re-read.
3. After each lab, write **three sentences** in your own words: what the system does, where it breaks first, and what you would do next.
4. Before any interview, run at least two full mock interviews from `interview-prep/mock-interviews/` under a real 45-minute timer.

---

## 6. What this course is not

- **Not a math course.** We use exactly as much math as system design requires: a precision/recall tradeoff, a sample-size formula, a cost-per-token calculation.
- **Not a framework course.** You will not "learn LangChain" here. You will learn what LangChain does — and what it hides — by building the same loop yourself once (Lab c1) before you ever let a framework do it for you.
- **Not a research course.** No derivations, no papers to reproduce. We cite papers where they changed practice, not where they filled journals.
- **Not a guarantee.** It is a curriculum with a philosophy. The doing is your part.

---

## 7. A note on honesty

Every number in this course that can go stale is date-stamped, and every claim that comes from a real incident links to its source in `field-notes/` or `REFERENCES.md`. When you find something wrong, open an issue — that is what the repo is for. A course that admits its own decay is more trustworthy than one that pretends it has none.
