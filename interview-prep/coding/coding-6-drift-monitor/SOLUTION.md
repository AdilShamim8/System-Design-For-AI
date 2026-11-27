# Coding 6 — Worked Solution

*(Attempt the problem first. The value is the delta between your answer and this one.)*

PSI is 20 lines; the other 30 are the discipline around it.

```python
import numpy as np

def psi_numeric(ref, cur, bins=10, eps=1e-6):
    # Quantile bins FROM THE REFERENCE — current data uses reference edges.
    # (Fixed edges = comparable across days; re-binning daily = the noise bug.)
    edges = np.unique(np.quantile(ref, np.linspace(0, 1, bins + 1)))
    ref_p = np.histogram(ref, edges)[0] / max(len(ref), 1) + eps
    cur_p = np.histogram(cur, edges)[0] / max(len(cur), 1) + eps
    return float(np.sum((cur_p - ref_p) * np.log(cur_p / ref_p)))

def psi_categorical(ref, cur, eps=1e-6):
    cats = set(ref)
    ref_p = {c: (ref == c).mean() for c in cats}
    cur_p = {c: (cur == c).mean() for c in cats}
    cur_p["__other__"] = max(1 - sum(cur_p.values()), 0)   # NEW categories bucket
    ref_p["__other__"] = eps
    return float(sum((cur_p[c] - ref_p[c]) * np.log(cur_p[c] / max(ref_p[c], eps))
                     for c in cur_p))

def monitor(refs, curs, min_n=500):
    report = {f: psi_numeric(r, c) if r.dtype.kind == "f"
              else psi_categorical(r, c) for f, (r, c) in zip(refs, curs)}
    worst, val = max(report.items(), key=lambda kv: kv[1])
    if val > 0.2:   return {"decision": "ALERT", "feature": worst, "psi": val, "report": report}
    if val > 0.1:   return {"decision": "INVESTIGATE", "borderline":
                            [f for f, v in report.items() if v > 0.1]}
    return {"decision": "QUIET", "report": report}
```

The bands' justification, spoken: "0.1/0.2 are credit-industry rules of thumb — the honest version is: log PSI for a month, correlate with your incidents, and *then* own the bands. Small samples make PSI explode (a bin with 3 rows moves it wildly) — the guard is a minimum count per bin or wider bins; and binning sensitivity is why the reference fixes the edges.

## Complexity and cost

O(n) per feature per day. The cron story: reference = last-90-days rolling (refit monthly, versioned — a moving reference makes drift invisible by definition); current = yesterday. The monitor's output feeds the alert → dashboard → auto-retrain-trigger ladder (a7's full loop).

## Self-check

- [ ] Reference-fixed bin edges
- [ ] Categorical + new-category bucket
- [ ] Bands justified, not just recited
- [ ] Drift injection test passes
- [ ] Both PSI failure modes + guards stated
