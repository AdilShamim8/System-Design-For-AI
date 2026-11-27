# Coding 6 — A Drift Monitor in 50 Lines

**Time budget: 35 min.** Open book (docs, not solutions). Narrate your tradeoffs.

## The scenario

ML-platform screen: 'Write the drift check I can put in a cron. Inputs: yesterday's feature distribution and a reference distribution. Outputs: a decision — alert, investigate, or quiet — plus a per-feature breakdown. Constraints: 50 lines, no fancy dependencies, and the PSI bands must be justified.' The reference: A.7 and cheatsheet #8's PSI bands (<0.1 stable, 0.1–0.2 investigate, >0.2 act).

## Your task

The drifted feature named correctly, non-drifted features quiet. Bands justified (they're heuristics from credit-industry practice — say so, and note the real justification is YOUR data's alert history). Both PSI failure modes named with guards: min-bin-count, and fixed reference binning.

## Success looks like

1. Implement PSI (population stability index) for numeric features (10-bin quantile binning from the reference).
2. Implement PSI for categoricals (bin = category, with an 'other' bucket for new values).
3. The decision rule: max-feature PSI decides; borderline features listed.
4. Inject drift in one feature; verify the monitor names it.
5. State the two failure modes of PSI itself (small-sample noise; binning sensitivity) and the guard for each.

## Dataset

Self-generated: two numeric arrays plus a categorical column, with drift injected in one feature. Or Lab a7's data. The monitor must handle both numeric and categorical features.

## After your attempt

Open [SOLUTION.md](./SOLUTION.md). Grade yourself against the checklist at the end.
