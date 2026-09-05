import type { Lesson } from '../types';

export const lesson: Lesson = {
  slug: 'git-and-daily-workflows',
  moduleNumber: 8,
  title: 'Git and daily workflows',
  summary:
    'The nine tasks that make up most agentic work, each with a boundary, a check, and a report — plus the git habits that keep them reviewable.',
  level: 'Daily workflow',
  minutes: 35,
  prerequisites: ['explore-plan-implement-verify'],
  objectives: [
    'Establish repository state before an agentic change and review it afterwards.',
    'Run the nine common workflows with verification built into the request.',
    'Use branches and worktrees to keep parallel work from colliding.',
    'Prepare commits and pull requests only after evidence exists.',
  ],
  blocks: [
    { kind: 'h2', id: 'state', text: 'State first' },
    {
      kind: 'p',
      text: 'Before an agentic change, three commands. After it, three more. This is thirty seconds that makes every subsequent step honest.',
    },
    {
      kind: 'code',
      lang: 'bash',
      label: 'Before',
      code: `git status --short          # clean?
git branch --show-current   # not on main?
npm test                    # what already fails?`,
    },
    {
      kind: 'code',
      lang: 'bash',
      label: 'After',
      code: `git status --short          # any new files you did not expect?
git diff                    # read it, all of it
git diff --stat             # is the shape right?`,
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Untracked files hide',
      body: [
        '`git diff` shows changes to tracked files. A new file — a config, a script, a dependency shim — does not appear until it is staged. `git status --short` is how you see it.',
        'This is the most commonly skipped step in agentic review, and it is where surprises live.',
      ],
    },

    { kind: 'h2', id: 'rules', text: 'Working rules' },
    {
      kind: 'ul',
      items: [
        '**One concern per session.** A bug fix and a dependency bump in the same diff means neither gets reviewed properly.',
        '**Ask for focused changes.** "Only files under `src/features/search/`" is a sentence that saves an hour.',
        '**Focused tests first, broader checks last.** Tight loops during iteration; the full suite once at the end.',
        '**Commits after review, not before.** The point of review is to catch things; committing first inverts the order.',
        '**Never let Claude discard your work.** No `git checkout .`, no `git reset --hard`, no force-push on a shared branch, without you asking for it explicitly.',
      ],
    },
    {
      kind: 'code',
      lang: 'text',
      label: 'A line worth keeping in your CLAUDE.md',
      code: `Do not run destructive git commands (reset --hard, checkout ., clean -fd,
push --force) or commit anything unless I explicitly ask. Show me the diff
and let me decide.`,
    },

    { kind: 'h2', id: 'workflows', text: 'The nine workflows' },
    {
      kind: 'p',
      text: 'Every one of these has the same shape: a boundary, a check, and a report. The full copyable versions, with variables you can edit, are in the recipe library.',
    },

    { kind: 'h3', id: 'w-bug', text: '1. Bug fixing' },
    {
      kind: 'p',
      text: 'Reproduce before diagnosing, diagnose before editing. The regression test is not optional — it is what stops the bug from coming back silently.',
    },
    {
      kind: 'code',
      lang: 'text',
      code: `Reproduce this failure with the existing tests, explain the root cause
before editing, then make the smallest fix. Add a regression test that
fails without the fix. Run the focused tests and report the results.`,
    },

    { kind: 'h3', id: 'w-feature', text: '2. Feature implementation' },
    {
      kind: 'p',
      text: 'For anything spanning more than a couple of files, plan first. State the boundary and the conventions to match.',
    },
    {
      kind: 'code',
      lang: 'text',
      code: `Implement <feature>. Follow the existing patterns in <module>; do not
introduce new abstractions. Files under <path> only. Add tests covering
<edge cases>. Run <test command> and the type check, then report files
changed, decisions made, and anything you left out.`,
    },

    { kind: 'h3', id: 'w-refactor', text: '3. Refactoring' },
    {
      kind: 'p',
      text: 'The defining constraint is that behavior does not change, and the evidence is the existing tests passing unmodified.',
    },

    { kind: 'h3', id: 'w-tests', text: '4. Test generation' },
    {
      kind: 'p',
      text: 'Generated tests have a specific failure mode: they assert what the code currently does, including its bugs. Ask for the boundaries, not the coverage number.',
    },
    {
      kind: 'code',
      lang: 'text',
      code: `Add tests for <module>. Cover the boundaries: empty input, null, the
maximum size, the error paths, and concurrent callers. Do not write a
test that only re-states the implementation. If you find behavior that
looks like a bug, report it instead of encoding it in an assertion.`,
    },

    { kind: 'h3', id: 'w-deps', text: '5. Dependency updates' },
    {
      kind: 'p',
      text: 'One dependency at a time. Read the changelog for breaking changes before touching code, and require the full suite afterwards — a dependency bump is precisely the change whose blast radius you cannot predict.',
    },

    { kind: 'h3', id: 'w-conflicts', text: '6. Merge conflicts' },
    {
      kind: 'p',
      text: 'Claude is good at mechanical conflicts and dangerous on semantic ones. Ask it to classify before resolving.',
    },
    {
      kind: 'code',
      lang: 'text',
      code: `Resolve the merge conflicts in this branch. For each conflict, first say
whether it is mechanical (formatting, imports, adjacent edits) or
semantic (both sides changed the same logic). Resolve the mechanical
ones. For semantic ones, show me both sides and your recommendation, and
wait. Regenerate lockfiles with the project's tooling, never by hand.
Then run the full test suite.`,
    },

    { kind: 'h3', id: 'w-review', text: '7. Pull-request review' },
    {
      kind: 'p',
      text: 'Ask for findings ranked by severity, with the failure scenario spelled out. "This could be cleaner" is not a finding; "this drops the error when the parse fails, so a malformed payload becomes a silent 200" is.',
    },

    { kind: 'h3', id: 'w-docs', text: '8. Documentation' },
    {
      kind: 'p',
      text: 'Documentation is the one workflow where the verification is you reading it. Ask for docs derived from the code as it is now, with anything uncertain flagged rather than smoothed over.',
    },

    { kind: 'h3', id: 'w-commit', text: '9. Commits and pull requests' },
    {
      kind: 'p',
      text: 'Only after review, and only after the checks are green. A commit message written before verification describes an intention, not a change.',
    },
    {
      kind: 'code',
      lang: 'text',
      code: `The tests pass and I have reviewed the diff. Stage only the files
related to <change> — list them for me before staging. Write a commit
message that says what changed and why, following the convention in
recent history. Do not push.`,
    },

    { kind: 'h2', id: 'parallel', text: 'Branches and worktrees' },
    {
      kind: 'p',
      text: 'Two sessions editing the same checkout will overwrite each other. A git worktree gives each one its own directory and branch from the same repository, which removes the collision entirely.',
    },
    {
      kind: 'code',
      lang: 'bash',
      label: 'Start a session in an isolated worktree',
      code: `claude --worktree feature-auth

# Created under .claude/worktrees/feature-auth/ on branch
# worktree-feature-auth. Run it again with another name in a second
# terminal for a second isolated session.`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Two practical notes',
      body: [
        'Add `.claude/worktrees/` to your `.gitignore` so worktree contents do not show up as untracked files in your main checkout.',
        'A worktree is a fresh checkout, so it needs its own dependency install and environment setup before anything will run.',
      ],
    },
    {
      kind: 'p',
      text: 'Use worktrees when tasks are genuinely independent. Two agents working on the same module in separate worktrees will produce two conflicting branches, and you will merge them by hand — which is usually slower than doing the work sequentially.',
    },
    { kind: 'sources', ids: ['worktrees', 'commonWorkflows'] },

    { kind: 'h2', id: 'recipes', text: 'The recipe library' },
    {
      kind: 'p',
      text: 'Each of these workflows has a full recipe with editable variables, expected behavior, a verification checklist, and recovery steps for when it goes wrong. Use them as starting points and adapt them to your repository — a recipe that names your actual test command is worth more than a generic one.',
    },
  ],
  checklist: [
    'I checked repository state before starting and after finishing.',
    'This session covers one concern.',
    'I read the full diff, including untracked files.',
    'The tests I ran are the ones relevant to what changed, plus a broader pass at the end.',
    'Nothing was committed before I reviewed it.',
    'Parallel tasks are in separate worktrees or branches, not the same checkout.',
    'No destructive git command ran without me asking for it.',
  ],
  quiz: [
    {
      id: 'q1',
      prompt:
        'Claude reports the change is complete and `git diff` looks right. What is the most commonly missed check?',
      options: [
        { id: 'a', text: '`git log`' },
        { id: 'b', text: '`git status --short`, for untracked files the diff does not show' },
        { id: 'c', text: '`git blame`' },
        { id: 'd', text: '`git stash list`' },
      ],
      correctOptionId: 'b',
      explanation:
        '`git diff` covers tracked files. A new config file, script, or dependency shim will not appear there until it is staged.',
    },
    {
      id: 'q2',
      prompt: 'When are git worktrees genuinely worth the setup cost?',
      options: [
        { id: 'a', text: 'For every task, as a default.' },
        {
          id: 'b',
          text: 'When several genuinely independent tasks would otherwise share one checkout.',
        },
        { id: 'c', text: 'When the repository is large.' },
        { id: 'd', text: 'Only in CI.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Worktrees prevent edit collisions between parallel sessions. If the tasks are not independent, you pay setup and merge cost for work that would have been faster sequentially.',
    },
    {
      id: 'q3',
      prompt: 'What is the specific risk of asking Claude to "add tests for this module"?',
      options: [
        { id: 'a', text: 'It will refuse without a test framework configured.' },
        {
          id: 'b',
          text: 'It may assert the current behavior, bugs included, and call that coverage.',
        },
        { id: 'c', text: 'Tests are always too slow.' },
        { id: 'd', text: 'It will rewrite the module.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Tests written from the implementation encode it. Ask for boundary conditions and error paths, and ask it to report suspected bugs rather than encoding them.',
    },
    {
      id: 'q4',
      prompt: 'A merge conflict where both branches changed the same function’s logic should be:',
      options: [
        { id: 'a', text: 'Resolved by Claude, picking the newer side.' },
        {
          id: 'b',
          text: 'Surfaced to you with both sides and a recommendation, then decided by you.',
        },
        { id: 'c', text: 'Resolved by taking both changes.' },
        { id: 'd', text: 'Avoided by force-pushing.' },
      ],
      correctOptionId: 'b',
      explanation:
        'That is a semantic conflict: either resolution loses behavior somebody intended. Mechanical conflicts are safe to delegate; semantic ones are a decision.',
    },
  ],
  sources: ['commonWorkflows', 'worktrees', 'bestPractices', 'permissions'],
};
