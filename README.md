# Claude Code Academy

**From first prompt to reliable engineering workflow.**

An interactive course that teaches developers to use Claude Code correctly,
safely, and efficiently — how to scope a task an agent can finish, manage the
context window, set permissions, verify results, and turn the whole thing into
a repeatable engineering system.

It is a static site: no accounts, no server, no analytics, no third-party
scripts. Learning progress lives in the visitor's browser and nowhere else.

> This is an independent educational project. It is not affiliated with or
> endorsed by Anthropic. Every version-sensitive claim links to the official
> [Claude Code documentation](https://code.claude.com/docs/en/overview) with
> the date it was last checked.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command                           | What it does                                                       |
| --------------------------------- | ------------------------------------------------------------------ |
| `npm run dev`                     | Development server with hot reload                                 |
| `npm run build`                   | Static export to `out/`                                            |
| `npm start`                       | Serve the built site from `out/` on port 3000                      |
| `npm run typecheck`               | `tsc --noEmit`                                                     |
| `npm run lint`                    | ESLint via `next lint`                                             |
| `npm run format` / `format:check` | Prettier                                                           |
| `npm test`                        | Unit and component tests (Vitest)                                  |
| `npm run test:e2e`                | End-to-end, accessibility, link and responsive checks (Playwright) |
| `npm run check`                   | Typecheck + lint + format check + unit tests + build               |

`npm run test:e2e` needs a build first — it serves `out/` and asserts against
the real exported HTML.

```bash
npm run build && npm run test:e2e
```

If your environment provides its own Chromium rather than Playwright's managed
download, point at it:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome npm run test:e2e
```

Otherwise run `npx playwright install chromium` once.

## What is in it

| Route                 | Contents                                                                               |
| --------------------- | -------------------------------------------------------------------------------------- |
| `/`                   | Landing page: the agentic loop, a weak-versus-scoped prompt demo, the three-level path |
| `/learn`              | Curriculum hub with objectives, prerequisites, times and progress                      |
| `/learn/[slug]`       | Ten modules, each with a review checklist, a knowledge check and sources               |
| `/clinic`             | Prompt clinic — deterministic rubric, per-criterion evidence, step-by-step improvement |
| `/recipes`            | Fifteen workflow recipes, filterable by task, difficulty, risk and feature             |
| `/recipes/[slug]`     | Editable prompt template, why it works, verification checklist, recovery steps         |
| `/safety`             | Seven scenario exercises in agent safety                                               |
| `/reference`          | Compact reference pages plus the full source registry                                  |
| `/reference/glossary` | Twenty-six terms                                                                       |
| `/progress`           | Local progress dashboard with export, import and reset                                 |

Seven interactive labs are embedded in the lessons: a terminal walkthrough,
annotated prompt anatomy, a context-budget simulator, a CLAUDE.md linter, a
permission decision lab, a diff-review exercise, and a guided fix lab. Every
simulation is labelled as one — nothing on this site connects to your terminal,
repository, or Claude account.

## Architecture

```
app/                     Routes (App Router, static export)
components/
  labs/                  Interactive exercises, lazy-loaded per lesson
  learning/              Block renderer, quiz, recipe playground, dashboards
  navigation/            Header, course nav, search, table of contents
  progress/              Progress context provider
  ui/                    Design-system primitives
content/
  lessons/               Ten typed lesson objects
  recipes/               Fifteen typed recipe objects
  reference/             Reference entries
  glossary.ts, safety.ts, clinic-examples.ts, types.ts
data/
  curriculum.ts          Curriculum order — the single source of sequencing
  recipes.ts, sources.ts, site.ts
lib/
  claude-md-linter/      Heuristic CLAUDE.md rules
  code/                  Build-time Shiki highlighting
  progress/              Versioned schema, migrations, storage, pure reducers
  prompt-rubric/         Deterministic prompt scoring
  search/                Client-side index over all content
styles/globals.css       Design tokens and base styles
tests/unit, tests/e2e
```

### Decisions worth knowing

**Content is typed data, not components.** Lessons and recipes are plain
objects rendered through one block renderer. That keeps the writing free of
layout, makes the search index impossible to drift out of sync, and lets
`tests/unit/content-integrity.test.ts` assert things like "every source id
resolves" and "no lesson links to a route that does not exist".

**Inline markup is parsed, never injected.** Author text supports only
`` `code` ``, `**strong**` and `[label](href)`, turned into React elements by
`components/ui/RichText.tsx`. Nothing a learner types is ever treated as
markup.

**Semantic colour tokens, no `dark:` variants.** Both themes redefine the same
CSS variables in `styles/globals.css`, so a component is theme-correct by
construction. Theme resolution happens before first paint via a small inline
script, with `prefers-color-scheme` as the no-JavaScript fallback.

**Syntax highlighting is a build step.** Shiki runs during static generation
and emits dual-theme markup; the stylesheet swaps colours. No highlighting
code reaches the browser.

**Storage is behind one module.** `lib/progress/storage.ts` is the only place
that touches `localStorage`, and every access is wrapped — the site stays fully
usable in a private window or with site data blocked. The stored payload has a
`version` field and `migrate()` upgrades older shapes rather than discarding
them; an import that is not progress data is rejected without touching what
you have.

**Labs are lazy.** Reading content is server-rendered and needs no JavaScript;
the interactive exercises are code-split and load with the lesson that uses
them.

**No runtime fonts.** The type stack is system fonts, which avoids a
third-party request and a flash of unstyled text. Swap it in the
`--ca-font-sans` / `--ca-font-mono` tokens if you prefer web fonts.

## Content accuracy

`data/sources.ts` is the single registry of official documentation links, each
with a `lastReviewed` date. That date is a build-time content field — it is
never derived from the viewer's clock. The footer and the reference index
surface it, and configuration examples whose schemas change carry a "verify
against current docs" note pointing at the exact reference page.

When you revise content, update the `lastReviewed` date on the entries you
actually re-checked.

## Deployment

`npm run build` produces a fully static `out/` directory that any static host
can serve. Set the canonical origin at build time so metadata, canonical URLs
and the sitemap are right:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

## Accessibility

Targets WCAG 2.2 AA. Automated axe checks run over every major page and over
the labs after interaction, as part of `npm run test:e2e`. Beyond that: full
keyboard operation with visible focus, a skip link and semantic landmarks,
accessible dialogs and drawers via Radix primitives, one polite live region for
copy/save/quiz announcements, reduced-motion support, and no state conveyed by
colour alone.

## Licence

Educational content and code in this repository are provided as-is for
learning purposes.
