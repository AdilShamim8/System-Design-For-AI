# ML System Design — Question Bank

Practice scenarios for classical ML system design: recommendation, search, fraud, ads, content moderation.

---

## Q-ML-1 — The Stale Podcast Homepage

**Scenario:** You're a new engineer at a podcast app with 500,000 podcasts in the catalog and 1 million monthly active users. The "For You" row on the homepage has 10 slots and a 300ms end-to-end budget. The existing recommendation system was built 3 years ago using a single collaborative-filtering model, and engagement has been declining for two quarters. The product team wants a redesign.

**Track:** ml
**Difficulty:** medium
**Read first:** [A.2 The Front Page Mind Reader](../01-ml-system-design/a2-the-front-page-mind-reader.md), [A.6 Two Models Walk Into Production](../01-ml-system-design/a6-two-models-walk-into-production.md), [A.7 Why Did the Model Get Worse?](../01-ml-system-design/a7-why-did-the-model-get-worse.md)

**Your task:** Walk through your redesign. What questions do you ask first? What does the new architecture look like? How do you know if it's actually better than the old one?

---

### Worked answer (how a story-taught learner would reason through this)

A story-taught learner starts by *not* reaching for a model. They reach for questions.

**Question 1: why is engagement declining?** Before redesigning anything, you need to know what's broken. Has the candidate generation stopped surfacing relevant podcasts? Has the ranking gotten worse at picking between them? Has the user base shifted (more new users hitting cold-start)? Has the catalog grown in a way the old embeddings don't capture? Each of these points to a different fix. A redesign that doesn't diagnose first is a redesign built on a guess.

**Question 2: what does the current pipeline actually look like?** The prompt says "single collaborative-filtering model," but that's underspecified. Is it doing both candidate generation and ranking in one step? Is there any re-ranking? Is there a cold-start path at all? You can't redesign what you don't understand. Read the code. Read the metrics. Talk to the people who built it.

**The redesign itself**, once you've diagnosed, probably moves toward the standard three-stage pattern from A.2: candidate generation (blended sources — embeddings + content-based + trending), ranking (a model that scores each candidate given user + item + context features), and re-ranking (diversity, freshness, business rules). The old single-model system is probably being asked to do too much; the redesign splits the job.

**How you know it's better:** you A/B test it. Per A.6, offline metrics will lie — the new model will probably win on every offline metric and might still lose in production. The only honest test is an online A/B test with a real engagement metric (listen-through rate, not just clicks), real statistical power (run it long enough to detect a 2% effect), and real duration (long enough to catch novelty effects wearing off).

**The deeper move:** per A.7, you also build drift detection. The old system declined over two years because nobody was watching. The new system should monitor its own input distribution, output distribution, and ground-truth signal — and alert before the next two-year decline happens.

---

## Q-ML-2 — The 10ms Ad Bid

**Scenario:** You're designing the CTR prediction model for a real-time bidding advertising system. You have 10 milliseconds from the moment an ad slot becomes available to the moment you must submit your bid. The current model has 80% AUC offline but the business suspects it's miscalibrated — bids are too aggressive on cheap inventory and too conservative on premium.

**Track:** ml
**Difficulty:** hard
**Read first:** [A.4 The Penny That Decides a Billion Dollars](../01-ml-system-design/a4-the-penny-that-decides-a-billion-dollars.md), [A.6 Two Models Walk Into Production](../01-ml-system-design/a6-two-models-walk-into-production.md)

**Your task:** How do you diagnose the miscalibration? What does the redesigned system look like, given the 10ms constraint? What would you change first?

---

### Worked answer

The story-taught learner notices two separate problems: calibration and latency. They tackle them in that order.

**Calibration first.** AUC measures ranking quality — does the model put higher-CTR ads above lower-CTR ads? It says nothing about whether the model's predicted probabilities are accurate. A model with 80% AUC can be perfectly ranked but systematically overconfident, which is exactly what "too aggressive on cheap inventory" sounds like. The fix: compute calibration curves (predicted CTR vs. actual CTR, binned), apply Platt scaling or isotonic regression as a post-hoc calibration layer, and re-evaluate. This is a one-day fix, not a redesign.

**Latency second.** The 10ms budget is brutal. Per A.4, the model itself probably consumes 3-5ms; the rest goes to feature extraction, network, and decisioning. If the current model is a deep neural net, consider whether a gradient-boosted tree (XGBoost/LightGBM) gives comparable accuracy at 1/10 the latency. If features are expensive to compute (cross-features, real-time aggregations), pre-compute and cache them in a low-latency feature store (per A.1).

**What to change first:** calibration. It's the cheapest fix with the biggest expected business impact. A miscalibrated model is bidding wrong *every* time; a slightly-slow model is just bidding slightly less often. Fix the systematic error first, then optimize the latency.

---

## Q-ML-3 — The Fraud Surge

**Scenario:** Your payment company sees a 3x spike in fraud losses over a weekend. The existing fraud detection model — a gradient-boosted tree trained on historical data — is still running, still producing scores, but the scores don't seem to correlate with the actual fraud anymore. The fraud team is panicking.

**Track:** ml
**Difficulty:** hard
**Read first:** [A.5 The 3am Fraud Alarm](../01-ml-system-design/a5-the-3am-fraud-alarm.md), [A.7 Why Did the Model Get Worse?](../01-ml-system-design/a7-why-did-the-model-get-worse.md)

**Your task:** What's probably happening? What do you do in the first hour? What does the longer-term fix look like?

---

### Worked answer

The story-taught learner recognizes the pattern from A.7 immediately: this is drift. The model didn't break — the world changed. A 3x spike in fraud losses over a weekend suggests either a coordinated fraud campaign using a new pattern the model has never seen, or a change in the payment flow that shifted the input distribution.

**First hour: contain.** Don't retrain — there's no time, and you don't have labels yet. Instead: tighten the decisioning threshold (block more transactions, accept more false positives — better than losing money), escalate more transactions to manual review, and look at the actual transactions causing the losses. Are they all from one geographic region? One merchant category? One device fingerprint? The pattern reveals the attack.

**First day: diagnose.** Was this a new fraud pattern (concept drift — the relationship between features and fraud changed) or a new user behavior pattern (data drift — the input distribution shifted)? The fix differs. Concept drift requires retraining with the new pattern in the training data. Data drift might just require feature engineering to capture the new pattern.

**Longer-term fix:** per A.7, build the drift detection that wasn't there. The model "still producing scores" that don't correlate with fraud means nobody was watching the output distribution. Add monitoring on input drift, output drift, and ground-truth latency (how quickly do you learn whether a transaction was actually fraud?). Build a retraining pipeline that triggers on drift detection, not just on a schedule. Build a champion/challenger setup so the next drift event is caught by a better model shadow-running alongside the current one, not by a fraud team panicking on a Sunday.

---

## Q-ML-4 — The New Search Backend

**Scenario:** Your e-commerce site has used a lexical search backend (Elasticsearch with BM25) for five years. The search team wants to add semantic search (embeddings + vector retrieval) to handle queries like "blue running shoes for flat feet" that the lexical backend struggles with. The catalog has 2 million products. Average query volume: 200 queries per second, peak 2,000.

**Track:** ml
**Difficulty:** medium
**Read first:** [A.3 The Search Bar That Almost Understands You](../01-ml-system-design/a3-the-search-bar-that-almost-understands-you.md), [B.3 The Index That Speaks in Numbers](../02-genai-system-design/b3-the-index-that-speaks-in-numbers.md)

**Your task:** Design the migration. Do you replace lexical with semantic, or blend them? How do you handle the latency budget? How do you roll it out safely?

---

### Worked answer

The story-taught learner reaches for the hybrid pattern from A.3: blend, don't replace. Lexical search is good at exact matches (product names, SKUs, brand queries). Semantic search is good at intent queries ("shoes for flat feet"). Real users do both kinds of queries, and you don't know which is which in advance.

**Architecture:** run both retrievers in parallel — Elasticsearch for lexical results, a vector DB (Pinecone, Weaviate, or pgvector) for semantic results — and merge the top-K from each into a unified candidate pool. Then rank the merged pool with a model that has access to both lexical and semantic features. This is more expensive than either alone, but it's the pattern that wins in production.

**Latency budget:** at 200 QPS steady, 2,000 QPS peak, you can afford ~150ms for retrieval. Parallel retrieval (both backends called simultaneously) keeps total retrieval latency at max(lexical, semantic), not sum. The semantic side is the slow one — embedding the query (~30ms) + ANN search (~30ms). Tight but doable.

**Safe rollout:** A/B test. Per A.6, offline metrics will lie. Start with 1% of traffic on the hybrid path, monitor search success rate (clicks, add-to-cart, purchases) vs. the control. If the hybrid wins, ramp to 5%, 25%, 50%, 100% over a few weeks. If it loses — and it might, on exact-match queries — dig into which query types it lost on, and adjust the blending weights or the ranking model. Don't ship 100% on day one.

---

## Q-ML-5 — The Cold-Start Subscription Box

**Scenario:** You're launching a subscription box service. Users sign up, fill out a taste profile, and receive a monthly box of 5 items. You have 10,000 items in the catalog and zero users on day one. By month 6 you expect 100,000 users. Design the recommendation system for month 1, month 3, and month 6.

**Track:** ml
**Difficulty:** medium
**Read first:** [A.2 The Front Page Mind Reader](../01-ml-system-design/a2-the-front-page-mind-reader.md), [A.6 Two Models Walk Into Production](../01-ml-system-design/a6-two-models-walk-into-production.md)

**Your task:** What does the system look like at each stage? What changes as you get more data? What stays the same?

---

### Worked answer

The story-taught learner recognizes this is a cold-start problem at every stage — different stage, different flavor of cold.

**Month 1 — pure cold start, no data.** Per A.2's cold-start section, you can't do collaborative filtering with zero data. Use content-based recommendation: match the user's taste profile (categories, attributes they said they like) to item metadata. Lean heavily on editorial curation (hand-picked boxes for the first month). This is dumb but it works — and it generates the data you need for month 3.

**Month 3 — limited data.** You have ~10,000 users with one box each. Not enough for serious collaborative filtering, but enough to start blending. Add a popularity signal (what's everyone getting?), a content-based signal (what matches their profile?), and a simple co-purchase signal (users who liked X also liked Y — even with one box per user, you can compute this). Build the candidate-generation-then-ranking pattern from A.2, but keep the models simple. The bottleneck is data, not model sophistication.

**Month 6 — real data.** 100,000 users, six boxes each. Now collaborative filtering works. Train embeddings (users and items in the same vector space). Blend embeddings + content + popularity in candidate generation. Use a real ranking model (GBT or small neural net) with user features, item features, and context features. Add re-ranking for diversity (don't put 5 items from the same category in one box).

**What stays the same across all three stages:** the *shape* of the system (candidate generation → ranking → re-ranking), the cold-start fallback (content-based + editorial for new users), and the evaluation discipline (A/B test every change, never trust offline metrics alone). What changes is the *sophistication* of each stage as data accumulates.

---

*More questions coming as the curriculum grows. Want to add one? See [CONTRIBUTING.md](../CONTRIBUTING.md#5-add-a-question-to-the-question-bank).*
