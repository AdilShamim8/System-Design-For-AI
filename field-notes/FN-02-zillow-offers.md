# FN-02 — Zillow Offers: When the Model's Error Bars Are Bigger Than the Business

**Date:** Nov 2021 · **Category & chapters below**

## What happened

Zillow, the US real-estate marketplace, ran "Zillow Offers" — an iBuying business that purchased homes directly from sellers using Zestimate-based pricing models, made light repairs, and resold them. On 2 November 2021, Zillow announced it would shut the program down, take a write-down exceeding $500M ($304M in Q3 plus anticipated further losses), and cut about 25% of its workforce (~2,000 people). The core failure: the models systematically under-pricing risk in a volatile market — buying homes at prices the market would not support as mortgage rates and demand shifted, compounded by a feedback loop where the algorithm's own buying influenced local prices. Executives publicly acknowledged the forecasting error and the difficulty of separating signal from the "lab experiment" of the model participating in the market.

## Why it happened (the design lens)

This is not a "bad model" story — Zestimates are among the most-studied home-price models in existence. It is a **decision-asymmetry story**: the business converted point forecasts into irreversible purchases at scale. A model that is 96% accurate on price is *still wrong on thousands of homes out of every 100K*, and when each wrong decision costs you tens of thousands of dollars on a house you now own in a cooling market, the error distribution's tails — not its mean — determine solvency. Add the feedback loop (your own bids move the market you're predicting) and the batch-lag problem (models trained on last quarter's prices in a market that turned), and the system failed exactly where systems fail: at the interaction of model error, business structure, and market regime change.

## The design lessons

- **Error bars must meet the decision structure** (Chapter A.4/A.5): point estimates are fine for ranking search results; they are lethal for irreversible purchases. Where decisions are irreversible, you need uncertainty estimates (quantiles — see Lab a6's extension) and position sizing that survives the tail.
- **Feedback loops are a design input** (Chapter A.7, Lab a7): a model whose predictions change the world it predicts requires drift monitoring *of its own footprint* — standard drift detection assumes an exogenous world.
- **Model risk is business risk** (Chapter X.4): the $500M write-down is the cost of treating model error as an engineering detail rather than a P&L line. Sizing exposure to model error is a systems-engineering responsibility.
- **Regime change breaks retraining cadence** (Lab a7): a market that turns between training runs will punish any fixed retrain schedule; the runbook needs trigger-based retraining and, more importantly, *humane* circuit breakers (stop buying when inputs leave the training distribution).

## Say it in an interview (the 30-second version)

"Zillow Offers is the cleanest case that model accuracy is a business-risk question, not a modeling question: a great home-price model still has tails, and an iBuyer turns every tail error into an owned house in a falling market — $500M+ of write-down and a quarter of the staff. The fixes are structural: quantile forecasts, position sizing to the error bars, circuit breakers on distribution shift, and monitoring your own market footprint — because your bids move the very prices you predict." 

## Sources

- Widely covered Nov 2021: e.g., CNBC and The Wall Street Journal reporting on the shutdown call and write-down; Zillow's Q3 2021 shareholder letter.
- Context: Chapters A.4–A.5, A.7, X.4; Labs a3 (cost of errors), a6 (quantile forecasts), a7 (drift).
