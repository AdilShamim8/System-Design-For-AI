# Path: From Backend Engineer

**You are:** comfortable building APIs, talking to databases, maybe running queues and caches. You've kept services alive under load. What you've mostly *not* done is train, serve, evaluate, or monitor a model — and "LLM app" to you sounds like "an expensive HTTP call."

**Good news:** you are closer to AI system design than any other role. AI system design interviews are ~70% classical system design (which you know) applied to a component that is probabilistic, slow, and expensive (which this course teaches you to handle). The [AI Engineering Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide) calls the backend → AI engineer transition one of the smoothest: add AI on top of engineering.

---

## What you already have

- **The four questions** (parts, communication, failure, growth) — you've lived them. Chapter 0.0 will feel like someone naming what you do by feel.
- **Latency and throughput intuition** — you know what a p99 is and why it ruins your week.
- **Caching, queues, load balancers, idempotency** — the exact machinery LLM systems reuse. A semantic cache (Lab b5) is a cache with fuzzy keys; an async inference job (X.5) is a queue consumer you've written before.
- **API design** — and B.1's "prompting as a design surface" is literally interface design with worse error messages.

## What will be new (and where it bites)

1. **Non-determinism.** Same input, different output. Your tests assumed determinism; AI tests need distributions. Start: Chapter 0.1, Lab b1.
2. **Evaluation is the hard part.** There is no `assert status == 200` for "is this answer good?" Chapters X.2 and B.8, Labs b4 and a8. Most backend engineers underestimate this — do not.
3. **The unit of cost is the token.** Your instincts about cheap function calls are wrong by 3–4 orders of magnitude. Chapter X.4, Lab b1, b5.
4. **Models degrade silently.** Data drift is a thing databases never had. Chapters A.7, X.3, Lab a7.
5. **Feature stores and training/serving skew.** Chapter A.1, Lab a6.

---

## Your 11-week plan

| Week | Read | Do | Why |
|---|---|---|---|
| 1 | 0.0–0.3 | Setup + Lab a1 | Skim chapters fast; the lab (serve a model behind your own FastAPI app) maps ML onto what you know |
| 2 | A.0, A.6 | Finish a1 | Training/serving split, deployment patterns |
| 3 | A.1, A.2 | Lab a2 | Feature stores + the three-stage recommender — the most-asked ML design question |
| 4 | A.5, A.4 | Lab a3 | Imbalance, thresholds, cost of errors — where pure backend intuition fails |
| 5 | B.0, B.1, B.2 | Lab b1 | Tokens, cost, latency — then the RAG chapter |
| 6 | B.3, B.4 | Lab b2 | Build RAG from scratch; you'll recognize it as search + cache + API glue |
| 7 | B.5, B.6, B.8 | Labs b3, b4 | Reranking, model selection, evaluation |
| 8 | C.0–C.2 | Lab c1 | The agent loop = a while-loop with tool calls; no framework, from scratch |
| 9 | C.3–C.5 | Lab c5 | Multi-agent, memory, guardrails |
| 10 | X.0–X.5 | Labs x2, x3 | Cost dashboard + load test — your home turf, now with tokens |
| 11 | S.1, S.2 | Capstone cap1 | Ship the support bot; then mocks 1 and 4 |

---

## Your interview profile

**Strengths to lean on:** capacity estimation, caching, queues, API design, failure handling. In AI-system-design interviews you will often be *more* credible than ML-native candidates on "what happens when the provider rate-limits you" (Mock 4 is built for you).

**Blind spots to patch before interviews:**
- Never say "the model is a black box, whatever." Say how you'd evaluate it (X.2, b4).
- Learn one real ML failure story cold (field notes — FN-02 Zillow is the best one for you: it's a forecasting error that killed a business unit, i.e., an engineering failure with model-shaped root cause).
- Rehearse the tradeoff vocabulary of ML: precision/recall, offline/online metrics, batch/realtime features (cheatsheets 1 and 10).

**First 48 hours:** read chapters 0.0 and B.2, do Lab a1 end-to-end, and read FN-11 (the Netflix Prize model that never shipped — the perfect story about why *your* skills are the difference between a model and a product).
