# 9 — Evaluation Metrics (X.2, Labs a3, a8, b4)

## Classical ML
| Metric | Use | Trap |
|---|---|---|
| Accuracy | balanced classes only | lies under imbalance (99.83% = always-negative fraud) |
| Precision / Recall | asymmetric costs | pick by cost matrix, not F1 (Lab a3) |
| PR-AUC (avg precision) | rare positives | **the** imbalanced-classes headline |
| ROC-AUC | ranking quality | flatters under imbalance (denominator = negatives) |
| Calibration (ECE, reliability) | decisions multiply scores | bidders/decisions need it; rankers don't (Lab a4) |
| NDCG@k | graded relevance, ranking | ideal-DCG must use ALL judgments |

## Offline vs online (the chapter's core)
Offline (hit rate, AUC, faithfulness) = rumor about online truth. **A/B tests decide**: one primary metric (pre-registered), guardrails with thresholds, AA test first, fixed horizon or honest sequential (Lab a8: peeking inflates false positives 5% → 20%+). N scales 1/lift²: +1% relative on 5% CTR ≈ **~780K users/arm** (α=.05, power=.8).

## RAG (b4 — two tiers, always)
- **Retrieval** (free, exact, CI): hit@k, MRR
- **Generation** (judge, temp-0, bias-tested): faithfulness (answer ⊆ context — the trust metric), relevance (answers the question)
- Compound quality = product of stages: 0.75 × 0.9 × 0.9 ≈ **0.61** — users feel the product
- Refusal rate on adversarial set — the FN-04 insurance metric

## LLM-as-judge discipline
JSON output, temp 0 · randomize A/B order (position bias: 25%+ flip without it) · length-aware rubrics · calibrate vs. ~50 hand labels (κ ≥ 0.6 workable) · judge version logged

## Agents (c5)
Outcome grade + **trajectory grade** (right answer via garbage path = scheduled regression): steps, loops, wrong-tool calls, groundedness. Attack set pass rate is a first-class metric.

## Fairness slices (FN-01, FN-05, FN-10)
Disaggregate by group *by default*. Know which fairness definition your metrics encode (calibration vs error-rate balance can't both hold — choose deliberately).
