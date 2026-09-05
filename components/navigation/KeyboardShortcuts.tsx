'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';

/**
 * Only two bindings, both chosen because they do not collide with browser
 * or assistive-technology shortcuts: `/` to search and `?` to open this
 * dialog. Both are suppressed while the reader is typing.
 */
const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: '/', action: 'Open search' },
  { keys: '?', action: 'Open this dialog' },
  { keys: 'Esc', action: 'Close any dialog' },
  { keys: 'Tab', action: 'Move through every control on the page' },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target !== null &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable === true);
      if (event.key === '?' && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="hidden rounded-chip border border-line bg-surface-2 px-2 py-1.5 text-sm text-ink-subtle transition-colors hover:text-ink lg:block">
        <span aria-hidden="true">⌨</span>
        <span className="sr-only">Keyboard shortcuts</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-panel border border-line-strong bg-surface p-5 shadow-raised">
          <Dialog.Title className="text-lg font-semibold text-ink">Keyboard shortcuts</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-ink-muted">
            Deliberately few, so nothing here overrides your browser or screen reader.
          </Dialog.Description>
          <dl className="mt-4 space-y-2">
            {SHORTCUTS.map((shortcut) => (
              <div key={shortcut.keys} className="flex items-center justify-between gap-4">
                <dt>
                  <kbd className="rounded border border-line bg-surface-2 px-2 py-0.5 font-mono text-xs text-ink">
                    {shortcut.keys}
                  </kbd>
                </dt>
                <dd className="text-sm text-ink-muted">{shortcut.action}</dd>
              </div>
            ))}
          </dl>
          <Dialog.Close className="mt-5 w-full rounded-chip border border-line bg-surface-2 px-3 py-1.5 text-sm font-medium text-ink">
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
