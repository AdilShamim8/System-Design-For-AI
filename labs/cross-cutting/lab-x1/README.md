# Lab x1 — Monitoring and Drift Alerts for an AI Service

| | |
|---|---|
| **Prerequisites** | Chapter X.3 (the stethoscope) · Labs a7, b2 |
| **You will build** | The three-horizon monitoring dashboard for an AI service — input drift, output drift, business metrics — plus alerting rules that page only when a human is needed |
| **Est. time** | 2 hours | 
| **Cost** | Free (local, no LLM needed) |

**The story.** Chapter X.3's claim: AI services rot silently — green dashboards, dying model. Lab a7 proved it on a manufactured incident; this lab builds the *standing* defense for a real service (your b2 RAG system, or any model you've trained in Track A). The deliverable is a `monitor.py` that ingests request logs and emits the three-horizon report, plus the alert rules with *human-calibrated* thresholds — because an alert that fires weekly gets ignored, and an ignored alert is worse than none.

## Part 1 — The log schema (15 min)

Monitoring starts with what you record. Define the per-request log line (JSONL — same file format your traces already use):

```python
{"ts": "...", "user_q": "...", "n_chunks_retrieved": 4, "top_sim": 0.71,
 "answer_len_tokens": 312, "ttft_ms": 640, "model": "small-v2",
 "corpus_hash": "a91f...", "prompt_version": "p7"}
```

Run 200 requests through your b2 pipeline (vary questions from SQuAD + a few adversarial ones) and log everything. **The discipline: every field you might debug later, log now.** `corpus_hash` and `prompt_version` are the two everyone forgets and everyone needs.

## Part 2 — The three horizons (45 min)

```python
# Horizon 1: input drift — is the query mix moving away from what we built for?
def query_drift(reference_embeds, current_embeds):
    # centroid distance + share of "unlike-anything" queries (max-sim < 0.5)
    ...

# Horizon 2: output drift — is the answer distribution moving?
def output_drift(ref, cur):
    return {"answer_len_psi": psi(ref.len, cur.len),
            "ttft_psi": psi(ref.ttft, cur.ttft),
            "refusal_rate_delta": cur.refusal.mean() - ref.refusal.mean()}

# Horizon 3: the business layer — what the product owner sees
def business(cur):
    return {"answer_rate": 1 - cur.refusal.mean(),
            "p95_ttft_ms": cur.ttft.quantile(.95),
            "cost_per_1k": cur.tokens.sum() / len(cur) * PRICE * 1000}
```

**Checkpoint 2:** Compute all three horizons on your 200-request log against a "reference week" (your first 100 requests). Then *shift the world*: run 50 more requests that are all short, weird, or out-of-domain — and watch which horizon fires first. (Expected: input drift first — that's its job. The stethoscope catches the cough before the fever.)

## Part 3 — Alert rules that survive human nature (30 min)

Write the alert config, each with an owner, a runbook link, and a *sustain* window (a7's lesson — no paging on single-blip PSI):

```python
ALERTS = [
    {"name": "query_drift_sustained",
     "expr": "centroid_distance > 0.35 for 3h",
     "severity": "page", "owner": "rag-oncall",
     "runbook": "check for new traffic source; sample 20 drifted queries by hand"},
    {"name": "refusal_rate_up",
     "expr": "refusal_rate > 0.15 for 2h (baseline 0.05)",
     "severity": "page", "owner": "rag-oncall"},
    {"name": "cost_anomaly",
     "expr": "cost_per_1k > 1.5x 7d-mean for 6h",
     "severity": "ticket", "owner": "platform"},
]
```

**Checkpoint 3:** The calibration exercise that makes this lab real: run your shifted traffic past the rules. Does anything page? Then — the crucial discipline — *simulate a boring month*: run unshifted traffic through the same rules and count alerts. **A rule that fires on normal traffic is deleted, not tuned into submission.** Write your month-simulation count in the journal; that number is the difference between monitoring and noise.

## Part 4 — The dashboard mock (10 min)

Sketch (paper or matplotlib) the one-screen dashboard: three panels for the three horizons, each with the reference band drawn in. The X.3 principle to honor: **a metric without its healthy band is decoration.** Every line gets a band; every panel gets a "what to do if this moves" note. That note — not the metric — is what makes 3AM incidents short.

---

## Explain it back

1. The three horizons — what does each catch, and which fires first in a slow shift? A fast outage?
2. Why must alerts have sustain windows and owners?
3. Why log corpus_hash and prompt_version on every request?
4. Your monitoring catches nothing for a month. Good news or bad news?

## Extensions

- **Wire to real infra:** emit the same metrics to Prometheus via `prometheus_client` and graph in Grafana Cloud free tier — the concepts become a live URL you can show in interviews.
- **Drift on embeddings, done right:** replace centroid distance with MMD or a two-sample classifier (train to distinguish reference vs. current; AUC ≈ 0.5 means no drift, 0.8 means real drift). The classifier trick is the practitioner's favorite — know it.
- **The silent-killer metric:** add "share of answers citing the *bottom* 10% of chunks" — a canary for corpus rot (old docs being cited over new ones). Invent your own canary and defend it.

## What you can now claim in an interview

"I run AI monitoring on three horizons — input drift, output drift, business metrics — each with reference bands, sustain windows, owners, and runbooks. I simulate boring months against my alert rules and delete anything that fires on normal traffic, because a noisy alert channel is an ignored alert channel."
