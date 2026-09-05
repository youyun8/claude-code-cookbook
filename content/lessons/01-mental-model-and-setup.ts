import type { Lesson } from '../types';

export const lesson: Lesson = {
  slug: 'mental-model-and-setup',
  moduleNumber: 1,
  title: 'Mental model and setup',
  summary:
    'What an agentic coding tool actually does, how to install it, and how to prepare a repository so your first real task is safe to run.',
  level: 'Foundations',
  minutes: 25,
  prerequisites: [],
  objectives: [
    'Describe the agentic loop and how it differs from chat and from autocomplete.',
    'Install Claude Code on your operating system and start it in the right directory.',
    'Prepare a repository so that a change is easy to review and easy to undo.',
    'Run a first task end to end and confirm the result yourself.',
  ],
  blocks: [
    { kind: 'h2', id: 'what-it-is', text: 'What Claude Code is' },
    {
      kind: 'p',
      text: 'Claude Code is an agentic coding tool. It reads your codebase, edits files, runs commands, and works across multiple files and tools to finish a task. It runs in a terminal, in VS Code and JetBrains, in a desktop app, and in a browser.',
    },
    {
      kind: 'p',
      text: 'The important word is **agentic**. A chat assistant answers; an autocomplete tool suggests the next few tokens. An agent runs a loop: it takes your request, inspects the repository, decides on an action, executes it, reads the result, and repeats until it believes the task is done.',
    },
    {
      kind: 'table',
      caption: 'Three different tools that all involve a language model',
      head: ['', 'Autocomplete', 'Chat assistant', 'Agentic tool'],
      rows: [
        ['Sees', 'The open file', 'What you paste', 'The repository, plus command output'],
        ['Acts by', 'Suggesting text', 'Producing an answer', 'Editing files and running commands'],
        ['Knows it worked when', 'You accept it', 'You say so', 'A check it ran passed'],
        ['Your job', 'Accept or reject', 'Copy and adapt', 'Scope, review, and verify'],
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'The consequence of the loop',
      body: [
        'Because Claude acts and then reads the result, giving it something it can run — a test, a linter, a type check — changes its behavior. It stops guessing and starts iterating against evidence.',
        'This is the single idea the rest of this course keeps returning to. Everything else is technique.',
      ],
    },
    {
      kind: 'lab',
      lab: 'terminal-walkthrough',
      title: 'The loop, one step at a time',
      description:
        'A simulated session showing what Claude does between your prompt and its answer.',
    },

    { kind: 'h2', id: 'surfaces', text: 'Where it runs' },
    {
      kind: 'p',
      text: 'Claude Code runs on several surfaces. This course teaches ideas that apply to all of them, and uses terminal commands in examples because they are the most explicit.',
    },
    {
      kind: 'ul',
      items: [
        '**Terminal** — the full-featured CLI. Everything in this course works here.',
        '**VS Code and JetBrains** — extensions that add inline diffs and editor context. The VS Code extension needs no separate CLI install; the JetBrains plugin does.',
        '**Desktop app** — a standalone app with visual diff review and multiple sessions side by side. It bundles Claude Code, so no separate CLI install is needed.',
        '**Web and mobile** — sessions at claude.ai/code that run in a cloud container, useful for long tasks and repositories you do not have locally.',
      ],
    },
    {
      kind: 'sources',
      ids: ['overview', 'platforms'],
      note: 'Surface availability and requirements change; check before you commit a team to one.',
    },

    { kind: 'h2', id: 'install', text: 'Install and authenticate' },
    {
      kind: 'p',
      text: 'The native installer is the recommended path on every platform, and native installs update themselves in the background.',
    },
    {
      kind: 'code',
      lang: 'bash',
      label: 'macOS, Linux, WSL',
      code: 'curl -fsSL https://claude.ai/install.sh | bash',
    },
    {
      kind: 'code',
      lang: 'powershell',
      label: 'Windows PowerShell',
      code: 'irm https://claude.ai/install.ps1 | iex',
    },
    {
      kind: 'code',
      lang: 'batch',
      label: 'Windows CMD',
      code: 'curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd',
    },
    {
      kind: 'p',
      text: 'Package managers work too — `brew install --cask claude-code` on macOS and `winget install Anthropic.ClaudeCode` on Windows — but neither auto-updates, so you upgrade them yourself.',
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Windows without WSL',
      body: [
        'On native Windows, installing Git for Windows is recommended so Claude Code can use the Bash tool. Without it, Claude Code uses PowerShell as its shell instead.',
        'The built-in Bash sandbox covered in module 6 runs on macOS, Linux, and WSL2. Native Windows is not supported, so run Claude Code inside a WSL2 distribution if you want it.',
      ],
    },
    {
      kind: 'p',
      text: 'Start Claude in a project directory. You will be prompted to log in the first time. Setting `ANTHROPIC_API_KEY` skips the login prompt and asks you to approve the key instead.',
    },
    { kind: 'code', lang: 'bash', code: 'cd your-project\nclaude' },
    { kind: 'sources', ids: ['overview', 'quickstart', 'sandboxing'] },

    { kind: 'h2', id: 'directory', text: 'Start in the right directory' },
    {
      kind: 'p',
      text: 'Where you launch matters more than it looks. Claude Code loads `CLAUDE.md` files from your working directory and every directory above it, and the working directory is what read-only tools can reach without asking. Launching from your home folder gives you a session with no project context and an uncomfortably wide blast radius.',
    },
    {
      kind: 'ul',
      items: [
        'In a monorepo, launch from the package you are working on when the work is local to it, so nested instructions and rules apply.',
        'Use `--add-dir` (or `/add-dir` in a session) when Claude genuinely needs a second directory. Adding a directory grants file access; it is not a substitute for scoping your task.',
        'Never launch in a directory you would not want edited.',
      ],
    },

    { kind: 'h2', id: 'prepare', text: 'Prepare the repository' },
    {
      kind: 'p',
      text: 'Five minutes here saves an hour of untangling later. Do this before your first agentic change in any repository.',
    },
    {
      kind: 'ol',
      items: [
        "**Get to a clean git status.** Commit or stash what you have. If your uncommitted work is mixed with Claude's edits, `git diff` stops being a review tool.",
        '**Work on a branch.** Not because Claude is reckless, but because a branch makes "throw it away and retry with a better prompt" a one-line operation.',
        '**Run the baseline checks yourself.** Run the test suite, the build, the linter, the type check — whatever your project has — and note what already fails. You cannot tell whether Claude broke something if you never knew the starting state.',
        '**Know where your secrets are.** `.env` files, keychains, cloud credential files. Module 6 covers how to keep them out of reach; for now, just know what exists.',
        '**Check `.gitignore` covers build output.** Otherwise a "review the diff" step drowns in generated files.',
      ],
    },
    {
      kind: 'code',
      lang: 'bash',
      label: 'Baseline, before you ask for anything',
      code: `git status --short          # should be empty
git switch -c try/first-task

npm test                    # or pytest, go test ./..., cargo test
npm run typecheck           # note anything already failing`,
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Uncommitted work is not protected',
      body: [
        'Claude Code checkpoints its own file edits, and `/rewind` can restore them. That is a safety net for edits Claude made, not a backup of work you had in progress.',
        'Commit or stash first. It is the cheapest insurance in this course.',
      ],
    },
    { kind: 'sources', ids: ['checkpointing', 'bestPractices'] },

    { kind: 'h2', id: 'first-session', text: 'Your first session' },
    {
      kind: 'p',
      text: 'A good first task is read-only. You learn how Claude explores, and nothing can go wrong.',
    },
    {
      kind: 'code',
      lang: 'text',
      label: 'Prompt',
      code: `Explore this repository and explain how a request reaches the database,
starting from the HTTP entry point. Do not modify any files. Cite the
paths and symbols you relied on, name the tests that cover that path,
and list anything you could not determine. Keep it under 300 words.`,
    },
    {
      kind: 'p',
      text: 'Notice what that prompt does: it states a goal, forbids edits, asks for citations you can check, and caps the length. You can verify the answer by opening the files it named. That is the whole skill, in miniature.',
    },
    {
      kind: 'p',
      text: 'Then try a small, verifiable change. Something with an obvious check — a typo in a user-facing string, a missing null guard with a test you can write. Ask for the change, ask for the test run, then read the diff yourself before you commit anything.',
    },
    {
      kind: 'compare',
      title: 'First real task: two ways to ask',
      sides: [
        {
          label: 'Incomplete',
          tone: 'weak',
          code: 'Clean up the date formatting helper.',
          notes: [
            'No definition of "clean up" — Claude picks one.',
            'No file named, so it searches first and may pick the wrong helper.',
            'Nothing to run, so "done" means "looks plausible".',
          ],
        },
        {
          label: 'Workable',
          tone: 'strong',
          code: `In src/lib/date.ts, formatRelative() returns "in -3 days" for past
dates. Fix it so past dates render as "3 days ago". Do not change the
function signature or the exported names. Add a test for a past date, a
future date, and now. Run \`npm test -- date\` and report the results.`,
          notes: [
            'Names the file and the function, so exploration is short.',
            'States the expected output, so "correct" is checkable.',
            'Names a non-goal, so the diff stays small.',
            'Names a command that produces pass or fail.',
          ],
        },
      ],
    },

    { kind: 'h2', id: 'not-infallible', text: 'What this does not remove' },
    {
      kind: 'p',
      text: 'Claude Code is genuinely capable, and it is also wrong sometimes — confidently. It can misread an abstraction, fix a symptom instead of a cause, or satisfy a test in a way that does not satisfy the requirement.',
    },
    {
      kind: 'p',
      text: 'The permission system exists because of this. So does the review step. You remain the engineer of record for everything that lands in your repository, and the rest of this course is largely about building habits that make that responsibility cheap to discharge.',
    },
  ],
  checklist: [
    'Claude Code is installed and I have logged in successfully.',
    'I can start a session from a project directory and get a prompt.',
    'My working tree is clean and I am on a branch.',
    'I have run the project’s tests and know what already fails.',
    'I completed one read-only exploration task and checked its citations.',
  ],
  quiz: [
    {
      id: 'q1',
      prompt: 'What most distinguishes an agentic coding tool from a chat assistant?',
      options: [
        { id: 'a', text: 'It uses a larger model.' },
        { id: 'b', text: 'It executes actions and reads the results, then iterates.' },
        { id: 'c', text: 'It has been trained on your repository.' },
        { id: 'd', text: 'It never needs review.' },
      ],
      correctOptionId: 'b',
      explanation:
        'The loop is the difference: inspect, act, observe, iterate. That is also why giving Claude something it can run changes its reliability — it can read whether the last action worked.',
    },
    {
      id: 'q2',
      prompt: 'Why commit or stash your work before starting an agentic task?',
      options: [
        { id: 'a', text: 'Claude Code refuses to run in a dirty working tree.' },
        { id: 'b', text: 'It makes `git diff` a usable review tool and makes retrying cheap.' },
        { id: 'c', text: 'Uncommitted files are invisible to Claude.' },
        { id: 'd', text: 'It reduces token usage.' },
      ],
      correctOptionId: 'b',
      explanation:
        'A clean baseline means the diff shows exactly what Claude changed. Checkpoints cover edits Claude made; they are not a backup of your own in-progress work.',
    },
    {
      id: 'q3',
      prompt: 'Which first task teaches the most while risking the least?',
      options: [
        { id: 'a', text: 'A repository-wide refactor to see how far it gets.' },
        { id: 'b', text: 'A read-only exploration whose citations you can check.' },
        { id: 'c', text: 'Upgrading the framework major version.' },
        { id: 'd', text: 'Asking it to fix every failing test at once.' },
      ],
      correctOptionId: 'b',
      explanation:
        'A read-only task shows you how Claude explores and gives you an answer you can verify by opening the files it named, with no possibility of an unwanted edit.',
    },
  ],
  sources: ['overview', 'quickstart', 'bestPractices', 'platforms', 'checkpointing'],
};
