import { highlight } from '@/lib/code/highlight';
import { CopyButton } from '@/components/ui/CopyButton';

interface CodeBlockProps {
  code: string;
  lang: string;
  label?: string;
  caption?: string;
  copyLabel?: string;
}

/**
 * A server component: highlighting happens at build time and the browser
 * receives plain markup. Only the copy button is interactive.
 */
export async function CodeBlock({ code, lang, label, caption, copyLabel }: CodeBlockProps) {
  const html = await highlight(code, lang);

  return (
    <figure className="my-5 min-w-0">
      <div className="overflow-hidden rounded-card border border-line bg-surface-2">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-3/60 px-3 py-1.5">
          <span className="truncate font-mono text-[11px] uppercase tracking-wide text-ink-subtle">
            {label ?? lang}
          </span>
          <CopyButton value={code} label={copyLabel ?? label ?? 'Code block'} />
        </div>
        <div
          className="overflow-x-auto p-3.5 text-[13.5px] leading-relaxed [&_pre]:min-w-fit"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      {caption ? (
        <figcaption className="mt-1.5 text-sm text-ink-subtle">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
