import type { Lesson } from '../types';

export const lesson: Lesson = {
  slug: 'advanced-automation-and-scale',
  moduleNumber: 10,
  title: 'Advanced automation and scale',
  summary:
    'Headless runs, structured output, enforced conventions, parallel work with isolation, and the team practices that make any of it safe.',
  level: 'Advanced systems',
  minutes: 40,
  prerequisites: ['skills-hooks-mcp-plugins', 'efficiency-cost-and-quality'],
  objectives: [
    'Run Claude Code non-interactively in scripts and CI with an explicit tool allowlist.',
    'Consume structured output from an automated run.',
    'Use parallelism with isolation, and judge when it is worth the coordination cost.',
    'Establish shared instructions, review, and cost controls for a team.',
  ],
  blocks: [
    { kind: 'h2', id: 'headless', text: 'Non-interactive runs' },
    {
      kind: 'p',
      text: 'Adding `-p` (or `--print`) runs a prompt non-interactively and prints the result. Claude Code exits 0 on success and non-zero on failure, so scripts can branch on the exit status.',
    },
    {
      kind: 'code',
      lang: 'bash',
      code: `claude -p "What does the auth module do?"`,
    },
    {
      kind: 'p',
      text: 'For CI and scripts, add `--bare`. It skips auto-discovery of hooks, skills, custom commands, subagents, plugins, MCP servers, auto memory, and `CLAUDE.md`, so the run behaves the same on every machine. A hook in a teammate’s home directory or a server in the project’s `.mcp.json` will not run, because bare mode never reads them.',
    },
    {
      kind: 'code',
      lang: 'bash',
      label: 'A reproducible scripted run',
      code: `# Bare mode does not use your subscription login; set an API key.
claude --bare -p "Summarize README.md" --allowedTools "Read"`,
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'What a plain `-p` run does read',
      body: [
        'Without `--bare`, a `-p` session runs the hooks in a project’s `.claude/settings.json` and connects the servers in its `.mcp.json` — even in a folder you have never trusted, with no trust dialog and no per-server approval prompt.',
        'That is the argument for `--bare` in any pipeline that touches code you did not write.',
      ],
    },
    { kind: 'sources', ids: ['headless', 'cliReference'] },

    { kind: 'h2', id: 'ci', text: 'A CI task with an exact allowlist' },
    {
      kind: 'p',
      text: 'In automation, name the tools rather than relying on a mode. `dontAsk` runs only pre-approved tools, so an unlisted tool fails loudly instead of silently prompting into the void.',
    },
    {
      kind: 'code',
      lang: 'bash',
      label: 'CI: an exact allowlist',
      code: `claude -p "run the test suite" \\
  --permission-mode dontAsk \\
  --allowedTools "Bash(npm test)" "Read"`,
    },
    {
      kind: 'callout',
      tone: 'danger',
      title: 'Unattended runs need real isolation',
      body: [
        'A fully unattended run with permission checks skipped belongs in a container or VM, run as a non-root user — never on a developer machine and never against production credentials.',
        'Give the job the narrowest credentials that let it do its work. A CI job that reviews a diff does not need deploy keys.',
      ],
    },

    { kind: 'h2', id: 'structured', text: 'Structured output' },
    {
      kind: 'p',
      text: 'For integrations, `--output-format` gives you something to parse instead of prose. Use it when another program consumes the result — posting a review comment, gating a pipeline, filling a dashboard.',
    },
    {
      kind: 'code',
      lang: 'bash',
      code: `claude --bare -p "List any TODO comments added in the last commit" \\
  --allowedTools "Bash(git diff HEAD~1)" \\
  --output-format json`,
    },
    {
      kind: 'p',
      text: 'A streaming JSON format is also available for consuming events as they happen. Check the headless documentation for the exact format names and payload shapes before you write a parser against them.',
    },

    { kind: 'h2', id: 'hooks', text: 'Enforce conventions with hooks' },
    {
      kind: 'p',
      text: 'At team scale, the difference between "we agreed to" and "it happens" is a hook. Formatting after edits, blocking writes to protected paths, and auditing configuration changes are all things you want true regardless of which session, which developer, or which model.',
    },
    {
      kind: 'p',
      text: 'The rule of thumb from module 7 holds: if you would be annoyed when it is skipped, an instruction is fine. If something breaks, it needs a hook.',
    },

    { kind: 'h2', id: 'parallel', text: 'Parallel work, with isolation' },
    {
      kind: 'p',
      text: 'Parallelism has three prerequisites, and skipping any one of them turns a speed-up into a merge problem.',
    },
    {
      kind: 'ol',
      items: [
        '**The tasks are genuinely independent.** Different modules, no shared interfaces in flight.',
        '**Each has its own working directory.** A worktree per session, so edits cannot collide.',
        '**Each has its own definition of done.** Otherwise you cannot tell which branch is finished.',
      ],
    },
    {
      kind: 'code',
      lang: 'bash',
      label: 'Two isolated sessions',
      code: `# Terminal one
claude --worktree search-indexing

# Terminal two
claude --worktree billing-webhooks

# Each gets .claude/worktrees/<name>/ on its own branch.
# Add .claude/worktrees/ to .gitignore.`,
    },
    {
      kind: 'p',
      text: 'Subagents are the other axis: instead of parallel sessions you drive, one session delegates bounded work and collects the results. Subagents can also be given `isolation: worktree` so their file edits happen in their own checkout.',
    },
    {
      kind: 'compare',
      title: 'When parallelism helps, and when it costs',
      sides: [
        {
          label: 'Coordination cost exceeds the benefit',
          tone: 'weak',
          code: `Three agents refactoring the same service:
  - agent A: extract the validation layer
  - agent B: rename the domain types
  - agent C: add tests for both`,
          notes: [
            'All three touch the same files.',
            'C is blocked on work A and B have not finished.',
            'You will merge three conflicting branches by hand.',
            'Sequential would have been faster and clearer.',
          ],
        },
        {
          label: 'Genuinely parallel',
          tone: 'strong',
          code: `Three agents, three subsystems:
  - agent A: why is the search index rebuild slow?
  - agent B: why do billing webhooks retry twice?
  - agent C: which endpoints lack rate limiting?`,
          notes: [
            'No overlapping files.',
            'Each has an independent, checkable answer.',
            'Read-only investigation, so nothing to merge.',
            'You get three reports and decide what to act on.',
          ],
        },
      ],
    },
    { kind: 'sources', ids: ['worktrees', 'subAgents', 'agents'] },

    { kind: 'h2', id: 'review', text: 'An adversarial pass for important changes' },
    {
      kind: 'p',
      text: 'For anything touching money, auth, data integrity, or a public interface, add a review step whose only job is to attack the change — ideally in a fresh session, so it is not anchored by the reasoning that produced it.',
    },
    {
      kind: 'code',
      lang: 'text',
      label: 'Adversarial review',
      code: `Review the diff on this branch as a hostile reviewer. For each file, name
concrete failure scenarios: inputs that break it, states it does not
handle, errors it swallows, and security or concurrency assumptions it
makes silently. Rank findings by severity, say which ones the current
tests would miss, and do not fix anything.`,
    },
    {
      kind: 'p',
      text: '"Do not fix anything" matters. A reviewer that quietly fixes what it finds destroys the artifact you wanted, which is a list of findings you can weigh.',
    },

    { kind: 'h2', id: 'team', text: 'Team practices' },
    {
      kind: 'table',
      head: ['Concern', 'Mechanism', 'Note'],
      rows: [
        [
          'Shared conventions',
          'Project `CLAUDE.md` in version control',
          'Reviewed like code; it changes behavior',
        ],
        [
          'Scoped conventions',
          '`.claude/rules/` with `paths:` frontmatter',
          'Loads only for matching files',
        ],
        ['Guarantees', 'Hooks in project settings', 'Review them — they run commands'],
        [
          'Shared procedures',
          'Skills, or a plugin for distribution',
          'One install beats a wiki page',
        ],
        ['Access boundaries', 'Permission rules, checked in', 'Deny before ask before allow'],
        ['Org-wide policy', 'Managed settings', 'Enforced by the client, not by wording'],
        ['Cost visibility', '`/cost`, `/usage`, org analytics', 'Watch cost per merged change'],
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Instruction files are code',
      body: [
        'A change to `CLAUDE.md` changes how every session in the repository behaves. Review it in a pull request. A hook change deserves more scrutiny than most application code, because it executes on every developer’s machine.',
      ],
    },

    { kind: 'h2', id: 'rollout', text: 'Rolling it out safely' },
    {
      kind: 'ol',
      items: [
        '**Start read-only.** Investigation, review, and documentation build trust and cannot break anything.',
        '**Add verification before autonomy.** A team without reliable checks should not be increasing automation; fix the checks first.',
        '**Introduce enforcement gradually.** One hook that solves a real, felt problem beats twelve that nobody asked for.',
        '**Keep a human accountable for every merge.** Automation changes who does the typing, not who is responsible.',
        '**Review the setup quarterly.** Instructions rot, permissions widen by accretion, and the tool changes underneath you.',
      ],
    },
    {
      kind: 'sources',
      ids: ['headless', 'githubActions', 'settings', 'costs', 'securityGuidance'],
    },
  ],
  checklist: [
    'Scripted runs use `--bare` and an explicit tool allowlist.',
    'Unattended runs happen in a container or VM with narrow credentials.',
    'Parallel tasks are independent and each has its own worktree.',
    'Important changes get an adversarial review pass that does not fix anything.',
    'Shared instructions and hooks are reviewed in pull requests.',
    'Someone human is accountable for every merge.',
  ],
  quiz: [
    {
      id: 'q1',
      prompt: 'Why is `--bare` recommended for CI runs?',
      options: [
        { id: 'a', text: 'It uses a cheaper model.' },
        {
          id: 'b',
          text: 'It skips discovery of hooks, skills, MCP servers, and CLAUDE.md, so runs are reproducible.',
        },
        { id: 'c', text: 'It disables the permission system.' },
        { id: 'd', text: 'It is required for JSON output.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Bare mode removes machine-specific and repository-specific configuration from the run, which is what makes CI results the same everywhere — and keeps unreviewed repository content from executing.',
    },
    {
      id: 'q2',
      prompt: 'Which set of tasks is a good fit for parallel agents?',
      options: [
        { id: 'a', text: 'Three agents refactoring different parts of the same service.' },
        { id: 'b', text: 'Three read-only investigations of three unrelated subsystems.' },
        { id: 'c', text: 'One agent writing a feature while another writes its tests.' },
        { id: 'd', text: 'Two agents making the same change so you can compare.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Independent, read-only, bounded work has nothing to merge and three separately checkable answers. The others share files or have a dependency between them.',
    },
    {
      id: 'q3',
      prompt: 'Why tell an adversarial reviewer not to fix anything?',
      options: [
        { id: 'a', text: 'Reviewers lack edit permissions.' },
        { id: 'b', text: 'Fixes would inflate the diff size.' },
        {
          id: 'c',
          text: 'Silent fixes destroy the artifact you wanted: a weighable list of findings.',
        },
        { id: 'd', text: 'It reduces token usage.' },
      ],
      correctOptionId: 'c',
      explanation:
        'You asked for judgement, not edits. A finding you can weigh and reject is more valuable than a patch you did not ask for and might not notice.',
    },
    {
      id: 'q4',
      prompt: 'A team wants to guarantee that no session ever writes to `.env`. What do they use?',
      options: [
        { id: 'a', text: 'A line in CLAUDE.md.' },
        { id: 'b', text: 'A permission deny rule, or a PreToolUse hook, in checked-in settings.' },
        { id: 'c', text: 'A skill invoked at session start.' },
        { id: 'd', text: 'A note in the README.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Deny rules and hooks are enforced by the client regardless of what the model decides. CLAUDE.md shapes behavior but guarantees nothing.',
    },
  ],
  sources: [
    'headless',
    'cliReference',
    'worktrees',
    'subAgents',
    'agents',
    'githubActions',
    'settings',
    'costs',
    'securityGuidance',
  ],
};
