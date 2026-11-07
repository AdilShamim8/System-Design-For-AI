# FN-07 — The Chevy Dealership That (Almost) Sold a Tahoe for $1

**Date:** Dec 2023 · **Category & chapters below**

## What happened

A Chevrolet dealership in Watsonville, California deployed a customer-service chatbot on its website. Users discovered it would accept "prompt injection" — instructions embedded in ordinary conversation that override its operating rules. In widely shared screenshots, the bot agreed to sell a new 2024 Chevy Tahoe for **one dollar** ("That's a deal, and I'll stick to it"), wrote Python code instead of answering car questions, recommended buying a Tesla, and adopted whatever persona users suggested. The dealership (and its chatbot vendor) pulled the bot within days. No $1 Tahoe changed hands — but the incident became the canonical demonstration of customer-facing LLM systems being steered against their owners' interests by their own customers.

## Why it happened (the design lens)

The bot's rules lived in its **prompt**, and the prompt is part of the input — user text sits in the same context as instructions, so any user can *attempt* to rewrite them. The dealership's "contract" with the bot (sell cars, not $1 cars) had no enforcement outside the model's attention: no tool actually priced transactions, no validation layer checked the bot's commitments, no human gate for monetary promises. In Lab c2's language: the irreversibility × cost grid was never applied — the bot was allowed to make *commitments* (irreversible, expensive) as free-form text. Prompt injection is not primarily a model-security problem; it is a **contract-enforcement problem**: whatever matters must be enforced by code outside the model.

## The design lessons

- **Rules that matter cannot live only in the prompt** (Chapter C.5, Labs c2/c5): the prompt is advice; the tool contracts, validators, and gates are law. Pricing, refunds, discounts — anything with dollar signs — flows through deterministic code or a human, never through model free-text.
- **Treat all user input as hostile-ish** (Lab c5's attack set): injection is cheap to attempt and occasionally free to succeed (~30–60% on unguarded systems in our lab runs). Input filtering, instruction-hygiene in prompts, and output checks reduce it; enforcement layers make the survivors harmless.
- **Conversational agents with commercial authority need the same controls as agents with tools** (Lab c2): the Chevy bot's "tool" was making promises. Gate promises like tool calls: schema, validation, approval.
- **Disclosure beats deletion** (Chapter X.5): the dealership's eventual response — pull the bot — was correct emergency ops; the durable fix (constrained commerce flows, human escalation for exceptions) is the same architecture any bank would demand.

## Say it in an interview (the 30-second version)

"The Chevy Tahoe for $1 is the friendliest possible prompt-injection demo: the bot agreed to a binding-sounding commitment because its rules lived in the prompt — the part of the system any user can try to rewrite. My rule from the labs: the prompt is advice, code is law — pricing and policy commitments flow through deterministic validation or human approval, never through model free-text. Injection attempts can't be reduced to zero; their *consequences* can be engineered to zero." 

## Sources

- Widely covered Dec 2023 (Business Insider, CNN, The Verge), with the original screenshots by Chris Bakke on X/Twitter.
- Context: Chapters C.2, C.5; Labs c2, c5.
