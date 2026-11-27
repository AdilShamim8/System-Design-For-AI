# Mock 10 — Fine-Tune or RAG? The CFO Wants a Number

**45 minutes.** Interviewer reads the prompt, candidate drives. Timer segments: 10 clarify + scope · 20 architecture · 10 deep dive · 5 curveballs. The interviewer's job is to push ONE level past the candidate's comfort — the deep dive is where levels are decided.

## The prompt

You join a mid-size legal-tech company. Their contract-analysis assistant (built on a frontier LLM with RAG over 200K contracts) works well but costs $18K/month in API spend. The CFO heard fine-tuning is cheaper: "Train a small model on our data and stop paying per token." The ML lead disagrees: "Fine-tuning won't know case law." They want YOU to decide — with numbers — in this interview. The assistant: reads contracts, extracts 15 structured fields, answers clause questions with citations, handles 2M requests/month, must maintain 95% extraction accuracy.

## Candidate-quality walkthrough

This mock is really a decision-analysis interview wearing a system-design hat. The winning structure:

**Decompose by task first — "fine-tune vs RAG" is the wrong unit.** The assistant does two different jobs: (a) extraction of 15 structured fields — bounded output, enumerable, a *classification-shaped* task where fine-tuning shines; (b) clause Q&A with citations over the corpus — open-domain, retrieval-dependent, where fine-tuning CANNOT work (the knowledge is in 200K contracts that change daily; a model can't memorize a moving corpus — B.6's matrix). So the real architecture is likely BOTH: fine-tuned small model for extraction, RAG for Q&A. That reframing is the first senior signal.

**The extraction math (fine-tuning side):** 2M requests/month; if 70% are extraction-shaped (1.4M), each ~2K tokens through a frontier model at ~$3–5/M input ≈ $10–15K/month of the bill. A fine-tuned 7B-class model on labeled extractions (you have millions of weak labels — the frontier model's own outputs, human-verified on a sample) reaches 90–97% field accuracy on bounded extraction — plausible parity for this task. Serving: 1.4M × 2K tokens on self-hosted GPU (an L40S-class node handles ~50–100 tokens/sec/parallel-stream, batch for throughput) ≈ 1–2 GPUs ≈ $2–4K/month including ops. Net: extraction bill drops from ~$10–15K to ~$3–5K fully-loaded. Payback: labeling 50–100K verified examples (at ~$0.50–1 each with a verification UI — $50–100K one-time) plus training/eval infra. Honest horizon: 6–12 months to break even, IF accuracy parity holds — which the eval set must prove per field before cutover (champion/challenger, Q-ML-14's gate).

**The Q&A math (stays RAG):** 600K requests/month of open-domain questions — fine-tuning a small model to answer without retrieval produces confident fabrication over a changing corpus: the exact FN-04 liability. RAG costs here are mostly generation (~$3–8K/month) — optimizable with routing (b6: mid-tier for 70% of Q&A traffic with no measurable quality loss — that alone cuts the bill 40–60% before any fine-tuning).

**The decision delivered to the CFO:** three numbers — (1) routing on Q&A saves ~$5–8K/month in week one, zero risk; (2) fine-tuned extraction saves another ~$8–12K/month after a $50–100K one-time investment and a 2–3 month eval-gated rollout; (3) the fine-tune-everything alternative breaks Q&A citations and creates liability — it's not on the menu. The staff-level close: "we're not choosing fine-tuning OR RAG; we're routing each job to the cheapest model that passes its eval — and now we have the eval set to prove it."

**What the candidate must NOT do:** accept the either/or frame; quote training costs without serving costs; promise accuracy parity without an eval gate.

## The curveballs

1. **"Your fine-tuned extractor drifts: new contract templates from an acquisition. Extraction accuracy silently drops. What's the safety net?"** — Drift monitoring on the *output distribution* (a7: field-fill rates, confidence histograms by template-cluster), a canary slice of human-verified extractions weekly, and the fallback path: the frontier model takes over extraction for novel templates (detected by a template-classifier or low-confidence rate) — routing as the safety net, again. The weak answer: "we retrain periodically" — periodic retraining without detection is a calendar, not a safety net.
2. **"The frontier-model vendor announces the model you distill from is deprecated in 90 days. Your labels are its outputs. Walk me through your week."** — Q-CC-14's reproducibility teeth: pin the current version for label generation while it exists (generate the full label set NOW), version the labels with the teacher's identity, and re-baseline the eval before any teacher migration. The insight they're probing: your training data has a supply chain and a shelf life.
3. **"Legal asks whether the fine-tuned model 'contains' client contracts — can we promise no client data leaks via the model?"** — The honest answer: memorization in fine-tuned models is real but measurable — run extraction-attack evals (canary strings in training data, then test whether the model emits them; canary catches the memorization class), plus contractual scoping (per-client fine-tunes only if contracts demand it — usually overkill vs the measured leak rate), and DPA/training-data governance. The weak answer: "fine-tuned models don't memorize" — they do; the question is how much, and you measure it.

## Scoring rubric (grade yourself honestly)

- **Junior:** picks a side (usually RAG "because it's more accurate") with one reason. Misses the decomposition, the numbers, the eval gate.
- **Mid:** decomposes by task, does rough math on both paths, proposes the hybrid, names the eval gate. May miss serving-cost realism (GPU utilization, batch) or the labeling cost.
- **Senior:** the full decision analysis: task decomposition, per-path economics including one-time vs recurring, the routing-first sequencing (cheap wins first), drift/fallback design for the fine-tuned path, and the vendor-deprecation supply-chain answer. Delivers the CFO three numbers with confidence bounds.
- **Staff:** everything senior, plus the platform view (the eval set and the labeling pipeline are now company assets other products reuse), the build-vs-org question (who owns the fine-tune in 18 months — the ML platform team or the product team), and the strategic frame: model costs are falling ~10x/2yr — the fine-tune's payback window competes with just waiting for cheaper frontier pricing. That last sentence is the staff-level tell.

**Grounding:** Chapters B.6, X.4 · Labs b1, b6, x2 · Q-GEN-13, Q-CC-10, Q-CC-14 · mock 4
