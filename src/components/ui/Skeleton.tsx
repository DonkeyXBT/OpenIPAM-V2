interface SkeletonProps {
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

const roundedStyles = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
}

export function Skeleton({
  width,
  height = '16px',
  rounded = 'md',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer ${roundedStyles[rounded]} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="p-4 rounded-xl border border-[var(--border-secondary)] bg-[var(--card-bg)]">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton width="40px" height="40px" rounded="lg" />
        <div className="flex-1">
          <Skeleton width="60%" height="14px" className="mb-2" />
          <Skeleton width="40%" height="10px" />
        </div>
      </div>
      <Skeleton width="100%" height="32px" className="mb-2" />
      <Skeleton width="80%" height="10px" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full" role="status" aria-label="Loading table">
      {/* Header */}
      <div className="flex gap-4 p-3 border-b border-[var(--border-secondary)]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width={`${100 / cols}%`} height="12px" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-3 border-b border-[var(--border-secondary)]">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={`${100 / cols}%`} height="14px" />
          ))}
        </div>
      ))}
    </div>
  )
}
