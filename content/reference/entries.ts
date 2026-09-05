import type { ReferenceEntry } from '../types';

export const REFERENCE: ReferenceEntry[] = [
  {
    slug: 'mental-model',
    title: 'Core mental model',
    summary: 'The loop, and the one property that makes it reliable.',
    blocks: [
      {
        kind: 'p',
        text: 'Claude Code runs a loop: **prompt → inspect → act → observe → iterate → verify**. Everything else on this site is a technique for making one of those steps better.',
      },
      {
        kind: 'ul',
        items: [
          '**Inspect before acting.** An edit made before the code was read is the most common cause of a bad change.',
          '**Give it a success signal it can run.** Without one, "done" means "looks plausible" — to Claude and to you.',
          '**Bound the work.** State what may change and what must not.',
          '**Review the diff.** Tests catch what you thought to test; review catches the rest.',
          '**Record only what generalises.** If it will be true next month on a different task, write it down.',
        ],
      },
    ],
    sources: ['howItWorks', 'bestPractices'],
  },
  {
    slug: 'strong-prompt-checklist',
    title: 'Strong-prompt checklist',
    summary: 'Seven parts, used in proportion to ambiguity and risk.',
    blocks: [
      {
        kind: 'code',
        lang: 'text',
        label: 'The pattern',
        code: `Goal:
Context:
Relevant files or symptoms:
Constraints and non-goals:
Expected behavior and edge cases:
Verification commands or evidence:
Deliverable:`,
      },
      {
        kind: 'p',
        text: 'You do not need all seven for every task. Add structure in proportion to how ambiguous and how risky the work is.',
      },
      {
        kind: 'code',
        lang: 'text',
        label: 'Closing paragraph worth reusing',
        code: `When finished, report:
1. Root cause or design decision.
2. Files changed and why.
3. Verification commands run and their results.
4. Remaining risks, assumptions, or work not performed.`,
      },
    ],
    sources: ['bestPractices'],
  },
  {
    slug: 'session-commands',
    title: 'Session and context commands',
    summary: 'What to run when the window fills up or the task changes.',
    blocks: [
      {
        kind: 'table',
        head: ['Command', 'What it does'],
        rows: [
          ['`/context`', 'Shows context usage by category, including which memory files loaded'],
          ['`/clear`', 'Starts a new conversation with empty context; project memory still loads'],
          [
            '`/compact [instructions]`',
            'Summarises the conversation so far, optionally with a focus',
          ],
          [
            '`/rewind`',
            'Restores code, conversation, or both to an earlier prompt; can also summarise a range',
          ],
          ['`/resume`', 'Returns to a previous conversation'],
          ['`/memory`', 'Lists and opens memory files; toggles auto memory'],
          [
            '`/init`',
            'Generates a starting CLAUDE.md, or suggests improvements to an existing one',
          ],
          [
            '`/permissions`',
            'Views and edits permission rules and shows which settings file each came from',
          ],
          ['`/sandbox`', 'Opens the sandbox panel'],
          ['`/hooks`', 'Shows configured hooks'],
          ['`/model`, `/effort`', 'Adjusts the model and reasoning effort'],
          ['`/cost`', 'Shows spend for the session'],
        ],
      },
      {
        kind: 'callout',
        tone: 'note',
        title: 'Availability varies',
        body: [
          'Commands change between versions and some depend on your plan or surface. Run `/help` in your own session for the authoritative list.',
        ],
      },
    ],
    sources: ['commands', 'contextWindow', 'checkpointing'],
  },
  {
    slug: 'project-files',
    title: 'Common project files and directories',
    summary: 'Where configuration lives, and what loads when.',
    blocks: [
      {
        kind: 'table',
        head: ['Path', 'Purpose', 'Loads'],
        rows: [
          [
            '`./CLAUDE.md` or `./.claude/CLAUDE.md`',
            'Project instructions, shared via version control',
            'Every session',
          ],
          ['`./CLAUDE.local.md`', 'Personal project instructions — gitignore it', 'Every session'],
          ['`~/.claude/CLAUDE.md`', 'Your instructions across all projects', 'Every session'],
          [
            '`.claude/rules/*.md`',
            'Topic-specific instructions',
            'Every session, or when `paths:` matches',
          ],
          ['`.claude/skills/<name>/SKILL.md`', 'Project skills', 'When invoked or judged relevant'],
          [
            '`~/.claude/skills/<name>/SKILL.md`',
            'Personal skills',
            'When invoked or judged relevant',
          ],
          ['`.claude/agents/<name>.md`', 'Project subagents', 'When delegated to'],
          [
            '`.claude/settings.json`',
            'Project settings: permissions, hooks, sandbox',
            'Every session',
          ],
          [
            '`.claude/settings.local.json`',
            'Personal project settings — gitignore it',
            'Every session',
          ],
          ['`.mcp.json`', 'Project MCP servers', 'On connect'],
        ],
      },
      {
        kind: 'p',
        text: 'CLAUDE.md files are discovered from your working directory upward and concatenated. Files in subdirectories load on demand when Claude reads files there. Confirm what actually loaded with `/context`.',
      },
    ],
    sources: ['memory', 'settings', 'claudeDirectory', 'skills', 'subAgents'],
  },
  {
    slug: 'permissions-and-sandboxing',
    title: 'Permissions and sandboxing',
    summary: 'Two independent questions: does it run, and what can it reach.',
    blocks: [
      {
        kind: 'table',
        caption: 'Permission modes',
        head: ['Mode', 'Runs without asking'],
        rows: [
          ['`default` (Manual)', 'Reads only'],
          ['`acceptEdits`', 'Reads, file edits, common filesystem commands'],
          ['`plan`', 'Reads; edits blocked until you approve a plan'],
          ['`auto`', 'Everything, with background safety checks'],
          ['`dontAsk`', 'Only pre-approved tools'],
          ['`bypassPermissions`', 'Everything — isolated containers and VMs only'],
        ],
      },
      {
        kind: 'p',
        text: 'Rules are evaluated **deny, then ask, then allow**. The first match wins and specificity does not change the order, so a broad deny cannot carry allowlist exceptions.',
      },
      {
        kind: 'code',
        lang: 'json',
        label: '.claude/settings.json',
        code: `{
  "permissions": {
    "allow": ["Bash(npm test)", "Bash(npm run lint)", "Read"],
    "ask": ["Bash(git push *)"],
    "deny": ["Bash(curl *)", "Read(./.env)"]
  },
  "sandbox": {
    "enabled": true,
    "filesystem": { "denyRead": ["~/"], "allowRead": ["."] }
  }
}`,
      },
      {
        kind: 'callout',
        tone: 'warning',
        title: 'Verify against current docs',
        body: [
          'Mode availability depends on your plan and how you run Claude Code, and settings schemas change. Check the linked pages before relying on any of this in a team configuration.',
        ],
      },
    ],
    sources: ['permissions', 'permissionModes', 'sandboxing', 'settingsReference'],
  },
  {
    slug: 'extension-mechanisms',
    title: 'Skills, hooks, MCP, plugins, subagents',
    summary: 'Which one to reach for, by what it guarantees.',
    blocks: [
      {
        kind: 'table',
        head: ['Mechanism', 'Loads', 'Guarantee', 'Use for'],
        rows: [
          ['CLAUDE.md', 'Every session', 'None — context', 'Short rules that apply broadly'],
          [
            '`.claude/rules/`',
            'Every session, or on matching files',
            'None — context',
            'Instructions scoped to part of a codebase',
          ],
          [
            'Skill',
            'When invoked or judged relevant',
            'None — context',
            'A repeatable multi-step procedure',
          ],
          [
            'Hook',
            'At a fixed lifecycle event',
            'Runs regardless of what Claude decides',
            'Anything that must happen every time',
          ],
          ['MCP', 'On connect', 'Access, not behavior', 'External tools and data'],
          [
            'Subagent',
            'When delegated to',
            'Separate context window',
            'Bounded research; parallel work',
          ],
          [
            'Plugin',
            'When installed and enabled',
            'Whatever it bundles',
            'Distributing a team setup',
          ],
        ],
      },
      {
        kind: 'p',
        text: 'The deciding question: if Claude skipped this, would you be annoyed, or would something break? Annoyed → CLAUDE.md. Broken → hook.',
      },
    ],
    sources: ['featuresOverview', 'skills', 'hooksGuide', 'mcp', 'subAgents', 'plugins'],
  },
  {
    slug: 'git-safety-checklist',
    title: 'Git safety checklist',
    summary: 'Before, during, and after an agentic change.',
    blocks: [
      {
        kind: 'checklist',
        title: 'Before',
        items: [
          'Working tree clean (`git status --short`).',
          'On a branch, not the default branch.',
          'Baseline checks run; you know what already fails.',
        ],
      },
      {
        kind: 'checklist',
        title: 'During',
        items: [
          'One concern per session.',
          'Focused tests while iterating.',
          'No commits before review.',
        ],
      },
      {
        kind: 'checklist',
        title: 'After',
        items: [
          '`git status --short` for untracked files the diff does not show.',
          '`git diff` read in full, including deletions.',
          'No test skipped, deleted, or weakened.',
          'Staged files listed and confirmed before committing.',
          'Nothing pushed or force-pushed without you asking.',
        ],
      },
    ],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting flow',
    summary: 'Symptom to first check.',
    blocks: [
      {
        kind: 'table',
        head: ['Symptom', 'First check'],
        rows: [
          [
            'An instruction is being ignored',
            '`/context` — did the file load? Then: is the rule specific? Is another rule contradicting it?',
          ],
          ['An instruction must never be skipped', 'It needs a hook, not better wording'],
          [
            'Answers are getting worse in a long session',
            'Context is crowded. `/compact` with focus, or `/clear` and restart with what you learned',
          ],
          [
            'Claude keeps editing the wrong file',
            'Name the path explicitly; consider plan mode so it must show you the target first',
          ],
          [
            'Too many permission prompts',
            'A narrow allowlist for the commands you actually run, plus the Bash sandbox',
          ],
          [
            'A hook does not fire',
            '`/hooks` to confirm it is registered; check the matcher; run the command manually',
          ],
          [
            'A CI run hangs',
            'Something is waiting for approval — check the permission mode and the allowlist',
          ],
          [
            'Works locally, fails in CI',
            'Bare mode does not use your subscription login; check the API key in the CI environment',
          ],
          [
            'Three corrections and still wrong',
            'Stop correcting. New session, prompt containing what the failures ruled out',
          ],
        ],
      },
    ],
    sources: ['troubleshooting', 'memory', 'hooksGuide', 'headless'],
  },
];

export function getReferenceEntry(slug: string): ReferenceEntry | undefined {
  return REFERENCE.find((entry) => entry.slug === slug);
}
