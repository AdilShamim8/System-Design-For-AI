---
chapter_id: "B.1"
title: "Prompting as a Design Surface"
topic: "Context engineering"
track: genai
bloom_stage: ["understand", "apply"]
est_read_minutes: 16
prerequisites: ["B.0"]
teaching_goal: "Treat prompting as a system design surface: system prompts, few-shot, tool schemas, structured output, prompt-as-code."
primary_diagram: assets/diagrams/B.1/
common_misconception: "See chapter body"
status: stable
last_updated: 2026-08-10
---

# Prompting as a Design Surface

A prompt is not a question. It's a program — written in natural language, interpreted by a neural network, debugged by rephrasing. The prompt is the API. This chapter is about treating it that way.

---

## Remember

**System prompt** — instructions to the LLM about persona, rules, and constraints. **User prompt** — the actual question or request. **Few-shot prompting** — including examples in the prompt. **Tool schema** — JSON description of tools the LLM can call. **Structured output** — forcing the LLM to emit JSON. **Prompt-as-code** — versioning, testing, reviewing prompts like software.

---

## Understand

Most people treat prompting as 'talk to the AI.' System designers treat it as 'program the AI.' The shift is fundamental: a prompt is an API, with inputs, outputs, behavior, and versioning.

**System prompt vs. user prompt.** The system prompt sets the rules: 'You are a helpful support agent. Never invent policies. If you don't know, say so.' The user prompt is the actual question: 'How do I reset my password?' Separating them matters because the system prompt is stable across requests (and can be cached — see X.4), while the user prompt varies.

**Few-shot prompting.** Including examples in the prompt: 'Here are three examples of good responses: [example 1], [example 2], [example 3]. Now respond to this query: [query].' Few-shot teaches the model the desired format, tone, and behavior. It's often more effective than instructions alone. But it costs tokens — every example is paid on every request.

**Tool schemas.** When the LLM can call tools (functions), you describe each tool in JSON: name, description, input schema, output schema. The LLM reads these descriptions and decides which tool to call. Good tool descriptions are the difference between an agent that works and one that fumbles every call.

**Structured output.** Instead of free-form text, ask the LLM to emit JSON: `{"answer": "...", "confidence": 0.85, "sources": ["..."]}`. This makes the output machine-parseable, enabling composition with traditional software. Most modern LLM APIs support 'JSON mode' or 'structured output' with schema enforcement.

**Prompt-as-code.** Prompts are versioned in git, tested against eval suites, reviewed in PRs. A prompt change can break production as surely as a code change. Treat prompts with the same discipline as code: version control, testing, review, rollback.

---

## Apply

Design a prompt for a customer support bot:
```
System: You are a support agent for [company]. Answer user questions
using only the provided context. If the context doesn't contain the
answer, say "I don't know — let me connect you with a human."

Rules:
- Never invent policies, prices, or features.
- Always cite the source document for your answer.
- If the user is angry, acknowledge their frustration first.

Context:
[retrieved chunks from knowledge base]

User: [user's question]

Respond in JSON: {"answer": "...", "source": "...", "confidence": 0.0-1.0}
```
This prompt has: persona (support agent), constraints (use only context, cite sources), behavior rules (handle anger), structured output (JSON), and a retrieval slot (context). Each element is a design decision.

---

## Analyze

Prompt engineering has diminishing returns. A well-structured prompt with clear instructions and examples gets you 90% of the way. Spending hours tweaking word order might get you to 92%. The 8% gain is rarely worth the time — better to invest in retrieval quality, model selection, or evaluation. The exception: prompts for high-stakes applications (medical, legal) where every percentage point matters.

---

## Evaluate

When a prompt isn't working, the instinct is to tweak the prompt. Often the problem is upstream: bad retrieval (in RAG), wrong model choice, insufficient context, or a task the LLM isn't capable of. Diagnose before tweaking. 'The prompt needs work' is sometimes true and sometimes a scapegoat for deeper architectural issues.

---

## Create

Design a prompt for a coding assistant that reviews pull requests. What persona? What rules? What structured output? How do you handle the fact that code review feedback is subjective? How do you prevent the LLM from being overly critical or overly lenient?

---

## A common misconception

**'Prompt engineering is just writing good instructions.'** It's more than that. It's treating the prompt as a program: with inputs, outputs, behavior, versioning, testing, and review. A prompt that isn't versioned, tested, and reviewed is a prompt that will break in production — and you won't know why.

---

## Explain it back

A prompt is a _____, not a _____. The system prompt is _____; the user prompt is _____. Few-shot prompting works by _____. Structured output is important because _____. The prompt-as-code discipline means _____.

---

## Further reading

- **Anthropic (2024), "Prompt Engineering"** — official guide.
- **OpenAI (2024), "GPT Best Practices"** — practical patterns.
- **White et al. (2023), "A Prompt Pattern Catalog for Enhancing Prompt Engineering with ChatGPT," arXiv** — systematic prompt patterns.
