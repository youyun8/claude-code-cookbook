'use client';

import { useMemo, useState } from 'react';
import { LabShell } from './LabShell';
import { lintClaudeMd, type FindingSeverity } from '@/lib/claude-md-linter';

const SAMPLE = `# Our project

## General
- Write clean code and follow best practices
- Be careful when making changes
- Use meaningful variable names
- Test your changes

## Setup
This project uses React and TypeScript.
Dependencies:
- react ^18.2.0
- eslint ^8.50.0

## Structure
- src/ - contains the source code
- tests/ - contains the tests

## Rules
- Use npm for everything
- Run pnpm install before starting
- Always run the formatter after editing any file
- Try to keep functions small where possible
- Write clean code and follow best practices

## Status
We are currently migrating the API to v2. TODO: update this section when done.
Deadline is next Friday.
`;

const SEVERITY_STYLE: Record<FindingSeverity, { chip: string; icon: string; label: string }> = {
  high: { chip: 'border-danger-line bg-danger-soft text-danger', icon: '■', label: 'High' },
  medium: { chip: 'border-warning-line bg-warning-soft text-warning', icon: '▲', label: 'Medium' },
  low: { chip: 'border-line bg-surface-2 text-ink-muted', icon: '●', label: 'Low' },
};

export function ClaudeMdLinterLab() {
  const [text, setText] = useState(SAMPLE);
  const report = useMemo(() => lintClaudeMd(text), [text]);

  return (
    <LabShell
      title="CLAUDE.md linter"
      description="Heuristic sample rules, not an authoritative validator. Everything runs in your browser; nothing is uploaded."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="claude-md-input" className="mb-1.5 block text-sm font-semibold text-ink">
            Your CLAUDE.md
          </label>
          <p id="claude-md-help" className="mb-2 text-sm text-ink-muted">
            Paste your own file, or edit the deliberately bad sample below. Do not paste anything
            confidential.
          </p>
          <textarea
            id="claude-md-input"
            aria-describedby="claude-md-help"
            value={text}
            onChange={(event) => setText(event.target.value)}
            spellCheck={false}
            rows={20}
            className="w-full resize-y rounded-card border border-line bg-surface-2 p-3 font-mono text-[13px] leading-relaxed text-ink"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
            <span>
              {report.lineCount} lines, {report.contentLineCount} with content
            </span>
            <button
              type="button"
              onClick={() => setText(SAMPLE)}
              className="rounded-chip border border-line bg-surface px-2 py-0.5 font-medium text-ink-muted"
            >
              Reset sample
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              className="rounded-chip border border-line bg-surface px-2 py-0.5 font-medium text-ink-muted"
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <h4 className="mb-1.5 text-sm font-semibold text-ink">
            Findings <span className="font-normal text-ink-subtle">({report.findings.length})</span>
          </h4>
          <div aria-live="polite" className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
            {report.findings.length === 0 ? (
              <p className="rounded-card border border-success-line bg-success-soft px-3 py-2.5 text-sm text-success">
                ● No findings from these heuristics. That is not a guarantee the file is good — read
                it yourself and ask whether every line would still be true next month.
              </p>
            ) : (
              report.findings.map((finding, index) => {
                const style = SEVERITY_STYLE[finding.severity];
                return (
                  <article
                    key={`${finding.rule}-${finding.line}-${index}`}
                    className="rounded-card border border-line bg-surface p-3"
                  >
                    <p className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-chip border px-1.5 py-0.5 text-[11px] font-medium ${style.chip}`}
                      >
                        <span aria-hidden="true">{style.icon}</span> {style.label}
                      </span>
                      <span className="font-mono text-[11px] text-ink-subtle">
                        {finding.line === 0 ? 'whole file' : `line ${finding.line}`} ·{' '}
                        {finding.rule}
                      </span>
                    </p>
                    <p className="mb-1.5 truncate rounded-[6px] bg-surface-2 px-2 py-1 font-mono text-[12px] text-ink-muted">
                      {finding.excerpt}
                    </p>
                    <p className="text-sm text-ink-muted">{finding.message}</p>
                    <p className="mt-1.5 text-sm text-ink">
                      <span className="font-semibold">Instead: </span>
                      {finding.suggestion}
                    </p>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </LabShell>
  );
}
