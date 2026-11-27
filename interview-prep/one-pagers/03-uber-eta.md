# 03 — Uber's ETA / Dispatch (forecasting + matching at city scale)

**The system in three sentences.** Match riders to drivers in seconds and quote an honest arrival time — a real-time forecasting problem wearing a marketplace costume. The system: location-sharded services, per-zone-and-minute demand/supply forecasts feeding a matching optimizer, with the forecast's MAE priced directly into UX trust (a wrong ETA is a broken promise). It's the canonical 'ML inside a real-time marketplace' design.

## The spine (draw it in 60 seconds)

```
riders/drivers → location shards (geohash) → live supply/demand maps
forecasts: per-zone × per-horizon (lags, hour-of-week, events, weather)
matching: batch-window optimizer (not greedy) → assignments + ETAs
             ↑ realized trips feed back: forecast retraining loop ↑
```

## The numbers to carry

a6 lab: the forecast features must be point-in-time (a leaky rolling feature inflated MAE 50-60 percent) · global GBT with zone-as-feature beats per-zone models at scale (Q-ML-4) · batch-window matching beats greedy at peak (the classic result) · MAE by zone is the dashboard, not global MAE

## The failure modes that get probed

Spiky demand (events, weather — regime shifts the model can't see; layered rules help) · cold zones (sparse history: spatial pooling of training data) · the forecast-loop feedback (pricing changes rider behavior — the two-sided feedback FN-02's shape) · driver-side gaming

**Interviews this arms you for:** Q-ML-4, drill bank (the forecasting drills) · the 'design dispatch for X' family

**The AI-era twist (say it before they ask):** The classic features were hand-crafted; the modern layer adds learned representations and LLM-assisted anomaly notes — but point-in-time correctness remains the whole game, and that's the thing to say.
