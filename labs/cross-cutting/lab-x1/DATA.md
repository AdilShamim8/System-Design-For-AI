# Lab x1 — Data notes: your request logs are the dataset

No external download. The dataset is **the log stream you generate** from your b2 pipeline (or any model you've trained): 200 "reference" requests + 50 shifted ones. The shift set matters — build it from:

- 15 out-of-domain questions (weather, sports — SQuAD can't answer)
- 15 single-word / typo queries (input-distribution edges)
- 10 very long questions (token-budget stress)
- 10 paraphrase-duplicates of reference questions (cache/eval relevance)

**Calibration numbers:**

- Query-centroid drift on the shift set: expect a visible jump; on paraphrases: near-zero. That contrast *is* the metric working.
- Answer-length PSI across the shift: 0.2–0.6 (big — refusals are short).
- Refusal rate: baseline ~5–10% on SQuAD, jumps to 30%+ on out-of-domain.
- TTFT should NOT move with query mix (it's load, not content, driven) — a useful negative control: know what *shouldn't* fire.

**Why the negative control matters:** a monitoring system that fires on everything detects nothing. Your TTFT-stays-flat observation is the first entry in a "known-stable metrics" list — as valuable as the alert list itself.

**License:** yours. Logs may contain user text — the scrub-before-sharing rule from c5 applies here too.
