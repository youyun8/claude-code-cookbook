import type { CalloutTone } from '@/content/types';
import { RichText } from '@/components/ui/RichText';

const TONE: Record<
  CalloutTone,
  { border: string; bg: string; ink: string; icon: string; prefix: string }
> = {
  note: {
    border: 'border-line-strong',
    bg: 'bg-surface-2',
    ink: 'text-ink',
    icon: '◆',
    prefix: 'Note',
  },
  tip: {
    border: 'border-violet-line',
    bg: 'bg-violet-soft',
    ink: 'text-violet',
    icon: '✦',
    prefix: 'Tip',
  },
  verify: {
    border: 'border-success-line',
    bg: 'bg-success-soft',
    ink: 'text-success',
    icon: '✓',
    prefix: 'Verify',
  },
  warning: {
    border: 'border-warning-line',
    bg: 'bg-warning-soft',
    ink: 'text-warning',
    icon: '▲',
    prefix: 'Warning',
  },
  danger: {
    border: 'border-danger-line',
    bg: 'bg-danger-soft',
    ink: 'text-danger',
    icon: '■',
    prefix: 'Important',
  },
};

export function Callout({
  tone,
  title,
  body,
}: {
  tone: CalloutTone;
  title: string;
  body: string[];
}) {
  const style = TONE[tone];
  return (
    <aside
      className={`my-5 rounded-card border ${style.border} ${style.bg} px-4 py-3.5`}
      aria-label={`${style.prefix}: ${title}`}
    >
      <p className={`mb-1.5 flex items-baseline gap-2 font-semibold ${style.ink}`}>
        <span aria-hidden="true" className="text-sm">
          {style.icon}
        </span>
        <span>
          <span className="sr-only">{style.prefix}: </span>
          {title}
        </span>
      </p>
      <div className="space-y-2 text-[0.95rem] text-ink-muted">
        {body.map((paragraph, index) => (
          <p key={index}>
            <RichText text={paragraph} />
          </p>
        ))}
      </div>
    </aside>
  );
}
