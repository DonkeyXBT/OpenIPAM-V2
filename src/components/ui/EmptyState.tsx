import type { ReactNode } from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
      role="status"
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--surface-tertiary)] flex items-center justify-center mb-4 text-[var(--text-tertiary)] [&>svg]:w-7 [&>svg]:h-7">
        {icon}
      </div>
      <h3 className="text-headline text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-callout text-[var(--text-secondary)] max-w-sm mb-6">{description}</p>
      {action && (
        <Button variant="primary" icon={action.icon} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

// ─── Specialized Empty States ────────────────────────────────────────────────

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center" role="alert">
      <div className="w-16 h-16 rounded-2xl bg-system-red/10 flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 text-system-red"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h3 className="text-headline text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-callout text-[var(--text-secondary)] max-w-sm mb-6">{description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}

export function OfflineState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center" role="alert">
      <div className="w-16 h-16 rounded-2xl bg-system-orange/10 flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 text-system-orange"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>
      <h3 className="text-headline text-[var(--text-primary)] mb-1">Backend Offline</h3>
      <p className="text-callout text-[var(--text-secondary)] max-w-sm mb-2">
        The server is not reachable. Running in browser-only mode with local storage.
      </p>
      <p className="text-caption text-[var(--text-tertiary)]">
        Data will sync automatically when the server becomes available.
      </p>
    </div>
  )
}
