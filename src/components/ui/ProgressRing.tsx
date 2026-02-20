interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
  showValue?: boolean
  className?: string
}

export function ProgressRing({
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
  color = 'var(--color-system-blue)',
  trackColor = 'var(--surface-tertiary)',
  label,
  showValue = true,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(value / max, 1)
  const offset = circumference * (1 - percent)

  // Color thresholds
  const autoColor =
    percent > 0.9 ? 'var(--color-system-red)' :
    percent > 0.75 ? 'var(--color-system-orange)' :
    color

  return (
    <div
      className={`inline-flex flex-col items-center gap-1 ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label || `${Math.round(percent * 100)}% utilized`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={autoColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showValue && (
        <span className="text-footnote font-medium text-[var(--text-secondary)]">
          {Math.round(percent * 100)}%
        </span>
      )}
      {label && (
        <span className="text-caption text-[var(--text-tertiary)]">{label}</span>
      )}
    </div>
  )
}

// ─── Capacity Bar ────────────────────────────────────────────────────────────

interface CapacityBarProps {
  used: number
  reserved: number
  total: number
  showLabels?: boolean
  height?: number
  className?: string
}

export function CapacityBar({
  used,
  reserved,
  total,
  showLabels = true,
  height = 6,
  className = '',
}: CapacityBarProps) {
  const usedPct = (used / total) * 100
  const reservedPct = (reserved / total) * 100

  return (
    <div className={className}>
      <div
        className="w-full rounded-full overflow-hidden bg-[var(--surface-tertiary)]"
        style={{ height }}
        role="meter"
        aria-valuenow={used + reserved}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${used} assigned, ${reserved} reserved, ${total - used - reserved} available of ${total} total`}
      >
        <div className="h-full flex">
          <div
            className="h-full bg-system-blue transition-all duration-300"
            style={{ width: `${usedPct}%` }}
          />
          <div
            className="h-full bg-system-orange transition-all duration-300"
            style={{ width: `${reservedPct}%` }}
          />
        </div>
      </div>
      {showLabels && (
        <div className="flex items-center gap-3 mt-1.5">
          <span className="inline-flex items-center gap-1 text-caption text-[var(--text-tertiary)]">
            <span className="w-2 h-2 rounded-full bg-system-blue" aria-hidden="true" />
            {used} assigned
          </span>
          <span className="inline-flex items-center gap-1 text-caption text-[var(--text-tertiary)]">
            <span className="w-2 h-2 rounded-full bg-system-orange" aria-hidden="true" />
            {reserved} reserved
          </span>
          <span className="inline-flex items-center gap-1 text-caption text-[var(--text-tertiary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--surface-tertiary)]" aria-hidden="true" />
            {total - used - reserved} free
          </span>
        </div>
      )}
    </div>
  )
}
