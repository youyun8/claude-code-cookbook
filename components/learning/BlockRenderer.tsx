import type { Block } from '@/content/types';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Callout } from '@/components/ui/Callout';
import { RichText } from '@/components/ui/RichText';
import { SourceList } from '@/components/ui/SourceList';
import { LabMount } from '@/components/labs/LabMount';

function CompareBlock({ block }: { block: Extract<Block, { kind: 'compare' }> }) {
  return (
    <section className="my-6">
      <h3 className="mb-3 text-base font-semibold text-ink">{block.title}</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {block.sides.map((side) => {
          const weak = side.tone === 'weak';
          return (
            <article
              key={side.label}
              className={`overflow-hidden rounded-card border ${
                weak ? 'border-danger-line' : 'border-success-line'
              } bg-surface`}
            >
              <h4
                className={`flex items-center gap-2 border-b px-3 py-2 text-sm font-semibold ${
                  weak
                    ? 'border-danger-line bg-danger-soft text-danger'
                    : 'border-success-line bg-success-soft text-success'
                }`}
              >
                <span aria-hidden="true">{weak ? '✕' : '✓'}</span>
                {side.label}
              </h4>
              <pre className="overflow-x-auto bg-surface-2 px-3 py-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words text-ink">
                {side.code}
              </pre>
              <ul className="space-y-1.5 px-3 py-3 text-sm text-ink-muted">
                {side.notes.map((note, index) => (
                  <li key={index} className="flex gap-2">
                    <span aria-hidden="true" className="text-ink-subtle">
                      →
                    </span>
                    <span>
                      <RichText text={note} />
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TableBlock({ block }: { block: Extract<Block, { kind: 'table' }> }) {
  return (
    <figure className="my-5">
      <div className="overflow-x-auto rounded-card border border-line">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          {block.caption ? <caption className="sr-only">{block.caption}</caption> : null}
          <thead className="bg-surface-2">
            <tr>
              {block.head.map((cell, index) => (
                <th
                  key={index}
                  scope="col"
                  className="border-b border-line px-3 py-2 font-semibold text-ink"
                >
                  <RichText text={cell} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="align-top even:bg-surface-2/50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-b border-line px-3 py-2 text-ink-muted">
                    <RichText text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.caption ? (
        <figcaption className="mt-1.5 text-sm text-ink-subtle">{block.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function BlockRenderer({ blocks }: { blocks: readonly Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'p':
            return (
              <p key={index}>
                <RichText text={block.text} />
              </p>
            );
          case 'h2':
            return (
              <h2 key={index} id={block.id}>
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={index} id={block.id}>
                {block.text}
              </h3>
            );
          case 'ul':
            return (
              <ul key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <RichText text={item} />
                  </li>
                ))}
              </ol>
            );
          case 'code':
            return (
              <CodeBlock
                key={index}
                code={block.code}
                lang={block.lang}
                label={block.label}
                caption={block.caption}
              />
            );
          case 'callout':
            return <Callout key={index} tone={block.tone} title={block.title} body={block.body} />;
          case 'table':
            return <TableBlock key={index} block={block} />;
          case 'compare':
            return <CompareBlock key={index} block={block} />;
          case 'checklist':
            return (
              <section
                key={index}
                className="my-5 rounded-card border border-line bg-surface-2 p-4"
              >
                <h3 className="mb-2 text-sm font-semibold text-ink">{block.title}</h3>
                <ul className="space-y-1.5 text-sm text-ink-muted">
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex gap-2">
                      <span aria-hidden="true" className="text-ink-subtle">
                        ☐
                      </span>
                      <span>
                        <RichText text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          case 'sources':
            return <SourceList key={index} ids={block.ids} note={block.note} />;
          case 'lab':
            return (
              <div key={index} className="not-prose">
                <LabMount lab={block.lab} />
              </div>
            );
          case 'definition':
            return (
              <div
                key={index}
                className="my-4 border-l-[3px] border-accent-line bg-accent-soft/40 py-2 pl-4"
              >
                <p className="font-semibold text-ink">{block.term}</p>
                <p className="mt-1 text-ink-muted">
                  <RichText text={block.body} />
                </p>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
