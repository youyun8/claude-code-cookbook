import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE } from '@/data/site';
import { LESSONS, LEVELS, LEVEL_BLURB, TOTAL_MINUTES, lessonsByLevel } from '@/data/curriculum';
import { CONTENT_LAST_REVIEWED } from '@/data/sources';
import { ContinueLearning } from '@/components/learning/ContinueLearning';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Chip } from '@/components/ui/Chip';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

const LOOP = [
  { step: 'Prompt', detail: 'You state the goal, the scope, and how it will be checked.' },
  { step: 'Inspect', detail: 'Claude reads the code and gathers evidence before editing.' },
  { step: 'Act', detail: 'It edits files or runs a command.' },
  { step: 'Observe', detail: 'It reads the result — output, errors, a failing assertion.' },
  { step: 'Iterate', detail: 'It corrects, using the result as the signal.' },
  { step: 'Verify', detail: 'A check passes, and you review the diff.' },
];

const LEARN = [
  {
    title: 'Prompting for engineering work',
    body: 'Goal, context, constraints, edge cases, verification, deliverable — used in proportion to risk.',
  },
  {
    title: 'Context management',
    body: 'What fills the window, why irrelevant context costs on every turn, and when to clear rather than compact.',
  },
  {
    title: 'Permissions and safety',
    body: 'Least privilege, sandboxing, prompt injection, and how to triage a proposed action in seconds.',
  },
  {
    title: 'Verification',
    body: 'Choosing checks that produce readable pass/fail evidence, and reviewing the diff for what tests miss.',
  },
  {
    title: 'Customisation',
    body: 'CLAUDE.md, skills, hooks, MCP, subagents — and which of them actually guarantee anything.',
  },
  {
    title: 'Automation and scale',
    body: 'Headless runs, structured output, parallel work with isolation, and team-level practice.',
  },
];

/** Structured data describing the course. Only fields we can state accurately. */
const COURSE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  inLanguage: 'en',
  isAccessibleForFree: true,
  teaches: [
    'Prompting for agentic coding tasks',
    'Context and session management',
    'Permissions, sandboxing, and agent safety',
    'Verification and code review',
    'Automating engineering workflows',
  ],
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: `PT${TOTAL_MINUTES}M`,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_JSON_LD) }}
      />

      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[76rem] px-4 py-14 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Chip tone="accent" icon="◆">
                An independent course · not affiliated with Anthropic
              </Chip>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-[3.1rem]">
                Learn to delegate coding work without losing control of it.
              </h1>
              <p className="mt-4 max-w-[46ch] text-lg text-ink-muted">
                Claude Code Cookbook takes you from installing an agentic coding tool to running a
                repeatable engineering system — scoping tasks, managing context, setting
                permissions, and verifying results you can defend in review.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ContinueLearning variant="inline" />
                <Link
                  href="/clinic/"
                  className="inline-flex items-center gap-2 rounded-chip border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-2"
                >
                  Open the prompt clinic
                </Link>
              </div>

              <p className="mt-5 text-sm text-ink-subtle">
                {LESSONS.length} modules · about {Math.round(TOTAL_MINUTES / 60)} hours · free, no
                account, nothing leaves your browser
              </p>
            </div>

            {/* Terminal demo */}
            <div className="rounded-panel border border-line-strong bg-[#1a1613] p-4 shadow-raised">
              <p className="mb-3 select-none font-mono text-[11px] uppercase tracking-wide text-[#a2988a]">
                the same task, twice
              </p>
              <div className="space-y-3 font-mono text-[12.5px] leading-relaxed">
                <div>
                  <p className="mb-1 text-[#f0938a]">✕ weak</p>
                  <pre className="whitespace-pre-wrap break-words text-[#d8cec1]">
                    {'> Fix the login bug.'}
                  </pre>
                  <p className="mt-1 text-[11px] text-[#a2988a]">
                    No target, no boundary, nothing that can come back red.
                  </p>
                </div>
                <div className="border-t border-[#3d382f] pt-3">
                  <p className="mb-1 text-[#79c99a]">✓ scoped and verifiable</p>
                  <pre className="whitespace-pre-wrap break-words text-[#e7ded1]">
                    {`> src/features/auth returns a generic 500 when a refresh
  token has expired. Reproduce it with the auth tests,
  explain the cause, then make the smallest fix. Do not
  change the response schema. Add a regression test, run
  \`npm test -- auth\`, and report what you changed.`}
                  </pre>
                  <p className="mt-1 text-[11px] text-[#a2988a]">
                    Location, sequence, scope, non-goal, and a check that passes or fails.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mental model */}
      <section aria-labelledby="mental-model" className="border-b border-line bg-surface-2">
        <div className="mx-auto max-w-[76rem] px-4 py-12">
          <p className="text-[11px] uppercase tracking-wide text-ink-subtle">
            The 30-second mental model
          </p>
          <h2 id="mental-model" className="mt-1 text-2xl font-semibold text-ink">
            An agent runs a loop, and the loop needs a signal
          </h2>
          <p className="mt-2 max-w-[62ch] text-ink-muted">
            This is the whole idea the course keeps returning to. Everything else — prompting,
            context, permissions, automation — is technique layered on top of it.
          </p>

          <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
            {LOOP.map((entry, index) => (
              <li key={entry.step} className="ca-card p-3.5">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span
                    aria-hidden="true"
                    className="grid h-5 w-5 place-items-center rounded-full border border-accent-line bg-accent-soft text-[10px] text-accent"
                  >
                    {index + 1}
                  </span>
                  {entry.step}
                </p>
                <p className="mt-1.5 text-sm text-ink-muted">{entry.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What you'll learn */}
      <section aria-labelledby="what-you-learn" className="border-b border-line">
        <div className="mx-auto max-w-[76rem] px-4 py-12">
          <h2 id="what-you-learn" className="text-2xl font-semibold text-ink">
            What you will learn
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEARN.map((item) => (
              <article key={item.title} className="ca-card p-4">
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Learning path preview */}
      <section aria-labelledby="path" className="border-b border-line bg-surface-2">
        <div className="mx-auto max-w-[76rem] px-4 py-12">
          <h2 id="path" className="text-2xl font-semibold text-ink">
            Three levels, ten modules
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {LEVELS.map((level) => {
              const lessons = lessonsByLevel(level);
              return (
                <article key={level} className="ca-card flex flex-col p-5">
                  <h3 className="text-lg font-semibold text-ink">{level}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{LEVEL_BLURB[level]}</p>
                  <ol className="mt-4 flex-1 space-y-1.5 text-sm">
                    {lessons.map((lesson) => (
                      <li key={lesson.slug}>
                        <Link
                          href={`/learn/${lesson.slug}/`}
                          className="flex items-baseline gap-2 text-ink-muted hover:text-ink"
                        >
                          <span className="font-mono text-[11px] text-ink-subtle">
                            {String(lesson.moduleNumber).padStart(2, '0')}
                          </span>
                          <span>{lesson.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 text-xs text-ink-subtle">
                    {lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)} minutes
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Responsibility */}
      <section aria-labelledby="not-infallible" className="border-b border-line">
        <div className="mx-auto max-w-[76rem] px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            {/* min-w-0 keeps the code block's scroll container from widening
                the grid track on narrow screens. */}
            <div className="min-w-0">
              <h2 id="not-infallible" className="text-2xl font-semibold text-ink">
                Claude Code is powerful, not infallible
              </h2>
              <div className="mt-3 space-y-3 text-ink-muted">
                <p>
                  It can misread an abstraction, fix a symptom instead of a cause, or satisfy a test
                  in a way that does not satisfy the requirement — and it will do all of that
                  confidently.
                </p>
                <p>
                  That is not a reason to avoid it. It is the reason the permission system, the
                  review step, and the verification habit exist. You remain the engineer of record
                  for everything that lands in your repository.
                </p>
                <p>
                  This course spends as much time on judgement as on technique: when to grant
                  autonomy, when to stop and clarify, and what evidence to require before you call
                  something done.
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <CodeBlock
                lang="text"
                label="The closing paragraph worth keeping on your clipboard"
                code={`When finished, report:
1. Root cause or design decision.
2. Files changed and why.
3. Verification commands run and their results.
4. Remaining risks, assumptions, or work not performed.`}
                copyLabel="Final-report request"
              />
              <p className="text-sm text-ink-subtle">
                Item 4 is the one that surfaces what review would otherwise miss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-[76rem] px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Start where you are</h2>
            <p className="mt-2 max-w-[56ch] text-ink-muted">
              New to agentic tools? Begin at module 1. Already using Claude Code daily? Module 4 on
              context and module 6 on permissions are where most experienced users find something
              they were doing the hard way.
            </p>
            <p className="mt-3 text-sm text-ink-subtle">
              Technical content last reviewed{' '}
              <time dateTime={CONTENT_LAST_REVIEWED}>{CONTENT_LAST_REVIEWED}</time>, against the
              official documentation linked throughout.
            </p>
          </div>
          <ContinueLearning />
        </div>
      </section>
    </>
  );
}
