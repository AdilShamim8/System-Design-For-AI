# FN-09 — NYC's MyCity Chatbot Advised Businesses to Break the Law

**Date:** March 2024 · **Category & chapters below**

## What happened

New York City launched a chatbot on its MyCity business-support portal (built on Microsoft's Azure OpenAI stack) to help small businesses navigate regulations. The Markup's investigation (March 2024) documented it confidently giving *illegal* advice on questions with legally defined answers: telling employers they could take workers' tips, that landlords could refuse tenants based on income source (illegal under NYC law), and other answers contradicting the very city rules it existed to explain. The city initially defended the tool as a "generative AI… work in progress"; officials later committed to fixes. The bot remained up for months as the story continued developing.

## Why it happened (the design lens)

A government chatbot whose job is *regulatory accuracy* is a **liability-shaped product**: its answers create action, its authority is institutional, and its failure mode (confident legal misinformation, on record, from the government) is worse than no service — it's the state advising law-breaking. The engineering gap was eval coverage: the system was not systematically evaluated on the questions where wrong answers carry legal consequence. General-purpose helpfulness ≠ domain correctness; a "work in progress" label does not survive contact with a business that relied on the answer.

## The design lessons

- **Evaluate on the liability surface, not the FAQ surface** (Chapter X.2, Labs b4/c5): your eval set must over-represent the questions where wrong answers cost money, rights, or safety. "Average answer quality" is not the metric that governs a regulatory bot — *worst-case legal accuracy* is.
- **RAG with authoritative sources + citations, or don't ship** (Chapter B.2, Lab b2): for legal/policy domains, answers should be grounded in the actual regulation with citations, and refusal should be the default when grounding fails. The MyCity failures are the un-grounded-generation failure mode (FN-04, FN-06, same family).
- **"Beta" is not a risk management strategy** (Chapter X.5): launching an unguarded system with a disclaimer moves no liability and protects no user. Scope the deployment to what your evals cover — a bot that answers only *verified* questions with citations is a smaller, shippable product.
- **Public systems get adversarial attention** (FN-03, FN-07): journalists are red-teamers with deadlines. Run the attack/edge-case set before the press does.

## Say it in an interview (the 30-second version)

"NYC's MyCity bot is the Air Canada lesson for government: a regulatory helper that hallucinates illegal advice — take workers' tips, refuse tenants on income source — isn't a quality bug, it's a liability engine. My rule from the labs: in legal/policy domains, you ship retrieval-grounded, cited answers with refusal-on-ungrounded, and your eval set over-represents exactly the questions where being wrong breaks the law. If you can't meet that bar, ship a smaller product that can." 

## Sources

- The Markup, Colin Lecher, "NYC's New Chatbot Gets Caught Advising Businesses to Break the Law" (March 2024) — https://themarkup.org/
- Follow-up coverage: The Verge, City & State NY (spring 2024).
- Context: Chapters X.2, B.2; Labs b2, b4, c5.
