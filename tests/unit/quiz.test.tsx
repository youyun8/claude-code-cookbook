import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './helpers';
import { Quiz } from '@/components/learning/Quiz';
import { STORAGE_KEY } from '@/lib/progress/schema';
import type { QuizQuestion } from '@/content/types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'What closes the agentic loop?',
    options: [
      { id: 'a', text: 'A polite tone' },
      { id: 'b', text: 'A check the agent can run and read' },
    ],
    correctOptionId: 'b',
    explanation: 'A runnable check is the signal the loop iterates against.',
  },
  {
    id: 'q2',
    prompt: 'Where does an always-rule belong?',
    options: [
      { id: 'a', text: 'A hook' },
      { id: 'b', text: 'CLAUDE.md, phrased emphatically' },
    ],
    correctOptionId: 'a',
    explanation: 'Hooks run regardless of what the model decides.',
  },
];

describe('Quiz', () => {
  it('keeps submission disabled until every question is answered', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Quiz lessonSlug="demo" questions={QUESTIONS} />);

    const submit = screen.getByRole('button', { name: /submit answers/i });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: /a check the agent can run/i }));
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: /^a hook$/i }));
    expect(submit).toBeEnabled();
  });

  it('shows an explanation for every question after submitting, right or wrong', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Quiz lessonSlug="demo" questions={QUESTIONS} />);

    await user.click(screen.getByRole('radio', { name: /a polite tone/i }));
    await user.click(screen.getByRole('radio', { name: /^a hook$/i }));
    await user.click(screen.getByRole('button', { name: /submit answers/i }));

    expect(screen.getByText(/signal the loop iterates against/i)).toBeInTheDocument();
    expect(screen.getByText(/regardless of what the model decides/i)).toBeInTheDocument();
    expect(screen.getByText('1 of 2 correct.')).toBeInTheDocument();
  });

  it('persists the score to local storage', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Quiz lessonSlug="demo" questions={QUESTIONS} />);

    await user.click(screen.getByRole('radio', { name: /a check the agent can run/i }));
    await user.click(screen.getByRole('radio', { name: /^a hook$/i }));
    await user.click(screen.getByRole('button', { name: /submit answers/i }));

    await waitFor(() => {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw ?? '{}').quizzes.demo).toMatchObject({ correct: 2, total: 2 });
    });
  });

  it('lets the learner retry, which clears the shown answers', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Quiz lessonSlug="demo" questions={QUESTIONS} />);

    await user.click(screen.getByRole('radio', { name: /a polite tone/i }));
    await user.click(screen.getByRole('radio', { name: /^a hook$/i }));
    await user.click(screen.getByRole('button', { name: /submit answers/i }));
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.queryByText(/signal the loop iterates against/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit answers/i })).toBeDisabled();
  });

  it('announces the result politely', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    renderWithProviders(<Quiz lessonSlug="demo" questions={QUESTIONS} />);

    await user.click(screen.getByRole('radio', { name: /a check the agent can run/i }));
    await user.click(screen.getByRole('radio', { name: /^a hook$/i }));
    await user.click(screen.getByRole('button', { name: /submit answers/i }));

    await waitFor(() =>
      expect(screen.getByText(/Knowledge check submitted\. 2 of 2 correct\./i)).toBeInTheDocument(),
    );
  });
});
