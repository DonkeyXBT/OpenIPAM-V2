import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { dismiss, subscribe } from './toastStore'
import type { ToastMessage } from '@/types'

export { toast } from './toastStore'

// ─── Icons ───────────────────────────────────────────────────────────────────

const icons = {
  success: <CheckCircle className="w-5 h-5 text-system-green" />,
  error: <XCircle className="w-5 h-5 text-system-red" />,
  warning: <AlertTriangle className="w-5 h-5 text-system-orange" />,
  info: <Info className="w-5 h-5 text-system-blue" />,
}

// ─── Toast Container ─────────────────────────────────────────────────────────

export function ToastContainer() {
  const [items, setItems] = useState<ToastMessage[]>([])

  useEffect(() => subscribe(setItems), [])

  const handleDismiss = useCallback((id: string) => dismiss(id), [])

  return (
    <div
      className="fixed bottom-5 right-5 flex flex-col-reverse gap-2 pointer-events-none"
      style={{ zIndex: 500 }}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="pointer-events-auto max-w-sm w-full"
          >
            <div
              className="
                flex items-start gap-3 p-3.5 rounded-xl
                bg-[var(--surface-elevated)] border border-[var(--border-primary)]
                shadow-lg
              "
              role="alert"
            >
              <span className="shrink-0" aria-hidden="true">
                {icons[t.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="typo-callout font-medium text-[var(--text-primary)]">
                  {t.title}
                </p>
                {t.message && (
                  <p className="typo-caption text-[var(--text-secondary)] mt-0.5">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDismiss(t.id)}
                className="shrink-0 p-0.5 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
