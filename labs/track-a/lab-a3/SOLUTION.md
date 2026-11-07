# Lab a3 — Worked Solution and What the Numbers Mean

## Expected results (our runs, HistGradientBoosting, stratified split)

| Measurement | What we got |
|---|---|
| AUC-ROC | ≈ 0.97 |
| Average precision (PR-AUC) | ≈ 0.80–0.85 |
| Recall @ precision 0.90 | ≈ 0.55–0.65 |
| Precision @ recall 1.0 | < 0.05 |
| Cost-optimal threshold (FN=$122 avg, FP=$5) | ≈ 0.02–0.10 (far below 0.5!) |
| Savings vs. always-approve | ≈ 60–80% of total fraud dollars |

The single most important number on that table: **the cost-optimal threshold is not 0.5, not 0.3 — it's usually under 0.1.** The model's probability scale has no duty to center on 0.5; the *business* decides where to cut. If you remember one sentence: *the threshold is a business decision wearing a math costume.*

## The five lessons hidden in those numbers

1. **ROC flatters imbalanced problems; PR tells the truth.** Same model, two curves: AUC 0.97 (glorious) vs. precision 0.05 at full recall (sobering). The difference is entirely the denominator: ROC divides false positives by ~71,000 negatives (tiny rate), PR divides by your own positive calls (your problem). When an interviewer asks "when do you prefer PR over ROC?", the answer is "whenever the class ratio is extreme and the cost of false positives is real — like the fraud lab I ran."
2. **Dollars beat F1.** F1 weights FP and FN equally at a 1:1 ratio; fraud dollars weight FN by transaction amount and FP by a support cost you chose. Different business, different optimum — your Part-2 paragraph proves you can re-derive it under any cost matrix.
3. **Label maturity breaks naive dashboards.** If you retrain weekly on "labels so far," you systematically under-train on recent fraud patterns (their labels haven't arrived). The runbook answer: train on transactions older than the label-maturity window (e.g., 45 days) *plus* a fast-path model on matured recent data.
4. **The adversary moves; your model doesn't.** The two-day dataset can't show it, but your Part-4 reasoning is the production reality: fraudsters probe limits, find your threshold's shadow, and adapt in days. Velocity features and merchant-risk scores exist because static transaction features lose. Concept drift here is *adversarial*, the hardest kind (A.7).
5. **Small-fraud blindness is structural.** Card-testing attacks spray $1–10 charges; a model trained on aggregate fraud statistics under-weights them precisely because they're individually cheap. Real systems add rules for velocity regardless of model output — rules and models are teammates, not rivals (A.5's layered defense).

## Common mistakes

- **Oversampling before splitting** (SMOTE on the full dataset, then split): synthetic frauds derived from test rows leak into training. Metrics look like 0.99 AP; production delivers ~0.75. If your AP is above ~0.90, suspect this first.
- **Fitting the threshold on the test set** and reporting its cost as expected performance. Threshold is a *hyperparameter* — tune on train/validation, report on test. (We broke this rule slightly for simplicity in the lab code; the extension is doing it properly. Yes, that's a confession — put it in your journal, it's a good story.)
- **Averaging `Amount` including outliers** when computing FN cost — one $25K fraud drags the "average" and hides the median story. Report both.

## Interview lines this lab earns you

- "On the ULB dataset, my cost-optimal threshold was 0.06, not 0.5 — with a $122 average fraud and $5 false-alarm cost. When the business changes those numbers, I re-solve the same one-line optimization, I don't retrain."
- "My metrics were 0.97 AUC but precision below 0.05 at full recall — I choose PR curves for fraud because ROC's negative-class denominator hides exactly the cost the business feels."
