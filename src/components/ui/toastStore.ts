import type { ToastMessage } from '@/types'

type Listener = (toasts: ToastMessage[]) => void

let toasts: ToastMessage[] = []
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l([...toasts]))
}

export function toast(msg: Omit<ToastMessage, 'id'>) {
  const id = crypto.randomUUID()
  toasts = [...toasts, { ...msg, id }]
  notify()

  const duration = msg.duration ?? 4000
  if (duration > 0) {
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id)
      notify()
    }, duration)
  }
}

export function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  notify()
}

export function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
