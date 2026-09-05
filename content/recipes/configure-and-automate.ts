import type { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    slug: 'write-or-prune-claude-md',
    title: 'Write or prune CLAUDE.md',
    summary:
      'Get a project instruction file that earns its place in every session — and cut the parts that do not.',
    task: 'configure',
    difficulty: 'beginner',
    risk: 'low',
    features: ['claude-md'],
    whenToUse: [
      'Starting a new project, after `/init` produced a draft.',
      'The file has grown past the point where you would read it.',
      'The same correction keeps coming up in sessions.',
    ],
    prerequisites: ['An existing CLAUDE.md, or `/init` run once.'],
    template: `Review our CLAUDE.md at {{path}}.

For each line, tell me which category it falls into:
A. Non-obvious and stable — keep
B. Discoverable from the codebase — cut
C. Transient (in-flight work, dates, current status) — cut
D. Generic advice that applies to any project — cut
E. Needs a guarantee, so it should be a hook instead — move
F. A long procedure used occasionally, so it should be a skill — move

Then give me a rewritten file under {{lineTarget}} lines containing only
category A, with each rule made concrete enough that I could check whether
it was followed.

List separately: what you cut, and what you think should become a hook or
a skill. Do not write those hooks or skills yet.`,
    variables: [
      {
        id: 'path',
        label: 'Path',
        placeholder: 'CLAUDE.md',
        example: 'CLAUDE.md',
        help: 'Or `.claude/CLAUDE.md`.',
      },
      {
        id: 'lineTarget',
        label: 'Line target',
        placeholder: '80',
        example: '80',
        help: 'The documented target is under about 200. Aim well below it.',
      },
    ],
    whyItWorks: [
      'Classification first means the cuts are argued rather than guessed.',
      'Categories E and F catch the two most common mistakes: advisory rules that need enforcement, and tutorials that belong in a skill.',
      'A line target forces prioritisation instead of accretion.',
      '"Do not write those yet" keeps this task to one concern.',
    ],
    expectedBehavior: [
      'Every existing line is classified, not just the obviously bad ones.',
      'The rewrite is materially shorter.',
      'Kept rules are concrete: paths, commands, named functions.',
    ],
    verification: [
      'Read the cut list and confirm nothing load-bearing was dropped.',
      'Run `/context` in a new session and confirm the file loads under **Memory files**.',
      'Use the linter on this site as a second pass.',
    ],
    failureSignals: [
      {
        signal: 'The rewrite is the same length.',
        recovery:
          'Ask which three lines it would cut if forced, then repeat until it argues rather than complies.',
      },
      {
        signal: 'Vague rules survived.',
        recovery: 'Ask for each one to be made checkable, or cut.',
      },
      {
        signal: 'It suggests adding "IMPORTANT" to rules that get ignored.',
        recovery: 'Reject that. Repetition does not add enforcement — a hook does.',
      },
    ],
    sources: ['memory', 'skills', 'hooksGuide'],
  },
  {
    slug: 'create-formatting-hook',
    title: 'Create a deterministic formatting or validation hook',
    summary: 'Turn a rule that keeps getting skipped into one that cannot be skipped.',
    task: 'automate',
    difficulty: 'intermediate',
    risk: 'medium',
    features: ['hooks'],
    whenToUse: [
      'An instruction in CLAUDE.md is followed most of the time, and "most" is not enough.',
      'You want formatting, linting, or a guard to run regardless of what the model decides.',
    ],
    prerequisites: [
      'The command you want to run, working from the command line.',
      'Familiarity with the hooks reference — schemas change, so verify field names.',
    ],
    template: `Create a hook in {{settingsPath}} that runs {{command}} {{trigger}}.

Requirements:
- Match only {{matcher}}.
- Fail loudly if the command is missing, rather than silently doing nothing.
- Do not block on {{allowedFailures}}.

Before writing it, check the current hooks reference for the exact event
names and configuration shape — do not rely on remembered schema.

After writing it, tell me how to test that it fires, and what I should see
when it does and when it does not.`,
    variables: [
      {
        id: 'settingsPath',
        label: 'Settings file',
        placeholder: '.claude/settings.json',
        example: '.claude/settings.json',
        help: 'Project settings are shared with the team; local settings are yours alone.',
      },
      {
        id: 'command',
        label: 'Command',
        placeholder: 'npx prettier --write',
        example: 'npx prettier --write',
        help: 'Must work from your shell first.',
      },
      {
        id: 'trigger',
        label: 'When',
        placeholder: 'after every file edit',
        example: 'after every file edit',
        help: 'Maps to a lifecycle event such as PostToolUse.',
      },
      {
        id: 'matcher',
        label: 'Matcher',
        placeholder: 'Edit|Write',
        example: 'Edit|Write',
        help: 'Limits the hook to the tools you mean.',
      },
      {
        id: 'allowedFailures',
        label: 'Tolerated failures',
        placeholder: 'files the formatter does not recognise',
        example: 'files the formatter does not recognise',
        help: 'A hook that blocks on irrelevant failures gets disabled within a week.',
      },
    ],
    whyItWorks: [
      'Hooks execute at fixed lifecycle events regardless of what Claude decides, which is exactly what "always" requires.',
      '"Fail loudly if the command is missing" prevents the worst outcome: a hook that appears to work and does nothing.',
      'The "how to test it fires" request gives you a verification step for a thing that is otherwise invisible.',
      'Requiring a docs check before writing prevents fabricated schema fields.',
    ],
    expectedBehavior: [
      'A small, readable settings change.',
      'The event and matcher match your stated trigger.',
      'Clear instructions for confirming it runs.',
    ],
    verification: [
      'Run `/hooks` in a session and confirm it is listed.',
      'Make a deliberately unformatted edit and check the file afterwards.',
      'Temporarily rename the command and confirm the failure is visible, not silent.',
    ],
    failureSignals: [
      {
        signal: 'The hook silently does nothing.',
        recovery:
          'Check the matcher, check `/hooks`, and run the command manually with the same input.',
      },
      {
        signal: 'It blocks routine work.',
        recovery:
          'Narrow the matcher or make the failure non-blocking. A hook everyone disables protects nothing.',
      },
      {
        signal: 'The configuration uses fields you cannot find in the docs.',
        recovery: 'Do not ship it. Check the hooks reference and correct the shape.',
      },
    ],
    sources: ['hooksGuide', 'hooksReference', 'settings'],
  },
  {
    slug: 'delegate-research-to-subagents',
    title: 'Delegate independent research to subagents',
    summary:
      'Ask several bounded questions at once, keep the raw material out of your session, and get short checkable answers back.',
    task: 'explore',
    difficulty: 'advanced',
    risk: 'low',
    features: ['subagents'],
    whenToUse: [
      'Several independent questions about different parts of a system.',
      'A broad search whose raw material you do not want in your main context.',
      'Investigation before deciding what work to do at all.',
    ],
    prerequisites: ['Questions that are genuinely independent of each other.'],
    template: `I have {{count}} independent questions. Use a separate subagent for each
so their file reads stay out of this conversation.

{{questions}}

For each: read-only, no edits. Return at most {{answerLimit}} lines —
file paths and one-line findings, not file contents.

When they are all back, give me a combined summary and tell me where the
answers contradict each other or overlap.`,
    variables: [
      {
        id: 'count',
        label: 'How many',
        placeholder: 'three',
        example: 'three',
        help: 'Keep it small. Coordination cost grows faster than the benefit.',
      },
      {
        id: 'questions',
        label: 'Questions',
        placeholder:
          '1. Which endpoints have no rate limiting?\n2. Where do we construct database connections outside the pool?\n3. Which background jobs have no retry limit?',
        example:
          '1. Which endpoints have no rate limiting?\n2. Where do we construct database connections outside the pool?\n3. Which background jobs have no retry limit?',
        help: 'Each must have a checkable answer — a list, a count, a set of paths.',
      },
      {
        id: 'answerLimit',
        label: 'Answer limit',
        placeholder: '15',
        example: '15',
        help: 'Caps what comes back into your context window.',
      },
    ],
    whyItWorks: [
      'Each subagent has its own context window, so the files it reads never enter yours.',
      'Read-only removes the risk of three agents editing the same files.',
      'A line limit keeps the return small, which is the whole point of delegating.',
      'Asking for contradictions surfaces the case where two agents saw the same code differently — a signal one of them is wrong.',
    ],
    expectedBehavior: [
      'Short, list-shaped answers with file paths.',
      'No file contents dumped back into your session.',
      'A combined summary you can act on.',
    ],
    verification: [
      'Spot-check one finding per subagent by opening the file.',
      'Treat any contradiction as unresolved until you check it yourself.',
      'Run `/context` afterwards and confirm your window did not balloon.',
    ],
    failureSignals: [
      {
        signal: 'Answers are vague or hedged.',
        recovery:
          'The question was not checkable. Rephrase it to demand a list, a count, or a yes/no with evidence.',
      },
      {
        signal: 'A subagent returned pages of file contents.',
        recovery: 'Restate the line limit and the required answer shape.',
      },
      {
        signal: 'Two subagents contradict each other.',
        recovery:
          'Do not average them. Open the code and decide, then note which one was wrong and why.',
      },
    ],
    sources: ['subAgents', 'agents', 'contextWindow'],
  },
  {
    slug: 'run-non-interactive-ci-task',
    title: 'Run a non-interactive CI task',
    summary: 'A reproducible headless run with an exact tool allowlist, safe to put in a pipeline.',
    task: 'automate',
    difficulty: 'advanced',
    risk: 'high',
    features: ['headless', 'permissions'],
    whenToUse: [
      'Automating a check that runs on every pull request.',
      'A scripted task that must behave the same on every machine.',
    ],
    prerequisites: [
      'A CI environment with credentials scoped to what the job needs and nothing more.',
      'A task with a clear, machine-checkable output.',
    ],
    template: `Write a CI step that runs Claude Code non-interactively to {{task}}.

Requirements:
- Use \`--bare\` so hooks, skills, MCP servers, and CLAUDE.md are not
  auto-discovered and the run is reproducible.
- Use \`--permission-mode dontAsk\` with an explicit \`--allowedTools\` list
  containing only: {{allowedTools}}.
- Use \`--output-format {{outputFormat}}\` so {{consumer}} can parse it.
- Branch on the exit code: non-zero must fail the step.

Explain what each flag does and what happens if the task tries to use a
tool that is not on the allowlist. Check the current headless and CLI
reference pages for exact flag names before writing this.`,
    variables: [
      {
        id: 'task',
        label: 'Task',
        placeholder: 'summarise the risks in the diff for this pull request',
        example: 'summarise the risks in the diff for this pull request',
        help: 'Read-only tasks are the safest place to start.',
      },
      {
        id: 'allowedTools',
        label: 'Allowed tools',
        placeholder: 'Read, Bash(git diff origin/main...HEAD)',
        example: 'Read, Bash(git diff origin/main...HEAD)',
        help: 'Name exact commands. This is the security boundary.',
      },
      {
        id: 'outputFormat',
        label: 'Output format',
        placeholder: 'json',
        example: 'json',
        help: 'Verify the available formats in the headless documentation.',
      },
      {
        id: 'consumer',
        label: 'Consumer',
        placeholder: 'the comment-posting script',
        example: 'the comment-posting script',
        help: 'Who parses the output.',
      },
    ],
    whyItWorks: [
      'Bare mode stops repository content — hooks, MCP servers, instruction files — from executing in a pipeline that may run untrusted branches.',
      '`dontAsk` with an explicit allowlist means an unexpected tool call fails loudly instead of hanging on a prompt nobody will answer.',
      'Structured output makes the result programmatically consumable rather than scraped.',
      'Exit-code branching is what turns the run into a gate rather than a log line.',
    ],
    expectedBehavior: [
      'A CI step with explicit flags and no interactive assumptions.',
      'An explanation of what happens on an unlisted tool call.',
      'Flag names checked against the current documentation.',
    ],
    verification: [
      'Run the exact command locally first, in a scratch clone.',
      'Deliberately ask it to do something outside the allowlist and confirm it fails.',
      'Confirm the CI job has only the credentials this task needs.',
    ],
    failureSignals: [
      {
        signal: 'The job hangs.',
        recovery: 'Something is waiting for approval. Check the permission mode and the allowlist.',
      },
      {
        signal: 'It works locally but not in CI.',
        recovery:
          'Usually authentication: bare mode does not use your subscription login. Check the API key is set in the CI environment.',
      },
      {
        signal: 'The allowlist is a broad wildcard.',
        recovery:
          'Narrow it. In automation the allowlist is the security boundary, not a convenience setting.',
      },
    ],
    sources: ['headless', 'cliReference', 'permissionModes', 'githubActions'],
  },
  {
    slug: 'prepare-commit-or-pull-request',
    title: 'Prepare a commit or pull request after verification',
    summary:
      'Stage deliberately, describe the change honestly, and stop short of anything irreversible.',
    task: 'maintenance',
    difficulty: 'beginner',
    risk: 'medium',
    features: ['git'],
    whenToUse: [
      'Checks are green and you have read the diff.',
      'You want a commit message or PR description that reflects what actually changed.',
    ],
    prerequisites: [
      'Verification has run and passed.',
      'You have read the diff, including untracked files.',
    ],
    template: `The checks pass and I have reviewed the diff.

1. List the files you would stage for {{change}}, and any files you would
   leave out and why. Wait for me to confirm before staging.
2. Write a commit message following the convention in recent history: a
   subject line saying what changed, and a body saying why.
3. {{prStep}}

Do not push, do not force-push, and do not amend existing commits.`,
    variables: [
      {
        id: 'change',
        label: 'The change',
        placeholder: 'the expired-token fix',
        example: 'the expired-token fix',
        help: 'Names the one concern this commit covers.',
      },
      {
        id: 'prStep',
        label: 'PR step',
        placeholder:
          'Draft a pull request description with the root cause, the approach, and how to verify it.',
        example:
          'Draft a pull request description with the root cause, the approach, and how to verify it.',
        help: 'Leave this out when you only want a commit.',
      },
    ],
    whyItWorks: [
      'Listing files before staging catches the stray edit, the debug print, and the accidental config change.',
      '"Files you would leave out and why" surfaces unrelated work that should be its own commit.',
      'Following the convention in recent history produces a message that fits the repository without you describing the style.',
      'The explicit prohibitions cover the operations that are hard or impossible to undo.',
    ],
    expectedBehavior: [
      'A file list, then a pause.',
      'A message describing the change, not the process of making it.',
      'Nothing pushed.',
    ],
    verification: [
      'Compare the staged list to `git status --short` — anything unexplained is a question.',
      'Confirm the message would make sense to someone reading `git log` in six months.',
      'Run `git log --oneline -1` and `git status` before pushing anything yourself.',
    ],
    failureSignals: [
      {
        signal: 'It staged everything, including unrelated files.',
        recovery: 'Unstage, and ask for the list-and-confirm step explicitly.',
      },
      {
        signal: 'The message describes the process ("fixed the tests, then refactored").',
        recovery: 'Ask for what changed and why, from the reader’s point of view.',
      },
      {
        signal: 'It pushed or amended without being asked.',
        recovery:
          'Add a rule to your CLAUDE.md forbidding it, and consider an ask rule on `Bash(git push *)`.',
      },
    ],
    sources: ['commonWorkflows', 'permissions', 'bestPractices'],
  },
];
