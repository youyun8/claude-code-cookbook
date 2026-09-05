'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/**
 * A single polite live region for the whole app.
 *
 * Copy confirmations, saved state, and quiz feedback all announce through
 * here, so assistive technology gets one predictable channel instead of a
 * scattering of ad-hoc regions.
 */

interface AnnouncerValue {
  announce: (message: string) => void;
}

const AnnouncerContext = createContext<AnnouncerValue | null>(null);

export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');

  const announce = useCallback((next: string) => {
    // Clearing first guarantees a re-announcement of an identical message.
    setMessage('');
    window.setTimeout(() => setMessage(next), 60);
  }, []);

  const value = useMemo(() => ({ announce }), [announce]);

  return (
    <AnnouncerContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </div>
    </AnnouncerContext.Provider>
  );
}

export function useAnnounce(): (message: string) => void {
  const context = useContext(AnnouncerContext);
  return context?.announce ?? (() => {});
}
