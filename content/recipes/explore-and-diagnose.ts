import type { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    slug: 'explore-unfamiliar-repository',
    title: 'Explore an unfamiliar repository',
    summary:
      'Get a checkable map of how a codebase fits together, before you or Claude change anything in it.',
    task: 'explore',
    difficulty: 'beginner',
    risk: 'low',
    features: ['plan-mode'],
    whenToUse: [
      'You have just cloned a repository and need orientation.',
      'You are about to change a subsystem you have never read.',
      'You inherited a service and need to know what covers it.',
    ],
    prerequisites: ['A local checkout you can read.'],
    template: `Explore this repository to explain how {{flow}} works, from
{{entryPoint}} through to {{endPoint}}.

Do not modify any files.

Give me:
1. The path through the code, citing file paths and symbol names.
2. The tests that cover that path.
3. The parts you are unsure about, and why.
4. Anything that looks like it has no coverage.

Keep the explanation under {{wordLimit}} words. I will check your
citations, so cite precisely.`,
    variables: [
      {
        id: 'flow',
        label: 'What to trace',
        placeholder: 'user authentication',
        example: 'user authentication',
        help: 'One flow, not the whole system. A broad ask produces a shallow answer.',
      },
      {
        id: 'entryPoint',
        label: 'Start of the path',
        placeholder: 'the HTTP entry point',
        example: 'the HTTP entry point',
        help: 'Where the request or event arrives.',
      },
      {
        id: 'endPoint',
        label: 'End of the path',
        placeholder: 'the database write',
        example: 'the database write',
        help: 'Where you want the trace to stop.',
      },
      {
        id: 'wordLimit',
        label: 'Word limit',
        placeholder: '400',
        example: '400',
        help: 'A cap keeps the answer dense and cheap to read.',
      },
    ],
    whyItWorks: [
      '"Do not modify any files" separates understanding from doing, so nothing is edited on a guessed architecture.',
      'Citations make the answer falsifiable — you can open the files and check.',
      'Asking for uncertainties surfaces the parts most likely to bite during implementation.',
      'A word limit prevents a long summary of things you could have read yourself.',
    ],
    expectedBehavior: [
      'Claude searches and reads a handful of files rather than the whole tree.',
      'The answer names concrete paths and symbols.',
      'Gaps and uncertainties are stated rather than smoothed over.',
    ],
    verification: [
      'Open two or three of the cited files and confirm the symbols exist.',
      'Run the tests it named and confirm they cover the path it described.',
      'Ask a follow-up about one uncertainty and see whether the answer holds.',
    ],
    failureSignals: [
      {
        signal: 'The explanation is generic and could describe any web application.',
        recovery: 'Ask again naming a specific entry file, and require a citation on every claim.',
      },
      {
        signal: 'Cited paths do not exist.',
        recovery:
          'Stop and start a fresh session. Confidently wrong citations mean the answer was assembled, not read.',
      },
      {
        signal: 'It started editing files.',
        recovery:
          'Use plan mode next time — `claude --permission-mode plan` blocks edits until you approve a plan.',
      },
    ],
    sources: ['bestPractices', 'commonWorkflows', 'permissionModes'],
  },
  {
    slug: 'diagnose-failing-test',
    title: 'Diagnose a failing test without editing first',
    summary:
      'Force diagnosis before treatment so you fix the cause rather than the first thing that turns the test green.',
    task: 'debug',
    difficulty: 'beginner',
    risk: 'low',
    features: ['plan-mode'],
    whenToUse: [
      'A test fails and you do not yet know why.',
      'A test is flaky and you need to know whether it is the test or the code.',
      'You suspect the test itself encodes an outdated requirement.',
    ],
    prerequisites: ['A reproducible failure, or a command that reproduces it.'],
    template: `The test {{testName}} in {{testFile}} is failing. Reproduce it with
{{testCommand}}.

Do not change any code yet. Instead:
1. Show me the actual failure output.
2. Explain what the test asserts and why the code does not satisfy it.
3. State the root cause in one or two sentences.
4. Tell me whether the bug is in the code or in the test's expectation.
5. Propose the smallest fix, and wait for me to approve it.`,
    variables: [
      {
        id: 'testName',
        label: 'Test name',
        placeholder: 'refreshes an expired token',
        example: 'refreshes an expired token',
        help: 'The exact test title, so there is no ambiguity.',
      },
      {
        id: 'testFile',
        label: 'Test file',
        placeholder: 'src/features/auth/session.test.ts',
        example: 'src/features/auth/session.test.ts',
        help: 'A path is the cheapest possible context.',
      },
      {
        id: 'testCommand',
        label: 'Command',
        placeholder: 'npm test -- session',
        example: 'npm test -- session',
        help: 'Scoped, so the output is short enough to read.',
      },
    ],
    whyItWorks: [
      'Reproducing first means the diagnosis is grounded in the real failure, not a plausible story about it.',
      'Step 4 is the step people skip: sometimes the test is wrong, and quietly "fixing" the code hides a real requirement.',
      'The approval gate stops a wrong theory from becoming a wrong commit.',
    ],
    expectedBehavior: [
      'The failure output is quoted, not paraphrased.',
      'The root cause is one specific thing, not a list of possibilities.',
      'No files are modified before you approve.',
    ],
    verification: [
      'Confirm the quoted failure matches what you get running the command yourself.',
      'Check the root cause explains all of the failure, not part of it.',
      'After the fix, confirm the test fails without it and passes with it.',
    ],
    failureSignals: [
      {
        signal: 'It edits code before explaining.',
        recovery:
          'Interrupt, revert with `/rewind`, and restate the "do not change any code yet" constraint.',
      },
      {
        signal: 'The root cause is a list of three possibilities.',
        recovery: 'Ask it to distinguish them with a specific experiment and report the result.',
      },
      {
        signal: 'It proposes deleting or skipping the assertion.',
        recovery:
          'Reject it. Ask whether the assertion encodes a real requirement, and if so, why the code does not meet it.',
      },
    ],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'fix-reproducible-bug',
    title: 'Fix a reproducible bug',
    summary:
      'The full loop for a bug you can reproduce: cause first, smallest fix, regression test, focused then broader checks.',
    task: 'debug',
    difficulty: 'beginner',
    risk: 'medium',
    features: ['git'],
    whenToUse: [
      'You have a reproduction and a clear symptom.',
      'The fix is expected to be local rather than architectural.',
    ],
    prerequisites: ['Clean working tree, on a branch.', 'A test command that exercises the area.'],
    template: `{{symptom}}

It happens in {{location}}. Reproduce it using {{reproduction}}, identify
the root cause, and explain it before editing.

Then make the smallest fix that preserves current behavior for
{{preserve}}. Do not {{nonGoal}}.

Add a regression test that fails without your fix. Run {{focusedTest}},
then {{broaderCheck}}.

Finish with: the root cause, the files changed and why, the verification
output, and anything you are unsure about.`,
    variables: [
      {
        id: 'symptom',
        label: 'Symptom',
        placeholder:
          'The login form returns a generic 500 when an expired refresh token is present.',
        example: 'The login form returns a generic 500 when an expired refresh token is present.',
        help: 'Observable behavior, not your theory about the cause.',
      },
      {
        id: 'location',
        label: 'Location',
        placeholder: 'src/features/auth',
        example: 'src/features/auth',
        help: 'A directory or file narrows exploration dramatically.',
      },
      {
        id: 'reproduction',
        label: 'Reproduction',
        placeholder: 'the existing auth tests',
        example: 'the existing auth tests',
        help: 'A failing test is the best form; a manual sequence works too.',
      },
      {
        id: 'preserve',
        label: 'Must keep working',
        placeholder: 'valid sessions',
        example: 'valid sessions',
        help: 'The behavior a careless fix would break.',
      },
      {
        id: 'nonGoal',
        label: 'Non-goal',
        placeholder: 'change the API response schema',
        example: 'change the API response schema',
        help: 'One sentence here saves an expensive review comment.',
      },
      {
        id: 'focusedTest',
        label: 'Focused check',
        placeholder: 'npm test -- auth',
        example: 'npm test -- auth',
        help: 'Fast, scoped, short output.',
      },
      {
        id: 'broaderCheck',
        label: 'Broader check',
        placeholder: 'npm run typecheck',
        example: 'npm run typecheck',
        help: 'Once at the end, not on every loop.',
      },
    ],
    whyItWorks: [
      'It supplies location, symptom, and reproduction, so the explore phase is short and grounded.',
      '"Explain it before editing" forces diagnosis to precede treatment.',
      '"Smallest fix" plus an explicit non-goal keeps the diff reviewable.',
      'A regression test converts a one-time fix into a permanent guarantee.',
      'Two checks — focused during iteration, broader at the end — give a tight loop without skipping coverage.',
    ],
    expectedBehavior: [
      'The failure is reproduced before any edit.',
      'The diff is small and confined to the named area.',
      'A new test fails without the fix and passes with it.',
    ],
    verification: [
      'Stash the fix and confirm the new test fails; restore it and confirm it passes.',
      'Read the full diff, including `git status --short` for untracked files.',
      'Confirm no existing test was modified, skipped, or deleted.',
    ],
    failureSignals: [
      {
        signal: 'The diff touches files unrelated to the symptom.',
        recovery: 'Revert and restate the boundary. Ask for a fix confined to the named path.',
      },
      {
        signal: 'A test was modified to make the suite pass.',
        recovery:
          'Revert. Ask what behavior changed and why the original assertion no longer holds.',
      },
      {
        signal: 'The fix adds a broad try/catch around the failure.',
        recovery: 'Reject it — that is symptom masking. Ask for the cause of the exception.',
      },
    ],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'review-pull-request',
    title: 'Review a pull request for correctness and security',
    summary:
      'An adversarial review that produces ranked findings with concrete failure scenarios — and changes nothing.',
    task: 'review',
    difficulty: 'intermediate',
    risk: 'low',
    features: ['git', 'subagents'],
    whenToUse: [
      'Before merging a change that touches auth, money, data integrity, or a public interface.',
      'As a second pass on work an agent produced.',
      'When you are reviewing unfamiliar code and want a checklist to work from.',
    ],
    prerequisites: ['The branch checked out, or the diff available.'],
    template: `Review the diff on this branch as a hostile reviewer. Assume the author
was rushing.

Scope: {{scope}}

For each file, name concrete failure scenarios:
- Inputs that break it
- States it does not handle
- Errors it swallows or logs and continues past
- Security assumptions made silently ({{securityFocus}})
- Concurrency or ordering assumptions

Rank findings by severity. For each, say which ones the current tests
would miss. Do not fix anything — I want findings, not edits.`,
    variables: [
      {
        id: 'scope',
        label: 'Scope',
        placeholder: 'the diff against main, excluding lockfiles',
        example: 'the diff against main, excluding lockfiles',
        help: 'Excluding generated files keeps the review focused.',
      },
      {
        id: 'securityFocus',
        label: 'Security focus',
        placeholder: 'authorization, input validation, injection, secret handling',
        example: 'authorization, input validation, injection, secret handling',
        help: 'Naming categories produces more specific findings than "check security".',
      },
    ],
    whyItWorks: [
      '"Hostile reviewer" and "assume the author was rushing" shift the default from charitable reading to adversarial reading.',
      'Concrete failure scenarios are checkable; "this could be cleaner" is not.',
      '"Which ones the current tests would miss" tells you where to add coverage, not just what to fix.',
      '"Do not fix anything" preserves the artifact: a list you can weigh and reject.',
    ],
    expectedBehavior: [
      'Findings name specific lines and specific inputs.',
      'Severity ranking, with the highest-impact items first.',
      'No files modified.',
    ],
    verification: [
      'Take the top finding and try to trigger it. If you cannot, ask for the exact input.',
      'Confirm the review covers files you know are risky, not only the easy ones.',
      'Confirm `git status` shows no changes.',
    ],
    failureSignals: [
      {
        signal: 'Findings are style opinions.',
        recovery:
          'Ask again for failure scenarios only: input, state, and resulting wrong behavior.',
      },
      {
        signal: 'It fixed things while reviewing.',
        recovery:
          'Revert the edits and re-run with a read-only subagent, restricted to `Read, Glob, Grep`.',
      },
      {
        signal: 'Everything is marked critical.',
        recovery:
          'Ask it to rank by blast radius and likelihood, and to name the single finding it would block the merge on.',
      },
    ],
    sources: ['commonWorkflows', 'securityGuidance', 'subAgents'],
  },
  {
    slug: 'analyze-performance-regression',
    title: 'Analyze a performance regression with benchmarks',
    summary:
      'Measure before you theorise, and require the same benchmark before and after so the improvement is a number.',
    task: 'performance',
    difficulty: 'advanced',
    risk: 'medium',
    features: ['git'],
    whenToUse: [
      'A measured regression, with a before and after.',
      'A latency or throughput target you must hit.',
    ],
    prerequisites: [
      'A benchmark or profiling command that produces comparable numbers.',
      'A known-good reference point — a commit, a tag, or a recorded measurement.',
    ],
    template: `{{metric}} regressed from {{before}} to {{after}}{{suspect}}.

Before changing anything, profile it with {{benchmark}} and tell me where
the time goes. Show the numbers.

Then propose a fix and wait for my approval before implementing it.

Do not {{nonGoal}} — I want the underlying cause, not a workaround.

After the fix, run the same benchmark and report before and after numbers
from the same command on the same machine.`,
    variables: [
      {
        id: 'metric',
        label: 'Metric',
        placeholder: 'The /dashboard endpoint p95',
        example: 'The /dashboard endpoint p95',
        help: 'A specific, measured quantity.',
      },
      {
        id: 'before',
        label: 'Before',
        placeholder: '180ms',
        example: '180ms',
        help: 'The known-good value.',
      },
      {
        id: 'after',
        label: 'After',
        placeholder: '1.4s',
        example: '1.4s',
        help: 'The current value.',
      },
      {
        id: 'suspect',
        label: 'Suspect change',
        placeholder: ' after commit a1b2c3d',
        example: ' after commit a1b2c3d',
        help: 'Optional. A suspect commit narrows the search enormously.',
      },
      {
        id: 'benchmark',
        label: 'Benchmark command',
        placeholder: 'the existing benchmark in bench/dashboard.bench.ts',
        example: 'the existing benchmark in bench/dashboard.bench.ts',
        help: 'The same command before and after, or the numbers are not comparable.',
      },
      {
        id: 'nonGoal',
        label: 'Forbidden workaround',
        placeholder: 'add caching',
        example: 'add caching',
        help: 'Block the tempting symptom fix explicitly.',
      },
    ],
    whyItWorks: [
      'Profiling before theorising prevents a fix aimed at the wrong hot path.',
      'The approval gate is where you catch a plausible but wrong diagnosis, cheaply.',
      'Forbidding the obvious workaround forces the actual cause to surface.',
      'The same benchmark before and after is the only evidence that means anything.',
    ],
    expectedBehavior: [
      'A profile with numbers, before any code change.',
      'A specific bottleneck, not a list of general suggestions.',
      'A pause for approval before implementation.',
    ],
    verification: [
      'Run the benchmark yourself and confirm the reported numbers.',
      'Confirm the run conditions were the same: same machine, same data, warm or cold consistently.',
      'Confirm correctness tests still pass — performance work breaks behavior more often than it should.',
    ],
    failureSignals: [
      {
        signal: 'It suggests optimisations without profiling.',
        recovery: 'Stop. Require the profile output before any proposal.',
      },
      {
        signal: 'The improvement is within run-to-run noise.',
        recovery: 'Ask for repeated runs and a variance figure before accepting the result.',
      },
      {
        signal: 'It added caching despite the non-goal.',
        recovery: 'Revert. Restate the constraint and ask what the cache was hiding.',
      },
    ],
    sources: ['commonWorkflows', 'bestPractices'],
  },
];
