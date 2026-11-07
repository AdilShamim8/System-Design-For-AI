# Your Progress Tracker

Fork this repo (or copy this file) and check boxes off as you go. This file is your single source of truth for where you are. Total commitment: **38 chapters · 27 labs · 12 field notes · 9 question banks · 8 mock interviews**.

**Legend:** `[ ]` todo · `[x]` done · `[~]` in progress. Every module is done when all its boxes are checked AND you can complete its "explain it back" without re-reading.

---

## Module 0 — Start Here (4 chapters)

- [ ] 0.0 The Friday Night Problem — what system design is
- [ ] 0.1 Why AI Breaks Differently
- [ ] 0.2 Six Words That Unlock Everything
- [ ] 0.3 Boxes, Arrows, and What They're Telling You
- [ ] Lab 0 — environment setup (`labs/setup/`)

**Module 0 done when:** you can explain, without notes, the four questions every system design answers and the difference between latency and throughput with a real number for each.

---

## Track A — Classical ML System Design (8 chapters · 8 labs)

- [ ] A.0 The Model That Got Worse on Monday
- [ ] A.1 The Recipe Box Everyone Cooks From (feature stores)
- [ ] A.2 The Front Page Mind Reader (recommendations)
- [ ] A.3 The Search Bar That Almost Understands You (search)
- [ ] A.4 The Penny That Decides a Billion Dollars (ads/CTR)
- [ ] A.5 The 3AM Fraud Alarm (fraud detection)
- [ ] A.6 Two Models Walk Into Production (deployment)
- [ ] A.7 Why Did the Model Get Worse? (drift)

**Labs (do each after its chapter):**

- [ ] Lab a1 — Your First Prediction Service · UCI Adult Income (`labs/track-a/lab-a1/`)
- [ ] Lab a2 — Build a Recommendation Engine · MovieLens 100K (`labs/track-a/lab-a2/`)
- [ ] Lab a3 — Fraud Detection Under Imbalance · ULB Credit Card Fraud (`labs/track-a/lab-a3/`)
- [ ] Lab a4 — CTR Prediction and Calibration · Criteo sample (`labs/track-a/lab-a4/`)
- [ ] Lab a5 — Search Ranking · Antique dataset (`labs/track-a/lab-a5/`)
- [ ] Lab a6 — A Demand Forecasting Pipeline · NYC TLC Taxi (`labs/track-a/lab-a6/`)
- [ ] Lab a7 — The Drift Detective · Adult + shifted data (`labs/track-a/lab-a7/`)
- [ ] Lab a8 — A/B Testing Without Lying to Yourself · simulation (`labs/track-a/lab-a8/`)

**Track A done when:** you can whiteboard the three-stage recommendation pattern, explain precision/recall tradeoffs with a fraud example, and compute a sample size for an A/B test.

---

## Track B — GenAI / LLM System Design (9 chapters · 8 labs)

- [ ] B.0 The Box That Predicts the Next Word
- [ ] B.1 Prompting as a Design Surface
- [ ] B.2 The Librarian Who Never Forgets (RAG)
- [ ] B.3 The Index That Speaks in Numbers (embeddings/vector search)
- [ ] B.4 Splitting Knowledge Without Losing It (chunking)
- [ ] B.5 The Second Pair of Eyes (reranking)
- [ ] B.6 Picking the Brain You Can Afford (model selection/cost)
- [ ] B.7 Beyond Text (multimodal)
- [ ] B.8 "It Sounds Right" Is Not Good Enough (evaluation)

**Labs:**

- [ ] Lab b1 — Tokens, Latency, and Money (`labs/track-b/lab-b1/`)
- [ ] Lab b2 — RAG From Scratch · SQuAD contexts (`labs/track-b/lab-b2/`)
- [ ] Lab b3 — Chunking Strategies Compared · SEC 10-K filings (`labs/track-b/lab-b3/`)
- [ ] Lab b4 — Evaluate RAG Like You Mean It (`labs/track-b/lab-b4/`)
- [ ] Lab b5 — Semantic Caching and Cost Control (`labs/track-b/lab-b5/`)
- [ ] Lab b6 — Fine-tune vs. RAG: The Decision Lab (`labs/track-b/lab-b6/`)
- [ ] Lab b7 — Structured Outputs That Don't Break (`labs/track-b/lab-b7/`)
- [ ] Lab b8 — Multimodal Embeddings · Flickr8k (`labs/track-b/lab-b8/`)

**Track B done when:** you can draw the full RAG pipeline from memory, name its three failure modes, and defend chunk-size and top-k choices with numbers from your own labs.

---

## Track C — Agentic System Design (7 chapters · 5 labs)

- [ ] C.0 The Bot That Thinks vs. The Bot That Talks
- [ ] C.1 The Loop That Won't Stop (the agent loop)
- [ ] C.2 The Tools in the Toolbox (tool design)
- [ ] C.3 The Team in the Same Room (multi-agent)
- [ ] C.4 The Memory That Forgets on Purpose
- [ ] C.5 The Guardrail Problem
- [ ] C.6 The Agent That Drives Your Computer

**Labs:**

- [ ] Lab c1 — Agent Loop From Scratch, No Framework (`labs/track-c/lab-c1/`)
- [ ] Lab c2 — Designing Tool Contracts (`labs/track-c/lab-c2/`)
- [ ] Lab c3 — Multi-Agent Handoff (`labs/track-c/lab-c3/`)
- [ ] Lab c4 — Memory and State (`labs/track-c/lab-c4/`)
- [ ] Lab c5 — Agent Evaluation and Guardrails (`labs/track-c/lab-c5/`)

**Track C done when:** you can write the agent loop pseudocode from memory and list three ways each of its stages fails in production.

---

## Cross-Cutting Concerns (6 chapters · 4 labs)

- [ ] X.0 The Pipes Behind the Magic (data pipelines)
- [ ] X.1 Two Competitors, One Backend (multi-tenancy)
- [ ] X.2 Confidently Wrong (evaluation)
- [ ] X.3 The Stethoscope on the System (monitoring)
- [ ] X.4 The Bill Nobody Warned You About (cost)
- [ ] X.5 When Production Breaks (incident response)

**Labs:**

- [ ] Lab x1 — Monitoring and Drift Alerts (`labs/cross-cutting/lab-x1/`)
- [ ] Lab x2 — The Cost Dashboard (`labs/cross-cutting/lab-x2/`)
- [ ] Lab x3 — Load-Test Your AI Service (`labs/cross-cutting/lab-x3/`)
- [ ] Lab x4 — The Design-Document Drill (`labs/cross-cutting/lab-x4/`)

---

## Capstone Studio (4 chapters · 3 capstones)

- [ ] S.1 Design a Customer Support AI
- [ ] S.2 Design a Multi-Tenant RAG Platform
- [ ] S.3 Design a Coding Agent
- [ ] S.4 Design a Voice Assistant

- [ ] Capstone cap1 — Ship a Customer Support AI (`labs/capstones/cap1/`)
- [ ] Capstone cap2 — Multi-Tenant RAG Platform (`labs/capstones/cap2/`)
- [ ] Capstone cap3 — Build a Coding Agent (`labs/capstones/cap3/`)

---

## Field Notes (read one with breakfast, 12 total)

- [ ] FN-01 Amazon's recruiting model learned to dislike women (2018)
- [ ] FN-02 Zillow Offers: when a model's error bars are bigger than the business (2021)
- [ ] FN-03 Microsoft Tay: adversarial inputs in the wild (2016)
- [ ] FN-04 Air Canada's chatbot loses in court (2024)
- [ ] FN-05 COMPAS and the two definitions of fairness (2016)
- [ ] FN-06 Meta Galactica: pulled in three days (2022)
- [ ] FN-07 The Chevy dealership that sold a car for $1 (2023)
- [ ] FN-08 DPD's swearing chatbot (2024)
- [ ] FN-09 NYC MyCity gave illegal business advice (2024)
- [ ] FN-10 Google Photos mislabeled people (2015)
- [ ] FN-11 The Netflix Prize model that never shipped (2010)
- [ ] FN-12 Bing/Sydney: the persona drift incident (2023)

---

## Interview Preparation

**Question banks (write your answer BEFORE reading the worked one):**

- [ ] 02 — ML system design questions
- [ ] 03 — GenAI/LLM system design questions
- [ ] 04 — Agentic system design questions
- [ ] 05 — Cross-cutting questions
- [ ] 06 — Classical-to-AI bridge questions
- [ ] 07 — Estimation drills (do all 12 on paper)
- [ ] 08 — Curveball follow-ups
- [ ] 09 — Behavioral questions for AI engineers
- [ ] 10 — Take-home assignments guide

**Mock interviews (45 minutes each, timer ON, draw on paper or a whiteboard):**

- [ ] Mock 1 — Design a RAG customer-support bot
- [ ] Mock 2 — Design YouTube recommendations
- [ ] Mock 3 — Design a fraud-detection system
- [ ] Mock 4 — Design an LLM API gateway
- [ ] Mock 5 — Design a coding agent
- [ ] Mock 6 — Design a search ranker
- [ ] Mock 7 — Design a vector-database service
- [ ] Mock 8 — Design an AI feature for a fintech app

**Reference:**

- [ ] Read `interview-prep/01-the-framework.md` and rehearse the framework cold
- [ ] Read `interview-prep/11-seniority-ladder.md` — know what level you interview at
- [ ] Read `interview-prep/12-common-mistakes.md`
- [ ] Flashcards: foundations & numbers / ML / GenAI / agents
- [ ] Choose and follow a study plan (30 / 60 / 90 days)

---

## Final self-assessment

You are interview-ready when all of the following are true:

1. You can complete any two mock interviews in this repo at "strong hire" quality, out loud, in 45 minutes.
2. You can state from memory: your p99 latency budget story, your A/B sample-size formula, your RAG failure modes, and one real incident per design principle.
3. You have shipped one capstone to a public URL (even a free tier) and can defend every design decision in it.
