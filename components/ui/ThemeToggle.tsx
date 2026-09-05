'use client';

import { useEffect } from 'react';
import { useProgress } from '@/components/progress/ProgressProvider';
import { useAnnounce } from '@/components/ui/Announcer';
import type { ThemeChoice } from '@/lib/progress/schema';

const OPTIONS: { value: ThemeChoice; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀' },
  { value: 'dark', label: 'Dark', icon: '☾' },
  { value: 'system', label: 'System', icon: '◐' },
];

export function ThemeToggle() {
  const { state, ready, setTheme } = useProgress();
  const announce = useAnnounce();

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    if (state.theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', state.theme);
  }, [state.theme, ready]);

  return (
    <fieldset className="flex items-center gap-0.5 rounded-chip border border-line bg-surface-2 p-0.5">
      <legend className="sr-only">Colour theme</legend>
      {OPTIONS.map((option) => {
        const active = ready && state.theme === option.value;
        return (
          <label
            key={option.value}
            className={[
              'cursor-pointer rounded-[7px] px-2 py-1 text-xs font-medium transition-colors',
              active
                ? 'bg-surface text-ink shadow-card'
                : 'text-ink-subtle hover:text-ink hover:bg-surface-3',
            ].join(' ')}
          >
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={active}
              onChange={() => {
                setTheme(option.value);
                announce(`Theme set to ${option.label}`);
              }}
              className="sr-only"
            />
            <span aria-hidden="true" className="mr-1">
              {option.icon}
            </span>
            {option.label}
          </label>
        );
      })}
    </fieldset>
  );
}
