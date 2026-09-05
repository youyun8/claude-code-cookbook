import type { ReactNode } from 'react';

export type ChipTone = 'neutral' | 'accent' | 'violet' | 'success' | 'warning' | 'danger';

const TONE: Record<ChipTone, string> = {
  neutral: 'border-line bg-surface-2 text-ink-muted',
  accent: 'border-accent-line bg-accent-soft text-accent',
  violet: 'border-violet-line bg-violet-soft text-violet',
  success: 'border-success-line bg-success-soft text-success',
  warning: 'border-warning-line bg-warning-soft text-warning',
  danger: 'border-danger-line bg-danger-soft text-danger',
};

export function Chip({
  tone = 'neutral',
  children,
  icon,
}: {
  tone?: ChipTone;
  children: ReactNode;
  /** A shape or glyph, so meaning is never carried by colour alone. */
  icon?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-chip border px-2 py-0.5 text-xs font-medium ${TONE[tone]}`}
    >
      {icon ? (
        <span aria-hidden="true" className="text-[0.8em]">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

export function riskTone(risk: 'low' | 'medium' | 'high'): ChipTone {
  return risk === 'low' ? 'success' : risk === 'medium' ? 'warning' : 'danger';
}

export function riskIcon(risk: 'low' | 'medium' | 'high'): string {
  return risk === 'low' ? '●' : risk === 'medium' ? '▲' : '■';
}
