export function ProgressBar({
  value,
  max = 100,
  label,
  size = 'md',
}: {
  value: number;
  max?: number;
  label: string;
  size?: 'sm' | 'md';
}) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${percent}% complete`}
      className={`w-full overflow-hidden rounded-full bg-surface-3 ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
