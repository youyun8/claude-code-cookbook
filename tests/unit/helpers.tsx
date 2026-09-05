import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ProgressProvider } from '@/components/progress/ProgressProvider';
import { AnnouncerProvider } from '@/components/ui/Announcer';

function Providers({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider>
      <AnnouncerProvider>{children}</AnnouncerProvider>
    </ProgressProvider>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';
