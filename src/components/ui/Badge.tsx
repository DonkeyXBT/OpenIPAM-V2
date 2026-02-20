import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'custom'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  color?: string
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--surface-tertiary)] text-[var(--text-secondary)]',
  success: 'bg-system-green/15 text-system-green',
  warning: 'bg-system-orange/15 text-system-orange',
  error: 'bg-system-red/15 text-system-red',
  info: 'bg-system-blue/15 text-system-blue',
  purple: 'bg-system-purple/15 text-system-purple',
  custom: '',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-[11px]',
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot,
  color,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      style={variant === 'custom' && color ? {
        backgroundColor: `${color}18`,
        color: color,
      } : undefined}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: color || 'currentColor' }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
