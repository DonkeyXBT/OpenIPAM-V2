import type { IPStatus, HostState } from '@/types'

const ipStatusConfig: Record<IPStatus, { label: string; color: string; dot: string }> = {
  available: { label: 'Available', color: 'bg-system-green/15 text-system-green', dot: 'bg-system-green' },
  assigned: { label: 'Assigned', color: 'bg-system-blue/15 text-system-blue', dot: 'bg-system-blue' },
  reserved: { label: 'Reserved', color: 'bg-system-orange/15 text-system-orange', dot: 'bg-system-orange' },
  conflict: { label: 'Conflict', color: 'bg-system-red/15 text-system-red', dot: 'bg-system-red' },
}

const hostStateConfig: Record<HostState, { label: string; color: string; dot: string }> = {
  running: { label: 'Running', color: 'bg-system-green/15 text-system-green', dot: 'bg-system-green' },
  stopped: { label: 'Stopped', color: 'bg-[var(--surface-tertiary)] text-[var(--text-secondary)]', dot: 'bg-[var(--text-tertiary)]' },
  suspended: { label: 'Suspended', color: 'bg-system-orange/15 text-system-orange', dot: 'bg-system-orange' },
  unknown: { label: 'Unknown', color: 'bg-[var(--surface-tertiary)] text-[var(--text-tertiary)]', dot: 'bg-[var(--text-quaternary)]' },
  maintenance: { label: 'Maintenance', color: 'bg-system-purple/15 text-system-purple', dot: 'bg-system-purple' },
  decommissioned: { label: 'Decommissioned', color: 'bg-system-red/15 text-system-red', dot: 'bg-system-red' },
}

export function IPStatusBadge({ status }: { status: IPStatus }) {
  const config = ipStatusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  )
}

export function HostStateBadge({ state }: { state: HostState }) {
  const config = hostStateConfig[state]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${state === 'running' ? 'animate-pulse' : ''}`} aria-hidden="true" />
      {config.label}
    </span>
  )
}
