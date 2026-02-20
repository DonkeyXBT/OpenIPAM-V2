import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  iconRight?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconRight, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="typo-subhead font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] [&>svg]:w-4 [&>svg]:h-4"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-9 px-3 typo-callout
              bg-[var(--input-bg)] text-[var(--text-primary)]
              border border-[var(--input-border)] rounded-lg
              placeholder:text-[var(--text-quaternary)]
              transition-all duration-150
              focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--input-focus-ring)]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-8' : ''}
              ${iconRight ? 'pr-8' : ''}
              ${error ? 'border-system-red focus:border-system-red focus:ring-system-red/30' : ''}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {iconRight && (
            <span
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] [&>svg]:w-4 [&>svg]:h-4"
              aria-hidden="true"
            >
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="typo-caption text-system-red" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="typo-caption text-[var(--text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
