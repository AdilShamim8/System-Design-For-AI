# Lab b7 — Data notes: the 30-description corpus

**The corpus is yours to build — deliberately hostile.** Write (or scrape) 30 product descriptions engineered to break naive extraction. Required mix:

- 10 clean cases (the demo set — everything works)
- 5 format traps (price ranges, "call for pricing," prices in prose, multi-currency)
- 5 category traps (novel categories, two-category items, categories as brand names)
- 5 length/style traps (600+ char SEO rants, ALL-CAPS, emoji-laden, duplicate names)
- 5 semantic traps (a price that contradicts the prose; a "name" that's really a tagline)

Writing hostile test data is a professional skill — QA engineers call it equivalence partitioning, and it's how you find failure modes before users do. Your Part-1 failure table is only as good as the corpus, so spend the twenty minutes.

**Why not a public dataset:** extraction benchmarks age fast (formats, tasks), and the *skill* is building the corpus + the harness, not memorizing someone else's. The pattern — hostile corpus, failure taxonomy, mechanism per failure — transfers to any extraction task you'll meet in production.

**Calibration numbers:**

- Naive `json.loads` on raw completions: 60–90% success depending on model and prompt.
- + JSON mode / structured output: 95–99% format success.
- + one repair round with error feedback: 98–99.5% total.
- Semantic errors (valid JSON, wrong values): unaffected by all of the above — that's the eval problem, and expect 2–10% on messy real inputs.

**License:** your corpus, your license. Keep it — it becomes your regression corpus for the batch-eval extension.
