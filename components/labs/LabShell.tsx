import type { ReactNode } from 'react';

/**
 * Shared frame for every interactive exercise.
 *
 * The "Simulated" marker is not decoration: it is the promise that nothing
 * here is connected to the reader's terminal, repository, or account.
 */
export function LabShell({
  title,
  description,
  children,
  simulated = true,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  simulated?: boolean;
}) {
  return (
    <section
      className="my-6 overflow-hidden rounded-panel border border-line-strong bg-surface shadow-card"
      aria-label={title}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line bg-surface-2 px-4 py-3">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {simulated ? (
          <span className="rounded-chip border border-line bg-surface px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
            Simulated · runs in your browser only
          </span>
        ) : null}
      </header>
      {description ? (
        <p className="border-b border-line px-4 py-2.5 text-sm text-ink-muted">{description}</p>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}
