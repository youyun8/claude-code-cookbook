/**
 * Heuristic linter for CLAUDE.md files.
 *
 * These are sample rules, not an authoritative validator. They encode the
 * guidance from the official memory documentation — keep the file short,
 * specific, and free of things Claude can read from the codebase — as a set
 * of deterministic checks a learner can inspect and argue with.
 *
 * Everything runs locally on a string. Nothing is uploaded.
 */

export type FindingSeverity = 'high' | 'medium' | 'low';

export type FindingRule =
  | 'generic-advice'
  | 'discoverable-fact'
  | 'transient-detail'
  | 'not-actionable'
  | 'duplicate'
  | 'conflict'
  | 'tutorial'
  | 'needs-hook'
  | 'file-too-long';

export interface Finding {
  rule: FindingRule;
  severity: FindingSeverity;
  /** 1-indexed line the finding anchors to. 0 means "the file as a whole". */
  line: number;
  excerpt: string;
  message: string;
  suggestion: string;
}

export interface LintReport {
  findings: Finding[];
  lineCount: number;
  /** Non-blank, non-comment content lines. */
  contentLineCount: number;
}

/** Documented target: keep a CLAUDE.md under roughly 200 lines. */
export const RECOMMENDED_MAX_LINES = 200;

const GENERIC_PHRASES: { pattern: RegExp; label: string }[] = [
  { pattern: /(?:乾淨|高品質|易讀)的?程式碼/, label: 'write clean code' },
  { pattern: /(?:遵循|採用)最佳(?:實務|做法)/, label: 'follow best practices' },
  { pattern: /(?:務必|請)?(?:小心|仔細|謹慎)/, label: 'be careful' },
  { pattern: /\bwrite (?:clean|good|high[- ]quality|readable) code\b/i, label: 'write clean code' },
  { pattern: /\bfollow (?:industry )?best practices\b/i, label: 'follow best practices' },
  { pattern: /\bbe (?:careful|thorough|mindful|diligent)\b/i, label: 'be careful' },
  {
    pattern: /\buse (?:meaningful|descriptive|good) (?:variable )?names\b/i,
    label: 'use good names',
  },
  {
    pattern: /\b(?:add|write) (?:comments|documentation) where (?:needed|appropriate)\b/i,
    label: 'comment where appropriate',
  },
  { pattern: /\bkeep (?:functions|code) (?:small|short|simple)\b/i, label: 'keep functions small' },
  { pattern: /\bdon'?t repeat yourself\b|\bDRY principle\b/i, label: 'DRY' },
  { pattern: /\bthink (?:step by step|carefully)\b/i, label: 'think carefully' },
  { pattern: /\bwrite tests?\b(?!\s+(?:with|using|in|for `))/i, label: 'write tests' },
  {
    pattern: /\bhandle errors? (?:properly|gracefully|appropriately)\b/i,
    label: 'handle errors properly',
  },
];

const DISCOVERABLE_PATTERNS: { pattern: RegExp; what: string }[] = [
  {
    pattern: /(?:本|此|這個)專案使用\s*(?:React|Vue|TypeScript|Next.js)/,
    what: 'the framework, which is visible in the manifest files',
  },
  {
    pattern:
      /^\s*[-*]\s*`?[\w.-]+\/`?\s*[-–—:]\s*(?:contains|holds|has|is where|directory|folder)\b/i,
    what: 'a directory description',
  },
  {
    pattern:
      /\bthis (?:project|repo(?:sitory)?) (?:uses|is built with|is written in)\s+(?:React|Vue|Angular|Svelte|Next\.js|TypeScript|JavaScript|Python|Go|Rust|Java|Ruby|PHP|Django|Rails|Express|Flask)\b/i,
    what: 'the framework, which is visible in the manifest files',
  },
  {
    pattern:
      /^\s*[-*]\s*(?:react|vue|typescript|eslint|prettier|jest|vitest|webpack|vite|tailwind)\b[\s@^~]*\d+\.\d+/i,
    what: 'a dependency version, which lives in the lockfile',
  },
  {
    pattern: /\bthe (?:codebase|project) has \d+ (?:files|packages|modules|components)\b/i,
    what: 'a file count',
  },
];

const TRANSIENT_PATTERNS: { pattern: RegExp; what: string }[] = [
  { pattern: /(?:目前|暫時|這週|下週|截止日期)/, what: 'a point-in-time statement' },
  {
    pattern:
      /\b(?:currently|right now|at the moment|for now|as of (?:today|this week|\w+ \d{4}))\b/i,
    what: 'a point-in-time statement',
  },
  {
    pattern:
      /\b(?:we are|we're|team is) (?:currently )?(?:migrating|refactoring|rewriting|working on)\b/i,
    what: 'in-flight work',
  },
  { pattern: /\bTODO\b|\bFIXME\b|\bWIP\b/, what: 'a task marker' },
  {
    pattern: /\b(?:sprint|Q[1-4]\s*20\d{2}|deadline|by (?:next )?(?:friday|monday|week))\b/i,
    what: 'a schedule',
  },
  {
    pattern: /\b(?:broken|failing|flaky) (?:right now|currently|this week)\b/i,
    what: 'a transient failure',
  },
];

const NOT_ACTIONABLE =
  /\b(?:try to|generally|usually|ideally|where possible|if possible|when appropriate|as needed|prefer to maybe|should probably|might want to|consider)\b/i;

const NEEDS_HOOK: { pattern: RegExp; mechanism: string }[] = [
  {
    pattern: /每次.*(?:編輯|修改).*(?:格式化|執行)|(?:編輯|修改).*後.*(?:一定|務必)/,
    mechanism: 'a PostToolUse hook',
  },
  {
    pattern:
      /\balways (?:run|format|lint|prettier|gofmt|rustfmt|black)\b[^.\n]*\b(?:after|before|on every|when(?:ever)?)\b/i,
    mechanism: 'a PostToolUse hook',
  },
  {
    pattern: /\b(?:always|make sure to) run [`'"]?[\w -]+[`'"]? before (?:every )?commit\b/i,
    mechanism: 'a PreToolUse hook on the commit command, or a pre-commit hook',
  },
  {
    pattern: /\bnever (?:edit|modify|touch|write to)\b[^.\n]*\.(?:env|pem|key)\b/i,
    mechanism: 'a permissions deny rule or a PreToolUse hook',
  },
  {
    pattern: /\bnever (?:commit|push) (?:secrets|credentials|api keys?)\b/i,
    mechanism: 'a deny rule plus a secret scanner in CI',
  },
];

const NORMALIZE_CONFLICT: { subject: string; options: { pattern: RegExp; value: string }[] }[] = [
  {
    subject: 'package manager',
    options: [
      { pattern: /\buse (?:`)?npm(?:`)?\b|\bnpm (?:install|run|test)\b/i, value: 'npm' },
      { pattern: /\buse (?:`)?pnpm(?:`)?\b|\bpnpm (?:install|run|test)\b/i, value: 'pnpm' },
      { pattern: /\buse (?:`)?yarn(?:`)?\b|\byarn (?:install|run|test)\b/i, value: 'yarn' },
    ],
  },
  {
    subject: 'indentation',
    options: [
      { pattern: /\b(?:use )?tabs?\b(?:\s+for indent)?/i, value: 'tabs' },
      { pattern: /\b(?:use )?\d+[- ]space(?:s)? indent/i, value: 'spaces' },
    ],
  },
  {
    subject: 'commit policy',
    options: [
      {
        pattern: /\b(?:always )?commit (?:your |the )?(?:changes|work) (?:when|after|once)\b/i,
        value: 'commit automatically',
      },
      { pattern: /\b(?:never|do not|don'?t) commit\b/i, value: 'never commit' },
    ],
  },
];

function normalizeForDuplicates(line: string): string {
  return line
    .replace(/^\s*[-*+]\s*/, '')
    .replace(/^#+\s*/, '')
    .replace(/[`*_]/g, '')
    .replace(/[.,;:!?]+$/, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptOf(line: string): string {
  const trimmed = line.trim();
  return trimmed.length > 100 ? `${trimmed.slice(0, 97)}…` : trimmed;
}

export function lintClaudeMd(source: string): LintReport {
  const lines = source.split(/\r?\n/);
  const findings: Finding[] = [];

  let inFence = false;
  let fenceStart = 0;
  let fenceLength = 0;
  const seen = new Map<string, number>();
  const conflictHits = new Map<string, { value: string; line: number }[]>();
  let contentLineCount = 0;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (/^\s*```/.test(line)) {
      if (inFence) {
        if (fenceLength > 20) {
          findings.push({
            rule: 'tutorial',
            severity: 'medium',
            line: fenceStart,
            excerpt: `Code block of ${fenceLength} lines`,
            message:
              'A long code block reads like a tutorial. CLAUDE.md is loaded into every session, so a walkthrough costs context on every task, whether or not it is relevant.',
            suggestion:
              'Move the walkthrough into a skill, which loads only when it is relevant, and leave a one-line pointer here.',
          });
        }
        inFence = false;
        fenceLength = 0;
      } else {
        inFence = true;
        fenceStart = lineNumber;
        fenceLength = 0;
      }
      return;
    }

    if (inFence) {
      fenceLength += 1;
      return;
    }

    const trimmed = line.trim();
    if (trimmed.length === 0) return;
    contentLineCount += 1;
    if (/^<!--/.test(trimmed)) return;

    for (const { pattern, label } of GENERIC_PHRASES) {
      if (pattern.test(trimmed)) {
        findings.push({
          rule: 'generic-advice',
          severity: 'high',
          line: lineNumber,
          excerpt: excerptOf(trimmed),
          message: `"${label}" is advice any competent model already applies. It spends context without changing behavior, and it dilutes the rules around it.`,
          suggestion:
            'Delete it, or replace it with the project-specific version — the rule someone would only know after a code review here.',
        });
        break;
      }
    }

    for (const { pattern, what } of DISCOVERABLE_PATTERNS) {
      if (pattern.test(trimmed)) {
        findings.push({
          rule: 'discoverable-fact',
          severity: 'medium',
          line: lineNumber,
          excerpt: excerptOf(trimmed),
          message: `This states ${what}. Claude can read that from the repository, and a stale copy here is worse than no copy.`,
          suggestion: 'Remove it. Keep only what the code does not say out loud.',
        });
        break;
      }
    }

    for (const { pattern, what } of TRANSIENT_PATTERNS) {
      if (pattern.test(trimmed)) {
        findings.push({
          rule: 'transient-detail',
          severity: 'medium',
          line: lineNumber,
          excerpt: excerptOf(trimmed),
          message: `This is ${what}. It will be wrong soon, and nobody will remember to update it.`,
          suggestion:
            'Move it to the issue tracker or the pull request. CLAUDE.md is for facts that stay true.',
        });
        break;
      }
    }

    for (const { pattern, mechanism } of NEEDS_HOOK) {
      if (pattern.test(trimmed)) {
        findings.push({
          rule: 'needs-hook',
          severity: 'high',
          line: lineNumber,
          excerpt: excerptOf(trimmed),
          message:
            'This must happen every time. CLAUDE.md is context, not enforcement — Claude reads it and usually complies, but nothing guarantees it.',
          suggestion: `Move the requirement to ${mechanism}, which runs regardless of what Claude decides.`,
        });
        break;
      }
    }

    if (NOT_ACTIONABLE.test(trimmed) && !/`/.test(trimmed)) {
      findings.push({
        rule: 'not-actionable',
        severity: 'low',
        line: lineNumber,
        excerpt: excerptOf(trimmed),
        message:
          'Hedged wording gives Claude room to skip the instruction, and no way to tell whether it followed it.',
        suggestion:
          'Rewrite it as something you could check: name the command, the path, or the exact convention.',
      });
    }

    const key = normalizeForDuplicates(trimmed);
    if (key.length > 12) {
      const previous = seen.get(key);
      if (previous !== undefined) {
        findings.push({
          rule: 'duplicate',
          severity: 'low',
          line: lineNumber,
          excerpt: excerptOf(trimmed),
          message: `This repeats line ${previous}. Repetition does not increase adherence; it just costs context.`,
          suggestion: 'Keep one copy, in the section where a reader would look for it.',
        });
      } else {
        seen.set(key, lineNumber);
      }
    }

    for (const { subject, options } of NORMALIZE_CONFLICT) {
      for (const option of options) {
        if (option.pattern.test(trimmed)) {
          const hits = conflictHits.get(subject) ?? [];
          hits.push({ value: option.value, line: lineNumber });
          conflictHits.set(subject, hits);
          break;
        }
      }
    }
  });

  for (const [subject, hits] of conflictHits) {
    const distinct = [...new Set(hits.map((hit) => hit.value))];
    if (distinct.length > 1) {
      const last = hits[hits.length - 1];
      if (!last) continue;
      findings.push({
        rule: 'conflict',
        severity: 'high',
        line: last.line,
        excerpt: `${subject}: ${distinct.join(' vs ')}`,
        message: `Two rules disagree about ${subject}. When instructions contradict, Claude may pick either one, and you will not know which.`,
        suggestion: `Decide on one and delete the other. If both are genuinely true, say when each applies.`,
      });
    }
  }

  if (lines.length > RECOMMENDED_MAX_LINES) {
    findings.push({
      rule: 'file-too-long',
      severity: 'high',
      line: 0,
      excerpt: `${lines.length} lines`,
      message: `This file is ${lines.length} lines. The documented target is under ${RECOMMENDED_MAX_LINES}: longer files consume more context every session and reduce how reliably any single rule is followed.`,
      suggestion:
        'Split path-specific guidance into .claude/rules/ files with `paths:` frontmatter so they load only when Claude touches matching files, and move procedures into skills.',
    });
  }

  findings.sort((a, b) => {
    const order: Record<FindingSeverity, number> = { high: 0, medium: 1, low: 2 };
    if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
    return a.line - b.line;
  });

  return { findings, lineCount: lines.length, contentLineCount };
}
