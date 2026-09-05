import type { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    slug: 'implement-small-feature',
    title: 'Implement a small feature',
    summary:
      'A bounded feature with conventions to match, edge cases named up front, and checks that run before you see it.',
    task: 'implement',
    difficulty: 'beginner',
    risk: 'medium',
    features: ['git'],
    whenToUse: [
      'The design is settled and the work fits in a handful of files.',
      'There is an existing pattern in the codebase to follow.',
    ],
    prerequisites: ['Clean working tree, on a branch.', 'A test command for the area.'],
    template: `Implement {{feature}}.

Follow the existing pattern in {{pattern}} rather than introducing a new
abstraction. Only change files under {{boundary}}.

Handle these cases: {{edgeCases}}.

Do not {{nonGoal}}.

Add tests covering those cases, run {{testCommand}}, then run
{{typeCheck}}. Report the files changed, the decisions you made, and
anything you chose not to do.`,
    variables: [
      {
        id: 'feature',
        label: 'Feature',
        placeholder: 'a "copy link" button on the share dialog that copies the canonical URL',
        example: 'a "copy link" button on the share dialog that copies the canonical URL',
        help: 'One sentence describing observable behavior.',
      },
      {
        id: 'pattern',
        label: 'Pattern to follow',
        placeholder: 'src/components/ShareDialog.tsx',
        example: 'src/components/ShareDialog.tsx',
        help: 'Naming an example is the single best way to get conventional code.',
      },
      {
        id: 'boundary',
        label: 'Boundary',
        placeholder: 'src/components/ and its tests',
        example: 'src/components/ and its tests',
        help: 'A positive boundary narrows the search and the diff.',
      },
      {
        id: 'edgeCases',
        label: 'Edge cases',
        placeholder: 'clipboard permission denied, and the announcement for screen readers',
        example: 'clipboard permission denied, and the announcement for screen readers',
        help: 'The cases a happy-path implementation would miss.',
      },
      {
        id: 'nonGoal',
        label: 'Non-goal',
        placeholder: 'add a new dependency',
        example: 'add a new dependency',
        help: 'Blocks the shortcut you would reject in review.',
      },
      {
        id: 'testCommand',
        label: 'Test command',
        placeholder: 'npm test -- ShareDialog',
        example: 'npm test -- ShareDialog',
        help: 'Scoped, so iteration is fast.',
      },
      {
        id: 'typeCheck',
        label: 'Broader check',
        placeholder: 'npm run typecheck',
        example: 'npm run typecheck',
        help: 'Catches what a scoped test run does not.',
      },
    ],
    whyItWorks: [
      'Naming a file to imitate produces conventional code without you writing a style guide.',
      'A stated boundary keeps the feature from spreading into adjacent modules.',
      'Edge cases named in the prompt end up in the tests; edge cases you forgot to mention usually do not.',
      '"Anything you chose not to do" is where the real risks surface.',
    ],
    expectedBehavior: [
      'The new code looks like the file you pointed at.',
      'Tests cover the edge cases you named.',
      'Both checks are run and their output reported.',
    ],
    verification: [
      'Read the diff and compare the new code to the pattern file.',
      'Confirm the edge-case tests actually exercise the edge case, not just the happy path.',
      'Run the app or the component and try the failure case yourself.',
    ],
    failureSignals: [
      {
        signal: 'A new abstraction or helper layer appeared.',
        recovery: 'Revert and restate: follow the existing pattern, no new abstractions.',
      },
      {
        signal: 'Tests assert the implementation rather than behavior.',
        recovery:
          'Ask for tests written from the requirement: given this input, expect this output.',
      },
      {
        signal: 'A dependency was added.',
        recovery:
          'Revert. Ask what it solved and whether the standard library or an existing utility covers it.',
      },
    ],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'plan-large-feature',
    title: 'Plan a large multi-file feature',
    summary:
      'Get a plan you can reject cheaply, with alternatives and risks, before any code exists.',
    task: 'implement',
    difficulty: 'intermediate',
    risk: 'medium',
    features: ['plan-mode'],
    whenToUse: [
      'The change spans several modules or introduces a new concept.',
      'More than one design is reasonable.',
      'Getting the approach wrong would be expensive to unpick.',
    ],
    prerequisites: ['Enough clarity on the requirement to judge a plan against it.'],
    template: `I want to add {{feature}}.

Before writing any code, explore the relevant parts of the codebase and
produce a plan:

1. The approach you recommend, and one alternative you rejected, with why.
2. The files you would create or change, and roughly what happens in each.
3. Where this touches {{sensitiveArea}}, and what could break.
4. The tests you would add, and what they would prove.
5. What you are uncertain about, and what would resolve it.

Constraints: {{constraints}}.

Do not write any code until I approve the plan.`,
    variables: [
      {
        id: 'feature',
        label: 'Feature',
        placeholder: 'per-organisation rate limiting on the public API',
        example: 'per-organisation rate limiting on the public API',
        help: 'The outcome, not the implementation.',
      },
      {
        id: 'sensitiveArea',
        label: 'Sensitive area',
        placeholder: 'authentication and the existing middleware chain',
        example: 'authentication and the existing middleware chain',
        help: 'The part you are worried about. If the plan does not mention it, ask again.',
      },
      {
        id: 'constraints',
        label: 'Constraints',
        placeholder: 'no new infrastructure; must work with the existing Redis instance',
        example: 'no new infrastructure; must work with the existing Redis instance',
        help: 'Real constraints stated now prevent a plan you have to reject wholesale.',
      },
    ],
    whyItWorks: [
      'A rejected alternative tells you the space was actually considered, not that the first idea was written up.',
      'Naming the sensitive area up front means the plan addresses your actual worry.',
      '"What would resolve it" turns uncertainty into a next action rather than a hedge.',
      'Approval gating is far cheaper than reviewing twelve changed files.',
    ],
    expectedBehavior: [
      'Exploration happens before the plan is written.',
      'The plan is specific about files and responsibilities.',
      'No code is written until you approve.',
    ],
    verification: [
      'Check the plan against your own mental model — where does it differ, and is it right?',
      'Confirm it addresses the sensitive area explicitly.',
      'If it does not mention your main worry, say so and ask again before approving.',
    ],
    failureSignals: [
      {
        signal: 'The plan is a restatement of the requirement.',
        recovery:
          'Ask for specific files, specific responsibilities, and the alternative it rejected.',
      },
      {
        signal: 'No uncertainties listed.',
        recovery: 'Push back — on a multi-file change there are always some. Ask what it assumed.',
      },
      {
        signal: 'Implementation started without approval.',
        recovery: 'Use plan mode: `claude --permission-mode plan` blocks edits until you approve.',
      },
    ],
    sources: ['bestPractices', 'permissionModes', 'commonWorkflows'],
  },
  {
    slug: 'refactor-without-behavior-change',
    title: 'Refactor without changing behavior',
    summary:
      'Structure changes with behavior held constant, proven by the existing tests passing unmodified.',
    task: 'refactor',
    difficulty: 'intermediate',
    risk: 'medium',
    features: ['git'],
    whenToUse: [
      'Code is hard to work with and you want it easier before adding to it.',
      'You are preparing for a feature and want the refactor in its own reviewable commit.',
    ],
    prerequisites: [
      'Existing test coverage for the code being changed. Without it, this is not a refactor — it is a rewrite.',
    ],
    template: `In {{file}}, {{problem}}.

Refactor it by {{approach}}, keeping behavior identical.

Do not change the public signature, do not touch {{outOfScope}}, and do
not add dependencies.

Run {{testCommand}} before and after. The same tests must pass, and you
must not modify any test file. If you find yourself needing to change a
test, stop and tell me — that means behavior moved.

Afterwards, tell me what the current tests do not cover.`,
    variables: [
      {
        id: 'file',
        label: 'File',
        placeholder: 'src/checkout/total.ts',
        example: 'src/checkout/total.ts',
        help: 'One file, or one tight cluster.',
      },
      {
        id: 'problem',
        label: 'The problem',
        placeholder:
          'calculateTotal() has four levels of nested conditionals for discount stacking',
        example: 'calculateTotal() has four levels of nested conditionals for discount stacking',
        help: 'A specific structural complaint, not "it is messy".',
      },
      {
        id: 'approach',
        label: 'Approach',
        placeholder: 'extracting each discount rule into a named function in the same file',
        example: 'extracting each discount rule into a named function in the same file',
        help: 'Naming the approach keeps the refactor from becoming a redesign.',
      },
      {
        id: 'outOfScope',
        label: 'Out of scope',
        placeholder: 'tax handling',
        example: 'tax handling',
        help: 'The adjacent thing that will otherwise get pulled in.',
      },
      {
        id: 'testCommand',
        label: 'Test command',
        placeholder: 'npm test -- checkout',
        example: 'npm test -- checkout',
        help: 'Run before and after; the comparison is the evidence.',
      },
    ],
    whyItWorks: [
      '"Behavior identical" is the definition of a refactor, and stating it makes the constraint checkable.',
      'Forbidding test edits protects the only evidence you have.',
      '"Stop and tell me" turns a silent behavior change into a conversation.',
      'The coverage question surfaces the real risk: the parts no test was watching.',
    ],
    expectedBehavior: [
      'Tests run before and after, unchanged, and pass both times.',
      'The diff changes structure, not conditions or values.',
      'Coverage gaps are reported honestly.',
    ],
    verification: [
      'Confirm `git diff` shows no changes under your test directories.',
      'Read the diff for changed conditionals, defaults, or ordering — those are behavior.',
      'If coverage is thin, add characterisation tests before the refactor, not after.',
    ],
    failureSignals: [
      {
        signal: 'Test files appear in the diff.',
        recovery:
          'Revert. Ask specifically what behavior changed and why the original assertions no longer hold.',
      },
      {
        signal: 'A new module or abstraction layer appeared.',
        recovery:
          'Revert and restate the approach. A refactor to a named plan should not invent architecture.',
      },
      {
        signal: 'It reports the code has no test coverage.',
        recovery:
          'Stop the refactor. Add characterisation tests for current behavior first — those become your evidence.',
      },
    ],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'add-tests-for-module',
    title: 'Add tests for an existing module',
    summary:
      'Coverage aimed at boundaries and error paths, with suspected bugs reported rather than encoded as assertions.',
    task: 'test',
    difficulty: 'beginner',
    risk: 'low',
    features: [],
    whenToUse: [
      'You are about to change code that has no tests.',
      'A bug reached production in an untested area.',
      'You want characterisation tests before a refactor.',
    ],
    prerequisites: ['A working test setup and a command that runs it.'],
    template: `Add tests for {{module}} using the patterns in {{examplePattern}}.

Cover the boundaries, not the coverage number:
- Empty, null, and missing input
- The largest realistic input
- Every error path
- {{domainCases}}

Do not write tests that only restate the implementation. If you find
behavior that looks like a bug, report it instead of writing an assertion
that locks it in.

Run {{testCommand}} and report the results, plus anything you decided not
to test and why.`,
    variables: [
      {
        id: 'module',
        label: 'Module',
        placeholder: 'src/lib/parseDuration.ts',
        example: 'src/lib/parseDuration.ts',
        help: 'One module at a time.',
      },
      {
        id: 'examplePattern',
        label: 'Example test file',
        placeholder: 'src/lib/parseDate.test.ts',
        example: 'src/lib/parseDate.test.ts',
        help: 'Points at your conventions so you do not have to describe them.',
      },
      {
        id: 'domainCases',
        label: 'Domain cases',
        placeholder: 'negative durations, fractional units, and values above 24 hours',
        example: 'negative durations, fractional units, and values above 24 hours',
        help: 'The cases only someone who knows the domain would think of.',
      },
      {
        id: 'testCommand',
        label: 'Test command',
        placeholder: 'npm test -- parseDuration',
        example: 'npm test -- parseDuration',
        help: 'Scoped to the module.',
      },
    ],
    whyItWorks: [
      'Tests generated from an implementation tend to assert what it does, bugs included. Asking for boundaries changes what gets written.',
      '"Report it instead of writing an assertion" is the line that stops a bug being cemented as expected behavior.',
      'Pointing at an example test file gets your conventions without a style guide.',
    ],
    expectedBehavior: [
      'Tests read as requirements, not as a transcript of the code.',
      'Error paths are covered, not only the happy path.',
      'Suspected bugs are surfaced separately.',
    ],
    verification: [
      'Deliberately break the module and confirm the new tests fail.',
      'Read the assertions: would they still be right if the implementation were rewritten?',
      'Check that no test asserts something you believe is wrong.',
    ],
    failureSignals: [
      {
        signal: 'Every test passes immediately and none would catch a regression.',
        recovery:
          'Mutate the source deliberately and see which tests fail. Those that never fail are not tests.',
      },
      {
        signal: 'Tests mock the thing they are supposed to be testing.',
        recovery:
          'Ask for tests against the real function, mocking only genuine external boundaries.',
      },
      {
        signal: 'A test encodes behavior you know is wrong.',
        recovery:
          'Remove it and file the bug. A test that asserts a bug makes fixing it look like a regression.',
      },
    ],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'upgrade-dependency-safely',
    title: 'Upgrade a dependency safely',
    summary:
      'One dependency, changelog first, full suite afterwards — the blast radius you cannot predict deserves the checks you can.',
    task: 'maintenance',
    difficulty: 'intermediate',
    risk: 'high',
    features: ['git'],
    whenToUse: [
      'A security advisory or a needed fix in a newer version.',
      'Routine maintenance where you want the upgrade isolated and reviewable.',
    ],
    prerequisites: [
      'Clean working tree, on a branch.',
      'A test suite you trust, and knowledge of what already fails.',
    ],
    template: `Upgrade {{package}} from {{fromVersion}} to {{toVersion}}. Only this
package — do not upgrade anything else, and do not run a general audit fix.

Before changing code:
1. Read the changelog or release notes between these versions and list the
   breaking changes that affect us.
2. Show me where we use the affected APIs.

Then apply the upgrade and the minimum code changes required. Use
{{packageManager}} so the lockfile is regenerated correctly — never edit
the lockfile by hand.

Run {{fullSuite}} and {{buildCommand}}. Report every breaking change, what
you changed for it, and anything you could not verify.`,
    variables: [
      {
        id: 'package',
        label: 'Package',
        placeholder: 'react-router',
        example: 'react-router',
        help: 'One package. Batched upgrades hide which one broke things.',
      },
      {
        id: 'fromVersion',
        label: 'From',
        placeholder: '6.22.0',
        example: '6.22.0',
        help: 'Current version.',
      },
      {
        id: 'toVersion',
        label: 'To',
        placeholder: '7.1.0',
        example: '7.1.0',
        help: 'Target version.',
      },
      {
        id: 'packageManager',
        label: 'Package manager',
        placeholder: 'npm',
        example: 'npm',
        help: 'The lockfile must be regenerated by the tool, never hand-edited.',
      },
      {
        id: 'fullSuite',
        label: 'Full test suite',
        placeholder: 'npm test',
        example: 'npm test',
        help: 'Not scoped — a dependency change can break anything.',
      },
      {
        id: 'buildCommand',
        label: 'Build',
        placeholder: 'npm run build',
        example: 'npm run build',
        help: 'Catches what tests miss in bundling and types.',
      },
    ],
    whyItWorks: [
      'Reading the changelog before editing turns guesswork into a checklist.',
      '"Show me where we use the affected APIs" makes the blast radius visible before anything changes.',
      'One package at a time means a failure has one candidate cause.',
      'The full suite is warranted here precisely because the blast radius is unpredictable.',
    ],
    expectedBehavior: [
      'A list of breaking changes with the ones affecting you marked.',
      'Code changes limited to adapting to those breaks.',
      'A regenerated lockfile, plus a green suite and build.',
    ],
    verification: [
      'Confirm only the intended package changed in the lockfile diff.',
      'Run the application, not just the tests — dependency breaks often show at runtime.',
      'Check the changelog yourself for anything marked as a breaking change that the report omitted.',
    ],
    failureSignals: [
      {
        signal: 'The lockfile shows dozens of unrelated version changes.',
        recovery: 'Revert. Re-run with an explicit instruction to change only the one package.',
      },
      {
        signal: 'Code was changed to silence a type error rather than adapt to the new API.',
        recovery: 'Revert that change. Ask what the new API expects and adapt properly.',
      },
      {
        signal: 'Tests were adjusted to pass with the new version.',
        recovery: 'Investigate each one — an adjusted test may be hiding a real behavior change.',
      },
    ],
    sources: ['commonWorkflows', 'bestPractices', 'security'],
  },
];
