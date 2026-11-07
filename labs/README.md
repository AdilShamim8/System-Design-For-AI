# Labs — Learn by Doing

This is where the course stops being something you read and becomes something you build. **24 labs + 3 capstones**, every one on a real-world dataset, every one ending with a system-design question — because the point of each lab is not the model, it's the system around it.

> If you skip one layer of this course, don't let it be this one. Chapters make sense; labs make skill.

## The rules of the labs

1. **Type the code yourself.** Copy-paste teaches your fingers, not your brain. Break it, read the traceback, fix it — that loop *is* the skill.
2. **Never look at SOLUTION.md until your version runs** (or you've been stuck 30+ minutes). Struggle is the mechanism, not an obstacle.
3. **Write a journal entry after every lab** — three sentences: what it does, where it breaks first, what you'd do next. This becomes your interview story bank.
4. **Do the "explain it back" checkpoint out loud.** If you can't explain it, you've found what to re-read.
5. **Time-box extensions.** Extensions are optional; a finished core beats an abandoned extension.

## Anatomy of a lab

Every lab directory contains:

| File | What it is |
|---|---|
| `README.md` | The lab itself: story, dataset, steps with code, checkpoints, extensions |
| `DATA.md` | Dataset card for this lab: download, license, quirks — the "know your data" step |
| `SOLUTION.md` | A worked solution with the *numbers we got* and what they mean — read after yours runs |

Labs assume the [setup](./setup/) is done (Python 3.10+, one venv for everything). No GPU is required for any Track A lab; Track B labs run embedding models on CPU fine (a few seconds per batch).

## The lab map

### Track A — Classical ML (after Chapters A.0–A.7)

| Lab | What you build | Real dataset | Est. time |
|---|---|---|---|
| [a1 — First Prediction Service](./track-a/lab-a1/) | A model behind an API, load-timed | UCI Adult Income | 2–3 h |
| [a2 — Recommendation Engine](./track-a/lab-a2/) | Candidate generation + ranking + offline eval | MovieLens 100K | 3–4 h |
| [a3 — Fraud Detection](./track-a/lab-a3/) | Thresholds under 0.17% imbalance | ULB Credit Card Fraud | 2–3 h |
| [a4 — CTR & Calibration](./track-a/lab-a4/) | A CTR model that means its probabilities | Criteo (subsample) | 2–3 h |
| [a5 — Search Ranking](./track-a/lab-a5/) | BM25 vs embeddings vs hybrid | ANTIQUE | 2–3 h |
| [a6 — Forecasting Pipeline](./track-a/lab-a6/) | Point-in-time-correct features, batch scoring | NYC TLC Yellow Taxi | 3–4 h |
| [a7 — The Drift Detective](./track-a/lab-a7/) | PSI/KS drift detection + alert rules | Adult (shifted) | 2 h |
| [a8 — A/B Testing, Honestly](./track-a/lab-a8/) | Sample size, peeking, guardrails | Simulation | 2 h |

### Track B — GenAI / LLM (after Chapters B.0–B.8)

| Lab | What you build | Real dataset | Est. time |
|---|---|---|---|
| [b1 — Tokens, Latency, Money](./track-b/lab-b1/) | Token accounting + cost/latency measurement | Real API pricing | 1–2 h |
| [b2 — RAG From Scratch](./track-b/lab-b2/) | The whole pipeline, no framework | SQuAD contexts | 3–4 h |
| [b3 — Chunking Strategies](./track-b/lab-b3/) | Fixed vs recursive vs semantic, measured | SEC 10-K filings | 2–3 h |
| [b4 — Evaluate RAG Properly](./track-b/lab-b4/) | Faithfulness, context recall, hit rate | SQuAD + LLM judge | 2–3 h |
| [b5 — Semantic Caching](./track-b/lab-b5/) | An embedding cache; hit rate economics | SQuAD questions | 2 h |
| [b6 — Fine-tune vs RAG](./track-b/lab-b6/) | A decision you can defend with numbers | SST-2 / IMDB | 2–3 h |
| [b7 — Structured Outputs](./track-b/lab-b7/) | Schemas, validation, repair loops | Generated + real | 2 h |
| [b8 — Multimodal Embeddings](./track-b/lab-b8/) | Image-text search | Flickr8k | 2–3 h |

### Track C — Agents (after Chapters C.0–C.6)

| Lab | What you build | Est. time |
|---|---|---|
| [c1 — Agent Loop From Scratch](./track-c/lab-c1/) | ReAct loop, no framework, 2 tools | 3 h |
| [c2 — Tool Contracts](./track-c/lab-c2/) | Robust tool schemas, errors, timeouts | 2–3 h |
| [c3 — Multi-Agent Handoff](./track-c/lab-c3/) | Orchestrator + specialists | 2–3 h |
| [c4 — Memory & State](./track-c/lab-c4/) | Sliding window + summarization | 2 h |
| [c5 — Agent Evaluation](./track-c/lab-c5/) | Trajectory checks, trace scoring, guardrails | 2–3 h |

### Cross-Cutting (after Chapters X.0–X.5)

| Lab | What you build | Est. time |
|---|---|---|
| [x1 — Monitoring & Drift Alerts](./cross-cutting/lab-x1/) | A metrics log + PSI alert script | 2 h |
| [x2 — The Cost Dashboard](./cross-cutting/lab-x2/) | Unit economics of a RAG service | 2 h |
| [x3 — Load-Test Your AI Service](./cross-cutting/lab-x3/) | Find the p99 cliff of your own service | 2–3 h |
| [x4 — The Design-Document Drill](./cross-cutting/lab-x4/) | A one-page design doc, graded by rubric | 3 h |

### Capstones (after Chapter S.1–S.4)

| Capstone | What you ship |
|---|---|
| [cap1 — Customer Support AI](./capstones/cap1/) | RAG + guardrails + human-in-the-loop |
| [cap2 — Multi-Tenant RAG Platform](./capstones/cap2/) | The platform version: isolation, quotas, billing |
| [cap3 — Coding Agent](./capstones/cap3/) | A small agent that runs code safely |

## Difficulty and prerequisites

Labs are ordered within each track and get harder; each `README.md` names its prerequisite chapters at the top. If a lab feels impossible, the prerequisite list is telling you what to re-read. Expect to be confused for the first 20 minutes of any lab — that's normal and it passes.

## Stuck?

1. Read the error message. Actually read it. 80% of bugs are named in the traceback.
2. Check `SOLUTION.md` — but only the section you're stuck on.
3. Open a GitHub issue with the lab name and the error; include what you expected and what happened.
