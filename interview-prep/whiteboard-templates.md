# The Whiteboard Templates — Six Diagrams Worth Memorizing

**Why this file exists:** in a design round, the diagram is your interface to the interviewer's working memory — a good one carries the conversation; a bad one (or none) costs you 15 minutes of pointing at air. These six templates cover ~90 percent of AI system-design prompts. Each is given in ASCII so you can rehearse it on paper; the numbers to annotate each with are from your labs (the interview-connections sections of each lab name them).

## Template 1 — The serving pipeline (the default spine)

```
        ┌─────────────────────────── the request path ───────────────────────────┐
user → gateway ──→ cache(s)? ──→ retrieval ──→ model(s) ──→ output checks ──→ user
        │  (authn, budgets)   (exact,semantic)  (hybrid)   (route/tier)  (validate)
        │
        └──→ metering: cost, latency, refusal-rate ──→ dashboards & alerts
```
*Annotate with:* per-hop latency budgets (drill 18/23), the degradation ladder under each hop (x3), and the cache flush trigger (corpus version).

## Template 2 — The data/feedback loop (the AI-specific third)

```
            ┌──────────────────── the learning loop ────────────────────┐
            │                                                            │
 predictions ──→ logs ──→ labels (matured, a3) ──→ training ──→ registry ─┘
      │            │                                      │
      ▼            ▼                                      ▼
   outcomes    monitoring (PSI, a7)              champion/challenger gate (a6)
```
*Annotate with:* the label maturity window in days, the drift alert bands, and the promotion gate stages (shadow → canary → ramp — Q-ML-14). Drawing this loop unprompted is the mid-to-senior tell in ML rounds.

## Template 3 — The RAG stack (GenAI rounds)

```
ingest:  docs → chunk (structure-first, b3) → embed → vector store ─┐
                                                                    ├─→ RRF fuse ──→ rerank (top-20) ──→ generate (cited) ──→ validate (b7)
query:   question ──→ embed ────────────────────────────→ lexical ──┘
                          (cache first: exact → semantic, b5)
```
*Annotate with:* the hybrid rationale (different failures — a5), rerank's 40-150ms price, the version-stamp on citations (Q-BR-9).

## Template 4 — The agent loop (agent rounds)

```
            ┌─────────────────────── (budgets OUTSIDE: steps · tokens · wall-clock)
            ▼
state → llm(state) ──final?──→ answer
            │ tool call (JSON)
            ▼
       tool registry ──(errors as DATA)──→ state += result (truncated)
            │
            └→ side-effect grid: read | write | money | irreversible → human gate?
```
*Annotate with:* the six-item contract (c2), the stop-reason taxonomy, and the +1-step error recovery number (c1).

## Template 5 — The multi-tenant platform (platform rounds)

```
                 ┌── tenant A ── isolated: data plane, quotas, cache namespace
control plane →──┼── tenant B ── (per-tenant circuit breakers, cap2)
(policy, models,│
 metering)      └── tenant C ── shared: model registry, eval service (Q-CC-12)
```
*Annotate with:* what's shared vs isolated (and WHY — blast radius vs cost), the noisy-neighbor fix, and the cost-attribution flow.

## Template 6 — The capacity box (any "at scale" follow-up)

```
┌─ inputs: QPS, payload sizes, growth rate ─┐   ┌─ compute: per-request tokens/GPU-ms ─┐
│ storage: bytes = count × dims × 4 × ovhd  │   │ cost: $/request → fully-loaded ×2    │
└─ the node count, stated with a buffer ────┘   └─ the monthly bill, stated as unit econ┘
```
*Annotate with:* the derivation visible (interviewers grade the arithmetic, not the answer — drill bank 07/07b), and the "what breaks at 100x" line pointed at ONE component.

---

**Rehearsal protocol:** each template, blank paper, three times over a week — until the shape comes out of your hand without thinking, leaving your mouth free for the numbers.
