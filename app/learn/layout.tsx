import type { ReactNode } from 'react';
import { CourseNav } from '@/components/navigation/CourseNav';

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[90rem] gap-8 px-4">
      <aside className="ca-no-print sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto py-8 lg:block">
        <CourseNav />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
