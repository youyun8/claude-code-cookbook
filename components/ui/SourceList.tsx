import { getSources } from '@/data/sources';
import { ExternalLink } from '@/components/ui/ExternalLink';

/**
 * The provenance block that appears under version-sensitive content.
 *
 * `lastReviewed` comes from the source registry, which is a build-time
 * content field — never the viewer's clock.
 */
export function SourceList({ ids, note }: { ids: readonly string[]; note?: string }) {
  const sources = getSources(ids);
  if (sources.length === 0) return null;

  return (
    <aside className="my-5 rounded-card border border-line bg-surface-2 px-4 py-3.5">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
        <span aria-hidden="true" className="text-ink-subtle">
          ⌸
        </span>
        Official documentation
      </h3>
      {note ? <p className="mb-2 text-sm text-ink-muted">{note}</p> : null}
      <ul className="space-y-1.5">
        {sources.map((source) => (
          <li key={source.id} className="text-sm">
            <ExternalLink href={source.url}>{source.title}</ExternalLink>
            <span className="ml-2 text-xs text-ink-subtle">
              Last reviewed <time dateTime={source.lastReviewed}>{source.lastReviewed}</time>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
