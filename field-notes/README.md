# Field Notes — Real Production AI Failures

Twelve documented incidents where AI systems failed in public, with dates, causes, and the design lesson each one buys you. These are your **war stories** — a candidate who says "that's the Air Canada failure mode, and here's the guardrail layer that prevents it" sounds like someone who has been on call, even before they have been.

**How to read them:** one per breakfast. For each, learn (1) the two-sentence version of what happened, (2) the root cause in design terms, (3) the one mechanism that would have prevented it. That's the retrieval key you need under interview pressure.

| # | Incident | Year | The one-line lesson |
|---|---|---|---|
| [FN-01](./FN-01-amazon-recruiting-bias.md) | Amazon's recruiting model penalized "women's" | 2018 | Training data encodes history, including its injustices |
| [FN-02](./FN-02-zillow-offers.md) | Zillow Offers: the model that killed a business unit | 2021 | Model error must be priced against decision asymmetry |
| [FN-03](./FN-03-microsoft-tay.md) | Tay corrupted in under a day | 2016 | Adversarial users are part of your input distribution |
| [FN-04](./FN-04-air-canada-chatbot.md) | The chatbot that lost in court | 2024 | You are liable for what your deployed model says |
| [FN-05](./FN-05-compas-fairness.md) | COMPAS and the two definitions of fairness | 2016 | Calibration and error-rate balance can't both hold |
| [FN-06](./FN-06-meta-galactica.md) | Galactica pulled in three days | 2022 | Authoritative tone is a liability when accuracy matters |
| [FN-07](./FN-07-chevy-one-dollar-car.md) | The Chevy dealership that (almost) sold a car for $1 | 2023 | Prompt injection attacks your contract, not your model |
| [FN-08](./FN-08-dpd-swearing-bot.md) | DPD's swearing chatbot | 2024 | Guardrails are layers, and the user-facing one is last |
| [FN-09](./FN-09-nyc-mycity.md) | NYC MyCity advised businesses to break the law | 2024 | Evaluation must cover the cases that create liability |
| [FN-10](./FN-10-google-photos-labels.md) | Google Photos mislabeled people | 2015 | Long-tail errors need humility and human escalation |
| [FN-11](./FN-11-netflix-prize.md) | The $1M model that never shipped | 2007–09 | Model quality is not system value |
| [FN-12](./FN-12-bing-sydney.md) | Sydney, the persona that emerged | 2023 | Long conversations drift; bound the state space |

**A honesty note on sources:** each note lists the primary reporting we relied on (publication, title, year — with links where stable). Details are as reported at the time; when accounts differ, we follow the primary investigation. If you find an error, open an issue — precision about failures is the whole point of this folder.

**How they connect to the course:** every note names its chapters and labs. After reading, you should be able to trace each incident to a mechanism you have *built* in a lab — the strongest way to remember a lesson is to have implemented its prevention.
