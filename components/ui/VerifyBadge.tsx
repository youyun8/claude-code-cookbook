import { ExternalLink } from '@/components/ui/ExternalLink';
import { getSource } from '@/data/sources';

/**
 * Marks a configuration example whose schema can change between releases.
 * It links to the exact reference page rather than asserting the shape is
 * current.
 */
export function VerifyBadge({ sourceId }: { sourceId: string }) {
  const source = getSource(sourceId);
  if (!source) return null;

  return (
    <p className="my-3 flex flex-wrap items-center gap-2 rounded-chip border border-warning-line bg-warning-soft px-3 py-1.5 text-xs text-warning">
      <span aria-hidden="true">▲</span>
      <span className="font-semibold">Verify against current docs</span>
      <span className="text-ink-muted">
        Configuration schemas change. Check{' '}
        <ExternalLink href={source.url}>{source.title}</ExternalLink> before relying on this shape.
      </span>
    </p>
  );
}
