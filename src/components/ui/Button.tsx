import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  iconRight?: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-system-blue bg-gradient-to-b from-white/[0.12] to-transparent text-white hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] shadow-[var(--btn-primary-shadow)]',
  secondary:
    'bg-[var(--surface-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--surface-secondary)] active:bg-[var(--surface-tertiary)]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)] active:bg-[var(--surface-tertiary)]',
  destructive:
    'bg-system-red bg-gradient-to-b from-white/[0.12] to-transparent text-white hover:bg-[var(--btn-destructive-hover)] active:bg-[var(--btn-destructive-active)] shadow-[var(--btn-primary-shadow)]',
  outline:
    'bg-transparent border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-7 px-2.5 text-[12px] gap-1 rounded-md',
  md: 'h-9 px-3.5 text-[14px] gap-1.5 rounded-lg',
  lg: 'h-11 px-5 text-[15px] gap-2 rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconRight,
      loading,
      fullWidth,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center font-medium select-none
          transition-all duration-150 ease-out
          disabled:opacity-50 disabled:pointer-events-none
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        aria-busy={loading}
        {...(props as object)}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="60"
              strokeLinecap="round"
              opacity="0.3"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="15 45"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          icon && <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {iconRight && (
          <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{iconRight}</span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
