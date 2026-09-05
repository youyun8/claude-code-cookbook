import type { Lesson } from '../types';

export const lesson: Lesson = {
  slug: 'explore-plan-implement-verify',
  moduleNumber: 3,
  title: 'Explore, plan, implement, verify',
  summary:
    'The operating loop for non-trivial work: map the code before editing it, plan when the task is ambiguous, keep changes small, and finish with evidence.',
  level: 'Foundations',
  minutes: 35,
  prerequisites: ['prompting-for-engineering-work'],
  objectives: [
    'Separate investigation from implementation when a task is ambiguous or high-impact.',
    'Use plan mode where it pays for itself, and skip it where it does not.',
    'Choose verification that produces readable pass/fail evidence.',
    'Review a diff for the defects tests do not catch.',
  ],
  blocks: [
    { kind: 'h2', id: 'loop', text: 'The loop' },
    {
      kind: 'p',
      text: 'Define, explore, plan, implement, verify, review, record. Not every task needs every step — a typo fix needs two of them — but for anything you would think about before doing yourself, the order matters.',
    },
    {
      kind: 'table',
      head: ['Step', 'What you do', 'What it prevents'],
      rows: [
        [
          'Define',
          'State the goal, scope and definition of done',
          'Solving the wrong problem well',
        ],
        [
          'Explore',
          'Have Claude read the relevant code first, without editing',
          'Confident edits based on a guessed architecture',
        ],
        [
          'Plan',
          'Ask for a short implementation plan and approve it',
          'Discovering the approach was wrong after 12 files changed',
        ],
        [
          'Implement',
          'Small, reviewable changes that match local conventions',
          'A diff nobody can read',
        ],
        [
          'Verify',
          'Run tests, builds, linters, type checks, benchmarks',
          'Plausible code that was never executed',
        ],
        [
          'Review',
          'Read the diff; add an adversarial pass when risk warrants',
          'Defects that pass tests',
        ],
        [
          'Record',
          'Update durable instructions when the lesson generalises',
          'Re-explaining the same thing next session',
        ],
      ],
    },

    { kind: 'h2', id: 'explore', text: 'Explore before editing' },
    {
      kind: 'p',
      text: 'The most common cause of a bad agentic change is an edit made before the code was understood. The fix is boring: ask for the map first, and forbid edits while you get it.',
    },
    {
      kind: 'code',
      lang: 'text',
      label: 'Exploration prompt',
      code: `Explore the repository to explain how requests flow from the HTTP entry
point to persistence for this feature. Do not modify files. Cite the
relevant paths and symbols, identify the tests that cover the path, and
list uncertainties or missing coverage. Keep the final explanation
concise.`,
    },
    {
      kind: 'p',
      text: 'Three things make this work. "Do not modify files" removes the temptation to start fixing. "Cite the relevant paths and symbols" gives you something to check — an answer with citations is falsifiable. "List uncertainties or missing coverage" is where the useful information usually is, because the gaps are what will bite during implementation.',
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Plan mode enforces this',
      body: [
        'Starting with `claude --permission-mode plan`, or pressing `Shift+Tab` to cycle into plan mode, blocks edits until you approve a plan. It turns "please do not edit" from a request into a constraint.',
        'You can also run `/plan` mid-session to switch into it before a large change.',
      ],
    },

    { kind: 'h2', id: 'plan', text: 'Plan when planning pays' },
    {
      kind: 'p',
      text: 'Planning is worth a round trip when the work spans several files, when there is more than one reasonable approach, or when being wrong is expensive. It is pure ceremony on a change you could describe in a sentence.',
    },
    {
      kind: 'table',
      head: ['Task', 'Plan first?', 'Why'],
      rows: [
        ['Rename a local variable', 'No', 'One reasonable approach, trivially reversible'],
        ['Fix a bug with a failing test', 'No', 'The test defines done; go'],
        [
          'Add a field to an API response',
          'Usually',
          'Touches types, validation, tests, and consumers',
        ],
        ['Introduce a caching layer', 'Yes', 'Several designs, hard to unpick later'],
        ['Change a database schema', 'Yes', 'Migrations are the least reversible thing you own'],
      ],
    },
    {
      kind: 'p',
      text: 'Read the plan for the decision, not the prose. The question is not "is this well written" but "is this the approach I would have chosen, and does it mention the thing I am worried about". If it does not mention your worry, say so and ask again before approving.',
    },

    { kind: 'h2', id: 'implement', text: 'Implement inside a boundary' },
    {
      kind: 'p',
      text: 'Tell Claude what it may change and what it must not. Both halves matter: the permission narrows the search, and the prohibition keeps the diff reviewable.',
    },
    {
      kind: 'ul',
      items: [
        '"You may change files under `src/features/billing/`" — a positive boundary.',
        '"Do not modify the generated client in `src/api/generated/`" — a negative one.',
        '"Match the existing error-handling pattern in this module rather than introducing a new one" — a convention instruction, which prevents the most common review comment.',
        '"If the fix requires touching more than three files, stop and tell me before continuing" — a circuit breaker for tasks that turn out bigger than they looked.',
      ],
    },
    {
      kind: 'callout',
      tone: 'danger',
      title: 'Fix causes, not symptoms',
      body: [
        'If a test fails, the correct response is to understand why. Deleting the assertion, adding a `skip`, widening a type to `any`, or wrapping the call in an empty catch all make the red go away without making the software work.',
        'Say so explicitly when you suspect the temptation: "Do not disable or skip tests, and do not suppress the type error — fix the underlying cause or explain why you cannot."',
      ],
    },

    { kind: 'h2', id: 'verify', text: 'Verification is the point' },
    {
      kind: 'p',
      text: 'A task is not complete because the code looks plausible. It is complete when something ran and came back green — and when you know which something.',
    },
    {
      kind: 'table',
      caption: 'Pick verification that produces readable pass/fail output',
      head: ['Kind of change', 'Strong verification', 'Weak verification'],
      rows: [
        [
          'Bug fix',
          'A regression test that fails before and passes after',
          '"I checked the logic"',
        ],
        ['Feature', 'New tests plus the existing suite for that area', 'The app starts'],
        [
          'Refactor',
          'The same tests passing before and after, unchanged',
          'Rewritten tests that now pass',
        ],
        ['Type-level change', 'The project type check', '"No red squiggles"'],
        ['Performance', 'The same benchmark, before and after numbers', '"It feels faster"'],
        [
          'UI change',
          'A screenshot of the rendered state, or a visual test',
          '"The CSS looks right"',
        ],
      ],
    },
    {
      kind: 'callout',
      tone: 'verify',
      title: 'The refactor trap',
      body: [
        'If a refactor changes the tests, the tests are no longer evidence that behavior is unchanged. Insist that the existing tests pass untouched, and treat any request to modify them as a signal that behavior moved.',
      ],
    },
    {
      kind: 'p',
      text: 'Run focused checks during iteration and broader ones at the end. `npm test -- auth` on every loop and the full suite once is faster and cheaper than the full suite six times, and it gives Claude a tighter feedback signal.',
    },

    { kind: 'h2', id: 'review', text: 'Review the diff yourself' },
    {
      kind: 'p',
      text: 'Tests catch what you thought to test. Review catches the rest: a silently swallowed error, a widened permission, a changed default, a dependency added to solve a two-line problem.',
    },
    {
      kind: 'code',
      lang: 'bash',
      label: 'What to look at',
      code: `git diff                    # staged and unstaged changes
git status --short          # new files you did not expect
git diff --stat             # is the shape of the change what you asked for?`,
    },
    {
      kind: 'lab',
      lab: 'diff-review',
      title: 'Diff review exercise',
      description:
        'A short simulated diff with real defects. Find them before reading the answers.',
    },
    {
      kind: 'p',
      text: 'For changes with real consequences, add an adversarial pass: a second request, ideally in a fresh session so it is not anchored by the first, whose only job is to attack the change.',
    },
    {
      kind: 'code',
      lang: 'text',
      label: 'Adversarial review prompt',
      code: `Review the diff on this branch as a hostile reviewer. Assume the author
was rushing. For each file, name concrete failure scenarios: inputs that
break it, states it does not handle, errors it swallows, and security or
concurrency assumptions it makes silently. Do not fix anything. Rank
findings by severity and say which ones the current tests would miss.`,
    },

    { kind: 'h2', id: 'lab', text: 'Guided lab' },
    {
      kind: 'p',
      text: 'Work through the whole loop on a small failing function: improve a weak prompt, choose verification, and inspect the resulting diff.',
    },
    {
      kind: 'lab',
      lab: 'guided-fix',
      title: 'Guided lab: fix a failing function',
      description: 'Three steps — sharpen the prompt, pick the check, review the diff.',
    },

    { kind: 'h2', id: 'record', text: 'Record only what generalises' },
    {
      kind: 'p',
      text: 'At the end of a session you often know something you did not before. Ask one question: will this be true next month, on a different task? If yes, it belongs in durable instructions — module 5 covers where. If it was specific to this bug, let it go.',
    },
    { kind: 'sources', ids: ['bestPractices', 'commonWorkflows', 'permissionModes'] },
  ],
  checklist: [
    'For anything non-trivial, Claude read the relevant code before editing it.',
    'I planned when the approach was genuinely ambiguous, and skipped planning when it was not.',
    'I stated what may change and what must not.',
    'A check ran and I saw its output, not a claim about its output.',
    'For a refactor, the existing tests passed unmodified.',
    'I read the diff, including new and deleted files.',
    'Nothing was silenced, skipped, or suppressed to produce green.',
  ],
  quiz: [
    {
      id: 'q1',
      prompt: 'When is plan mode most clearly worth the round trip?',
      options: [
        { id: 'a', text: 'Every task, without exception.' },
        {
          id: 'b',
          text: 'When several designs are reasonable and the wrong one is expensive to unpick.',
        },
        { id: 'c', text: 'Only for changes under ten lines.' },
        { id: 'd', text: 'Only when you do not know the language.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Planning buys you a cheap chance to reject an approach. That is valuable when the approach is contested and reversal is costly, and it is pure overhead when neither is true.',
    },
    {
      id: 'q2',
      prompt:
        'Claude reports a refactor is complete and all tests pass — but it also modified three test files. What is the correct read?',
      options: [
        { id: 'a', text: 'Good: the tests were updated to match the new structure.' },
        {
          id: 'b',
          text: 'The tests are no longer evidence that behavior is unchanged; ask what moved and why.',
        },
        { id: 'c', text: 'Irrelevant, as long as the suite is green.' },
        { id: 'd', text: 'Revert everything immediately.' },
      ],
      correctOptionId: 'b',
      explanation:
        'A refactor holds behavior constant. If the tests had to change, either the behavior changed or the tests were coupled to structure — both are worth knowing before you merge.',
    },
    {
      id: 'q3',
      prompt: 'A test fails after a change. Which response is unacceptable?',
      options: [
        { id: 'a', text: 'Diagnose the root cause and fix it.' },
        {
          id: 'b',
          text: 'Show the failure and ask whether the test encodes an outdated requirement.',
        },
        { id: 'c', text: 'Add `skip` to the test so the suite passes.' },
        { id: 'd', text: 'Reproduce the failure in isolation first.' },
      ],
      correctOptionId: 'c',
      explanation:
        'Skipping converts a known failure into an unknown one. If the test genuinely encodes an outdated requirement, that is a conversation and a deliberate change — not a silent skip.',
    },
    {
      id: 'q4',
      prompt: 'Why run an adversarial review in a fresh session rather than the same one?',
      options: [
        { id: 'a', text: 'It costs fewer tokens.' },
        {
          id: 'b',
          text: 'The original session is anchored by the reasoning that produced the change.',
        },
        { id: 'c', text: 'Reviews cannot run in a session that made edits.' },
        { id: 'd', text: 'It runs faster.' },
      ],
      correctOptionId: 'b',
      explanation:
        'A session that just argued itself into an approach is poorly placed to attack it. A fresh context reads the diff on its own terms.',
    },
  ],
  sources: ['bestPractices', 'commonWorkflows', 'permissionModes', 'checkpointing'],
};
