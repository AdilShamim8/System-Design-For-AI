# Contributing to System Design for AI

First: thank you. This project exists because free, beginner-first, storytelling-taught AI system design content should exist. If you're here to help make that real, you're in the right place.

---

## The contract (read this first)

Every chapter in this repo obeys the pedagogy contract in [README.md §Pedagogy contract](./README.md#pedagogy-contract-the-non-negotiables). Read it. Internalize it. If your contribution doesn't live up to it, we'll work with you to get it there — but the contract is not negotiable.

The short version:

1. **Open with a story or concrete scene, never a definition.**
2. **Bloom's Taxonomy in order:** Remember → Understand → Apply → Analyze → Evaluate → Create.
3. **One idea per paragraph, one analogy per concept, plain words over jargon.**
4. **No lecture voice.** Coffee with a sharp friend, not a slide deck.
5. **Never assume unstated prerequisites.** Link to earlier chapters inline.
6. **End with "explain it back,"** not a multiple-choice quiz.
7. **Memorization is a failure mode.** If a section requires memorizing a term to "get it right," rewrite it.

The quality bar: a reader with zero prior exposure can follow it start to finish without opening another tab; every technical claim survives a staff AI engineer's fact-check; it reads aloud without sounding like documentation; and it ends with something the reader could actually explain to someone else.

---

## Ways to contribute

### 1. Fix a typo, broken link, or small error

Open a PR. Small fixes are always welcome and always fast-reviewed.

### 2. Improve a diagram

Diagrams live in [`assets/diagrams/`](./assets/diagrams/), one subfolder per chapter, as editable Mermaid `.mmd` source. To improve one:

1. Edit the `.mmd` file (Mermaid syntax — [the live editor](https://mermaid.live/) is helpful).
2. Verify it renders on GitHub (GitHub renders Mermaid natively in fenced code blocks; the `.mmd` file itself won't preview on GitHub, so include a fenced ```mermaid block in the chapter `.md` that references the same source).
3. Open a PR with both the edited source and a note on what changed and why.

### 3. Write a missing chapter

Many chapters in this repo are currently stubs (frontmatter + story hook + outline + `status: coming-soon`). To write one:

1. Check [ROADMAP.md](./ROADMAP.md) — make sure no one else has claimed it.
2. Comment on the corresponding issue (or open one) to claim it.
3. Read 1–2 existing full-quality chapters first to calibrate the voice. Recommended: [`0.0 The Friday Night Problem`](./00-start-here/0.0-the-friday-night-problem.md) and [`B.2 The Librarian Who Never Forgets`](./02-genai-system-design/b2-the-librarian-who-never-forgets.md).
4. Write the chapter following the structure in [README.md §How to read this repo](./README.md#how-to-read-this-repo).
5. Include at least one Mermaid diagram in `assets/diagrams/{chapter_id}-{slug}/`.
6. Cite real sources (Anthropic, OpenAI, Google, Databricks engineering blogs, arXiv papers) for any claim that comes from them.
7. Date-stamp anything time-sensitive (model names, pricing, protocol versions) — see the Field Notes pattern.
8. Open a PR. Set `status: draft` in the frontmatter; we'll move it to `stable` after review.

### 4. Propose a Field Note

Field Notes are short, dated entries about real production AI failure patterns — hallucination-driven incidents, runaway agent loops, cost blowups, prompt-injection incidents. They follow the same story-first pedagogy as the core curriculum, and they always end with "here's the design pattern that would have prevented this."

To propose one:

1. Open an issue with the title `Field Note: <incident name>`.
2. In the issue, include: the public source (news article, post-mortem, engineering blog), the failure pattern in one sentence, and the design pattern that would have prevented it in one sentence.
3. We'll discuss, then assign it to you to write.

Field Notes are kept visibly dated. The "living document" claim depends on actually updating — target cadence is at least 2 entries per month.

### 5. Add a question to the question bank

Questions live in [`06-question-bank/`](./06-question-bank/), one file per track. Every question must be:

- Framed as a **2–4 sentence scenario**, not a bare "design X" prompt.
- Tagged with `track`, `difficulty` (easy/medium/hard), and `chapters` (the curriculum chapters a learner should read first if they get stuck).
- Accompanied by a "see how a story-taught learner would reason through this" worked answer.

Bare interview-style prompts ("Design a recommendation system") will be rejected — that's what `ai-system-design-guide`'s 122-question bank already does well. We teach, we don't just test.

---

## Technical conventions

- **File naming:** `{chapter_id}-{slug}.md`, all lowercase, hyphenated. Example: `02-genai-system-design/b2-the-librarian-who-never-forgets.md`.
- **Frontmatter:** see [README.md §How to read this repo](./README.md#how-to-read-this-repo). Required fields: `chapter_id`, `title`, `topic`, `track`, `bloom_stage`, `est_read_minutes`, `prerequisites`, `teaching_goal`, `status`, `last_updated`.
- **Diagrams:** Mermaid source (`.mmd`) in `assets/diagrams/{chapter_id}-{slug}/`. Rendered previews not required — GitHub renders Mermaid in fenced code blocks.
- **Cross-references:** link to other chapters by relative path, not by chapter ID alone. Example: `[Module 0](../00-start-here/0.0-the-friday-night-problem.md)`.
- **Citations:** inline Markdown links to the primary source. Prefer the engineering blog or arXiv paper over a secondary write-up.
- **Date-stamping:** anything time-sensitive (model names, pricing, protocol versions) gets a parenthetical date. Example: "GPT-4o pricing (as of 2026-08)".

---

## Review process

1. **Small fixes** (typos, links, diagram tweaks): reviewed within a few days, fast turnaround.
2. **New chapters**: reviewed against the pedagogy contract and the quality bar. Expect at least one round of feedback. We're not trying to be gatekeepers — we're trying to keep the voice consistent and the technical claims correct.
3. **Field Notes**: reviewed for factual accuracy and the "design pattern that would have prevented this" requirement.

All contributions are MIT-licensed. By submitting a PR, you agree your contribution is licensed under the project's MIT license.

---

## Code of conduct

Be kind. Be patient with beginners — they're the audience. Disagree about ideas, not people. Assume good faith.

If you see something that doesn't live up to this, email the maintainers or open a private issue.

---

## Questions?

Open an issue. We'd rather answer a question than have you stumble.
