# Coding 3 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

This is the join that quietly decides whether your model is real. The leak: `txn_count_7d` on the same date as the event includes *this event* — the feature has seen its own label's window.

```python
import pandas as pd

# The NAIVE join (wrong): the snapshot for date D includes events from date D
naive = events.merge(snap, on=["user", events.date == snap.date])
# -> the event's own amount is inside amount_mean_7d. The model learns
#    "large amount → large rolling mean," a tautology, not a signal.

# The POINT-IN-TIME join: the event at timestamp T joins the most recent
# snapshot with snapshot_date < date(T) — the last *completed* day.
events["d"] = events.timestamp.dt.floor("D")
pit = pd.merge_asof(
    events.sort_values("timestamp"),
    snap.sort_values("date"),
    left_on="timestamp", right_on="date",
    by="user", direction="backward", allow_exact_matches=False,
)
# allow_exact_matches=False is the whole answer: strictly prior, never same-day.

# Quantify: tiny model, both joins, compare AUC — the naive one wins by a
# margin that is exactly the size of the leak (a6: a single leaky rolling
# feature inflated apparent skill by 50–60% on MAE; expect a visible AUC gap).
```

The sentence to say while writing it: "I train on the information state the production system will actually be in — a feature that could only be computed *after* the prediction is a bug wearing a feature name."


## Complexity and cost

merge_asof on sorted frames: O(n log n). 20 users × 90 days is nothing — the point is the pattern, not the scale; say that the same join at 100M events is the feature store's job (Chapter A.1), and *this* is why feature stores exist.

## Self-check

- [ ] Naive join written and shown leaky with one example row
- [ ] `merge_asof` with `allow_exact_matches=False` (or equivalent)
- [ ] AUC gap measured, not asserted
- [ ] The one-sentence rule stated
- [ ] Feature-store connection made unprompted
