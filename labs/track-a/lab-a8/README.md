# Lab a8 — A/B Testing Without Lying to Yourself

| | |
|---|---|
| **Prerequisites** | Chapter X.2 (confidently wrong) · Labs a2 (you built the recommender to test) |
| **Dataset** | Simulation — you'll generate the "users" yourself (the honest way to study peeking) |
| **You will build** | A sample-size calculator, a peeking simulator that shows why peeking lies, and the guardrail design for a real ML A/B test |
| **Est. time** | 2 hours |
| **Hardware** | Laptop CPU. No GPU. No API key. |

**The story.** Your new recommender (Lab a2) looks better offline. The product team ships it to 1% of users for a week, and the dashboard says +4% engagement, p = 0.03. Ship it? Not yet — because if you *kept checking* the dashboard every hour until it looked good, that p-value is a coin you flipped until it landed the way you wanted. Today you'll run that scam *on purpose*, watch it produce false positives from pure noise, and come out with the three habits that make A/B results trustworthy: **fixed sample size, no peeking (or honest sequential tests), and guardrails.**

---

## Part 0 — Simulate the experiment (20 min)

Build a world where you *know the truth* (that's why we simulate): the new model has exactly **+1.0%** click-through rate on a 5.0% baseline.

```python
import numpy as np

rng = np.random.default_rng(42)
BASE, LIFT, N_PER_ARM = 0.05, 0.01, 20_000   # absolute lift 1.0 percentage point? No:
TRUE_CTR_B = 0.05
TRUE_CTR_A = 0.05 * 1.01                     # +1% *relative* — realistic ML lift

def run_experiment(n, seed):
    r = np.random.default_rng(seed)
    clicks_a = r.binomial(1, TRUE_CTR_A, n).sum()
    clicks_b = r.binomial(1, TRUE_CTR_B, n).sum()
    return clicks_a, clicks_b
```

**Checkpoint 0:** Why is +1% *relative* the right scale to simulate, not +1 percentage point? (Real ML improvements are single-digit-percent relative; simulating huge lifts teaches you nothing about the hard cases — detecting *small* effects is the entire discipline.)

---

## Part 1 — The sample-size calculator (30 min)

The formula every ML engineer should be able to derive on a whiteboard (two-proportion z-test):

```python
from math import sqrt, log

def required_n(p1, rel_lift, alpha=0.05, power=0.8):
    p2 = p1 * (1 + rel_lift)
    z_a, z_b = 1.96, 0.84                     # two-sided 95%, power 80%
    pbar = (p1 + p2) / 2
    return int(2 * pbar * (1 - pbar) * ((z_a + z_b) / (p2 - p1)) ** 2)

n_needed = required_n(0.05, 0.01)
print(f"users per arm: {n_needed:,}")
```

Now *verify* the formula with brute force — 1,000 simulations at your computed N:

```python
from scipy.stats import norm

def p_value(clicks_a, clicks_b, n):
    p_pool = (clicks_a + clicks_b) / (2 * n)
    se = sqrt(2 * p_pool * (1 - p_pool) / n)
    z = (clicks_b / n - clicks_a / n) / se
    return 2 * (1 - norm.cdf(abs(z)))

wins = sum(
    p_value(*run_experiment(n_needed, s)) < 0.05
    for s in range(1000)
)
print(f"detected the +1% lift in {wins/10:.1f}% of simulations (target: 80%)")
```

**Checkpoint 1:** You should detect ~80% of the time — that's what "power" means, now demonstrated rather than defined. Then compute: N for +2%, +5%, +10% lifts. Watch N fall by ~4× for 2× the effect (N scales with 1/lift²). **The lesson to write down: A/B tests are cheap for big effects and brutally expensive for small ones — which is why "how long will this take to detect?" is a *design* question you answer *before* shipping, not after.**

---

## Part 2 — The peeking scam, simulated (40 min)

Now the same experiment, run *dishonestly*: check daily, stop the moment p < 0.05 — with **no true effect at all** (A/A test: both arms 5%):

```python
def peeking_experiment(n, days, seed):
    r = np.random.default_rng(seed)
    a = r.binomial(1, TRUE_CTR_B, n)          # identical CTRs — no effect
    b = r.binomial(1, TRUE_CTR_B, n)
    for day in range(1, days + 1):
        k = int(n * day / days)
        if p_value(a[:k].sum(), b[:k].sum(), k) < 0.05:
            return True, day                   # "winner found" — a false positive
    return False, days

false_pos = 0
stopped_early = []
for s in range(1000):
    win, day = peeking_experiment(10_000, 10, s)
    false_pos += win
    if win and day < 10:
        stopped_early.append(day)

print(f"peeking false-positive rate: {false_pos/10:.1f}% (honest test: 5%)")
print(f"median 'discovery' day: {int(np.median(stopped_early)) if stopped_early else 'n/a'}")
```

**Checkpoint 2 (the lab's centerpiece):** Expect a **15–30% false-positive rate** from a test that *should* err 5% of the time — the sin is entirely the stopping rule. Every business that "always finds winners" is running this scam unknowingly. Write your number down; then compute what happens if you check *hourly for two weeks* (hint: it gets worse — try 50 check points). When you can say "in my simulation, optional stopping inflated false positives from 5% to X%," the peeking question is permanently answered in your head.

**The fix (know the menu, pick honestly):**
- **Fixed-horizon:** decide N in advance (Part 1), look once. The default; what the rest of this lab assumes.
- **Sequential tests** (mSPRT, alpha-spending): valid early stops at the cost of a higher N — real systems (and honest teams) use these when early-stopping matters. Know the name; don't improvise one.

---

## Part 3 — Guardrails and the AA test (20 min)

Your +1% CTR win means nothing if latency p99 doubled or revenue-per-user dipped. Design the full test on paper for *your* Lab a2 recommender:

1. **Primary metric:** the one number that justifies existence (e.g., 7-day retention, or watch-time for a video app). One primary, chosen *before* the test.
2. **Guardrail metrics** (fail the test if degraded): latency p99, error rate, thumbs-down rate, unsubscribe/cancel. Guardrails are one-sided: you don't win by improving them, you lose by hurting them.
3. **AA test:** before the B, run A vs A. A healthy AA shows ~5% "significant" differences across metrics. If your AA "wins," your randomization or your metrics pipeline is broken — and you just found out cheaply.

**Checkpoint 3:** List your primary + three guardrails for the Lab a2 recommender, with a threshold for each guardrail ("cancel if p99 > 300 ms"). Then answer: your test shows CTR +2% (p=0.01) and thumbs-down +0.3pp (p=0.04). Ship? The defensible answer: no — a guardrail tripped; investigate what the new recommender is doing to *content quality* (this is the popularity-vs-diversity tradeoff from Lab a2 showing up as a business event).

---

## Part 4 — Interlude: the metrics-chain problem (10 min)

One paragraph to read slowly. CTR is a *proxy*. The business cares about retention/revenue. Proxies are measurable weekly; outcomes move quarterly. Every shipped ML feature lives in this gap: **you optimize the proxy and pray it tracks the outcome.** When someone asks "why not test on revenue directly?", your answer is now experience-backed: sample size. Revenue is sparse and noisy; detecting +1% on revenue can need 10–100× the users of detecting +1% on clicks. Compute the ratio with Part 1's function for revenue-like rates (e.g., base 0.5%) vs CTR (5%) — the numbers argue for you.

---

## Explain it back

1. Why does optional stopping inflate false positives? Explain to a PM in three sentences, no math.
2. Your sample-size calc says 3 weeks; the business wants a decision Friday. Give the honest menu of options.
3. What makes a metric a guardrail rather than a primary? Who owns each?
4. A/A test "won" with p=0.001. What is broken, and in what order do you check things?

## Extensions

- **Ratio metrics:** repeat Part 1 with revenue-per-user (heavy-tailed) — required N explodes. Now you know why big-tech invented variance-reduction tricks (CUPED). Implement a toy CUPED: use pre-experiment activity as a covariate; watch N shrink.
- **Sequential test:** implement mSPRT with `mix` of likelihood ratios — or read Netflix's sequential-testing writeups and summarize the tradeoff in three sentences (that summary is the interview answer).
- **Novelty effect:** simulate a lift that decays over 14 days (day-1 CTR +5% → day-14 +1%). Your fixed-horizon test at day 7 overestimates by how much? Write the "minimum two-week test" rule in your journal with your own evidence.

## What you can now claim in an interview

"I compute sample size before shipping, verify power by simulation, and can show you a 1,000-run experiment where optional stopping inflated false positives from 5% to [your number]%. I design tests with one primary metric, guardrails with thresholds, and an AA pass — because I've seen every one of these save a bad decision."
