import type { Block } from '@/content/types';

/** Built from the lesson's own h2 blocks, so it can never drift. */
export function TableOfContents({ blocks }: { blocks: readonly Block[] }) {
  const headings = blocks.filter(
    (block): block is Extract<Block, { kind: 'h2' }> => block.kind === 'h2',
  );
  if (headings.length < 3) return null;

  return (
    <nav aria-labelledby="toc-heading" className="text-sm">
      <h2
        id="toc-heading"
        className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle"
      >
        On this page
      </h2>
      <ul className="space-y-1 border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="-ml-px block border-l border-transparent py-0.5 pl-3 text-ink-muted transition-colors hover:border-accent hover:text-ink"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
