# Website — System Design for AI

The Next.js website that renders the curriculum with an interactive system visualizer.

## Quick start

```bash
cd website
npm install
npm run dev
# Open http://localhost:3000
```

## What's included

- **Landing page** (`/`) — hero, stats, track summaries, "what this is NOT"
- **Curriculum map** — all 38 chapters, searchable and filterable by track
- **Lesson reader** — renders chapter markdown with Mermaid diagram support, sidebar navigation
- **System Visualizer** — interactive RAG pipeline walkthrough (6 steps)
- **Question bank** — scenario-framed practice questions with worked answers

## How it works

The website reads chapter content from the `../chapters/` directory via the API route at `src/app/api/chapters/route.ts`. The chapters are the same markdown files readable on GitHub — no separate CMS.

## Tech stack

- Next.js 16 with App Router
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui component library
- react-markdown + remark-gfm for markdown rendering
- mermaid for diagram rendering
- gray-matter for YAML frontmatter parsing

## Structure

```
website/
├── src/
│   ├── app/
│   │   ├── api/chapters/route.ts   # API: list + fetch chapters
│   │   ├── layout.tsx              # Root layout, metadata
│   │   ├── page.tsx                # Single-page app with tabs
│   │   └── globals.css             # Tailwind + prose styles
│   └── components/ui/              # shadcn/ui components
├── package.json
└── README.md (this file)
```

## Development

The page is a single-page app with tab-based navigation (Home, Curriculum, Reader, Visualizer, Questions). All state is client-side. The API route reads from the filesystem.

To add a new chapter: just add a markdown file to `../chapters/` with proper frontmatter. It will appear in the curriculum map automatically.

## Building for production

```bash
npm run build
npm start
```

## Customization

- **Colors**: edit Tailwind classes in `src/app/page.tsx` (TRACKS object, BLOOM_COLORS)
- **Typography**: edit `prose` classes in the MarkdownRenderer component
- **Mermaid theme**: edit `mermaid.initialize()` in the MermaidBlock component


---

## Note on the expanded curriculum (2026)

The repo now includes labs (`labs/`), the datasets catalog (`datasets/`), field notes (`field-notes/`), the interview-prep layer (`interview-prep/`), cheatsheets, reference diagrams, and role-based learning paths (`paths/`). The website currently renders the **chapters** and the question bank; the new layers are first-class markdown on GitHub for now. Surfacing them in the site (labs browser, field-note feed, flashcard mode) is on the roadmap — see the root `ROADMAP.md`.
