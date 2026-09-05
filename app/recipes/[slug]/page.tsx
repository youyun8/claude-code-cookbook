import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  RECIPES,
  RISK_DESCRIPTION,
  RISK_LABELS,
  TASK_LABELS,
  FEATURE_LABELS,
  getRecipe,
} from '@/data/recipes';
import { RecipePlayground } from '@/components/learning/RecipePlayground';
import { SourceList } from '@/components/ui/SourceList';
import { Chip, riskIcon, riskTone } from '@/components/ui/Chip';
import { RichText } from '@/components/ui/RichText';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return RECIPES.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return { title: 'Recipe not found' };

  return {
    title: recipe.title,
    description: recipe.summary,
    alternates: { canonical: `/recipes/${recipe.slug}/` },
    openGraph: {
      type: 'article',
      title: recipe.title,
      description: recipe.summary,
      url: `/recipes/${recipe.slug}/`,
    },
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  return (
    <div className="mx-auto max-w-[70rem] px-4 py-10">
      <nav aria-label="Breadcrumb" className="ca-no-print mb-4 text-sm">
        <Link href="/recipes/" className="text-ink-subtle hover:text-ink">
          Workflow recipes
        </Link>
      </nav>

      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{recipe.title}</h1>
        <p className="mt-3 max-w-[68ch] text-lg text-ink-muted">{recipe.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip>{TASK_LABELS[recipe.task]}</Chip>
          <Chip tone={riskTone(recipe.risk)} icon={riskIcon(recipe.risk)}>
            {RISK_LABELS[recipe.risk]}
          </Chip>
          <Chip>
            {recipe.difficulty[0]?.toUpperCase()}
            {recipe.difficulty.slice(1)}
          </Chip>
          {recipe.features.map((feature) => (
            <Chip key={feature} tone="violet">
              {FEATURE_LABELS[feature]}
            </Chip>
          ))}
        </div>
        <p className="mt-2 text-sm text-ink-subtle">{RISK_DESCRIPTION[recipe.risk]}</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0 space-y-6">
          <RecipePlayground recipe={recipe} />

          <section aria-labelledby="why" className="ca-card p-5">
            <h2 id="why" className="text-lg font-semibold text-ink">
              Why this prompt works
            </h2>
            <ul className="mt-3 space-y-2 text-[0.95rem] text-ink-muted">
              {recipe.whyItWorks.map((reason) => (
                <li key={reason} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-0.5 text-accent">
                    →
                  </span>
                  <span>
                    <RichText text={reason} />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="expected" className="ca-card p-5">
            <h2 id="expected" className="text-lg font-semibold text-ink">
              What Claude should do
            </h2>
            <ul className="mt-3 space-y-2 text-[0.95rem] text-ink-muted">
              {recipe.expectedBehavior.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-0.5 text-ink-subtle">
                    ·
                  </span>
                  <span>
                    <RichText text={item} />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-subtle">
              If the behavior differs materially from this, stop and re-read the prompt before
              accepting the result.
            </p>
          </section>

          <section
            aria-labelledby="verification"
            className="rounded-panel border border-success-line bg-success-soft/40 p-5"
          >
            <h2
              id="verification"
              className="flex items-center gap-2 text-lg font-semibold text-ink"
            >
              <span aria-hidden="true" className="text-success">
                ✓
              </span>
              Verification checklist
            </h2>
            <ul className="mt-3 space-y-2 text-[0.95rem] text-ink-muted">
              {recipe.verification.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-0.5 text-success">
                    ☐
                  </span>
                  <span>
                    <RichText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="failures" className="ca-card p-5">
            <h2 id="failures" className="text-lg font-semibold text-ink">
              Failure signals and recovery
            </h2>
            <dl className="mt-3 space-y-3">
              {recipe.failureSignals.map((entry) => (
                <div
                  key={entry.signal}
                  className="rounded-card border border-warning-line bg-warning-soft/40 p-3"
                >
                  <dt className="flex gap-2 text-[0.95rem] font-medium text-ink">
                    <span aria-hidden="true" className="text-warning">
                      ▲
                    </span>
                    <span>
                      <RichText text={entry.signal} />
                    </span>
                  </dt>
                  <dd className="mt-1.5 pl-6 text-[0.95rem] text-ink-muted">
                    <span className="font-medium text-ink">Recovery: </span>
                    <RichText text={entry.recovery} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <SourceList ids={recipe.sources} />
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-20">
          <section aria-labelledby="when" className="ca-card p-4">
            <h2 id="when" className="text-sm font-semibold text-ink">
              When to use it
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
              {recipe.whenToUse.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-ink-subtle">
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="prereq" className="ca-card p-4">
            <h2 id="prereq" className="text-sm font-semibold text-ink">
              Prerequisites
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
              {recipe.prerequisites.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-ink-subtle">
                    ☐
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <p className="ca-no-print rounded-card border border-line bg-surface-2 p-3 text-sm text-ink-muted">
            This page prints cleanly — use your browser&rsquo;s print command for a paper copy of
            the prompt and checklists.
          </p>
        </aside>
      </div>
    </div>
  );
}
