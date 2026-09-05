import type { Lesson } from '../types';

export const lesson: Lesson = {
  slug: 'skills-hooks-mcp-plugins',
  moduleNumber: 7,
  title: 'Skills, hooks, MCP, and plugins',
  summary:
    'Five extension mechanisms that are easy to confuse. What each one guarantees, when it loads, and how to pick the right one.',
  level: 'Advanced systems',
  minutes: 35,
  prerequisites: ['permissions-sandboxing-security'],
  objectives: [
    'Distinguish CLAUDE.md, skills, hooks, MCP, plugins, and subagents by what they guarantee.',
    'Pick the right mechanism for a given requirement.',
    'Write a minimal skill and a minimal hook.',
    'Connect an MCP server with narrow permissions and understand its trust implications.',
  ],
  blocks: [
    { kind: 'h2', id: 'compare', text: 'One table, six mechanisms' },
    {
      kind: 'p',
      text: 'The useful axis is not "what can it do" — several of these overlap. It is **when does it load** and **does it guarantee anything**.',
    },
    {
      kind: 'table',
      caption: 'Choosing an extension mechanism',
      head: ['Mechanism', 'Loads', 'Guarantee', 'Best for'],
      rows: [
        [
          'CLAUDE.md',
          'Every session, from disk',
          'None — context',
          'Short rules that apply broadly',
        ],
        [
          '`.claude/rules/`',
          'Every session, or when matching files are read',
          'None — context',
          'Instructions scoped to part of a codebase',
        ],
        [
          'Skill',
          'When invoked, or when judged relevant',
          'None — context',
          'A repeatable multi-step procedure',
        ],
        [
          'Hook',
          'At a fixed lifecycle event',
          'Runs regardless of what Claude decides',
          'Anything that must happen every time',
        ],
        [
          'MCP server',
          'When the session connects',
          'Access, not behavior',
          'Reaching external tools and data',
        ],
        [
          'Subagent',
          'When delegated to',
          'Separate context window',
          'Bounded research; parallel independent work',
        ],
      ],
    },
    {
      kind: 'p',
      text: 'A **plugin** is a package that can bundle several of these — skills, hooks, subagents, MCP server definitions, commands — so a team can install one thing instead of six.',
    },

    { kind: 'h2', id: 'decide', text: 'Decision examples' },
    {
      kind: 'table',
      head: ['Requirement', 'Mechanism', 'Why'],
      rows: [
        [
          '"Always format edited files"',
          'Hook',
          '"Always" is a guarantee; only a hook provides one',
        ],
        [
          '"Use these project testing commands"',
          'CLAUDE.md',
          'A short fact needed in every session',
        ],
        ['"Run our release checklist"', 'Skill', 'A long procedure needed occasionally'],
        ['"Read tickets from our issue tracker"', 'MCP', 'Access to an external system'],
        [
          '"Never let anything write to `.env`"',
          'Deny rule or PreToolUse hook',
          'Enforcement, not instruction',
        ],
        [
          '"Investigate three independent subsystems"',
          'Subagents or separate sessions',
          'Independent work with separate context',
        ],
        [
          '"Our API conventions, but only for `src/api/`"',
          'A rule with `paths:` frontmatter',
          'Loads only when relevant, saving context',
        ],
      ],
    },

    { kind: 'h2', id: 'skills', text: 'Skills' },
    {
      kind: 'p',
      text: 'A skill is a directory containing a `SKILL.md`: YAML frontmatter that tells Claude when to use it, followed by the instructions it should follow when it runs. The directory name becomes the command you type.',
    },
    {
      kind: 'table',
      head: ['Scope', 'Path'],
      rows: [
        ['Personal — all your projects', '`~/.claude/skills/<skill-name>/SKILL.md`'],
        ['Project — checked into the repo', '`.claude/skills/<skill-name>/SKILL.md`'],
        ['Plugin', '`<plugin>/skills/<skill-name>/SKILL.md`'],
      ],
    },
    {
      kind: 'code',
      lang: 'markdown',
      label: '.claude/skills/release-check/SKILL.md',
      code: `---
description: Runs our pre-release checklist. Use when the user asks to cut a
  release, prepare a release, or verify the branch is releasable.
---

## Checklist

Work through these in order and stop at the first failure.

1. Confirm the working tree is clean and we are on \`main\`.
2. Run \`npm run check\` and \`npm test\`. Report both results.
3. Confirm \`CHANGELOG.md\` has an entry for the version in \`package.json\`.
4. List commits since the last tag, grouped by type.
5. Report a go/no-go with the reason. Do not tag or publish anything.`,
    },
    {
      kind: 'p',
      text: 'Only `description` is really recommended — it is what Claude uses to decide whether to load the skill. Other frontmatter fields let you restrict tools, pin a model, or prevent automatic invocation. Verify field names against the current documentation rather than copying them from memory.',
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Verify against current docs',
      body: [
        'Configuration schemas for skills, hooks, and MCP change as features ship. Treat every example on this page as a shape to understand, not a spec to copy blindly — the linked reference page is authoritative.',
      ],
    },
    { kind: 'sources', ids: ['skills'] },

    { kind: 'h2', id: 'hooks', text: 'Hooks' },
    {
      kind: 'p',
      text: 'A hook is a shell command Claude Code runs at a lifecycle event. It is the only mechanism here that gives you a guarantee, because it does not depend on the model choosing to comply.',
    },
    {
      kind: 'p',
      text: 'The documented events include `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Notification`, `Stop`, `SubagentStop`, `PreCompact`, `SessionStart`, `SessionEnd`, `PermissionRequest`, and `InstructionsLoaded`. The two you will reach for first are `PreToolUse` (to block or approve something before it happens) and `PostToolUse` (to react after).',
    },
    {
      kind: 'code',
      lang: 'json',
      label: '.claude/settings.json — format every edited file',
      code: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}`,
    },
    {
      kind: 'p',
      text: 'The matcher limits the hook to file-editing tools. The command receives the tool call as JSON on stdin, pulls out the path, and formats it. Nothing about this depends on Claude remembering to format.',
    },
    {
      kind: 'callout',
      tone: 'danger',
      title: 'Hooks execute with your privileges',
      body: [
        'A hook runs shell commands on your machine, automatically, at events you may not be watching. Review hooks in a repository before you trust the folder — the same way you would review a `postinstall` script.',
      ],
    },
    { kind: 'sources', ids: ['hooksGuide', 'hooksReference'] },

    { kind: 'h2', id: 'mcp', text: 'MCP' },
    {
      kind: 'p',
      text: 'The Model Context Protocol connects Claude Code to external tools and data — issue trackers, observability, documentation systems, databases. It grants access; it does not shape behavior.',
    },
    {
      kind: 'code',
      lang: 'bash',
      label: 'Adding servers',
      code: `# A remote HTTP server
claude mcp add --transport http notion https://mcp.notion.com/mcp

# A local stdio server; everything after -- is the launch command
claude mcp add example --env API_KEY=your-key -- npx -y @example/mcp-server

claude mcp list
claude mcp get notion
claude mcp remove notion`,
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Three things to hold in mind',
      body: [
        'MCP tool output is untrusted content. It arrives from a system other people can write to, and it lands in the context window like anything else Claude read.',
        'Grant the narrowest scope the task needs. Read-only access to the issue tracker is a different risk profile from write access to production.',
        'Each connected server adds tool definitions to the context window in every session. Connect what you use, not what you might.',
      ],
    },
    { kind: 'sources', ids: ['mcp', 'security'] },

    { kind: 'h2', id: 'subagents', text: 'Subagents' },
    {
      kind: 'p',
      text: 'A subagent is a delegated task with its own context window and, optionally, its own system prompt and tool set. Module 4 covered the context-firewall use; module 10 covers parallelism. The definition is a markdown file with frontmatter.',
    },
    {
      kind: 'code',
      lang: 'markdown',
      label: '.claude/agents/code-reviewer.md',
      code: `---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.`,
    },
    {
      kind: 'p',
      text: 'Only `name` and `description` are required. Note the `tools` line: a reviewer that cannot edit is a better reviewer, because it has to report rather than quietly fix. Restricting tools is a design decision, not just a safety measure.',
    },
    { kind: 'sources', ids: ['subAgents'] },

    { kind: 'h2', id: 'plugins', text: 'Plugins' },
    {
      kind: 'p',
      text: 'Plugins package the above for distribution. For a team, the value is that "our conventions" becomes one install rather than a wiki page nobody follows — and that updating them is a version bump rather than a broadcast message.',
    },
    {
      kind: 'p',
      text: 'The same caution applies as to any dependency: a plugin can carry hooks, which run commands on your machine. Read what you install.',
    },
    { kind: 'sources', ids: ['plugins', 'discoverPlugins'] },

    { kind: 'h2', id: 'sequence', text: 'Build it in this order' },
    {
      kind: 'ol',
      items: [
        '**Work without any of it first.** You cannot tell which friction is worth automating until you have felt it more than once.',
        '**Write CLAUDE.md when you repeat yourself.** The second time you type the same correction.',
        '**Add a hook when a rule keeps getting skipped.** That is the signal that you need a guarantee, not better wording.',
        '**Write a skill when a procedure has steps and an order.** And when you would otherwise paste it from a notes file.',
        '**Connect MCP when Claude needs data it cannot read from disk.** Not before.',
        '**Package a plugin when a second team wants your setup.** Distribution is the problem plugins solve.',
      ],
    },
  ],
  checklist: [
    'I can state what each mechanism guarantees, and which guarantee nothing.',
    'Anything that must always happen is a hook, not an instruction.',
    'My skills have a description that says when to use them.',
    'Connected MCP servers have the narrowest scope the work needs.',
    'I treat MCP tool output as untrusted content.',
    'I reviewed hooks and plugins before trusting the repository that ships them.',
  ],
  quiz: [
    {
      id: 'q1',
      prompt: 'Which mechanism is the only one that guarantees something happens?',
      options: [
        { id: 'a', text: 'CLAUDE.md' },
        { id: 'b', text: 'A skill' },
        { id: 'c', text: 'A hook' },
        { id: 'd', text: 'An MCP server' },
      ],
      correctOptionId: 'c',
      explanation:
        'Hooks execute as shell commands at fixed lifecycle events, regardless of what Claude decides. The others are context or access.',
    },
    {
      id: 'q2',
      prompt:
        'You have a twelve-step release checklist used roughly once a fortnight. Where does it belong?',
      options: [
        { id: 'a', text: 'CLAUDE.md, so it is always available.' },
        { id: 'b', text: 'A skill, so it loads when it is relevant.' },
        { id: 'c', text: 'A hook on SessionStart.' },
        { id: 'd', text: 'An MCP server.' },
      ],
      correctOptionId: 'b',
      explanation:
        'It is long and rarely relevant. In CLAUDE.md it would cost context on every unrelated task; as a skill it loads when invoked or judged relevant.',
    },
    {
      id: 'q3',
      prompt: 'Why restrict a code-reviewer subagent to `Read, Glob, Grep`?',
      options: [
        { id: 'a', text: 'Subagents cannot use edit tools.' },
        { id: 'b', text: 'It makes the review faster.' },
        {
          id: 'c',
          text: 'A reviewer that cannot edit has to report findings instead of quietly fixing them.',
        },
        { id: 'd', text: 'It reduces the context window size.' },
      ],
      correctOptionId: 'c',
      explanation:
        'Tool restriction shapes the output. Silent fixes during a review destroy the artifact you wanted — a list of findings you can act on.',
    },
    {
      id: 'q4',
      prompt: 'What is the correct posture toward output returned by an MCP server?',
      options: [
        { id: 'a', text: 'Trusted, because you configured the server.' },
        { id: 'b', text: 'Untrusted content that may contain text aimed at the agent.' },
        { id: 'c', text: 'Trusted if the server uses HTTPS.' },
        { id: 'd', text: 'Ignored unless you asked for it.' },
      ],
      correctOptionId: 'b',
      explanation:
        'The server is a channel to a system other people can write to. Issue bodies, ticket comments, and documents arrive as content, and content is data — never instructions.',
    },
  ],
  sources: [
    'featuresOverview',
    'skills',
    'hooksGuide',
    'hooksReference',
    'mcp',
    'subAgents',
    'plugins',
    'discoverPlugins',
  ],
};
