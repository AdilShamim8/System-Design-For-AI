# FN-04 — Air Canada's Chatbot Lost in Court

**Date:** Dispute Nov 2022; ruling Feb 2024 · **Category & chapters below**

## What happened

Jake Moffatt asked Air Canada's website chatbot about bereavement fares after his grandmother's death. The chatbot told him he could book the full-price flight and claim the bereavement discount retroactively — information that was wrong; Air Canada's actual policy did not allow it. When the airline refused the refund (~$650 CAD), Moffatt took it to British Columbia's Civil Resolution Tribunal. Air Canada's defense included arguing the chatbot was "a separate legal entity" responsible for its own statements. The tribunal rejected that outright (Moffatt v. Air Canada, 2024 BCCRT 149): a company's website chatbot is part of its website, and the company is responsible for what it says. Air Canada was ordered to pay the difference plus fees — and subsequently disabled the chatbot.

## Why it happened (the design lens)

The design failure is treating a **generative system as if its outputs were marketing copy** — reviewable, versioned, guaranteed. A chatbot that composes answers freely will, at some rate, compose *wrong* answers with the company's authority behind them; hallucination is a distribution with a tail, and the tail has legal exposure. The airline had effectively deployed an unmonitored, un-versioned mouthpiece bound to nothing, then argued in court that it wasn't responsible for it — an argument that failed because, from the customer's view, the chatbot *is* the airline. Liability follows deployment, not intent.

## The design lessons

- **You are your chatbot's claims** (Chapter B.8, Labs b2/b4): hallucination rate is a business-risk metric. Measure refusal and faithfulness on adversarial questions *before* launch — and keep measuring (x1).
- **RAG ≠ immunity, grounding ≠ guarantee** (Lab b2 Part 5): the incident is exactly the "helpfully answers from memory instead of sources" failure. Citations, strict grounding instructions, and a *measured* refusal rate are the mitigation stack — and legal review of what the bot may promise (pricing, refunds, policies) is the layer above.
- **Log everything the bot says** (Chapter X.3): Air Canada couldn't even dispute what its bot had said — the customer had the screenshots. Full transcript logging with versions (b4's discipline) is the minimum audit trail.
- **Scope the autonomy** (Lab c2's reversibility grid): statements about money and policy are irreversible-cheap to say, expensive to honor. They belong behind retrieval-verified answers or human confirmation — the same grid that gates agent tools gates chatbot claims.

## Say it in an interview (the 30-second version)

"Air Canada is the case that ended 'it's just a chatbot' as a defense: a tribunal held the airline responsible for its bot's invented refund policy — the bot was ruled part of the website, not a 'separate legal entity.' Every generative system that speaks for a company needs faithfulness and refusal metrics measured pre-launch, transcript logging with versions, and money/policy claims either retrieval-verified or human-gated. I treat that as a deployment requirement, not a nice-to-have — my cap1 gates encode it." 

## Sources

- Tribunal decision: Moffatt v. Air Canada, 2024 BCCRT 149 (BC Civil Resolution Tribunal, Feb 2024).
- Coverage: BBC News, The Guardian, Ars Technica (Feb–June 2024).
- Context: Chapters B.8, X.3; Labs b2, b4; capstone cap1.
