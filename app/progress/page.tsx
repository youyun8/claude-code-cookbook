import type { Metadata } from 'next';
import { ProgressDashboard } from '@/components/learning/ProgressDashboard';

export const metadata: Metadata = {
  title: 'Progress',
  description:
    'Your completion across modules, labs and knowledge checks. Stored locally in your browser, with export, import and reset.',
  alternates: { canonical: '/progress/' },
  robots: { index: false, follow: true },
};

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-[70rem] px-4 py-10">
      <header className="max-w-[64ch]">
        <p className="text-[11px] uppercase tracking-wide text-ink-subtle">Where you are</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Progress</h1>
        <p className="mt-3 text-ink-muted">
          Everything on this page is stored in your browser. No account, no server, no analytics.
        </p>
      </header>

      <div className="mt-8">
        <ProgressDashboard />
      </div>
    </div>
  );
}
