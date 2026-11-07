# Path: From Data Scientist

**You are:** fluent in modeling. You know pandas, sklearn, train/test splits, cross-validation, and why accuracy is a lying metric on imbalanced data. You've lived in notebooks. What you've mostly *not* done is put a model behind an API, worry about p99 latency, pay a cloud bill, or design the system around the model.

**The gap you're closing:** data science teaches you the *model*; this course teaches you the *system the model lives in* — and the system is what interviews for AI/ML-design roles actually probe. In Chip Huyen's framing (CS 329S, *Designing Machine Learning Systems*): the model is a small fraction of an ML system; the rest is data, serving, monitoring, and the team around it.

---

## What you already have

- **Metrics literacy.** Precision/recall, ROC, calibration — Chapters A.4, A.5 and X.2 will confirm what you know and add the *cost* framing (a false negative in fraud is not symmetric with a false positive).
- **Experiment discipline.** You understand holdouts and statistical significance; Chapter X.2 and Lab a8 upgrade that to online A/B design (guardrails, peeking, sample size).
- **Data skepticism.** You've seen leakage and bad labels. Lab a6 (temporal splits on NYC taxi data) is your kind of puzzle.

## What will be new

1. **Serving.** Batch vs. realtime vs. streaming inference; latency budgets in milliseconds; serialization. Lab a1 makes you serve your own model and feel the latency of your feature computation.
2. **The feature store problem** (A.1) — training/serving skew, the single classic ML-systems interview topic DS candidates miss.
3. **LLMs as a component.** RAG, chunking, embeddings, token economics (B.0–B.6, Labs b1–b5). This is now ~40% of AI job postings per the [field guide's](https://github.com/alexeygrigorev/ai-engineering-field-guide) job-data analysis — treat Track B as your main investment.
4. **Evaluation of generated text** (B.8, Lab b4) — no ground truth, judge models, faithfulness metrics. Your offline-metrics instincts need a new toolbox.
5. **Cost as a constraint** (X.4, Lab x2) — no experiment you've run charged by the token.

---

## Your 10-week plan

| Week | Read | Do | Note |
|---|---|---|---|
| 1 | 0.0–0.3 | Setup | Fast read — this is your missing module, not your strength; take the four questions seriously |
| 2 | A.0, A.1, A.6 | Lab a1 | Serving your first model; training/serving skew |
| 3 | A.2 | Lab a2 | The three-stage recommender — you know the models; learn the *pipeline* |
| 4 | A.5, A.7 | Lab a3 | Drift + thresholds with cost framing |
| 5 | B.0–B.2 | Lab b1 | Token math, then the RAG chapter |
| 6 | B.3, B.4 | Lab b2 | RAG from scratch — you'll find embeddings are "just" representations you already understand |
| 7 | B.5, B.6, B.8 | Labs b3, b4 | Reranking, cost tiers, RAG evaluation |
| 8 | C.0–C.2 | Lab c1 | Agent loop from scratch |
| 9 | C.3–C.5, X.3 | Lab c5 | Guardrails, trace evals, monitoring |
| 10 | X.1, X.4, S.1 | Labs x2 + cap1 | Cost dashboard, capstone, mocks 1, 2, 6 |

---

## Your interview profile

**Strengths:** evaluation depth, metric selection, statistical rigor. When the interviewer asks "how do you know it works?", DS-background candidates give the best answers in the room. Lead with it.

**Blind spots to patch:**
- Answering design questions with model choice first. The interviewer wants the *data flow* first. Force yourself to draw the boxes before naming a single algorithm (train this with the framework in `interview-prep/01-the-framework.md`).
- Never having load-tested anything → Lab x3.
- Notebook habits: "I'd explore the data first" is right, but say *what you'd log and monitor after launch*, or you sound like someone whose systems rot in week two (A.7, X.3).
- Cloud cost naivety → Lab b1 and x2 give you real unit-economics numbers to quote.

**First 48 hours:** read Chapter 0.0 and A.1, do Lab a1 (you'll serve a sklearn model behind FastAPI — five years of notebook habits will not prepare you for how satisfying that first `/predict` curl is), and read FN-11 (the Netflix Prize: the world's best model that never shipped, because shipping wasn't the prize).
