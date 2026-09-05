'use client';

import { useEffect, useRef, useState } from 'react';
import { useAnnounce } from '@/components/ui/Announcer';

interface CopyButtonProps {
  value: string;
  /** Describes what is being copied, for the accessible name. */
  label: string;
  className?: string;
}

export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number | null>(null);
  const announce = useAnnounce();

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setFailed(false);
      announce(`${label} copied to clipboard`);
    } catch {
      setFailed(true);
      setCopied(false);
      announce('Copy failed. Select the text and copy it manually.');
    }
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2400);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={[
        'ca-no-print inline-flex shrink-0 items-center gap-1.5 rounded-chip border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink',
        className ?? '',
      ].join(' ')}
    >
      <span aria-hidden="true">{copied ? '✓' : failed ? '!' : '⧉'}</span>
      <span>{copied ? 'Copied' : failed ? 'Copy failed' : 'Copy'}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
