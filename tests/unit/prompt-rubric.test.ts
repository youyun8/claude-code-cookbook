import { describe, expect, it } from 'vitest';
import { CRITERIA, emphasisFor, scorePrompt } from '@/lib/prompt-rubric';

const STRONG = `The login form in src/features/auth returns a generic 500 when an expired
refresh token is present. Reproduce the failure using the existing auth tests,
identify the root cause, and explain it before editing. Then make the smallest
fix that preserves current behavior for valid sessions. Do not change the API
response schema. Add or update a regression test, run the focused auth tests
with npm test -- auth, then run npm run typecheck. Handle the edge case where
the token is missing entirely. Finish with the files changed, the root cause,
and the verification results.`;

describe('scorePrompt', () => {
  it('scores an empty prompt at zero with nothing met', () => {
    const result = scorePrompt('', 'bug');
    expect(result.score).toBe(0);
    expect(result.percent).toBe(0);
    expect(result.band).toBe('thin');
    expect(result.results.every((entry) => !entry.met)).toBe(true);
  });

  it('rates a bare request as thin', () => {
    const result = scorePrompt('Fix the login bug.', 'bug');
    expect(result.band).toBe('thin');
    expect(result.results.find((entry) => entry.id === 'verification')?.met).toBe(false);
    expect(result.results.find((entry) => entry.id === 'context')?.met).toBe(false);
  });

  it('rates a fully formed brief as strong', () => {
    const result = scorePrompt(STRONG, 'bug');
    expect(result.band).toBe('strong');
    expect(result.results.find((entry) => entry.id === 'verification')?.met).toBe(true);
    expect(result.results.find((entry) => entry.id === 'deliverable')?.met).toBe(true);
  });

  it('does not credit pasted evidence that is not there', () => {
    // The canonical strong prompt describes the symptom but pastes nothing.
    const described = scorePrompt(STRONG, 'bug');
    expect(described.results.find((entry) => entry.id === 'examples')?.met).toBe(false);

    const pasted = scorePrompt(`${STRONG}\n\nTypeError: cannot read exp of undefined`, 'bug');
    expect(pasted.results.find((entry) => entry.id === 'examples')?.met).toBe(true);
    expect(pasted.score).toBe(pasted.maxScore);
  });

  it('detects a file path as context', () => {
    const withPath = scorePrompt('Update src/lib/date.ts', 'bug');
    expect(withPath.results.find((entry) => entry.id === 'context')?.met).toBe(true);

    const withoutPath = scorePrompt('Update the date helper', 'bug');
    expect(withoutPath.results.find((entry) => entry.id === 'context')?.met).toBe(false);
  });

  it('detects a runnable check as verification', () => {
    for (const prompt of [
      'Run npm test -- auth and report the output.',
      'Then run the type check and confirm it passes.',
      'Add a regression test that fails without the fix.',
      'Verification: cargo test',
    ]) {
      expect(scorePrompt(prompt, 'bug').results.find((e) => e.id === 'verification')?.met).toBe(
        true,
      );
    }
  });

  it('does not treat a description of testing as verification', () => {
    const result = scorePrompt('The tests are important to this team.', 'bug');
    expect(result.results.find((entry) => entry.id === 'verification')?.met).toBe(false);
  });

  it('returns the matched phrase as evidence so the rubric is inspectable', () => {
    const result = scorePrompt('Do not change the API response schema.', 'refactor');
    const constraints = result.results.find((entry) => entry.id === 'constraints');
    expect(constraints?.met).toBe(true);
    expect(constraints?.evidence).toContain('Do not change');
  });

  it('weights verification highest of all criteria', () => {
    const weights = CRITERIA.map((criterion) => criterion.weight);
    const verification = CRITERIA.find((criterion) => criterion.id === 'verification');
    expect(verification?.weight).toBe(Math.max(...weights));
  });

  it('notes a very short prompt and a very long one', () => {
    expect(scorePrompt('fix it', 'bug').notes.some((note) => note.includes('very short'))).toBe(
      true,
    );
    const long = `${STRONG} ${'padding words here '.repeat(120)}`;
    expect(scorePrompt(long, 'bug').notes.some((note) => note.includes('long'))).toBe(true);
  });

  it('emphasises different criteria per task type', () => {
    expect(emphasisFor('bug')).toContain('examples');
    expect(emphasisFor('refactor')).toContain('constraints');
    expect(emphasisFor('investigation')).toContain('deliverable');
  });

  it('names the emphasised criteria that are missing for the chosen task type', () => {
    const result = scorePrompt('Rewrite the module.', 'refactor');
    expect(result.notes.some((note) => note.includes('Constraints'))).toBe(true);
  });

  it('is deterministic', () => {
    const a = scorePrompt(STRONG, 'bug');
    const b = scorePrompt(STRONG, 'bug');
    expect(a).toEqual(b);
  });
});
