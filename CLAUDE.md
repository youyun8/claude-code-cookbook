# Claude Code Cookbook

An interactive course teaching developers to use Claude Code. Next.js App
Router, TypeScript, Tailwind v4, statically exported.

## Commands

- Dev: `npm run dev`
- Everything CI runs: `npm run check` (typecheck, lint, format check, unit tests, build)
- Unit tests only: `npm test` — a single test: `npx vitest run tests/unit/<file>`
- End-to-end and accessibility: `npm run build` first, then `npm run test:e2e`

## Conventions

- Brand: Claude Code Cookbook. The old storage key is retained only for migration.
- English routes live in `app/(en)`; Chinese text lives in `locales/zh-TW`.
  Run `npm run localize` to regenerate the Chinese edition after editing shared
  source. Never edit `.localized/` or `app/(zh)/` directly.
- Commit subjects start with `feat:`, `fix:`, `chore:` or another conventional type.
  Every nonblank body line must be a bullet no longer than 120 characters.

- Educational material is typed data in `content/`, never JSX. Pages render it
  through `components/learning/BlockRenderer.tsx`.
- Author text supports only `` `code` ``, `**strong**` and `[label](href)`,
  parsed by `components/ui/RichText.tsx`. Never use `dangerouslySetInnerHTML`
  for author or learner input — the only exceptions are Shiki output and the
  theme script.
- Colours come from the semantic tokens in `styles/globals.css`. Do not use
  Tailwind palette classes (`bg-slate-800`) or `dark:` variants; both themes
  redefine the same variables.
- Never convey risk, progress or correctness by colour alone — pair every
  colour with a glyph and text.
- Every version-sensitive claim needs a `sources` block whose ids exist in
  `data/sources.ts`. `tests/unit/content-integrity.test.ts` enforces this.
- localStorage is only touched by `lib/progress/storage.ts`, and every access
  is wrapped — the site must work with storage unavailable.

## Before you finish

- Run `npm run check`.
- If you changed content or routes, run `npm run test:e2e` too; it checks
  internal links, metadata, accessibility, and mobile overflow against the
  built output.
- Do not add a dependency without saying why. There are no analytics, no
  third-party scripts, and no runtime fonts by design.
