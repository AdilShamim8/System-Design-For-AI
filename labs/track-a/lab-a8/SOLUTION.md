# Lab a8 — Worked Solution and What the Numbers Mean

## Expected results (our runs, 1,000 simulations each)

| Measurement | What we got |
|---|---|
| Required N per arm (5% CTR, +1% rel., α=.05, power .8) | ≈ 780,000 users |
| Same, +2% relative | ≈ 195,000 (÷4 — the 1/lift² law) |
| Same, +5% relative | ≈ 31,000 |
| Simulated power at N | ≈ 78–82% (formula verified) |
| **Peeking (daily checks, 10 days, no true effect)** | **≈ 18–25% false positives** |
| Peeking, hourly for 2 weeks | ≈ 30–40%+ |

## The five lessons hidden in those numbers

1. **Small effects are the expensive ones.** 780K users per arm to reliably see +1% — that's a *large* product. The 1/lift² law means "detect everything" is a strategy only the biggest platforms can afford, and even they use variance reduction (CUPED extension) to cheat the exponent. When a business asks "why can't we just test it?", the honest answer is a number from this lab.
2. **Peeking is a sin of procedure, not math.** The p-value is only valid for the *pre-registered* stopping rule. Look early and the "5%" printed on the dashboard is fiction — your simulation turned it into ~20%. The tell in real life: dashboards with real-time p-values and no pre-registered horizon. You now recognize that dashboard as a false-positive factory.
3. **The A/A test is the cheapest debugger in experimentation.** If randomization, logging, or metric pipelines are broken, the AA test says so *before* you spend six weeks on a B/B test that "wins." Teams that skip AAs are teams that ship ghosts.
4. **Guardrails are contracts, not vibes.** "Cancel if p99 > 300 ms" is enforceable; "make sure latency is fine" is a feeling. Your Checkpoint 3 table is the artifact — write thresholds *before* launch, in the experiment doc, where a colleague can check them.
5. **Proxies are a sample-size compromise, and everyone should admit it.** You test CTR because testing revenue needs 10–100× the users (compute it — the extension makes you). The mature framing: "we ship on the proxy, we *monitor* the outcome, and we periodically validate that the proxy still tracks the outcome" — that last clause is what separates an experimentation culture from a cargo cult.

## Common mistakes

- **Simulating +1 percentage point** (5% → 6%) instead of +1% relative (5% → 5.05%). The former is a 20× easier effect; your N will be ~400× too small and every subsequent number will mislead you. If your Part-1 N is under 20K, you made this mistake.
- **One-sided tests everywhere.** One-sided halves your N *if* you're honestly only interested in one direction — but you also blind yourself to the new feature being *worse*. Guardrails are the right place for one-sided; primaries usually aren't.
- **Peeking "just to monitor."** Looking is harmless; *deciding based on looking* is the sin. The practical fix: dashboards show counts and trends during the run, p-values only at the pre-registered horizon (or use a real sequential test).
- **Ignoring multiple metrics.** 20 metrics at α=0.05 → ~64% chance at least one is "significant" by noise. This is why there's *one* primary, and why secondary metrics are exploratory language ("we observed"), never confirmatory language ("we proved").

## Interview lines this lab earns you

- "I simulated my own experiment platform: at +1% relative lift on a 5% metric, I need ~780K users per arm for honest 80% power — so when a stakeholder wants that answer in a week, I show the N table, not an opinion."
- "Optional stopping took my false-positive rate from 5% to about 20% in a thousand simulated A/A tests. That's why I pre-register horizons, run A/A first, and treat real-time p-value dashboards as a warning sign, not a feature."
