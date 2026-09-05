import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './helpers';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LessonActions } from '@/components/learning/LessonActions';
import { CopyButton } from '@/components/ui/CopyButton';
import { STORAGE_KEY } from '@/lib/progress/schema';

function stored(): Record<string, unknown> {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
}

describe('ThemeToggle', () => {
  it('applies the choice to the document and persists it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    await user.click(screen.getByRole('radio', { name: /dark/i }));

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(stored().theme).toBe('dark');
    });
  });

  it('removes the attribute for the system option so prefers-color-scheme applies', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    await user.click(screen.getByRole('radio', { name: /light/i }));
    await waitFor(() => expect(document.documentElement.getAttribute('data-theme')).toBe('light'));

    await user.click(screen.getByRole('radio', { name: /system/i }));
    await waitFor(() => expect(document.documentElement.hasAttribute('data-theme')).toBe(false));
  });

  it('restores the stored theme on a fresh mount', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, theme: 'dark', completedLessons: [] }),
    );
    renderWithProviders(<ThemeToggle />);
    await waitFor(() => expect(document.documentElement.getAttribute('data-theme')).toBe('dark'));
  });
});

describe('LessonActions', () => {
  it('marks a lesson complete, shows the stamp, and persists', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LessonActions slug="mental-model-and-setup" title="Mental model" />);

    await user.click(screen.getByRole('button', { name: /mark this lesson complete/i }));

    expect(screen.getByRole('button', { name: /^completed$/i })).toBeInTheDocument();
    // The button label and the completion stamp both read "Completed".
    expect(screen.getAllByText('Completed')).toHaveLength(2);
    await waitFor(() => expect(stored().completedLessons).toContain('mental-model-and-setup'));
  });

  it('un-marks a completed lesson', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LessonActions slug="demo" title="Demo" />);

    const button = screen.getByRole('button', { name: /mark this lesson complete/i });
    await user.click(button);
    await user.click(screen.getByRole('button', { name: /^completed$/i }));

    await waitFor(() => expect(stored().completedLessons).toEqual([]));
  });

  it('records the lesson as the resume point', async () => {
    renderWithProviders(<LessonActions slug="context-and-session-management" title="Context" />);
    await waitFor(() => expect(stored().lastLessonSlug).toBe('context-and-session-management'));
  });

  it('toggles a bookmark with a pressed state', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LessonActions slug="demo" title="Demo" />);

    const bookmark = screen.getByRole('button', { name: /bookmark/i });
    expect(bookmark).toHaveAttribute('aria-pressed', 'false');

    await user.click(bookmark);
    expect(screen.getByRole('button', { name: /bookmarked/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await waitFor(() => expect(stored().bookmarks).toContain('lesson:demo'));
  });
});

describe('CopyButton', () => {
  it('copies the value and confirms accessibly', async () => {
    // userEvent.setup() installs its own clipboard stub, so replace it after.
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    renderWithProviders(<CopyButton value="npm test -- auth" label="Verification command" />);

    await user.click(screen.getByRole('button', { name: /copy verification command/i }));

    expect(writeText).toHaveBeenCalledWith('npm test -- auth');
    await waitFor(() => expect(screen.getByText('Copied')).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByText(/Verification command copied to clipboard/i)).toBeInTheDocument(),
    );
  });

  it('reports a failure instead of pretending it worked', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    });
    renderWithProviders(<CopyButton value="x" label="Prompt" />);
    await user.click(screen.getByRole('button', { name: /copy prompt/i }));

    await waitFor(() => expect(screen.getByText('Copy failed')).toBeInTheDocument());
  });
});
