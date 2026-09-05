'use client';

import { useMemo, useState } from 'react';
import { LabShell } from './LabShell';
import { ProgressBar } from '@/components/ui/ProgressBar';

/**
 * A conceptual model of a context window, not a token meter.
 *
 * The numbers are illustrative units chosen to make the shape of the
 * problem visible: fixed startup cost, cheap targeted reads, expensive
 * unfocused ones, and conversation that grows whether you want it to or not.
 */

interface Item {
  id: string;
  label: string;
  cost: number;
  hint: string;
  relevant: boolean;
}

const BUDGET = 100;
const BASELINE = 12;

const ITEMS: Item[] = [
  {
    id: 'claude-md-short',
    label: 'A short CLAUDE.md (60 lines)',
    cost: 3,
    hint: 'Loads every session. Worth it when every line earns its place.',
    relevant: true,
  },
  {
    id: 'claude-md-long',
    label: 'A sprawling CLAUDE.md (400 lines)',
    cost: 12,
    hint: 'Loads every session, relevant to almost none of it.',
    relevant: false,
  },
  {
    id: 'targeted-read',
    label: 'Two targeted file reads',
    cost: 6,
    hint: 'The files the task is actually about.',
    relevant: true,
  },
  {
    id: 'broad-read',
    label: 'Twelve files from a broad search',
    cost: 22,
    hint: 'Most will never be referenced again, and all of them stay.',
    relevant: false,
  },
  {
    id: 'focused-test',
    label: 'Focused test output',
    cost: 4,
    hint: 'Short, and it is the signal the loop iterates against.',
    relevant: true,
  },
  {
    id: 'full-suite',
    label: 'Full test suite output',
    cost: 14,
    hint: 'Useful once at the end; expensive on every iteration.',
    relevant: false,
  },
  {
    id: 'stack-trace',
    label: 'A pasted stack trace',
    cost: 3,
    hint: 'High signal per token. Paste the frames, not the log file.',
    relevant: true,
  },
  {
    id: 'whole-log',
    label: 'A whole log file',
    cost: 18,
    hint: 'The three useful lines arrive with two thousand others.',
    relevant: false,
  },
  {
    id: 'conversation',
    label: 'Thirty turns of conversation',
    cost: 15,
    hint: 'Grows on its own. This is what `/compact` reclaims.',
    relevant: false,
  },
  {
    id: 'mcp',
    label: 'Six connected MCP servers',
    cost: 9,
    hint: 'Tool definitions load every session, used or not.',
    relevant: false,
  },
];

export function ContextBudgetSimulator() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['claude-md-short']));

  const { used, relevantUsed } = useMemo(() => {
    let total = BASELINE;
    let relevant = BASELINE;
    for (const item of ITEMS) {
      if (!selected.has(item.id)) continue;
      total += item.cost;
      if (item.relevant) relevant += item.cost;
    }
    return { used: total, relevantUsed: relevant };
  }, [selected]);

  const signalRatio = used === 0 ? 0 : Math.round((relevantUsed / used) * 100);
  const over = used > BUDGET;

  function toggle(id: string) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <LabShell
      title="Context budget simulator"
      description="An educational model with illustrative units. It is not a token meter and does not reflect any real model's limits."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Add things to the session</legend>
          <ul className="space-y-1.5">
            {ITEMS.map((item) => {
              const checked = selected.has(item.id);
              return (
                <li key={item.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-card border px-3 py-2 transition-colors ${
                      checked
                        ? 'border-accent-line bg-accent-soft/40'
                        : 'border-line bg-surface hover:bg-surface-2'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(item.id)}
                      className="mt-1 h-4 w-4 accent-[var(--ca-accent)]"
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-medium text-ink">{item.label}</span>
                        <span
                          className={`rounded-chip border px-1.5 py-0.5 text-[11px] ${
                            item.relevant
                              ? 'border-success-line bg-success-soft text-success'
                              : 'border-warning-line bg-warning-soft text-warning'
                          }`}
                        >
                          {item.relevant ? '● signal' : '▲ noise'} · {item.cost} units
                        </span>
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-muted">{item.hint}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <aside className="h-fit rounded-card border border-line bg-surface-2 p-3.5 lg:sticky lg:top-24">
          <h4 className="mb-2 text-sm font-semibold text-ink">Window</h4>
          <ProgressBar value={Math.min(used, BUDGET)} max={BUDGET} label="Context window used" />
          <p className="mt-2 text-sm text-ink-muted">
            <strong className="text-ink">{used}</strong> of {BUDGET} units
            {over ? ' — over budget' : ''}
          </p>
          <p className="mt-1 text-xs text-ink-subtle">
            Includes {BASELINE} units of unavoidable startup context: system prompt and tool
            definitions.
          </p>

          <hr className="my-3 border-line" />

          <h4 className="mb-1 text-sm font-semibold text-ink">Signal ratio</h4>
          <p className="text-2xl font-semibold text-ink">{signalRatio}%</p>
          <p className="mt-1 text-sm text-ink-muted">
            The share of the window that is relevant to the task in front of you.
          </p>

          <div aria-live="polite" className="mt-3 text-sm">
            {over ? (
              <p className="rounded-chip border border-danger-line bg-danger-soft px-2.5 py-1.5 text-danger">
                ■ Over budget. Compaction would run, summarising the conversation to make room.
              </p>
            ) : signalRatio < 55 ? (
              <p className="rounded-chip border border-warning-line bg-warning-soft px-2.5 py-1.5 text-warning">
                ▲ Most of this window is not about your task. `/clear` between tasks, and delegate
                broad reads to a subagent.
              </p>
            ) : (
              <p className="rounded-chip border border-success-line bg-success-soft px-2.5 py-1.5 text-success">
                ● Healthy. Most of what Claude can see is relevant.
              </p>
            )}
          </div>
        </aside>
      </div>
    </LabShell>
  );
}
