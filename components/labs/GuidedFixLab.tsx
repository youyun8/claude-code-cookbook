'use client';

import { useState } from 'react';
import { LabShell } from './LabShell';
import { useProgress } from '@/components/progress/ProgressProvider';
import { useAnnounce } from '@/components/ui/Announcer';

/**
 * Three decisions, in the order they occur in a real session: sharpen the
 * prompt, choose verification, then read the diff you got back.
 */

interface Choice {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
}

interface Step {
  id: string;
  heading: string;
  setup: string;
  code?: { lang: string; text: string };
  question: string;
  choices: Choice[];
}

const STEPS: Step[] = [
  {
    id: 'prompt',
    heading: 'Step 1 — sharpen the prompt',
    setup:
      'A user reports that the shopping cart total is wrong when a percentage discount is applied to an item that is already on sale. You open a session and start typing.',
    code: {
      lang: 'text',
      text: 'Fix the discount bug in the cart.',
    },
    question: 'Which rewrite gives Claude the most to work with?',
    choices: [
      {
        id: 'a',
        label: 'Please carefully and thoroughly fix the discount bug in the cart. Take your time.',
        correct: false,
        feedback:
          'Politeness and emphasis add tokens without adding information. Claude still does not know which function, what the wrong value is, or how anyone would know it was fixed.',
      },
      {
        id: 'b',
        label:
          'In src/cart/total.ts, applyDiscount() double-applies a percentage discount to items that already have a sale price: a £100 item at 20% off then 10% off returns £72 instead of £72... it returns £64. Reproduce it with a test first, explain the cause, then make the smallest fix. Do not change the public signature. Run `npm test -- cart`.',
        correct: true,
        feedback:
          'Correct. It names the file and function, gives a concrete wrong value against an expected one, requires reproduction before diagnosis, states a non-goal, and names a command that produces pass or fail. Everything Claude needs, and nothing it does not.',
      },
      {
        id: 'c',
        label:
          'Read the whole cart module and all its tests, then fix every discount-related issue you find.',
        correct: false,
        feedback:
          'This maximises context cost and scope at once. You get a large diff addressing problems you did not report, and the one bug the user actually hit is buried in it.',
      },
      {
        id: 'd',
        label: 'The cart total is wrong. Fix it and make sure the tests pass.',
        correct: false,
        feedback:
          'Closer — "make sure the tests pass" is a check. But with no location and no expected value, a passing suite only proves nothing that was already tested broke.',
      },
    ],
  },
  {
    id: 'verification',
    heading: 'Step 2 — choose the verification',
    setup:
      'Claude has reproduced the bug and proposed a one-line fix in applyDiscount(). Before you approve, you decide what has to pass.',
    question: 'Which verification actually proves the fix works?',
    choices: [
      {
        id: 'a',
        label: 'The existing cart test suite passes.',
        correct: false,
        feedback:
          'It passed before the fix too — that is why the bug shipped. Existing tests prove you did not break the cases someone already thought of.',
      },
      {
        id: 'b',
        label:
          'A new test asserting that a £100 item at 20% then 10% off returns £72, which fails without the fix and passes with it, plus the existing cart suite.',
        correct: true,
        feedback:
          'Correct. The new test is a regression guard tied to the reported value, and demonstrating that it fails without the fix is what proves the test is actually testing the fix. The existing suite covers what you might have broken.',
      },
      {
        id: 'c',
        label: 'Claude confirms the logic is now correct and explains why.',
        correct: false,
        feedback:
          'An explanation is useful for review and is not evidence. The loop needs something that can come back red.',
      },
      {
        id: 'd',
        label: 'The application builds and the type check passes.',
        correct: false,
        feedback:
          'Necessary, not sufficient. Both would have passed with the bug in place — neither knows what the total should be.',
      },
    ],
  },
  {
    id: 'review',
    heading: 'Step 3 — read the diff',
    setup: 'The tests are green. Claude reports success. Here is the whole diff.',
    code: {
      lang: 'diff',
      text: `  export function applyDiscount(item: CartItem, percent: number) {
-   const base = item.salePrice ?? item.price;
-   return base - base * (percent / 100);
+   const base = item.salePrice ?? item.price;
+   const discounted = base - base * (percent / 100);
+   return Math.round(discounted * 100) / 100;
  }

  // src/cart/total.ts
- const total = items.reduce((sum, i) => sum + applyDiscount(i, i.discount), 0);
+ const total = items.reduce((sum, i) => sum + applyDiscount(i, i.discount ?? 0), 0);

  // src/cart/total.test.ts
+ it('applies a percentage discount to a sale-priced item', () => { ... });`,
    },
    question: 'What deserves a question before you merge this?',
    choices: [
      {
        id: 'a',
        label: 'Nothing — the tests pass and the diff is small.',
        correct: false,
        feedback:
          'Small and green is not the same as understood. There is a change here that has nothing to do with the reported bug.',
      },
      {
        id: 'b',
        label:
          'The rounding was introduced without being asked for, and `i.discount ?? 0` quietly changes behavior for items with no discount field.',
        correct: true,
        feedback:
          'Correct on both. Rounding to two decimal places is a product decision about money that nobody made — and it may not even be the right one for this currency. The `?? 0` fixes a different, unreported bug in the same commit, which is exactly the kind of thing that makes a change hard to revert cleanly.',
      },
      {
        id: 'c',
        label: 'The new test should have been written first.',
        correct: false,
        feedback:
          'It was — Claude reproduced the failure before editing. The ordering is fine; the unrequested behavior changes are the issue.',
      },
      {
        id: 'd',
        label: 'The variable name `discounted` is unclear.',
        correct: false,
        feedback:
          'Naming is worth a comment in review, but it is not what would cause an incident. Prioritise findings by what breaks.',
      },
    ],
  },
];

export function GuidedFixLab() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { setLabComplete } = useProgress();
  const announce = useAnnounce();

  const step = STEPS[index];
  if (!step) return null;

  const chosenId = answers[step.id];
  const chosen = step.choices.find((choice) => choice.id === chosenId);
  const isLast = index === STEPS.length - 1;

  function select(choiceId: string) {
    if (!step || answers[step.id]) return;
    setAnswers((previous) => ({ ...previous, [step.id]: choiceId }));
    const choice = step.choices.find((entry) => entry.id === choiceId);
    announce(choice?.correct ? 'Correct.' : 'Not the strongest option. Read the explanation.');
    if (isLast) setLabComplete('lab:guided-fix', true);
  }

  const score = STEPS.filter((entry) => {
    const answerId = answers[entry.id];
    return entry.choices.find((choice) => choice.id === answerId)?.correct;
  }).length;

  return (
    <LabShell
      title="Guided lab: fix a failing function"
      description="Three decisions in the order a real session presents them."
      simulated={false}
    >
      <p className="mb-3 text-[11px] uppercase tracking-wide text-ink-subtle">
        Step {index + 1} of {STEPS.length}
      </p>
      <h4 className="mb-1.5 text-base font-semibold text-ink">{step.heading}</h4>
      <p className="mb-3 text-sm text-ink-muted">{step.setup}</p>

      {step.code ? (
        <pre className="mb-3 overflow-x-auto rounded-card border border-line bg-surface-2 px-3 py-2.5 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap break-words text-ink">
          {step.code.text}
        </pre>
      ) : null}

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink">{step.question}</legend>
        <ul className="space-y-2">
          {step.choices.map((choice) => {
            const selected = chosenId === choice.id;
            const settled = Boolean(chosenId);
            const tone = !settled
              ? 'border-line bg-surface hover:bg-surface-2'
              : choice.correct
                ? 'border-success-line bg-success-soft'
                : selected
                  ? 'border-danger-line bg-danger-soft'
                  : 'border-line bg-surface opacity-70';
            return (
              <li key={choice.id}>
                <label className={`flex cursor-pointer gap-3 rounded-card border p-3 ${tone}`}>
                  <input
                    type="radio"
                    name={`guided-${step.id}`}
                    checked={selected}
                    onChange={() => select(choice.id)}
                    disabled={settled}
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--ca-accent)]"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm text-ink">{choice.label}</span>
                    {settled && (selected || choice.correct) ? (
                      <span className="mt-1.5 block text-sm text-ink-muted">
                        <span className="font-semibold text-ink">
                          {choice.correct ? '✓ ' : '✕ '}
                        </span>
                        {choice.feedback}
                      </span>
                    ) : null}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          disabled={index === 0}
          className="rounded-chip border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink disabled:opacity-45"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setIndex((value) => Math.min(STEPS.length - 1, value + 1))}
          disabled={!chosen || isLast}
          className="rounded-chip border border-accent bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink disabled:opacity-45"
        >
          Next step
        </button>
        {isLast && chosen ? (
          <p aria-live="polite" className="text-sm text-ink-muted">
            {score} of {STEPS.length} best answers. Saved to your progress.
          </p>
        ) : null}
      </div>
    </LabShell>
  );
}
