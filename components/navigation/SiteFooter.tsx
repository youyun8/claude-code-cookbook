import Link from 'next/link';
import { CONTENT_LAST_REVIEWED } from '@/data/sources';
import { ExternalLink } from '@/components/ui/ExternalLink';

export function SiteFooter() {
  return (
    <footer className="ca-no-print mt-16 border-t border-line bg-surface-2">
      <div className="mx-auto max-w-[90rem] px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-ink">Claude Code Academy</p>
            <p className="mt-1 max-w-xs text-sm text-ink-muted">
              An independent course. Not affiliated with or endorsed by Anthropic.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
              Sections
            </p>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/learn/" className="text-ink-muted hover:text-ink">
                  Learning path
                </Link>
              </li>
              <li>
                <Link href="/clinic/" className="text-ink-muted hover:text-ink">
                  Prompt clinic
                </Link>
              </li>
              <li>
                <Link href="/recipes/" className="text-ink-muted hover:text-ink">
                  Workflow recipes
                </Link>
              </li>
              <li>
                <Link href="/safety/" className="text-ink-muted hover:text-ink">
                  Safety lab
                </Link>
              </li>
              <li>
                <Link href="/reference/" className="text-ink-muted hover:text-ink">
                  Reference
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
              Accuracy
            </p>
            <p className="text-sm text-ink-muted">
              Technical content last reviewed{' '}
              <time dateTime={CONTENT_LAST_REVIEWED} className="font-medium text-ink">
                {CONTENT_LAST_REVIEWED}
              </time>
              . Claude Code changes frequently — check the{' '}
              <ExternalLink href="https://code.claude.com/docs/en/overview">
                official documentation
              </ExternalLink>{' '}
              for anything version-sensitive.
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              No accounts, no analytics, no third-party scripts. Progress is stored in your browser
              only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
