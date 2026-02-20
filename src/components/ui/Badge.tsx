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
  success: 'bg-system-green/18 text-system-green',
  warning: 'bg-system-orange/18 text-system-orange',
  error: 'bg-system-red/18 text-system-red',
  info: 'bg-system-blue/18 text-system-blue',
  purple: 'bg-system-purple/18 text-system-purple',
  custom: '',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-[12px]',
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
        inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap
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
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color || 'currentColor' }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
