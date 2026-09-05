import type { ReactNode } from 'react';

/**
 * Every link that leaves the site: safe target, and a visible plus
 * screen-reader indication that it opens in a new tab.
 */
export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ?? 'text-accent underline underline-offset-[3px] hover:text-accent-hover'
      }
    >
      {children}
      <span aria-hidden="true" className="ml-0.5 text-[0.85em]">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
