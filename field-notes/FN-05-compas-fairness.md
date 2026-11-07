# FN-05 — COMPAS and the Two Definitions of Fairness

**Date:** Investigation May 2016 · **Category & chapters below**

## What happened

ProPublica's "Machine Bias" investigation (Julia Angwin et al., May 2016) analyzed COMPAS — a recidivism-risk score used in bail and sentencing decisions across several US states — and found that Black defendants who did *not* reoffend were nearly twice as likely as white defendants to have been labeled high-risk (false-positive rates of ~45% vs ~23%), while white defendants who *did* reoffend were more likely to have been labeled low-risk. Northpointe (the vendor) responded that the score was *calibrated*: for any given score, Black and white defendants reoffended at similar rates. Both claims were, roughly, true — and that is the point. Later work (Kleinberg, Mullainathan, Raghavan 2016; Chouldechova 2017) proved the two fairness definitions (calibration and error-rate balance) are mathematically incompatible when base rates differ between groups — you cannot have both, so choosing is unavoidable.

## Why it happened (the design lens)

The deepest lesson in ML fairness lives here: **the conflict is mathematical, not implementation sloppiness**. When reoffense base rates differ by group (for reasons entangled with policing history), no single score can be simultaneously calibrated and equal in error rates. COMPAS also surfaced every layering problem: a proprietary score, used in high-stakes decisions, with little recourse for the scored, "risk" conflating behavior with enforcement exposure (arrest ≠ offense), and the training data itself reflecting decades of differential policing. The tool didn't introduce bias to a fair process; it laundered existing bias through mathematics and gave it the authority of a number.

## The design lessons

- **Define fairness before you build — and know you're choosing** (Chapter X.2): "fair" is not one thing. Calibration? Error-rate parity? Equalized odds? Each helps a different stakeholder; some cannot coexist. The interview-grade sentence: the impossibility results mean fairness is a *policy choice* the system must encode explicitly.
- **Audit slices, not aggregates** (Labs a1/a8): the ProPublica finding only appears in group-sliced confusion matrices — aggregate accuracy hid it completely. Slice-by-slice evaluation is the *only* way this class of problem becomes visible.
- **Feedback loops compound** (FN-01's theme, harsher stakes): risk scores influence incarceration, which influences future arrest data, which retrains future scores. High-stakes systems need loop-awareness in their governance, not just their metrics.
- **Accountability structures decide severity** (Chapter C.5): the same score in a advisory role with human review, published methodology, and appeal channels is a different system than a proprietary black box in sentencing.

## Say it in an interview (the 30-second version)

"COMPAS is the case I reach for on fairness: ProPublica showed error-rate disparity, the vendor showed calibration, and the impossibility results (Kleinberg et al., Chouldechova) proved both can't hold at once when base rates differ — so fairness is a policy decision, not a hyperparameter. Practically: I evaluate every model group-sliced, I know which fairness definition my metrics operationalize, and I flag when base-rate differences mean the choice is load-bearing." 

## Sources

- ProPublica, "Machine Bias" (Angwin et al., May 2016) — https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing
- Kleinberg, Mullainathan, Raghavan, "Inherent Trade-Offs in the Fair Determination of Risk Scores" (ITCS 2017); Chouldechova, "Fair prediction with disparate impact" (2017).
- Context: Chapter X.2; Labs a1, a8.
