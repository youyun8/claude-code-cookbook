'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createEmptyProgress,
  parseExport,
  serializeExport,
  type ProgressState,
  type QuizResult,
  type ThemeChoice,
} from '@/lib/progress/schema';
import {
  clearProgress,
  readProgress,
  writeProgress,
  type StorageStatus,
} from '@/lib/progress/storage';
import * as actions from '@/lib/progress/actions';

interface ProgressContextValue {
  state: ProgressState;
  /** False until the stored value has been read, so the UI can avoid flashing. */
  ready: boolean;
  storage: StorageStatus;
  setLessonComplete: (slug: string, complete: boolean) => void;
  setLabComplete: (id: string, complete: boolean) => void;
  recordQuiz: (slug: string, result: QuizResult) => void;
  toggleBookmark: (id: string) => void;
  setLastLesson: (slug: string) => void;
  setTheme: (theme: ThemeChoice) => void;
  reset: () => void;
  exportJson: () => string;
  importJson: (text: string) => { ok: true; notes: string[] } | { ok: false; error: string };
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(createEmptyProgress);
  const [ready, setReady] = useState(false);
  const [storage, setStorage] = useState<StorageStatus>('available');

  useEffect(() => {
    const result = readProgress();
    setState(result.state);
    setStorage(result.status);
    setReady(true);
  }, []);

  // Persist on every change once the initial read has happened, so a first
  // render never overwrites stored progress with the empty default.
  useEffect(() => {
    if (!ready) return;
    setStorage(writeProgress(state));
  }, [state, ready]);

  const update = useCallback((fn: (previous: ProgressState) => ProgressState) => {
    setState((previous) => fn(previous));
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      ready,
      storage,
      setLessonComplete: (slug, complete) =>
        update((previous) => actions.setLessonComplete(previous, slug, complete)),
      setLabComplete: (id, complete) =>
        update((previous) => actions.setLabComplete(previous, id, complete)),
      recordQuiz: (slug, result) =>
        update((previous) => actions.recordQuiz(previous, slug, result)),
      toggleBookmark: (id) => update((previous) => actions.toggleBookmark(previous, id)),
      setLastLesson: (slug) => update((previous) => actions.setLastLesson(previous, slug)),
      setTheme: (theme) => update((previous) => actions.setTheme(previous, theme)),
      reset: () => {
        clearProgress();
        setState(createEmptyProgress());
      },
      exportJson: () => serializeExport(state),
      importJson: (text: string) => {
        const result = parseExport(text);
        if (result === null) {
          return {
            ok: false as const,
            error:
              'That file could not be read as Claude Code Academy progress. Check that it is the JSON file exported from this site and that it has not been edited.',
          };
        }
        setState(result.state);
        return { ok: true as const, notes: result.notes };
      },
    }),
    [state, ready, storage, update],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (context === null) {
    throw new Error('useProgress must be used inside a ProgressProvider');
  }
  return context;
}
