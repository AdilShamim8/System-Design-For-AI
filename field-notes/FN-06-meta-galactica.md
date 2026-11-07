# FN-06 — Galactica: Pulled in Three Days

**Date:** Nov 15–18, 2022 · **Category & chapters below**

## What happened

Meta AI released Galactica, a 120B-parameter LLM trained on 48M scientific papers, positioned as a tool that could "summarize academic literature, solve math, write scientific code" — effectively offering to draft science. Within three days it was suspended. Researchers documented the model confidently generating fake papers (with plausible authors and citations), fabricated citations, wiki-style articles full of errors presented in authoritative encyclopedic tone, and — in widely shared examples — generating content on sensitive topics (race, homophobia, antisemitism) in the voice of neutral science. The tone was the poison: wrong answers delivered as encyclopedia. Some scientists defended the demo's value; the public consensus after three days of viral counterexamples was that a scientific-looking machine that makes things up is worse than no machine at all.

## Why it happened (the design lens)

Galactica's failure was a **product-framing failure wearing a model-quality costume**. The model was not uniquely bad; it was an LLM, and LLMs hallucinate. What was new: the interface *launders* hallucination into authority — Wikipedia styling, citation formatting, scientific register. No answer-level provenance, no "I don't know" surface, no visible uncertainty, and a launch that put the raw model in front of the exact audience (scientists, journalists) most qualified to break it publicly. Three months later, the same base capabilities launched wrapped in ChatGPT's conversational framing — "I might be wrong, check me" — and took over the world. The delta was UX honesty, not model quality.

## The design lessons

- **Authority is a liability multiplier** (Chapter B.8): the same wrong answer is harmless in a chatty tone and reputation-destroying in an encyclopedia tone. Design the *register* of your product's voice to its verified-accuracy level — citations-or-caveats, not confident prose.
- **RAG, grounding, and refusal exist because of this** (Labs b2, b4): Galactica was pure generation over parametric memory. Every mechanism you built in Track B — retrieval grounding, faithfulness eval, measured refusal — is the engineering answer to the Galactica demo.
- **Launch audience is a design decision** (Chapter C.5): adversarial users find failures fastest; launching an unguarded generative system directly to experts-in-public is running your worst-case eval on the front page. Beta with red-teamers first — the c5 attack-set discipline, at release-planning scale.
- **Hallucination is a rate, not a bug** (Chapter B.0): you don't fix it; you measure it, bound it, and design the interface so the residual rate is visible and recoverable (edits, citations, disclaimers, appeal).

## Say it in an interview (the 30-second version)

"Galactica versus ChatGPT is the purest A/B test in AI product history: roughly the same underlying capability, three months apart — one wrapped wrong answers in encyclopedic authority and died in three days; the other wrapped them in conversational humility and became the fastest-growing product ever. The lesson isn't 'make models honest' — it's that interface honesty, grounding, and visible uncertainty are load-bearing product features, and I evaluate them with the same rigor as accuracy." 

## Sources

- Coverage: The Verge and Ars Technica on the suspension (Nov 2022); Meta AI's Galactica paper (Taylor et al., 2022) and project page.
- Context: Chapters B.0, B.8; Labs b2, b4.
