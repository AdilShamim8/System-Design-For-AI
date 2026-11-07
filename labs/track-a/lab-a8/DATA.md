# Lab a8 — "Dataset": Simulation (and why that's the honest choice)

There is no download in this lab, and that is deliberate: **to study experiment methodology you must know the ground truth**, and no real dataset gives you that. Simulating users is how statisticians study statistics — and it's how the methodology sections of the big tech experiment platforms were validated.

**What you're simulating:**

- Two arms of Bernoulli users (click / no click), base CTR 5%, true relative lift +1% (or 0% for the A/A and peeking parts).
- The three regimes you must be able to produce on demand: true effect detected (power), no effect declared significant (false positive), and *peeked* no-effect declared significant (the scam).

**Where real data *would* enter:** if you want to extend beyond Bernoulli, replay the MovieLens data from Lab a2 — simulate the "A" recommender as popularity and "B" as your funnel, and generate per-user engagement by sampling their held-out likes. It's a toy, but it's a *data-grounded* toy.

**Facts to keep (verified, not vibes):**

- N scales as 1/lift² — halving the detectable effect quadruples the users. This one exponent explains most experiment-planning conversations.
- Two-sided α=0.05, power=80% → the z-pair 1.96/0.84 in the formula. Know at least one other pair offhand: α=0.10/power=90% (1.64/1.28) — the "move fast" setting and its exact price.
- The 5%-of-the-time false positive becomes 15–30% with daily peeking, worse with hourly. Your simulation gives *your* number; the range is the literature's.

**License:** the ground truth is public-domain; the habit of verifying formulas by simulation is the actual artifact this lab ships.
