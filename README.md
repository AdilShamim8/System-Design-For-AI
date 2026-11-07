# System Design for AI

> **A free, open-source course that teaches you to design AI systems by actually building them — recommenders, RAG chatbots, agents — on real data, then shows you how to explain your designs in interviews.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Chapters: 38](https://img.shields.io/badge/Chapters-38-brightgreen)](#the-curriculum-at-a-glance)
[![Labs: 28](https://img.shields.io/badge/Hands--on_Labs-28-blue)](#the-curriculum-at-a-glance)
[![Mocks: 8](https://img.shields.io/badge/Interview_Mocks-8-orange)](#get-interview-ready)
[![Price: $0](https://img.shields.io/badge/Cost-$0-success)](#faq)

**Beginner friendly · no GPU needed · $0–5 total API spend · 30/60/90-day plans · free forever (MIT)**

---

## What is this course, in plain words?

**System design** means planning how the pieces of software fit together — before you build it wrong. This course teaches you to do that for **AI systems**: the recommendation feeds behind apps like Netflix and Spotify, the chatbots that answer questions from company documents (called **RAG**), and the AI agents that use tools to finish tasks.

Most courses show you slides. This one makes you **build a working mini-version of every system** — a recommender on real movie-rating data, a chatbot on real Wikipedia questions, an agent you code yourself — then **break it on purpose**, and then **practice explaining your design out loud**, which is exactly what job interviews test.

By the end you can say: *"I built it, I broke it, I fixed it, and I can defend every decision with numbers."*

## What you'll be able to do

1. **Design** an AI system end-to-end: from "what's the actual problem?" to boxes-and-arrows architecture to "what breaks at 3AM?"
2. **Build** working prototypes of the four core AI products: recommenders, fraud/risk models, RAG chatbots, and agents.
3. **Debug** the failures that only happen in production: data leakage, drift, hallucination, runaway costs.
4. **Pass** AI system-design interviews: a repeatable 6-step framework, 42 practice questions, and 8 full mock interviews with grading rubrics.

## How the course works — one loop, five steps

Every topic follows the same five steps. This structure is the whole course:

| Step | Folder | What you do | Roughly |
|---|---|---|---|
| 1. **Read** | [`chapters/`](./chapters/) | Read one short story-driven chapter that makes the concept click | 38 chapters |
| 2. **Do** | [`labs/`](./labs/) | Build it yourself, on a **real public dataset** (movie ratings, taxi trips, real fraud data…) | 25 labs + 3 capstones |
| 3. **Break** | [`field-notes/`](./field-notes/) | Study a real, documented AI failure — Amazon's biased hiring tool, the chatbot that lost in court — and the lesson it teaches | 12 incidents |
| 4. **Perform** | [`interview-prep/`](./interview-prep/) | Answer scenario questions, then run full 45-minute mock interviews with a timer | 42 questions · 8 mocks |
| 5. **Review** | [`cheatsheets/`](./cheatsheets/) + [`flashcards/`](./interview-prep/flashcards/) | One-page reference cards and 102 flashcards so it sticks | 11 cards · 4 decks |

**New here?** That table is all you need to remember. Start at step 1 for Module 0, and the course will pull you through the rest.

## Start here — your first 60 minutes

Do these five things in order. Total time: about one hour.

1. **Read the philosophy (5 min).** Open [`docs/PHILOSOPHY.md`](./docs/PHILOSOPHY.md) — it explains the five-step loop above and the rules that make the course work.
2. **Pick your starting path (5 min).** You already have skills; your path file tells you what to skip and what to slow down on. Find yourself in the table below and open that one file.
3. **Read the first chapter (20 min).** [`chapters/00-start-here/0.0-the-friday-night-problem.md`](./chapters/00-start-here/0.0-the-friday-night-problem.md) — why systems break when everyone shows up at once, told through a hungry person and a food-delivery app.
4. **Set up your lab environment (20 min).** Follow [`labs/setup/README.md`](./labs/setup/README.md) — one Python environment, one time, about 20 minutes. No GPU, no paid accounts.
5. **Make it yours (10 min).** Fork this repo, open [`PROGRESS.md`](./PROGRESS.md), and check off your first boxes. From here, your path file tells you exactly what to do each week.

### Pick your path (step 2, expanded)

| You are… | Open this | Total time |
|---|---|---|
| Backend / web developer | [`paths/from-backend-engineer.md`](./paths/from-backend-engineer.md) | ~11 weeks |
| Data scientist | [`paths/from-data-scientist.md`](./paths/from-data-scientist.md) | ~10 weeks |
| ML engineer | [`paths/from-ml-engineer.md`](./paths/from-ml-engineer.md) | ~9 weeks |
| Data analyst | [`paths/from-data-analyst.md`](./paths/from-data-analyst.md) | ~13 weeks |
| Student / total beginner | [`paths/from-student.md`](./paths/from-student.md) | ~20 weeks |
| Product manager (no coding) | [`paths/from-product-manager.md`](./paths/from-product-manager.md) | ~7 weeks (reading track) |

Not sure? If you can write a for-loop, pick the closest match and don't overthink it — every path converges on the same core.

## The curriculum at a glance

**38 chapters · 28 hands-on labs (25 labs + 3 capstones) · 12 real failure case studies · a full interview layer.** Every chapter pairs with labs, every lab uses a real dataset, every concept shows up again in the interview layer.

| Track | Read (chapters) | Do (labs) | You finish able to… |
|---|---|---|---|
| **Module 0 — Start Here** | 4 | setup | speak the language: latency, throughput, tradeoffs, the four questions |
| **Track A — Classical ML** | 8 | 8 | build recommenders, fraud detection, search ranking, forecasts — and know when they rot |
| **Track B — GenAI / LLM** | 9 | 8 | build a RAG chatbot from scratch, evaluate it honestly, and control its cost |
| **Track C — Agentic AI** | 7 | 5 | build an agent loop by hand (no framework), design tool contracts, add guardrails |
| **Cross-Cutting** | 6 | 4 | monitor for drift, load-test, price a system, write a one-page design doc |
| **Capstone Studio** | 4 | 3 capstones | **ship something real**: a support bot, a multi-tenant platform, or a coding agent |

Then the whole thing gets converted into interview performance in [`interview-prep/`](./interview-prep/).

## Every lab runs on real data

No toy `data = [1,2,3]`. You learn on real public datasets — with their real messiness (imbalance, leakage traps, licensing) — because that messiness is what real system design is about:

- **MovieLens** — 100,000 real movie ratings (recommenders)
- **NYC TLC Taxi** — millions of real NYC trips (forecasting pipelines)
- **ULB Credit Card** — 284,807 real transactions, 492 frauds (imbalance)
- **SQuAD** — real Wikipedia questions with verified answers (RAG + evaluation)
- **SEC 10-K filings** — real 100-page corporate reports (chunking)
- **Criteo / ANTIQUE / Flickr8k / IMDB** — and more

Full catalog with sizes, licenses, and known gotchas: [`datasets/`](./datasets/).

## Get interview-ready

Everything you built becomes interview material in [`interview-prep/`](./interview-prep/):

- **The framework** — a 6-step answer structure with minute-by-minute timing ([`01-the-framework.md`](./interview-prep/01-the-framework.md))
- **42 scenario questions** with worked answers, across [ML](./interview-prep/02-ml-questions.md), [GenAI](./interview-prep/03-genai-questions.md), [agents](./interview-prep/04-agentic-questions.md), [cross-cutting](./interview-prep/05-cross-cutting-questions.md), and [classical-to-AI bridge](./interview-prep/06-classical-bridge-questions.md)
- **8 full mock interviews** — 45-minute walkthroughs with curveballs and grading rubrics ([`mock-interviews/`](./interview-prep/mock-interviews/))
- **12 estimation drills**, a **seniority ladder** (what junior vs. staff answers sound like), 30/60/90-day **study plans**, and 102 **flashcards**

## Prefer a website?

The repo includes a Next.js companion site that renders the chapters with an interactive system visualizer:

```bash
cd website && npm install && npm run dev    # then open http://localhost:3000
```

Everything is also plain markdown — GitHub renders it all, including the diagrams.

## FAQ

**Do I need to know machine learning already?** No. Module 0 assumes nothing, and the beginner path ([`paths/from-student.md`](./paths/from-student.md)) sequences everything from zero. If you already know ML, your path file tells you what to skip.

**Do I need a GPU?** No. Every lab runs on a normal laptop CPU. The LLM labs work with a free local model (Ollama) or a cheap API key.

**What does it cost?** $0 for everything except the LLM labs, which cost under $5 total if you use a small API model — or $0 with a local model. Real prices are measured, not guessed, in [Lab b1](./labs/track-b/lab-b1/).

**How long does it take?** Honest answer: 8–15 hours/week for 9–20 weeks depending on your background — the [study plans](./interview-prep/study-plans/) cover 30-day (interview already scheduled), 60-day, and 90-day routes.

**What order do I go in?** Follow your path file. The default order is Module 0 → Track A → Track B → Track C → Cross-Cutting → one capstone. Don't jump straight to the AI tracks — Track A teaches the evaluation and latency instincts everything else assumes.

**What if I get stuck?** Three rules: (1) actually read the error message, (2) struggle for 30 minutes before opening the lab's `SOLUTION.md`, (3) still stuck? Open a GitHub issue with the lab name and the error. Getting stuck is the mechanism, staying stuck is not.

**Is this good for interviews?** That's a third of the course by design: a field-tested answer framework, 42 graded scenarios, 8 timed mocks, and flashcards — plus the real numbers from your own labs, which no other candidate will have.

## Contributing & acknowledgments

Found a wrong number, a broken link, or a lab that confused you? [Open an issue](https://github.com/AdilShamim8/System-Design-For-AI/issues) — every fix makes the course better. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for how each layer accepts help, and [`docs/STYLING.md`](./docs/STYLING.md) for the writing rules.

This course complements (and cites — it never copies) excellent free resources: [ai-system-design-guide](https://github.com/ombharatiya/ai-system-design-guide), [ByteByteGo](https://bytebytego.com), [Awesome-Agentic-System-Design](https://github.com/gtzheng/Awesome-Agentic-System-Design), and [Stanford CS 329S](https://stanford-cs329s.github.io/). Sources for every real incident live in [`field-notes/`](./field-notes/) and [`docs/CITATIONS.md`](./docs/CITATIONS.md).

## License

MIT — free forever, for everyone. See [`LICENSE`](./LICENSE).

---

## Developer
Built and maintained by **Adil Shamim**.

## Connect With Me
<p align="center">
  <a href="https://www.adilshamim.me/"><img src="https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=About.me&logoColor=white" /></a>
  <a href="https://adilshamim8.medium.com/"><img src="https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white" /></a>
  <a href="https://linkedin.com/in/adilshamim8"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
  <a href="https://twitter.com/adil_shamim8"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>
  <a href="https://www.kaggle.com/adilshamim8"><img src="https://img.shields.io/badge/Kaggle-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white" /></a>
  <a href="https://leetcode.com/u/AdilShamim8"><img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" /></a>
</p>
