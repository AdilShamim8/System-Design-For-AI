---
chapter_id: "B.1"
title: "Prompting as a Design Surface"
topic: "Context engineering"
track: genai
bloom_stage: ["remember", "understand", "apply", "analyze", "evaluate", "create"]
est_read_minutes: 16
prerequisites: ["B.0"]
teaching_goal: "Treat prompting as a system design surface: system prompts, few-shot, tool schemas, structured output, prompt-as-code discipline."
status: stable
last_updated: 2026-08-12
---

# Prompting as a Design Surface

A prompt is not a question. It is a program — written in natural language, interpreted by a neural network, debugged by rephrasing. The prompt is the API. This chapter is about treating it that way.

Most people treat prompting as "talk to the AI." System designers treat it as "program the AI." The shift is fundamental: a prompt is an API, with inputs, outputs, behavior, and versioning. A prompt that isn't versioned, tested, and reviewed is a prompt that will break in production.

---

## Remember — name it

- **System prompt** — instructions to the LLM about persona, rules, and constraints. Stable across requests. "You are a helpful support agent. Never invent policies. If you don't know, say so." Typically 500-4000 tokens.
- **User prompt** — the actual question or request. Varies per request. "How do I reset my password?"
- **Few-shot prompting** — including examples in the prompt to guide the model's output format and behavior.
- **Tool schema** — JSON description of tools the LLM can call: name, description, input parameters, output format.
- **Structured output** — forcing the LLM to emit JSON instead of free-form text. Enables composition with traditional software.
- **Prompt-as-code** — versioning prompts in git, testing them against eval suites, reviewing them in PRs.

---

## Understand — the prompt as API

### System prompt vs. user prompt

The system prompt sets the rules; the user prompt asks the question. Separating them matters because:
1. The system prompt is stable across requests (and can be cached — see X.4).
2. The user prompt varies per request.
3. Most LLM APIs treat them differently — the system prompt has higher priority in the model's attention.

A good system prompt is:
- **Specific**: "You are a customer support agent for Acme Corp, a SaaS company that sells project management software" (not "You are a helpful assistant").
- **Constraining**: "Answer only from the provided context. If the context doesn't contain the answer, say 'I don't know.'" (not "Try to be helpful").
- **Brief**: 500-1500 tokens. Longer prompts cost more and can dilute the signal. Trust the model — you don't need to spell out every edge case.

### Few-shot prompting

Include 2-5 examples in the prompt to teach the model the desired format, tone, and behavior:

```
Examples:
User: How do I reset my password?
Assistant: {"answer": "Click 'Forgot Password' on the login page...", "source": "Account Security page", "confidence": 0.95}

User: What are your business hours?
Assistant: {"answer": "Our support team is available 24/7...", "source": "Contact page", "confidence": 0.99}

Now answer this:
User: How do I cancel my subscription?
```

Few-shot teaches by example. It's often more effective than instructions alone — the model learns the pattern from the examples, not from a description of the pattern. But it costs tokens: every example is paid on every request.

### Structured output

Instead of free-form text, ask the LLM to emit JSON:

```json
{"answer": "To reset your password...", "source": "Account Security", "confidence": 0.95}
```

This makes the output machine-parseable, enabling composition with traditional software. Most modern LLM APIs support "JSON mode" or "structured output" with schema enforcement — the model is guaranteed to produce valid JSON matching your schema.

### Prompt-as-code

Prompts are versioned in git, tested against eval suites, reviewed in PRs. A prompt change can break production as surely as a code change. Treat prompts with the same discipline as code:
- Version control (git)
- Testing (eval suites — see B.8)
- Code review (PRs)
- Rollback (revert to previous version if the new prompt degrades quality)
- A/B testing (50% of traffic sees the old prompt, 50% sees the new)

---

## Apply — design a prompt for a customer support bot

```
System: You are a customer support agent for Acme Corp.
Answer user questions using ONLY the provided context.
If the context doesn't contain the answer, say "I don't know — let me connect you with a human."
Never invent policies, prices, or features.
Always cite the source document for your answer.
Respond in JSON: {"answer": "...", "source": "...", "confidence": 0.0-1.0}

Context:
[retrieved chunks from knowledge base]

User: [user's question]
```

This prompt has: persona (support agent), constraints (use only context, cite sources), behavior rules (handle unknowns), structured output (JSON), and a retrieval slot (context). Each element is a design decision.

---

## Analyze — diminishing returns

Prompt engineering has diminishing returns. A well-structured prompt with clear instructions and examples gets you 90% of the way. Spending hours tweaking word order might get you to 92%. The 2% gain is rarely worth the time — better to invest in retrieval quality (B.2-B.5), model selection (B.6), or evaluation (B.8).

The exception: prompts for high-stakes applications (medical, legal) where every percentage point matters. In those cases, invest in comprehensive eval suites and systematic prompt optimization.

---

## Evaluate — when a prompt isn't working

When a prompt isn't working, the instinct is to tweak the prompt. Often the problem is upstream:
- Bad retrieval (in RAG) — the retrieved chunks don't contain the answer.
- Wrong model choice — a small model can't handle the task.
- Insufficient context — the prompt doesn't give the model enough information.
- Task is too hard for the model — some tasks require multi-step reasoning (agents, not single prompts).

Diagnose before tweaking. "The prompt needs work" is sometimes true and sometimes a scapegoat for deeper architectural issues.

---

## Create — design a prompt for a coding review assistant

Design a prompt for an LLM that reviews pull requests. What persona? What rules? What structured output? How do you handle subjective feedback? How do you prevent the LLM from being overly critical or overly lenient?

Consider: code review is subjective. "This variable name is unclear" is opinion, not fact. How do you structure the output to distinguish objective issues (bugs, security vulnerabilities) from subjective suggestions (style, naming)?

---

## A common misconception

**"Prompt engineering is just writing good instructions."** It's more than that. It's treating the prompt as a program: with inputs, outputs, behavior, versioning, testing, and review. A prompt that isn't versioned, tested, and reviewed is a prompt that will break in production — and you won't know why.

---

## Explain it back

> "A prompt is a _____, not a _____. The system prompt is _____; the user prompt is _____. Few-shot prompting works by _____. Structured output is important because _____. The prompt-as-code discipline means _____."

---

## References

- **Anthropic (2024), "Prompt Engineering."** https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering
- **OpenAI (2024), "GPT Best Practices."** https://platform.openai.com/docs/guides/prompt-engineering
- **White, J., et al. (2023), "A Prompt Pattern Catalog for Enhancing Prompt Engineering with ChatGPT," arXiv:2302.11382.** https://arxiv.org/abs/2302.11382
- **Wei, J., et al. (2022), "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models," NeurIPS 2022.** arXiv:2201.11903 — https://arxiv.org/abs/2201.11903
