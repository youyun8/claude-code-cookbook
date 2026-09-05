import type { Lesson } from '../types';

export const lesson: Lesson = {
  slug: 'prompting-for-engineering-work',
  moduleNumber: 2,
  title: 'Prompting for engineering work',
  summary:
    'The anatomy of a task an agent can actually finish: goal, context, constraints, edge cases, verification, and a deliverable you can read in a minute.',
  level: 'Foundations',
  minutes: 30,
  prerequisites: ['mental-model-and-setup'],
  objectives: [
    'Name the seven parts of a well-formed engineering task and explain what each one prevents.',
    'Add structure in proportion to a task’s ambiguity and risk, rather than to every request.',
    'Supply evidence — logs, traces, paths, URLs — that shortens exploration.',
    'Recognise when to ask Claude to interview you instead of guessing.',
  ],
  blocks: [
    { kind: 'h2', id: 'why', text: 'Why vague prompts produce vague work' },
    {
      kind: 'p',
      text: 'A vague request does not produce a smaller change. It produces a wider one. Given "clean up the auth module", Claude has to invent a definition of done, and the definitions it invents tend to be generous: renames, extracted helpers, new abstractions, a few opportunistic fixes. All of it plausible. None of it what you asked for, because you did not ask for anything specific.',
    },
    {
      kind: 'p',
      text: 'Worse, a vague request has no failure condition. If nothing can come back red, the loop from module 1 has nothing to iterate against, and the session ends when Claude runs out of ideas rather than when the work is correct.',
    },

    { kind: 'h2', id: 'anatomy', text: 'The anatomy of a strong task' },
    {
      kind: 'p',
      text: 'Seven parts. Each one prevents a specific failure. Hover, tap, or tab through the annotated prompt below to see them in place.',
    },
    {
      kind: 'lab',
      lab: 'prompt-anatomy',
      title: 'Annotated prompt',
      description: 'Select any part of the prompt to see what it prevents.',
    },
    {
      kind: 'table',
      head: ['Part', 'Answers', 'Prevents'],
      rows: [
        ['Goal', 'What should be true afterwards?', 'A change that solves a different problem'],
        [
          'Context',
          'Where in the code, and what did you observe?',
          'A long, expensive search of the whole repository',
        ],
        ['Constraints and non-goals', 'What must not change?', 'Scope creep and collateral edits'],
        [
          'Relevant files or symptoms',
          'What evidence do you already have?',
          'Guesswork that looks like diagnosis',
        ],
        [
          'Expected behavior and edge cases',
          'What must keep working?',
          'A fix that passes the happy path and breaks the boundary',
        ],
        [
          'Verification',
          'What can Claude run to know it worked?',
          'Plausible code that was never executed',
        ],
        [
          'Deliverable',
          'What should the final message contain?',
          'A ten-minute review of a two-minute change',
        ],
      ],
    },
    {
      kind: 'code',
      lang: 'text',
      label: 'The reusable pattern',
      code: `Goal:
Context:
Relevant files or symptoms:
Constraints and non-goals:
Expected behavior and edge cases:
Verification commands or evidence:
Deliverable:`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Do not use this template for everything',
      body: [
        'For "rename this variable" or "add a trailing comma", the template is ceremony. Just ask.',
        'Scale structure to ambiguity and risk. A one-line ask for a one-line change is correct. A seven-field brief for a change that touches billing is also correct. The mistake is using the same amount of structure for both.',
      ],
    },

    { kind: 'h2', id: 'before-after', text: 'Before and after' },
    {
      kind: 'compare',
      title: 'Bug fix',
      sides: [
        {
          label: 'Weak',
          tone: 'weak',
          code: 'Fix the login bug.',
          notes: [
            'Which bug? Claude will pick one, or ask, or fix something adjacent.',
            'No location, so exploration is unbounded.',
            'No check, so "fixed" means "compiles and looks right".',
          ],
        },
        {
          label: 'Strong',
          tone: 'strong',
          code: `The login form in src/features/auth returns a generic 500 when an expired
refresh token is present. Reproduce the failure using the existing auth
tests, identify the root cause, and explain it before editing. Then make
the smallest fix that preserves current behavior for valid sessions. Do
not change the API response schema. Add or update a regression test, run
the focused auth tests, then run the repository's required type check.
Finish with the files changed, the root cause, and the verification
results.`,
          notes: [
            'Location: `src/features/auth`, and the symptom is exact.',
            'Sequence: reproduce, then explain, then edit. Diagnosis before treatment.',
            'Scope: smallest fix; behavior for valid sessions preserved.',
            'Non-goal: the response schema is off limits.',
            'Regression requirement, so the bug cannot come back silently.',
            'Two executable checks, focused first and broader second.',
            'A deliverable that makes review fast.',
          ],
        },
      ],
    },
    {
      kind: 'compare',
      title: 'Refactor',
      sides: [
        {
          label: 'Weak',
          tone: 'weak',
          code: 'Refactor the checkout code, it’s messy.',
          notes: [
            '"Messy" is a feeling, not a specification.',
            'Nothing pins the behavior, so a refactor can silently become a rewrite.',
          ],
        },
        {
          label: 'Strong',
          tone: 'strong',
          code: `In src/checkout/total.ts, calculateTotal() has four nested conditionals
for discount stacking. Extract the discount rules into named functions in
the same file, keeping behavior identical. Do not change the public
signature, do not touch tax handling, and do not add dependencies.
Run \`npm test -- checkout\` before and after and confirm the same tests
pass. Report anything the current tests do not cover.`,
          notes: [
            'Names the exact function and the exact smell.',
            '"Behavior identical" is the constraint that makes it a refactor.',
            'Three non-goals, each cheap to state and expensive to undo.',
            'Before-and-after test runs are how "identical" gets evidence.',
            'The coverage question surfaces the real risk of any refactor.',
          ],
        },
      ],
    },
    {
      kind: 'compare',
      title: 'Performance',
      sides: [
        {
          label: 'Weak',
          tone: 'weak',
          code: 'Make the dashboard faster.',
          notes: [
            'No measurement, so there is no way to know if it worked.',
            'Invites speculative micro-optimisation across the whole page.',
          ],
        },
        {
          label: 'Strong',
          tone: 'strong',
          code: `The /dashboard endpoint p95 went from 180ms to 1.4s after commit a1b2c3d.
Profile it with the existing benchmark in bench/dashboard.bench.ts before
changing anything, and tell me where the time goes. Then propose a fix
and wait for my approval before implementing it. Do not add caching —
I want the underlying cause. Report before and after numbers from the
same benchmark.`,
          notes: [
            'A measured regression with a suspect commit, not a vibe.',
            'Measure first, and report before proposing.',
            'An explicit approval gate before implementation.',
            '"Do not add caching" blocks the tempting symptom fix.',
            'The same benchmark before and after is the evidence.',
          ],
        },
      ],
    },

    { kind: 'h2', id: 'evidence', text: 'Give it the evidence you already have' },
    {
      kind: 'p',
      text: 'If you have already seen the error, paste it. A stack trace is worth several minutes of exploration, and it anchors Claude to the real failure instead of a plausible one.',
    },
    {
      kind: 'ul',
      items: [
        '**Stack traces and logs** — paste the relevant frames, not the whole log file. The top of the trace and the line that mentions your code are usually enough.',
        '**File references** — a path is the cheapest possible context. `src/api/handlers/session.ts:88` beats a paragraph of description.',
        '**Images** — drag a screenshot into the terminal, or paste it, to show a visual bug or a design target.',
        '**URLs** — Claude can fetch a page. Point at the issue, the RFC, or the library docs rather than paraphrasing them.',
        '**A failing test** — the strongest form of evidence, because it is also the verification.',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Evidence is untrusted input',
      body: [
        'A log, an issue body, a fetched web page, or a file in an unfamiliar repository can contain text written by someone else — including text aimed at the agent reading it.',
        'This is called prompt injection, and module 6 covers it properly. For now: paste the frames you need rather than whole files from sources you do not control.',
      ],
    },

    { kind: 'h2', id: 'interview', text: 'Let it interview you' },
    {
      kind: 'p',
      text: 'When you know the outcome you want but not the shape of the work, do not write a detailed prompt full of invented details. Ask to be interviewed.',
    },
    {
      kind: 'code',
      lang: 'text',
      label: 'Prompt',
      code: `I want to add per-organisation rate limiting to our API. Before writing
any code or a plan, ask me the questions you need answered to design it
correctly — limits, storage, what happens on overflow, which endpoints
are exempt. Ask them a few at a time and wait for my answers.`,
    },
    {
      kind: 'p',
      text: 'This is worth doing whenever the cost of guessing wrong is higher than the cost of a short conversation. Product-shaped work, anything touching data models, and anything that will be hard to reverse all qualify.',
    },

    { kind: 'h2', id: 'report', text: 'Always ask for the report' },
    {
      kind: 'p',
      text: 'One reusable closing paragraph turns a diff you have to reconstruct into a change you can assess. Keep it on your clipboard.',
    },
    {
      kind: 'code',
      lang: 'text',
      label: 'Final-report request',
      code: `When finished, report:
1. Root cause or design decision.
2. Files changed and why.
3. Verification commands run and their results.
4. Remaining risks, assumptions, or work not performed.`,
    },
    {
      kind: 'p',
      text: 'Item 4 does the most work. It is the line that surfaces "I could not run the integration tests" and "I assumed the token is always present", which are exactly the things you would otherwise discover in review — or in production.',
    },
    { kind: 'sources', ids: ['bestPractices', 'commonWorkflows'] },
  ],
  checklist: [
    'My prompt names a goal with a verifiable outcome.',
    'I pointed at specific files, symbols, or symptoms.',
    'I stated at least one non-goal for anything non-trivial.',
    'I named a command or check Claude can run and read.',
    'I asked for a report that includes what was not done.',
    'The amount of structure matches the risk of the task.',
  ],
  quiz: [
    {
      id: 'q1',
      prompt: 'Which part of a task most improves an agent’s reliability?',
      options: [
        { id: 'a', text: 'A polite tone.' },
        { id: 'b', text: 'A verification step the agent can run and interpret.' },
        { id: 'c', text: 'A longer description of the problem.' },
        { id: 'd', text: 'Listing every file in the repository.' },
      ],
      correctOptionId: 'b',
      explanation:
        'A runnable check closes the loop. Without one, the agent has no signal distinguishing "correct" from "plausible", and neither do you until review.',
    },
    {
      id: 'q2',
      prompt:
        'You need to add a trailing comma to a config file. What should your prompt look like?',
      options: [
        { id: 'a', text: 'The full seven-field template, for consistency.' },
        { id: 'b', text: 'One sentence naming the file and the change.' },
        { id: 'c', text: 'A request for a plan, then approval, then implementation.' },
        { id: 'd', text: 'A subagent investigation followed by a review pass.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Structure should be proportional to ambiguity and risk. Ceremony on a trivial edit costs tokens and your time without reducing any risk.',
    },
    {
      id: 'q3',
      prompt: 'Why is "Do not change the API response schema" worth a line in a bug-fix prompt?',
      options: [
        { id: 'a', text: 'It reduces the token cost of the request.' },
        {
          id: 'b',
          text: 'It is a non-goal that is far cheaper to state than to discover in review.',
        },
        { id: 'c', text: 'Claude Code cannot edit schema files otherwise.' },
        { id: 'd', text: 'It makes the agent work faster.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Non-goals bound the diff. A schema change that reaches review is expensive to unwind and may already have consumers; one sentence prevents it.',
    },
    {
      id: 'q4',
      prompt: 'When is asking Claude to interview you the right move?',
      options: [
        { id: 'a', text: 'Always, before every task.' },
        {
          id: 'b',
          text: 'When you know the outcome but not the design, and guessing wrong is expensive.',
        },
        { id: 'c', text: 'Only when you are new to the codebase.' },
        { id: 'd', text: 'Never — it wastes a turn.' },
      ],
      correctOptionId: 'b',
      explanation:
        'An interview replaces invented requirements with real ones. It pays for itself when the cost of building the wrong thing exceeds the cost of a few questions.',
    },
  ],
  sources: ['bestPractices', 'commonWorkflows', 'security'],
};
