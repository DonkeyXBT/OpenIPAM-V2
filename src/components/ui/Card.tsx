import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  glass?: boolean
  hover?: boolean
  className?: string
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({
  children,
  padding = 'md',
  glass = false,
  hover = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl border border-[var(--card-border)] shadow-[var(--card-shadow)]
        ${glass ? 'glass' : 'bg-[var(--card-bg)]'}
        ${paddingStyles[padding]}
        ${hover ? 'transition-all duration-200 hover:shadow-[var(--card-hover-shadow)] hover:border-[var(--card-hover-border)] hover:bg-[var(--card-hover-bg)] cursor-pointer' : 'transition-all duration-200'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h3 className={`typo-headline text-[var(--text-primary)] ${className}`}>
      {children}
    </h3>
  )
}
