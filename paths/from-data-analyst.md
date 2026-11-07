# Path: From Data Analyst

**You are:** fluent in SQL, comfortable with dashboards, cohort math, and explaining to a product manager why the number moved. You may know some Python or spreadsheets-level modeling. You have never (or rarely) run a service, written an API, or trained a model yourself.

**Your realistic goal:** the analytics-engineer / AI-adjacent engineering path — roles where you build data pipelines that feed AI systems, evaluate them, and own the metrics. That is a real and growing job family: every RAG system needs someone who owns corpus quality and evaluation dashboards, and analysts who can code are exactly who gets those jobs.

**Be honest about this path:** it is the longest on-ramp in the repo (12–14 weeks), because you are learning two things at once — enough engineering to build, and enough ML/LLM depth to design. The plan below front-loads Python fundamentals inside the labs so you never learn syntax without a purpose.

---

## What you already have

- **Metric thinking.** You know the difference between a vanity metric and a driver metric, and you've diagnosed dashboards that moved for boring reasons. X.2 (evaluation) is where this becomes a superpower: offline/online metrics, guardrails, and "did the A/B actually move revenue?"
- **SQL.** Feature engineering on tabular data (Lab a1, a6) is SELECT-with-joins plus a model at the end.
- **Data skepticism.** You've caught mismatched funnels and survivorship bias. That instinct is exactly what drift detection (A.7, Lab a7) needs.

## What will be new

1. **Writing code that runs forever.** Services, endpoints, exceptions, latency. Lab a1 is deliberately your first lab: a model behind an API, then you time it.
2. **The ML minimum.** You need train/test discipline, one classifier, one regressor, and the vocabulary of precision/recall/calibration — not deep learning theory. Chapters A.0–A.5 give the systems view; the labs give just enough code.
3. **Embeddings and RAG** (B.2–B.4) — the highest-leverage new skill for analysts; corpus quality and chunking are *data* problems wearing AI clothes.
4. **The engineering vocabulary of interviews** — queues, caches, load balancers, rate limiters (0.0–0.3, X.0, cheatsheets). Analysts lose design interviews on vocabulary before they lose them on ideas.

---

## Your 13-week plan

| Week | Read | Do | Note |
|---|---|---|---|
| 1 | 0.0, 0.2 | Setup | Environment + the six words; slow down, this is your foundation |
| 2 | 0.1, 0.3 | Lab a1 (part 1) | Train the Adult-income classifier; get comfortable in Python |
| 3 | A.0, A.6 | Lab a1 (part 2) | Serve it behind FastAPI, time every request |
| 4 | A.2 | Lab a2 | MovieLens recommender — SQL-heavy, you'll feel at home |
| 5 | A.5, A.4 | Lab a3 | Fraud + thresholds — precision/recall with money attached |
| 6 | B.0, B.1 | Lab b1 | Tokens and cost — build the cost table, your spreadsheet skills shine |
| 7 | B.2 | Lab b2 | RAG from scratch on SQuAD contexts |
| 8 | B.3, B.4 | Lab b3 | Chunking — a data-quality problem in disguise |
| 9 | B.8, X.2 | Lab b4 | RAG evaluation; faithfulness/context metrics |
| 10 | C.0, C.1 | Lab c1 | The agent loop, no framework |
| 11 | X.0, X.3, A.7 | Lab a7 | Pipelines + drift — where analysts become the hero |
| 12 | X.4, X.1 | Lab x2 | The cost dashboard — this lab is literally your home turf |
| 13 | S.1 | Mocks 1, 6 | Capstone cap1 if you have time; else interview sprint |

---

## Your interview profile

**Strengths:** metric design and "so what" — when the interviewer asks "how do you know it's working?", analysts who've done Labs a8/b4 give business-aware answers most engineers can't.

**Blind spots to patch:**
- Vocabulary gaps: practice saying what a load balancer, queue, and cache each do in one sentence each (0.0, cheatsheet 5) until it's automatic.
- Never having built: your resume claim needs one deployed thing. The capstone cap1 on a free tier is the fastest credible artifact.
- Estimation under pressure: do all of `interview-prep/07-estimation-drills.md` on paper — your comfort with numbers is an asset only if it survives a whiteboard.
- Over-claiming ML depth. It's fine to say "my depth is data and evaluation; here's how I'd design the pipeline around the model" — honesty framed as specialization reads senior, not junior.

**First 48 hours:** read 0.0 and 0.2, set up the environment, and read FN-09 (NYC's MyCity chatbot giving illegal advice — an evaluation failure your whole career has trained you to catch).
