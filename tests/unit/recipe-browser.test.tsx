import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from './helpers';
import { RecipeBrowser } from '@/components/learning/RecipeBrowser';
import { RECIPES } from '@/data/recipes';

function visibleRecipeCount(): number {
  return screen.getAllByRole('listitem').filter((item) => within(item).queryByRole('heading'))
    .length;
}

describe('RecipeBrowser', () => {
  it('lists every recipe by default', () => {
    renderWithProviders(<RecipeBrowser recipes={RECIPES} />);
    expect(screen.getByText(`${RECIPES.length} of ${RECIPES.length} recipes`)).toBeInTheDocument();
    expect(visibleRecipeCount()).toBe(RECIPES.length);
  });

  it('filters by search text', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecipeBrowser recipes={RECIPES} />);

    await user.type(screen.getByLabelText('Search'), 'benchmark');
    const shown = visibleRecipeCount();
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(RECIPES.length);
    expect(
      screen.getByRole('heading', { name: /Analyze a performance regression/i }),
    ).toBeInTheDocument();
  });

  it('filters by risk level', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecipeBrowser recipes={RECIPES} />);

    await user.selectOptions(screen.getByLabelText('Risk'), 'high');
    const expected = RECIPES.filter((recipe) => recipe.risk === 'high').length;
    expect(screen.getByText(`${expected} of ${RECIPES.length} recipes`)).toBeInTheDocument();
  });

  it('combines filters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecipeBrowser recipes={RECIPES} />);

    await user.selectOptions(screen.getByLabelText('Task'), 'explore');
    await user.selectOptions(screen.getByLabelText('Difficulty'), 'advanced');
    const expected = RECIPES.filter(
      (recipe) => recipe.task === 'explore' && recipe.difficulty === 'advanced',
    ).length;
    expect(screen.getByText(`${expected} of ${RECIPES.length} recipes`)).toBeInTheDocument();
  });

  it('shows an empty state with a reset that restores every recipe', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecipeBrowser recipes={RECIPES} />);

    await user.type(screen.getByLabelText('Search'), 'zzzznotarecipe');
    expect(screen.getByText(/No recipes match those filters/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^reset them$/i }));
    expect(screen.getByText(`${RECIPES.length} of ${RECIPES.length} recipes`)).toBeInTheDocument();
  });

  it('bookmarks a recipe and can filter down to bookmarks', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecipeBrowser recipes={RECIPES} />);

    const first = RECIPES[0];
    if (!first) throw new Error('no recipes');

    await user.click(screen.getByRole('button', { name: new RegExp(`^Bookmark ${first.title}$`) }));
    await user.click(screen.getByLabelText(/bookmarked only/i));

    expect(screen.getByText(`1 of ${RECIPES.length} recipes`)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: first.title })).toBeInTheDocument();
  });
});
