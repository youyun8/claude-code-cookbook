'use client';

import { useMemo, useState } from 'react';
import type { Recipe } from '@/content/types';
import { CopyButton } from '@/components/ui/CopyButton';

/**
 * Fill in a recipe's variables and copy the rendered prompt.
 *
 * Substitution is a literal string replace on `{{id}}` tokens, and the
 * result is rendered as text — a value a learner types can never become
 * markup or a template placeholder of its own.
 */
export function RecipePlayground({ recipe }: { recipe: Recipe }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(recipe.variables.map((variable) => [variable.id, variable.example])),
  );

  const rendered = useMemo(() => {
    let output = recipe.template;
    for (const variable of recipe.variables) {
      const value = values[variable.id]?.trim();
      output = output
        .split(`{{${variable.id}}}`)
        .join(value && value.length > 0 ? value : `<${variable.label.toLowerCase()}>`);
    }
    return output;
  }, [recipe, values]);

  const unfilled = recipe.variables.filter(
    (variable) => (values[variable.id] ?? '').trim().length === 0,
  );

  return (
    <section aria-labelledby="playground" className="ca-card p-5">
      <h2 id="playground" className="text-lg font-semibold text-ink">
        Customise the prompt
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Replace the examples with your own paths and commands. A recipe that names your actual test
        command is worth more than a generic one.
      </p>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          {recipe.variables.map((variable) => (
            <div key={variable.id}>
              <label
                htmlFor={`var-${variable.id}`}
                className="mb-1 block text-sm font-medium text-ink"
              >
                {variable.label}
              </label>
              <textarea
                id={`var-${variable.id}`}
                aria-describedby={`help-${variable.id}`}
                value={values[variable.id] ?? ''}
                placeholder={variable.placeholder}
                onChange={(event) =>
                  setValues((previous) => ({ ...previous, [variable.id]: event.target.value }))
                }
                rows={variable.example.includes('\n') ? 4 : 2}
                className="w-full resize-y rounded-card border border-line bg-surface-2 px-2.5 py-1.5 font-mono text-[12.5px] text-ink"
              />
              <p id={`help-${variable.id}`} className="mt-1 text-xs text-ink-subtle">
                {variable.help}
              </p>
            </div>
          ))}
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-ink">Rendered prompt</h3>
            <CopyButton value={rendered} label={`${recipe.title} prompt`} />
          </div>
          <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap break-words rounded-card border border-line bg-surface-2 p-3 font-mono text-[12.5px] leading-relaxed text-ink">
            {rendered}
          </pre>
          <p aria-live="polite" className="mt-2 text-xs text-ink-subtle">
            {unfilled.length === 0
              ? 'All variables filled.'
              : `${unfilled.length} variable${unfilled.length === 1 ? '' : 's'} left as a placeholder: ${unfilled
                  .map((variable) => variable.label)
                  .join(', ')}.`}
          </p>
        </div>
      </div>
    </section>
  );
}
