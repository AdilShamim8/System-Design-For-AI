# Lab a4 — Worked Solution and What the Numbers Mean

## Expected results (our runs, 500K-row subsample, LightGBM)

| Measurement | What we got |
|---|---|
| Positive rate | ≈ 0.035 (your subsample: 0.03–0.04) |
| AUC | ≈ 0.79–0.81 |
| Log loss vs. constant baseline | ≈ 0.13 vs. ≈ 0.18 (the gap is the model's contribution) |
| ECE before calibration | ≈ 0.004–0.02 |
| Worst-bin overprediction | 1.2–1.6× (predicted CTR ~40–60% above observed in the top bins) |
| ECE after Platt | ≈ 0.001–0.004 |
| AUC after Platt | identical to 4 decimal places |
| Single-row predict | ≈ 0.5–2 ms |

## The five lessons hidden in those numbers

1. **Calibration is free for rankers and priceless for bidders.** Platt scaling is monotonic: AUC cannot move (your Checkpoint 3 proves it), yet the money changes, because bids multiply probabilities. This asymmetry — *same model, opposite stakes* — is the entire content of Chapter A.4 and the most quotable result of this lab.
2. **Boosted trees miscalibrate on rare positives by construction.** They optimize log loss, not per-bin honesty, and the top of the probability range is where data is thinnest — exactly where bidders spend the most. Reliability diagrams are how you *see* it; ECE is how you *track* it (add it to Lab x1's dashboard).
3. **Calibrate on held-out predictions.** Calibrating on training-set predictions fits the model's overconfidence curve; the sigmoid maps wrong probabilities to wronger ones. The 80/20 split inside your training data is the minimum; production teams keep a rolling calibration stream fresh (A.7's drift loop, applied to the *calibrator*).
4. **The 10ms bidder is a feature-store problem.** Your model takes 1–2 ms; the real budget dies in feature fetching. That's why feature stores (A.1) exist: precompute what you can, serve the rest from low-latency KV stores, and co-locate model with features. When interviews ask "how would you meet 10ms?", start with the feature path, not the model.
5. **Subsampling preserves the lesson but not the number.** AUC on 500K rows is ~0.01 lower than on the full 45M (less data, rarer patterns). Direction, not digits — and a nice reminder to be suspicious of small-data absolutism in either direction.

## Common mistakes

- **One-hot encoding C1–C26.** Memory explodes (tens of millions of columns), training crawls, AUC doesn't improve. Native categoricals or frequency/target encoding is the way.
- **Calibrating on the test set** — the ECE after "fixing" looks perfect and means nothing. The clumsy line in the lab code exists to make you trip on this; cleaning it up correctly is a rite of passage.
- **Comparing log loss across different positive rates.** If you subsample differently from us, your baseline log loss shifts; only compare *gaps* to baseline, never raw values across datasets.

## Interview lines this lab earns you

- "Calibration is a monotonic post-processing step, so it leaves AUC untouched — I verified that in my CTR lab — but it changes bids multiplicatively, so for a bidder it's mandatory; for a feed ranker it's optional."
- "I measured single-row prediction at ~1 ms and used that to build a real 10 ms budget: the model is the smallest line; feature fetching is the one to attack."
