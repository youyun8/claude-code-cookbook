'use client';

import { useState } from 'react';
import { LabShell } from './LabShell';
import { useProgress } from '@/components/progress/ProgressProvider';
import { useAnnounce } from '@/components/ui/Announcer';

/**
 * A simulated diff containing four real defects — the kind a passing test
 * suite does not catch. The learner marks lines before reading the answers.
 */

interface DiffLine {
  n: number;
  type: 'context' | 'add' | 'remove' | 'meta';
  text: string;
  /** Set when this line is one of the planted defects. */
  defect?: { title: string; explanation: string };
}

const DIFF: DiffLine[] = [
  { n: 1, type: 'meta', text: 'diff --git a/src/api/session.ts b/src/api/session.ts' },
  { n: 2, type: 'context', text: ' export async function refreshSession(token: string) {' },
  { n: 3, type: 'remove', text: '-  const claims = await verify(token);' },
  {
    n: 4,
    type: 'add',
    text: '+  const claims = decode(token);',
    defect: {
      title: 'Signature verification was replaced with decoding',
      explanation:
        '`decode` reads the payload without checking the signature, so any attacker-supplied token is now accepted. Tests that use validly signed fixtures still pass, because they never present a forged token. This is the most serious defect in the diff and the easiest to skim past.',
    },
  },
  { n: 5, type: 'context', text: '   if (!claims) throw new AuthError("invalid token");' },
  { n: 6, type: 'context', text: '' },
  { n: 7, type: 'remove', text: '-  if (claims.exp < Date.now() / 1000) {' },
  {
    n: 8,
    type: 'add',
    text: '+  if (claims.exp && claims.exp < Date.now() / 1000) {',
    defect: {
      title: 'A missing expiry now means "never expires"',
      explanation:
        'Guarding on `claims.exp &&` looks defensive, but it turns an absent expiry claim into an unconditional pass. The safe reading of a missing security claim is rejection, not acceptance.',
    },
  },
  { n: 9, type: 'context', text: '     throw new AuthError("expired");' },
  { n: 10, type: 'context', text: '   }' },
  { n: 11, type: 'context', text: '' },
  { n: 12, type: 'remove', text: '-  const user = await users.findById(claims.sub);' },
  {
    n: 13,
    type: 'add',
    text: '+  const user = await users.findById(claims.sub).catch(() => null);',
  },
  {
    n: 14,
    type: 'add',
    text: '+  // fall through if the lookup fails',
    defect: {
      title: 'A database failure is silently swallowed',
      explanation:
        'The `.catch(() => null)` makes a transient database error indistinguishable from "no such user". Callers will see an ordinary auth failure, the incident will be invisible in logs, and the root cause will be untraceable. Errors that are handled by discarding them are handled twice: once here, once at 3am.',
    },
  },
  { n: 15, type: 'context', text: '' },
  { n: 16, type: 'remove', text: '-  return { user, expiresIn: claims.exp - now() };' },
  {
    n: 17,
    type: 'add',
    text: '+  return { user, expiresIn: claims.exp - now(), token };',
    defect: {
      title: 'The raw token is now returned to the caller',
      explanation:
        'Adding `token` to the response widens the API surface and puts a credential somewhere it was not before — logs, error reports, and client-side storage. Nothing in the task asked for it, which is exactly the signal to question it.',
    },
  },
  { n: 18, type: 'context', text: ' }' },
];

const DEFECT_LINES = DIFF.filter((line) => line.defect).map((line) => line.n);

export function DiffReviewExercise() {
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const { setLabComplete } = useProgress();
  const announce = useAnnounce();

  const found = DEFECT_LINES.filter((n) => flagged.has(n)).length;
  const falsePositives = [...flagged].filter((n) => !DEFECT_LINES.includes(n)).length;

  function toggle(n: number) {
    if (revealed) return;
    setFlagged((previous) => {
      const next = new Set(previous);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  function reveal() {
    setRevealed(true);
    setLabComplete('lab:diff-review', true);
    announce(`Review complete. You found ${found} of ${DEFECT_LINES.length} defects.`);
  }

  return (
    <LabShell
      title="Diff review exercise"
      description="Four defects are planted in this diff, and the test suite passes with all of them. Flag the lines you would question, then reveal."
    >
      <div className="overflow-x-auto rounded-card border border-line bg-surface-2">
        <table className="w-full min-w-[36rem] border-collapse font-mono text-[12.5px]">
          <caption className="sr-only">
            Simulated diff of src/api/session.ts. Select a line to flag it as a concern.
          </caption>
          <tbody>
            {DIFF.map((line) => {
              const isFlagged = flagged.has(line.n);
              const isDefect = Boolean(line.defect);
              const selectable = line.type === 'add' || line.type === 'remove';
              const background =
                revealed && isDefect
                  ? 'bg-danger-soft'
                  : isFlagged
                    ? 'bg-warning-soft'
                    : line.type === 'add'
                      ? 'bg-success-soft/40'
                      : line.type === 'remove'
                        ? 'bg-danger-soft/25'
                        : '';
              return (
                <tr key={line.n} className={background}>
                  <td className="w-10 select-none border-r border-line px-2 py-0.5 text-right text-ink-subtle">
                    {line.n}
                  </td>
                  <td className="w-8 px-1 py-0.5">
                    {selectable ? (
                      <button
                        type="button"
                        onClick={() => toggle(line.n)}
                        disabled={revealed}
                        aria-pressed={isFlagged}
                        className={`h-5 w-5 rounded border text-[11px] leading-none ${
                          isFlagged
                            ? 'border-warning bg-warning-soft text-warning'
                            : 'border-line bg-surface text-ink-subtle hover:border-line-strong'
                        } disabled:opacity-60`}
                      >
                        <span aria-hidden="true">{isFlagged ? '⚑' : '·'}</span>
                        <span className="sr-only">
                          {isFlagged ? 'Unflag' : 'Flag'} line {line.n}
                        </span>
                      </button>
                    ) : null}
                  </td>
                  <td className="whitespace-pre px-2 py-0.5 text-ink">{line.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={reveal}
          disabled={revealed}
          className="rounded-chip border border-accent bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-ink disabled:opacity-45"
        >
          Reveal the defects
        </button>
        <p aria-live="polite" className="text-sm text-ink-muted">
          {revealed
            ? `You flagged ${found} of ${DEFECT_LINES.length} defects${falsePositives > 0 ? `, plus ${falsePositives} line${falsePositives === 1 ? '' : 's'} that were not planted defects` : ''}.`
            : `${flagged.size} line${flagged.size === 1 ? '' : 's'} flagged.`}
        </p>
      </div>

      {revealed ? (
        <div className="mt-4 space-y-3">
          {DIFF.filter((line) => line.defect).map((line) => (
            <article key={line.n} className="rounded-card border border-danger-line bg-surface p-3">
              <p className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-chip border border-danger-line bg-danger-soft px-1.5 py-0.5 text-[11px] font-medium text-danger">
                  ■ Line {line.n}
                </span>
                {flagged.has(line.n) ? (
                  <span className="text-xs font-medium text-success">✓ you flagged this</span>
                ) : (
                  <span className="text-xs font-medium text-warning">▲ missed</span>
                )}
              </p>
              <p className="text-sm font-semibold text-ink">{line.defect?.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{line.defect?.explanation}</p>
            </article>
          ))}
          <p className="rounded-card border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink-muted">
            All four defects pass the existing tests. That is the point: a green suite tells you the
            cases somebody thought to write still hold, not that the change is correct.
          </p>
        </div>
      ) : null}
    </LabShell>
  );
}
