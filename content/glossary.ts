import type { GlossaryTerm } from './types';

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Agentic loop',
    slug: 'agentic-loop',
    definition:
      'The cycle an agent runs: read the request, inspect the code, take an action, read the result, and repeat until the task is done. It is the reason a runnable check changes an agent’s reliability — the check is what the loop iterates against.',
    seeAlso: ['context-window', 'verification'],
    sources: ['howItWorks'],
  },
  {
    term: 'Auto memory',
    slug: 'auto-memory',
    definition:
      'Notes Claude writes for itself across sessions in a repository, based on your corrections and preferences, stored as plain markdown you can read and edit. Distinct from CLAUDE.md, which you write.',
    seeAlso: ['claude-md'],
    sources: ['memory'],
  },
  {
    term: 'Bare mode',
    slug: 'bare-mode',
    definition:
      'The `--bare` flag, which skips auto-discovery of hooks, skills, custom commands, subagents, plugins, MCP servers, auto memory, and CLAUDE.md. It is the recommended mode for CI and scripts because it makes a run reproducible across machines.',
    seeAlso: ['headless-mode'],
    sources: ['headless'],
  },
  {
    term: 'Checkpoint',
    slug: 'checkpoint',
    definition:
      'A snapshot of file state captured before each prompt, so `/rewind` can restore code, conversation, or both. It covers edits Claude made; it is not a backup of your own uncommitted work.',
    seeAlso: ['rewind'],
    sources: ['checkpointing'],
  },
  {
    term: 'CLAUDE.md',
    slug: 'claude-md',
    definition:
      'A markdown file of persistent project instructions, loaded into the context window at the start of every session. It is context, not enforcement: Claude reads it and usually complies, but nothing guarantees it.',
    seeAlso: ['hook', 'rules-directory', 'auto-memory'],
    sources: ['memory'],
  },
  {
    term: 'Compaction',
    slug: 'compaction',
    definition:
      'Summarising the conversation so far to free context-window space. It runs automatically as you approach the limit, and you can run `/compact` yourself with focus instructions to control what the summary keeps.',
    seeAlso: ['context-window', 'clear'],
    sources: ['contextWindow'],
  },
  {
    term: 'Context window',
    slug: 'context-window',
    definition:
      'Everything Claude can currently see: system prompt, instruction files, tool definitions, files read, command output, and the conversation. It is re-sent on every message, which is why irrelevant context costs on every turn rather than once.',
    seeAlso: ['compaction', 'subagent'],
    sources: ['contextWindow'],
  },
  {
    term: 'Deny rule',
    slug: 'deny-rule',
    definition:
      'A permission rule that blocks a tool or a pattern. Deny is evaluated before ask and allow, so a broad deny cannot carry allowlist exceptions — a narrower allow rule will not override it.',
    seeAlso: ['permission-mode', 'permission-rule'],
    sources: ['permissions'],
  },
  {
    term: 'Headless mode',
    slug: 'headless-mode',
    definition:
      'Running Claude Code non-interactively with `-p` or `--print`. It exits 0 on success and non-zero on failure, so scripts and CI jobs can branch on the result.',
    seeAlso: ['bare-mode', 'structured-output'],
    sources: ['headless'],
  },
  {
    term: 'Hook',
    slug: 'hook',
    definition:
      'A shell command Claude Code runs at a fixed lifecycle event such as `PreToolUse` or `PostToolUse`. The only extension mechanism that guarantees something happens, because it does not depend on the model choosing to comply.',
    seeAlso: ['claude-md', 'skill'],
    sources: ['hooksGuide', 'hooksReference'],
  },
  {
    term: 'MCP',
    slug: 'mcp',
    definition:
      'The Model Context Protocol, used to connect Claude Code to external tools and data sources such as issue trackers and documentation systems. It grants access; it does not shape behavior. Its output is untrusted content.',
    seeAlso: ['prompt-injection'],
    sources: ['mcp'],
  },
  {
    term: 'Permission mode',
    slug: 'permission-mode',
    definition:
      'The baseline for what runs without asking. Documented modes include `default` (shown as Manual), `acceptEdits`, `plan`, `auto`, `dontAsk`, and `bypassPermissions`. Rules layer on top of the mode.',
    seeAlso: ['permission-rule', 'plan-mode', 'sandbox'],
    sources: ['permissionModes'],
  },
  {
    term: 'Permission rule',
    slug: 'permission-rule',
    definition:
      'An allow, ask, or deny entry in settings that governs a tool or command pattern. Rules are evaluated deny, then ask, then allow, and the first match wins regardless of specificity.',
    seeAlso: ['deny-rule', 'permission-mode'],
    sources: ['permissions'],
  },
  {
    term: 'Plan mode',
    slug: 'plan-mode',
    definition:
      'A permission mode that blocks edits until you approve a plan. It turns "explore before you edit" from a request into a constraint, which is why it suits unfamiliar or high-impact work.',
    seeAlso: ['permission-mode'],
    sources: ['permissionModes'],
  },
  {
    term: 'Plugin',
    slug: 'plugin',
    definition:
      'A distributable package that can bundle skills, hooks, subagents, commands, and MCP server definitions, so a team installs one thing rather than assembling six. Like any dependency, it can execute code — review what you install.',
    seeAlso: ['skill', 'hook'],
    sources: ['plugins', 'discoverPlugins'],
  },
  {
    term: 'Prompt injection',
    slug: 'prompt-injection',
    definition:
      'Text placed where an agent will read it, written to look like an instruction from you. Channels include repository files, dependency documentation, issue bodies, CI logs, fetched web pages, and MCP tool output.',
    seeAlso: ['mcp', 'sandbox'],
    sources: ['security'],
  },
  {
    term: 'Rewind',
    slug: 'rewind',
    definition:
      'The `/rewind` menu, which restores code, conversation, or both to an earlier prompt, and can also summarise a chosen range of the conversation to free context.',
    seeAlso: ['checkpoint', 'compaction'],
    sources: ['checkpointing'],
  },
  {
    term: 'Rules directory',
    slug: 'rules-directory',
    definition:
      '`.claude/rules/`, holding topic-specific instruction files. A rule with `paths:` frontmatter loads only when Claude works with matching files, which keeps scoped guidance out of every unrelated session.',
    seeAlso: ['claude-md'],
    sources: ['memory'],
  },
  {
    term: 'Sandbox',
    slug: 'sandbox',
    definition:
      'OS-enforced filesystem and network isolation for Bash commands and their child processes, configured under the `sandbox` key in settings. It bounds what an action can reach, which is a different question from whether the action runs.',
    seeAlso: ['permission-mode', 'prompt-injection'],
    sources: ['sandboxing'],
  },
  {
    term: 'Skill',
    slug: 'skill',
    definition:
      'A directory containing a `SKILL.md` with frontmatter and instructions, loaded when you invoke it or when Claude judges it relevant. Suited to multi-step procedures used occasionally — the things that would bloat CLAUDE.md.',
    seeAlso: ['claude-md', 'hook'],
    sources: ['skills'],
  },
  {
    term: 'Structured output',
    slug: 'structured-output',
    definition:
      'Machine-readable results from a headless run, selected with `--output-format`. Use it when another program consumes the result rather than a person reading it.',
    seeAlso: ['headless-mode'],
    sources: ['headless'],
  },
  {
    term: 'Subagent',
    slug: 'subagent',
    definition:
      'A delegated task with its own context window and, optionally, its own system prompt and tool set. Useful as a context firewall for research, and as a unit of parallel work.',
    seeAlso: ['context-window', 'worktree'],
    sources: ['subAgents'],
  },
  {
    term: 'Verification',
    slug: 'verification',
    definition:
      'A check that produces readable pass/fail evidence — a test run, a build, a type check, a benchmark, a screenshot. The single strongest input to an agent’s reliability, because it is what the loop iterates against.',
    seeAlso: ['agentic-loop'],
    sources: ['bestPractices'],
  },
  {
    term: 'Worktree',
    slug: 'worktree',
    definition:
      'A separate working directory on its own branch from the same git repository. `claude --worktree <name>` starts a session in one, which is how parallel sessions avoid overwriting each other.',
    seeAlso: ['subagent'],
    sources: ['worktrees'],
  },
  {
    term: '/clear',
    slug: 'clear',
    definition:
      'Starts a new conversation with empty context while project memory still loads. The right command when switching to unrelated work; `/compact` is for freeing space within the same task.',
    seeAlso: ['compaction', 'context-window'],
    sources: ['commands'],
  },
  {
    term: '/context',
    slug: 'context',
    definition:
      'Shows current context usage by category, including which memory files loaded, with optimisation suggestions. The way to confirm a CLAUDE.md is actually in the session rather than assumed to be.',
    seeAlso: ['context-window', 'claude-md'],
    sources: ['commands', 'contextWindow'],
  },
];

export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((term) => term.slug === slug);
}
