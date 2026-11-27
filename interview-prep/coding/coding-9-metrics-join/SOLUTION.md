# Coding 9 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

The screen is about attribution semantics, not pandas fluency.

```python
import pandas as pd

# 1. The naive join — wrong, and you SAY why while writing it:
#    a user with 3 predictions and 2 conversions gets 6 rows; revenue triples.
naive = predictions.merge(outcomes, on="user_id")
# the sentence to say: "join cardinality IS the bug — attribution is a
# many-to-one decision, not a join."

# 2. Attribution: each outcome -> the most recent prediction strictly before it.
preds = predictions.sort_values("timestamp")
outs = outcomes.sort_values("event_time")
attributed = pd.merge_asof(
    outs, preds,
    left_on="event_time", right_on="timestamp",
    by="user_id", direction="backward", allow_exact_matches=False,
)
# direction="backward" + allow_exact_matches=False: the outcome looks UP the
# timeline for the newest prediction strictly before it. Same two flags as the
# point-in-time join (coding-3) — different question, same information-state rule.

# 3. Unattributed outcomes: attributed has NaN timestamp for outcomes with no
#    prior prediction. The rule you state out loud: "excluded from the per-
#    prediction comparison, REPORTED as a count" — silent drops are how dashboards
#    lie. Never-predicted users are out of scope by construction (no score to compare).

# 4. The comparison:
per_pred = attributed.groupby("model_version").agg(
    n=("user_id", "size"),
    revenue=("revenue", "sum"),
    conv_rate=("converted", "mean"),
)
per_pred["revenue_per_prediction"] = per_pred.revenue / per_pred.n
# report this with the window: "over the 14-day window, v2 shows $X vs $Y per
# prediction" — and the caveat below before anyone screenshots it.
```

The two ways it still misleads: (1) the attribution window — a 3-day-delay conversion attached to the newest prediction may belong to an older impression; the window is a modeling choice you should state; (2) version overlap — if both versions served during the same period (a canary), the comparison is clean; if v1 served weekdays and v2 weekends, you are comparing traffic, not models. The senior sentence: "the join is 10 lines; the trustworthiness of the comparison is the other 30 minutes.

## Complexity and cost

merge_asof on sorted frames: O(n log n). At production scale this is a batch job's window function (SQL: LAG/ROW_NUMBER with a time predicate) — say that this exact logic becomes a dbt-style model, versioned like code.

## Self-check

- [ ] Naive join shown double-counting, with one concrete row
- [ ] merge_asof backward + strictly-prior
- [ ] Unattributed outcomes counted, not dropped
- [ ] Comparison stated with its window
- [ ] Both residual-misleading modes named
