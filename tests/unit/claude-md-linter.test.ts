import { describe, expect, it } from 'vitest';
import { RECOMMENDED_MAX_LINES, lintClaudeMd } from '@/lib/claude-md-linter';

function rules(source: string): string[] {
  return lintClaudeMd(source).findings.map((finding) => finding.rule);
}

describe('lintClaudeMd', () => {
  it('reports nothing for a short, specific file', () => {
    const report = lintClaudeMd(`# Payments

## Commands
- Test: \`npm test\`
- Type check: \`npm run check\`

## Conventions
- Money is \`Cents\` (integer)
- HTTP handlers must not call the database directly; go through \`src/repo/\`
`);
    expect(report.findings).toEqual([]);
  });

  it('flags generic advice', () => {
    expect(rules('- Write clean code and follow best practices')).toContain('generic-advice');
    expect(rules('- Be careful when editing')).toContain('generic-advice');
  });

  it('flags facts discoverable from the codebase', () => {
    expect(rules('This project uses React and TypeScript.')).toContain('discoverable-fact');
    expect(rules('- react ^18.2.0')).toContain('discoverable-fact');
  });

  it('flags transient details', () => {
    expect(rules('We are currently migrating the API to v2.')).toContain('transient-detail');
    expect(rules('TODO: update this section')).toContain('transient-detail');
    expect(rules('Deadline is next Friday')).toContain('transient-detail');
  });

  it('flags an advisory rule that needs a hook', () => {
    const findings = lintClaudeMd('- Always run the formatter after editing any file').findings;
    const hook = findings.find((finding) => finding.rule === 'needs-hook');
    expect(hook).toBeDefined();
    expect(hook?.suggestion).toContain('PostToolUse');
  });

  it('flags hedged, uncheckable wording', () => {
    expect(rules('- Try to keep functions small where possible')).toContain('not-actionable');
  });

  it('flags an exact duplicate and names the earlier line', () => {
    const findings = lintClaudeMd(
      [
        '- Use two-space indentation in all files',
        '- something else entirely here',
        '- Use two-space indentation in all files',
      ].join('\n'),
    ).findings;
    const duplicate = findings.find((finding) => finding.rule === 'duplicate');
    expect(duplicate).toBeDefined();
    expect(duplicate?.message).toContain('line 1');
  });

  it('flags contradicting package-manager rules', () => {
    const findings = lintClaudeMd(
      ['- Use npm for everything', '- Run pnpm install before starting'].join('\n'),
    ).findings;
    const conflict = findings.find((finding) => finding.rule === 'conflict');
    expect(conflict).toBeDefined();
    expect(conflict?.excerpt).toContain('package manager');
  });

  it('flags a file over the recommended length', () => {
    const long = Array.from({ length: RECOMMENDED_MAX_LINES + 5 }, (_, i) => `- rule ${i}`).join(
      '\n',
    );
    const findings = lintClaudeMd(long).findings;
    const tooLong = findings.find((finding) => finding.rule === 'file-too-long');
    expect(tooLong).toBeDefined();
    expect(tooLong?.line).toBe(0);
  });

  it('flags a long fenced block as tutorial content', () => {
    const source = [
      '# Guide',
      '```bash',
      ...Array.from({ length: 25 }, (_, i) => `echo ${i}`),
      '```',
    ].join('\n');
    expect(rules(source)).toContain('tutorial');
  });

  it('does not lint the contents of code fences', () => {
    const source = ['```markdown', '- Write clean code and follow best practices', '```'].join(
      '\n',
    );
    expect(rules(source)).not.toContain('generic-advice');
  });

  it('sorts findings by severity, then by line', () => {
    const report = lintClaudeMd(
      [
        '- Try to keep functions small where possible',
        '- Write clean code and follow best practices',
        'This project uses React and TypeScript.',
      ].join('\n'),
    );
    const order = report.findings.map((finding) => finding.severity);
    const rank = { high: 0, medium: 1, low: 2 } as const;
    for (let i = 1; i < order.length; i += 1) {
      expect(rank[order[i - 1]!]).toBeLessThanOrEqual(rank[order[i]!]);
    }
  });

  it('counts lines and content lines', () => {
    const report = lintClaudeMd('# Title\n\n- one\n\n- two\n');
    expect(report.lineCount).toBe(6);
    expect(report.contentLineCount).toBe(3);
  });
});
