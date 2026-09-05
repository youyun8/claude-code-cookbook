'use client';

import { useEffect } from 'react';
import { useProgress } from '@/components/progress/ProgressProvider';
import { useAnnounce } from '@/components/ui/Announcer';
import { Stamp } from '@/components/ui/Stamp';

export function LessonActions({ slug, title }: { slug: string; title: string }) {
  const { state, ready, storage, setLessonComplete, toggleBookmark, setLastLesson } = useProgress();
  const announce = useAnnounce();

  useEffect(() => {
    if (ready) setLastLesson(slug);
  }, [ready, slug, setLastLesson]);

  const complete = state.completedLessons.includes(slug);
  const bookmarked = state.bookmarks.includes(`lesson:${slug}`);

  return (
    <div className="ca-no-print my-8 rounded-panel border border-line bg-surface-2 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setLessonComplete(slug, !complete);
            announce(
              complete
                ? `${title} marked as not complete`
                : `${title} marked complete. Progress saved.`,
            );
          }}
          className={`rounded-chip border px-4 py-1.5 text-sm font-medium transition-colors ${
            complete
              ? 'border-success-line bg-success-soft text-success'
              : 'border-accent bg-accent text-accent-ink hover:bg-accent-hover'
          }`}
        >
          <span aria-hidden="true" className="mr-1.5">
            {complete ? '✓' : '☐'}
          </span>
          {complete ? 'Completed' : 'Mark this lesson complete'}
        </button>

        <button
          type="button"
          onClick={() => {
            toggleBookmark(`lesson:${slug}`);
            announce(bookmarked ? 'Bookmark removed' : 'Lesson bookmarked');
          }}
          aria-pressed={bookmarked}
          className="rounded-chip border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <span aria-hidden="true" className="mr-1.5">
            {bookmarked ? '★' : '☆'}
          </span>
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>

        {complete ? <Stamp /> : null}
      </div>

      {storage === 'unavailable' ? (
        <p className="mt-3 rounded-card border border-warning-line bg-warning-soft px-3 py-2 text-sm text-warning">
          <span aria-hidden="true">▲</span> Browser storage is unavailable, so progress will not be
          saved between visits. Everything else on the site works normally.
        </p>
      ) : null}
    </div>
  );
}
