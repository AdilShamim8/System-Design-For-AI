# Security Policy

## Reporting a Vulnerability

If you find a technical inaccuracy that could lead readers to build insecure AI systems, report it privately rather than opening a public issue.

Email: security@system-design-for-ai.example

Include: which chapter, the specific concern, what the correct guidance should be, and supporting sources.

## What's Security-Relevant

- A chapter recommending disabling guardrails without explaining tradeoffs
- A code sample with a known vulnerability (prompt injection, SQL injection)
- A factually wrong claim about a model's safety properties
- A recommendation that could lead to data leakage in multi-tenant systems

## What's NOT Security-Relevant

- Typo fixes (open a PR)
- Style complaints (open an issue)
- Pedagogical disagreements (open a discussion)


---

## AI-specific security notes (2026 expansion)

This repository is content-only — no secrets, no deployed services — but the course teaches systems that hold them. Two notes:

- **If you find a vulnerability in the course's example code** (e.g., an unsafe pattern in a lab that could be dangerous if copied into production — the `eval` guard in Lab c1's calculator is a deliberately discussed example), open an issue with the `[security]` label so the *teaching* can be corrected. Example code is read as production advice; that responsibility is taken seriously.
- **Field notes FN-07 and FN-08, and Lab c5's guardrail stack**, are the canonical references for how this course treats prompt injection and agent safety: layered defenses, capability scoping, budgets outside the model, and honest residual-risk statements.
