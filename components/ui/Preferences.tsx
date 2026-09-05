'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { useProgress } from '@/components/progress/ProgressProvider';
import { writeProgress } from '@/lib/progress/storage';
import type { FontSize, Language, ReadingWidth } from '@/lib/progress/schema';
import { ThemeToggle } from './ThemeToggle';

export function Preferences() {
  const { state, ready, storage, setPreferences } = useProgress();
  const pathname = usePathname();
  const language: Language = pathname.startsWith('/zh-TW') ? 'zh-TW' : 'en';

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.fontSize = state.fontSize;
    document.documentElement.dataset.readingWidth = state.readingWidth;
    if (state.theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.dataset.theme = state.theme;
  }, [ready, state.fontSize, state.readingWidth, state.theme]);

  useEffect(() => {
    if (ready && state.language !== language) setPreferences({ language });
  }, [ready, state.language, language, setPreferences]);

  const selectClass =
    'mt-2 block w-full rounded-chip border border-line bg-surface-2 px-3 py-2 text-ink';

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="rounded-chip border border-line bg-surface-2 px-2.5 py-1.5 text-sm text-ink"
        aria-label="Reading preferences"
      >
        <span aria-hidden="true">⚙</span>
        <span className="hidden sm:inline"> Preferences</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-panel border border-line bg-surface p-6 shadow-raised">
          <Dialog.Title className="text-xl font-semibold">Reading preferences</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-ink-muted">
            {storage === 'unavailable'
              ? 'Browser storage is unavailable. These settings will last only for this visit.'
              : 'Make the cookbook comfortable to read. Your choices are saved in this browser.'}
          </Dialog.Description>
          <div className="mt-5 space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium">Theme</p>
              <ThemeToggle />
            </div>
            <div>
              <label htmlFor="preference-font-size" className="block text-sm font-medium">
                Font size
              </label>
              <select
                className={selectClass}
                id="preference-font-size"
                value={state.fontSize}
                onChange={(event) => setPreferences({ fontSize: event.target.value as FontSize })}
              >
                <option value="normal">Default</option>
                <option value="large">Large</option>
                <option value="larger">Extra large</option>
              </select>
            </div>
            <div>
              <label htmlFor="preference-reading-width" className="block text-sm font-medium">
                Reading width
              </label>
              <select
                className={selectClass}
                id="preference-reading-width"
                value={state.readingWidth}
                onChange={(event) =>
                  setPreferences({ readingWidth: event.target.value as ReadingWidth })
                }
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="wide">Wide</option>
              </select>
            </div>
            <div>
              <label htmlFor="preference-language" className="block text-sm font-medium">
                Language
              </label>
              <select
                className={selectClass}
                id="preference-language"
                value={language}
                onChange={(event) => {
                  const next = event.target.value as Language;
                  setPreferences({ language: next });
                  // Flush before a full navigation between the two static root layouts.
                  writeProgress({ ...state, language: next });
                  const path = pathname.replace(/^\/zh-TW(?=\/|$)/, '') || '/';
                  window.location.assign(
                    `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${next === 'zh-TW' ? '/zh-TW' : ''}${path}${window.location.search}${window.location.hash}`,
                  );
                }}
              >
                <option value="en" lang="en">
                  English
                </option>
                <option value="zh-TW" lang="zh-TW">
                  繁體中文
                </option>
              </select>
            </div>
          </div>
          <Dialog.Close className="mt-6 rounded-chip border border-line bg-surface-2 px-4 py-2 text-sm font-medium">
            Done
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
