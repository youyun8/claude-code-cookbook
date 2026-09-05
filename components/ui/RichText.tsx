import { Fragment, type ReactNode } from 'react';

/**
 * Renders a deliberately small inline markup subset into React elements:
 *
 *   `code`   **strong**   [label](https://example.com)   [label](/internal)
 *
 * Nothing is passed to dangerouslySetInnerHTML, so author text — and any
 * text a learner pastes into a lab — can never become markup.
 */

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderLink(label: string, href: string, key: number): ReactNode {
  const external = /^https?:\/\//.test(href);
  if (!external) {
    return (
      <a
        key={key}
        href={
          href.startsWith('/') && !href.startsWith('//')
            ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${href}`
            : href
        }
      >
        {label}
      </a>
    );
  }
  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer">
      {label}
      <span aria-hidden="true" className="ml-0.5 text-[0.85em]">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function RichText({ text }: { text: string }): ReactNode {
  const parts = text.split(TOKEN);

  return (
    <>
      {parts.map((part, index) => {
        if (part.length === 0) return null;

        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return <code key={index}>{part.slice(1, -1)}</code>;
        }

        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }

        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
        if (link && link[1] && link[2]) {
          return renderLink(link[1], link[2], index);
        }

        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
