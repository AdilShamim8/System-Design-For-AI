# Lab b6 — Worked Solution and What the Numbers Mean

## Expected results (our runs, DistilBERT, 4K examples, 2 epochs, 256 tokens)

| Measurement | What we got |
|---|---|
| Fine-tune accuracy (4K examples) | ≈ 0.88–0.91 |
| Fine-tune accuracy (500 examples) | ≈ 0.83–0.87 |
| Fine-tune accuracy (100 examples) | ≈ 0.70–0.80 (high variance) |
| Few-shot API baseline (extension) | ≈ 0.85–0.92 depending on model and shots |
| Train time | ≈ 15–30 min CPU / 3–8 min GPU |
| Checkpoint size | ≈ 268 MB full / ≈ 7 MB LoRA (extension) |
| RAG path (Part 2) | works immediately, cites sources, zero training |

## The five lessons hidden in those numbers

1. **Fine-tuning's data curve is steep then flat.** 100→4,000 examples buys 10–20 points; 4,000→25,000 buys 1–3. The knee near ~2–5K good labels is why "how many labeled examples do you have?" is *the* first question of every fine-tuning conversation — and why 500 *good* labels (extension's "good ones") can beat 2,000 noisy ones.
2. **The few-shot baseline is the fine-tune's executioner.** A modern API model with 5 examples gets within a point or two of your fine-tune — at zero training cost, zero deployment, and instant iteration. Fine-tuning survives this comparison only when volume economics (Part 3's break-even) or latency/privacy demands it. Skipping the baseline is the most expensive habit in this domain.
3. **Behavior vs. knowledge is a structural split, not a preference.** Knowledge-in-weights cannot cite, cannot update without retraining, and cannot be audited. RAG answers update on corpus change (minutes) and cite by construction. When a stakeholder asks "can't we just fine-tune it on our docs?", your answer is now three sentences built from this table — with your own break-even number in the third sentence.
4. **Self-hosting is a volume bet.** ~$15/1K requests (API, mid-tier) vs. ~$0 marginal + ~$100/mo infra (fine-tuned small model): the crossover lands somewhere around 5–10K requests/day — comfortably below it, API wins; far above, owning inference wins. The number moves with provider prices (b1's date-stamp rule), so the *shape* of the argument matters more than any single figure.
5. **The hybrid is the production default.** Fine-tune the voice (domain tone, format discipline, label taxonomy), retrieve the facts (policies, docs, inventory). Each mechanism does the half it's structurally good at. In the field guide's job-data language: RAG appears in ~40% of AI-engineer postings, fine-tuning is a focus of under 5% — the industry has already voted for the cheap-to-change side, with fine-tuning as the specialist tool.

## Common mistakes

- **Training on the full 25K on a laptop.** The lab subsamples for a reason: wall-clock matters, and 4K is past the data-efficiency knee anyway.
- **No fixed random seed.** Fine-tune results wobble ±1–2 points run-to-run; without a seed you can't tell a real improvement from noise (the same discipline as a8, and the same answer: fix seeds, measure twice).
- **Evaluating on train-period data for the RAG half.** Part 2's retrieval demo must use held-out reviews, or you've built a very expensive "search the training set" demo.
- **Comparing fine-tune accuracy to RAG "accuracy" directly.** They solve different tasks (Part 1 vs. Part 2). The matrix compares *decisions*, not scores — comparing accuracies across the two halves is a category error interviewers sometimes bait on purpose.

## Interview lines this lab earns you

- "I always run the few-shot prompt baseline before proposing a fine-tune — in my lab it landed within a point of a DistilBERT fine-tune, and the fine-tune only survives that comparison on volume or latency grounds, where its break-even is computable."
- "Behavior goes in weights, knowledge goes in the index: I fine-tuned a sentiment classifier to feel what behavior-tuning is, built the retrieval path to see what knowledge-tuning is, and my decision matrix leads with which one the task actually is."
