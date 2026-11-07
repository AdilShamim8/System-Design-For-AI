# Lab a7 — Worked Solution and What the Numbers Mean

## Expected results (our runs)

| Measurement | What we got |
|---|---|
| AUC before / after injected shift | ≈ 0.90 → ≈ 0.86–0.89 (0.01–0.04 drop) |
| PSI: workclass | ≈ 0.8–2.0 (off the charts — the rename) |
| PSI: education | ≈ 0.10–0.30 (visible, "investigate" band) |
| PSI: hours-per-week | ≈ 0.05–0.20 (shape shift, borderline) |
| KS: hours-per-week | ≈ 0.15–0.30 |
| Mean predicted score | moved 0.02–0.06 depending on shift mix |

## The five lessons hidden in those numbers

1. **Drift is silent by nature.** A 0.03 AUC drop raises no error, no exception, no ticket. If nobody is computing these statistics, *nobody knows*. That's why X.3 says ML monitoring is a different discipline from infra monitoring: green dashboards and a rotting model coexist happily.
2. **PSI thresholds are conventions, not physics.** The 0.1/0.25 bands come from credit-scoring practice. On low-cardinality categoricals PSI is jumpy; on heavy-tailed numerics it's deaf. The senior move is to *calibrate*: run PSI on consecutive stable periods (the seasonality extension) and set thresholds from observed noise — then defend them in a sentence.
3. **The category rename is the trap.** PSI = 2.0 looks apocalyptic; the correct fix is a one-line pipeline patch and a backfill. Meanwhile PSI = 0.15 on education *is* the world changing, and the response is a retraining *program*. **Alarm magnitude and response urgency are uncorrelated** — cause diagnosis is a human job, and Part 3's table is how you do it fast.
4. **Output drift is the early signal; label metrics are the confirmation.** Score distribution moves the day the world moves. AUC moves weeks later, when labels mature (Lab a3's maturity lesson, now a monitoring principle). A complete story uses both horizons — and knows which one it's looking at.
5. **Retraining cadence is an economic decision.** Drift cost per month vs. retrain cost per cycle. "Always retrain" is as lazy as "never retrain"; the dollar model in Part 4 makes you say numbers instead of adjectives. (Chapter X.4's cost discipline, applied to model lifecycle.)

## Common mistakes

- **PSI on raw category *counts*** instead of normalized frequencies — scale changes with sample size and the statistic becomes meaningless.
- **Bins from the *actual* distribution.** Bin edges must come from the reference period, or the comparison silently re-normalizes and understates drift (the lab code bins on `expected` for exactly this reason).
- **Alerting on every PSI > 0.1.** With 12 features checked hourly, false alarms will train the team to ignore the channel — alert on *sustained* violation (e.g., 3 consecutive hours) or *multiple* features simultaneously, and keep the rest as a dashboard, not a pager.
- **Retraining immediately on the bug data.** The model learns the bug as reality; when the pipeline is fixed, you must retrain *again*. Diagnosis before response — always.

## Interview lines this lab earns you

- "I've run a drift incident end-to-end: PSI flagged a category rename at 2.0, but the fix was a pipeline patch and backfill — the *silent* 0.15 on education was the one that needed a retraining program. Alarm size and urgency are different axes."
- "My monitoring story has three horizons: input drift (earliest, noisiest), output drift (early, business-meaningful), and matured label metrics (late, definitive). I built all three on a manufactured incident and know what each one can and can't tell me."
