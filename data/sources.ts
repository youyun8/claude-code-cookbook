/**
 * Central registry of official documentation sources.
 *
 * Every version-sensitive claim on this site links to one of these entries.
 * `lastReviewed` is a build-time content field: it records when a human
 * checked the claim against the page, and it never uses the viewer's clock.
 *
 * When you revise content, update the date on the entries you re-checked.
 */

export interface Source {
  id: string;
  title: string;
  url: string;
  /** ISO date (YYYY-MM-DD) the linked page was last checked. */
  lastReviewed: string;
}

/** Shown site-wide as the freshness label for technical content. */
export const CONTENT_LAST_REVIEWED = '2026-09-05';

const DOCS = 'https://code.claude.com/docs/en';

export const SOURCES = {
  overview: {
    id: 'overview',
    title: 'Claude Code overview',
    url: `${DOCS}/overview`,
    lastReviewed: '2026-09-05',
  },
  quickstart: {
    id: 'quickstart',
    title: 'Quickstart',
    url: `${DOCS}/quickstart`,
    lastReviewed: '2026-09-05',
  },
  bestPractices: {
    id: 'bestPractices',
    title: 'Best practices for Claude Code',
    url: `${DOCS}/best-practices`,
    lastReviewed: '2026-09-05',
  },
  commonWorkflows: {
    id: 'commonWorkflows',
    title: 'Common workflows',
    url: `${DOCS}/common-workflows`,
    lastReviewed: '2026-09-05',
  },
  memory: {
    id: 'memory',
    title: 'How Claude remembers your project',
    url: `${DOCS}/memory`,
    lastReviewed: '2026-09-05',
  },
  permissions: {
    id: 'permissions',
    title: 'Configure permissions',
    url: `${DOCS}/permissions`,
    lastReviewed: '2026-09-05',
  },
  permissionModes: {
    id: 'permissionModes',
    title: 'Choose a permission mode',
    url: `${DOCS}/permission-modes`,
    lastReviewed: '2026-09-05',
  },
  sandboxing: {
    id: 'sandboxing',
    title: 'Configure the sandboxed Bash tool',
    url: `${DOCS}/sandboxing`,
    lastReviewed: '2026-09-05',
  },
  sandboxEnvironments: {
    id: 'sandboxEnvironments',
    title: 'Choose a sandbox environment',
    url: `${DOCS}/sandbox-environments`,
    lastReviewed: '2026-09-05',
  },
  skills: {
    id: 'skills',
    title: 'Extend Claude with skills',
    url: `${DOCS}/skills`,
    lastReviewed: '2026-09-05',
  },
  hooksGuide: {
    id: 'hooksGuide',
    title: 'Automate actions with hooks',
    url: `${DOCS}/hooks-guide`,
    lastReviewed: '2026-09-05',
  },
  hooksReference: {
    id: 'hooksReference',
    title: 'Hooks reference',
    url: `${DOCS}/hooks`,
    lastReviewed: '2026-09-05',
  },
  mcp: {
    id: 'mcp',
    title: 'Connect Claude Code to tools via MCP',
    url: `${DOCS}/mcp`,
    lastReviewed: '2026-09-05',
  },
  subAgents: {
    id: 'subAgents',
    title: 'Create custom subagents',
    url: `${DOCS}/sub-agents`,
    lastReviewed: '2026-09-05',
  },
  agents: {
    id: 'agents',
    title: 'Run agents in parallel',
    url: `${DOCS}/agents`,
    lastReviewed: '2026-09-05',
  },
  worktrees: {
    id: 'worktrees',
    title: 'Run parallel sessions with worktrees',
    url: `${DOCS}/worktrees`,
    lastReviewed: '2026-09-05',
  },
  headless: {
    id: 'headless',
    title: 'Run Claude Code programmatically',
    url: `${DOCS}/headless`,
    lastReviewed: '2026-09-05',
  },
  cliReference: {
    id: 'cliReference',
    title: 'CLI reference',
    url: `${DOCS}/cli-reference`,
    lastReviewed: '2026-09-05',
  },
  commands: {
    id: 'commands',
    title: 'Commands',
    url: `${DOCS}/commands`,
    lastReviewed: '2026-09-05',
  },
  security: {
    id: 'security',
    title: 'Security',
    url: `${DOCS}/security`,
    lastReviewed: '2026-09-05',
  },
  settings: {
    id: 'settings',
    title: 'Claude Code settings',
    url: `${DOCS}/settings`,
    lastReviewed: '2026-09-05',
  },
  settingsReference: {
    id: 'settingsReference',
    title: 'Claude Code settings reference',
    url: `${DOCS}/settings-reference`,
    lastReviewed: '2026-09-05',
  },
  contextWindow: {
    id: 'contextWindow',
    title: 'Explore the context window',
    url: `${DOCS}/context-window`,
    lastReviewed: '2026-09-05',
  },
  checkpointing: {
    id: 'checkpointing',
    title: 'Checkpointing',
    url: `${DOCS}/checkpointing`,
    lastReviewed: '2026-09-05',
  },
  sessions: {
    id: 'sessions',
    title: 'Manage sessions',
    url: `${DOCS}/sessions`,
    lastReviewed: '2026-09-05',
  },
  costs: {
    id: 'costs',
    title: 'Manage costs effectively',
    url: `${DOCS}/costs`,
    lastReviewed: '2026-09-05',
  },
  modelConfig: {
    id: 'modelConfig',
    title: 'Model configuration',
    url: `${DOCS}/model-config`,
    lastReviewed: '2026-09-05',
  },
  featuresOverview: {
    id: 'featuresOverview',
    title: 'Extend Claude Code',
    url: `${DOCS}/features-overview`,
    lastReviewed: '2026-09-05',
  },
  howItWorks: {
    id: 'howItWorks',
    title: 'How Claude Code works',
    url: `${DOCS}/how-claude-code-works`,
    lastReviewed: '2026-09-05',
  },
  claudeDirectory: {
    id: 'claudeDirectory',
    title: 'Explore the .claude directory',
    url: `${DOCS}/claude-directory`,
    lastReviewed: '2026-09-05',
  },
  toolsReference: {
    id: 'toolsReference',
    title: 'Tools reference',
    url: `${DOCS}/tools-reference`,
    lastReviewed: '2026-09-05',
  },
  plugins: {
    id: 'plugins',
    title: 'Create plugins',
    url: `${DOCS}/plugins`,
    lastReviewed: '2026-09-05',
  },
  discoverPlugins: {
    id: 'discoverPlugins',
    title: 'Discover and install prebuilt plugins',
    url: `${DOCS}/discover-plugins`,
    lastReviewed: '2026-09-05',
  },
  troubleshooting: {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    url: `${DOCS}/troubleshooting`,
    lastReviewed: '2026-09-05',
  },
  glossary: {
    id: 'glossary',
    title: 'Glossary',
    url: `${DOCS}/glossary`,
    lastReviewed: '2026-09-05',
  },
  largeCodebases: {
    id: 'largeCodebases',
    title: 'Set up Claude Code in a monorepo or large codebase',
    url: `${DOCS}/large-codebases`,
    lastReviewed: '2026-09-05',
  },
  securityGuidance: {
    id: 'securityGuidance',
    title: 'Catch security issues as Claude writes code',
    url: `${DOCS}/security-guidance`,
    lastReviewed: '2026-09-05',
  },
  githubActions: {
    id: 'githubActions',
    title: 'Claude Code GitHub Actions',
    url: `${DOCS}/github-actions`,
    lastReviewed: '2026-09-05',
  },
  platforms: {
    id: 'platforms',
    title: 'Platforms and integrations',
    url: `${DOCS}/platforms`,
    lastReviewed: '2026-09-05',
  },
  docsIndex: {
    id: 'docsIndex',
    title: 'Claude Code documentation index',
    url: 'https://code.claude.com/docs/llms.txt',
    lastReviewed: '2026-09-05',
  },
} as const satisfies Record<string, Source>;

export type KnownSourceId = keyof typeof SOURCES;

export function getSource(id: string): Source | undefined {
  return (SOURCES as Record<string, Source>)[id];
}

export function getSources(ids: readonly string[]): Source[] {
  return ids.map(getSource).filter((source): source is Source => source !== undefined);
}

export const ALL_SOURCES: Source[] = Object.values(SOURCES);
