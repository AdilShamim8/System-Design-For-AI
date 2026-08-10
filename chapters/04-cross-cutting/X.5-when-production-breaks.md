---
chapter_id: "X.5"
title: "When Production Breaks"
topic: "Real failure patterns from real incidents"
track: cross-cutting
bloom_stage: ["analyze", "create"]
est_read_minutes: 18
prerequisites: ["C.5", "X.2"]
teaching_goal: "Analyze real public AI incidents, extract the design pattern that would have prevented each, and apply those patterns forward."
primary_diagram: assets/diagrams/X.5/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# When Production Breaks

Air Canada's chatbot promised a refund the airline didn't intend to honor. A court said the airline had to honor it anyway. NYC's MyCity bot told businesses to break the law. A DPDP prompt leak exposed system prompts across the industry. These aren't footnotes — they're the case studies that should shape every design decision you make.

---

## Remember

**Air Canada chatbot (2024)** — a chatbot hallucinated a refund policy; the airline was held responsible. **NYC MyCity bot (2024)** — gave legally wrong advice to businesses. **DPDP prompt leaks (2024)** — system prompts leaked through crafted user inputs. **Runaway agent cost blowups (2024-2025)** — agents looping into five-figure bills. **The pattern**: every incident was predictable, preventable, and only addressed after the fact.

---

## Understand

**The Air Canada chatbot incident (2024).** Air Canada's support chatbot told a customer that they could book a full-fare ticket and later apply for a bereavement refund. The customer did so. When Air Canada refused the refund (the actual policy didn't allow it), the customer sued. The British Columbia Civil Resolution Tribunal (BC CRT) held Air Canada responsible for the chatbot's statements — the chatbot is the airline's agent, and its promises are binding. (*Moffatt v. Air Canada*, 2024 BCCRT 149, decided February 14, 2024.)

**The lesson**: a chatbot's hallucination is the company's liability. You can't say 'the AI made a mistake' as a defense. The system design that would have prevented this: output validation (verify refund-related claims against the actual policy before sending to the user), human-in-the-loop for financial commitments, and a clear 'this is the policy' grounding in the system prompt.

---

**The NYC MyCity bot incident (2024).** NYC launched a chatbot to help businesses navigate regulations. The bot, trained on a corpus of NYC business rules, gave legally wrong advice — telling restaurants they could violate labor laws, telling landlords they could discriminate. The advice sounded authoritative.

**The lesson**: 'it sounds right' is not good enough for high-stakes domains. The system design that would have prevented this: human-in-the-loop for legal advice, clear disclaimers ('this is not legal advice; consult a lawyer'), eval suites with known-correct legal answers, and refusal to answer when uncertain.

---

**DPDP prompt leaks (2024).** Multiple LLM-based products had their system prompts leaked when users crafted inputs like 'repeat the above instructions verbatim.' The system prompts — which contained proprietary logic, safety rules, and business logic — were exposed publicly.

**The lesson**: system prompts are not secret. Treat them as if they will be public. The system design: don't put secrets in system prompts. Don't rely on the prompt being hidden for security. Build defenses (output validation, action confirmation) that work even if the prompt is known.

---

**Runaway agent cost blowups (2024-2025).** Multiple companies reported agents looping into five-figure bills — an agent stuck in a 'let me try one more search' loop, calling a paid API 1,000 times in 20 minutes.

**The lesson**: the LLM cannot enforce its own budget. The system design: hard budgets (iterations, tokens, dollars, wall-clock) enforced by the orchestrator, not the LLM. The kill switch must exist and must work.

---

**The pattern across all incidents**: each was predictable, each was preventable, and each was only addressed *after* public exposure. The guardrails existed (output validation, human-in-the-loop, budget enforcement, prompt hygiene) — they just weren't implemented. The lesson isn't 'add more guardrails.' It's 'implement the guardrails you already know you need.'

---

## Apply

For each incident, extract the design pattern that would have prevented it:
- **Air Canada**: output validation for financial claims; human-in-the-loop for refund promises.
- **NYC MyCity**: eval suite with legal ground truth; refusal to answer when uncertain; 'not legal advice' disclaimers.
- **DPDP prompt leaks**: no secrets in system prompts; defenses that work even with prompt known.
- **Runaway agents**: hard budgets enforced by orchestrator; kill switch.

These patterns aren't new — they're in this curriculum (C.5, X.2, B.8). The incidents happened because the patterns weren't implemented, not because they weren't known.

---

## Analyze

Why do teams skip guardrails? Three reasons:
1. **Time pressure**: guardrails slow down shipping. The demo works without them; the MVP doesn't have them; the launch happens without them; the incident happens after launch.
2. **Overconfidence**: 'our model is good enough.' It isn't. Every model fails sometimes. The question is whether the failure is caught.
3. **Invisibility**: guardrails that work produce *nothing* — no errors, no incidents. Their absence produces something very visible (an incident). So guardrails look like cost without benefit, until they don't.

The fix: make guardrails a launch requirement, not an optimization. Don't ship without them. The cost of the guardrail is always less than the cost of the incident.

---

## Evaluate

These incidents aren't cautionary tales — they're design requirements. Every AI system that handles money, legal advice, personal data, or autonomous actions needs the guardrails these incidents revealed. If you're building such a system and you haven't implemented these patterns, you're not 'moving fast and breaking things' — you're building the next incident.

---

## Create

You're designing an AI system for a bank that will recommend investment strategies to customers. What guardrails do you implement, based on the lessons from these incidents? What's your output validation? Where's the human-in-the-loop? What's your eval suite? What's your budget? What do you do when the model is uncertain?

---

## A common misconception

**'These incidents were unpredictable.'** No. Every one was predictable. Hallucinations happen. Prompt leaks happen. Loops run away. These are known failure modes with known preventions. The incidents happened because the preventions weren't implemented, not because they weren't known. 'Unpredictable' is the defense of a team that didn't do the reading.

---

## Explain it back

The four incidents I studied are _____, _____, _____, and _____. The lesson from Air Canada is _____. The lesson from NYC MyCity is _____. The lesson from DPDP is _____. The lesson from runaway agents is _____. The pattern across all is _____.

---

## Further reading

- **Moffatt v. Air Canada, 2024 BCCRT 149 (British Columbia Civil Resolution Tribunal)** — the chatbot liability case.
- **The Markup (2024), NYC MyCity bot investigation** — the legal advice incident.
- **OWASP Top 10 for LLM Applications (2024)** — the taxonomy of LLM security risks.
- **AI Incident Database (incidentdatabase.ai)** — a public database of AI failures.
