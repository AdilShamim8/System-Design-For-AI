# Contributing

First: thank you. This project exists because free, beginner-first, storytelling-taught AI system design content should exist.

---

## The contract

Every chapter obeys the pedagogy contract:

1. **Bloom's Taxonomy in order** — Remember → Understand → Apply → Analyze → Evaluate → Create
2. **Open with a story**, not a definition
3. **One idea per paragraph, one analogy per concept, plain words over jargon**
4. **No lecture voice** — coffee with a sharp friend
5. **Never assume unstated prerequisites** — link inline
6. **End with "explain it back"** — not a multiple-choice quiz
7. **Cite real sources** — papers, engineering blogs, official docs
8. **Date-stamp time-sensitive claims**

The quality bar: a reader with zero prior exposure can follow start to finish without opening another tab; every technical claim survives a staff AI engineer's fact-check; it reads aloud without sounding like documentation.

---

## Ways to contribute

1. **Fix a typo or error** — open a PR
2. **Improve a diagram** — edit the Mermaid `.mmd` source
3. **Write a missing chapter** — check ROADMAP, open an issue to claim it
4. **Add a question** — scenario-framed, with worked answer
5. **Improve the website** — fix bugs, add features, improve design

---

## Technical conventions

- **Chapters**: `chapters/{track-dir}/{chapter_id}-{slug}.md`
- **Frontmatter**: `chapter_id`, `title`, `topic`, `track`, `bloom_stage`, `est_read_minutes`, `prerequisites`, `teaching_goal`, `status`, `last_updated`
- **Diagrams**: Mermaid in fenced code blocks (GitHub renders natively)
- **Citations**: inline Markdown links to primary sources
- **Website**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui

---

## Review process

1. **Small fixes**: reviewed within a few days
2. **New chapters**: reviewed against the pedagogy contract. Expect at least one round of feedback.
3. **Website changes**: reviewed for functionality, design, and mobile responsiveness

All contributions are MIT-licensed.

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community standards.
