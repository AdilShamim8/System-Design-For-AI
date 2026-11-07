# Lab b6 — Dataset: IMDB movie reviews

Full card in [`datasets/nlp-sentiment.md`](../../../datasets/nlp-sentiment.md). Lab-specific notes:

**Getting it:** `load_dataset("imdb")` — 25K train / 25K test, ~80 MB, downloads once.

**Why IMDB for this lab:** it's the rare dataset that serves *both* sides of the fork cleanly. As sentiment classification (Part 1), it's a textbook behavior task — fixed labels, stable "knowledge," the thing fine-tuning was born for. As a review corpus (Part 2), it's knowledge — opinions about specific movies that should be retrieved and cited, not memorized. Same data, two architectural roles: the lab's whole point is that *the question decides the architecture, not the dataset*.

**Shape:** 12.5K positive / 12.5K negative in each split; reviews are long (avg ~230 words, some 1K+); train/test are disjoint *by movie* (a built-in leakage lesson — you can't memorize movie-specific test reviews from train).

**Known quirks you will hit:**

- **Long reviews and your 256-token cap:** truncation cuts some reviews in half; a few flip sentiment mid-review ("Great acting… but the ending ruins it"). Truncate the *end* at your peril — know that you are; the accuracy you lose is the price of the cap.
- **HTML remnants** (`<br />`) in raw text — strip or let the tokenizer eat them; fine either way, but know they're there.
- **Sarcasm and comparative reviews** are the error floor; 0.92–0.94 is about the ceiling for this task at reasonable effort. Don't chase 0.99 — you'd be overfitting noise.
- **Your subsample (4K) is a choice, not a limitation:** the extension's data-efficiency curve (100→4K examples) is the actual deliverable. Labeling cost is the real-world constraint; the curve is how you price it.

**License:** open for research (Stanford). Fine for labs; commercial sentiment products should train on licensed or own data.
