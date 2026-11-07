# Lab x1 — Worked Solution and What the Numbers Mean

## Expected results (our runs, 200 ref + 50 shifted requests)

| Metric | Reference | Shifted | Fires? |
|---|---|---|---|
| Query centroid distance | ≈ 0.12–0.2 (noise) | ≈ 0.35–0.55 | input-drift alert, sustained |
| Max-sim < 0.5 share | ≈ 5–10% | ≈ 25–40% | yes |
| Answer-length PSI | < 0.1 | ≈ 0.2–0.6 | yes |
| Refusal rate | ≈ 5–10% | ≈ 25–40% | yes |
| TTFT distribution | stable | stable | **no — correctly silent** |
| Cost/1K | baseline | similar | no |

## The five lessons hidden in those numbers

1. **The horizons fire in order, and the order is the early-warning system.** Input drift catches a changing world before output drift catches its consequences, and long before business metrics feel it. When a product owner asks "why do we track query embeddings?", the answer is *lead time*.
2. **Negative controls are half the dashboard.** TTFT staying flat under a content shift is not a failure to detect — it's the system correctly distinguishing load problems from content problems. A dashboard you trust is one whose silences are as informative as its alarms.
3. **Sustain windows are the anti-cry-wolf mechanism.** Every rule that fired once and stopped would have paged you 30 times in a boring month. The month simulation (Checkpoint 3) is the only honest way to set thresholds — thresholds derived from data, not from the 0.1/0.25 PSI folklore alone (a7's calibration lesson, operationalized).
4. **`corpus_hash` and `prompt_version` turn mysteries into lookups.** Half of all "the model got worse" incidents are actually "the corpus changed" or "someone edited the prompt." If those fields aren't in the logs, you find out by archaeology; if they are, you find out by `GROUP BY`.
5. **The runbook note is what shortens incidents.** A metric that moves tells you *that* something is wrong; the "what to do" note tells a tired on-call *what next*. Monitoring design is incomplete until every alert has a next step a human can execute at 3AM.

## Common mistakes

- **Averaging embeddings into a global centroid only.** A bimodal shift (two new traffic sources) can leave the centroid unmoved — track the max-sim-share metric alongside it. (Single-statistic drift detection always has a blind spot; use two.)
- **Alerting on raw metric values instead of deltas from reference bands.** Absolute thresholds rot as traffic grows; bands self-update.
- **Logging the question but not the retrieved chunks.** Without retrieval context you can't debug answer quality later — the log line is your *only* memory of what the system actually saw.
- **No owner on an alert.** Unowned alerts become Slack wallpaper within a month. If nobody owns it, delete it.

## Interview lines this lab earns you

- "My AI dashboards run three horizons with reference bands — input, output, business — and every rule has a sustain window, an owner, and a runbook link. I validate the rule set by simulating boring months: any rule that fires on normal traffic gets deleted, because a noisy channel is an ignored channel."
- "I log corpus_hash and prompt_version on every request — in my experience, half of 'the model degraded' tickets are actually 'the world changed' or 'the prompt changed,' and those two fields turn a mystery into a GROUP BY."
