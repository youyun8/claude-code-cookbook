/**
 * The workbench motif's completion mark: a small pressed stamp shown on
 * finished lessons and labs. It always appears alongside text, so progress
 * is never conveyed by the graphic alone.
 */
export function Stamp({ label = 'Completed' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-chip border border-success-line bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
      <span
        aria-hidden="true"
        className="grid h-4 w-4 place-items-center rounded-full border border-success text-[9px] leading-none"
      >
        ✓
      </span>
      {label}
    </span>
  );
}
