import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Download, Star, Server } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { HostStateBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { toast } from '@/components/ui/toastStore'
import { hosts, companies } from '@/data/mock'
import type { Host } from '@/types'

const hostTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'virtual-machine', label: 'Virtual Machine' },
  { value: 'physical', label: 'Physical' },
  { value: 'container', label: 'Container' },
  { value: 'firewall', label: 'Firewall' },
  { value: 'router', label: 'Router' },
  { value: 'switch', label: 'Switch' },
  { value: 'load-balancer', label: 'Load Balancer' },
  { value: 'storage', label: 'Storage' },
  { value: 'printer', label: 'Printer' },
  { value: 'other', label: 'Other' },
]

const stateOptions = [
  { value: '', label: 'All States' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'decommissioned', label: 'Decommissioned' },
]

export function Hosts() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() => {
    return hosts.filter((h) => {
      if (search) {
        const q = search.toLowerCase()
        if (!h.vmName.toLowerCase().includes(q) && !h.description.toLowerCase().includes(q) && !h.operatingSystem.toLowerCase().includes(q)) return false
      }
      if (typeFilter && h.hostType !== typeFilter) return false
      if (stateFilter && h.state !== stateFilter) return false
      return true
    })
  }, [search, typeFilter, stateFilter])

  const columns = [
    {
      key: 'favorite',
      label: '',
      width: '36px',
      render: (val: unknown) => (
        <Star className={`w-3.5 h-3.5 ${val ? 'fill-system-yellow text-system-yellow' : 'text-[var(--text-quaternary)]'}`} />
      ),
    },
    {
      key: 'vmName',
      label: 'Name',
      sortable: true,
      render: (val: unknown) => (
        <span className="typo-mono font-medium text-[var(--text-primary)]">{String(val)}</span>
      ),
    },
    {
      key: 'hostType',
      label: 'Type',
      sortable: true,
      width: '140px',
      render: (val: unknown) => <Badge variant="default">{String(val)}</Badge>,
    },
    {
      key: 'state',
      label: 'State',
      sortable: true,
      width: '140px',
      render: (val: unknown) => <HostStateBadge state={val as Host['state']} />,
    },
    {
      key: 'operatingSystem',
      label: 'OS',
      sortable: true,
      render: (val: unknown) => <span className="text-[var(--text-secondary)]">{String(val) || '—'}</span>,
    },
    {
      key: 'companyId',
      label: 'Company',
      sortable: true,
      render: (val: unknown) => {
        const company = companies.find((c) => c.id === String(val))
        return company ? <Badge variant="custom" size="sm" color={company.color} dot>{company.code}</Badge> : '—'
      },
    },
    {
      key: 'cpuCount',
      label: 'CPU',
      sortable: true,
      width: '70px',
      align: 'right' as const,
      render: (val: unknown) => <span className="text-[var(--text-secondary)]">{String(val)}</span>,
    },
    {
      key: 'memoryTotalGB',
      label: 'RAM',
      sortable: true,
      width: '80px',
      align: 'right' as const,
      render: (val: unknown) => <span className="text-[var(--text-secondary)]">{String(val)} GB</span>,
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (val: unknown) => <span className="typo-caption text-[var(--text-tertiary)]">{String(val) || '—'}</span>,
    },
  ]

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5 animate-fade-in">
      <PageHeader
        title="Hosts"
        description={`${hosts.length} hosts · ${hosts.filter((h) => h.state === 'running').length} running`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
            <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
              Add Host
            </Button>
          </div>
        }
      />

      <Card padding="md" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <Input placeholder="Search hosts..." icon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2.5">
          <Select options={hostTypeOptions} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by type" />
          <Select options={stateOptions} value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} aria-label="Filter by state" />
        </div>
      </Card>

      <Table
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        keyField="id"
        onRowClick={(row) => navigate(`/hosts/${(row as unknown as Host).id}`)}
        emptyState={
          <EmptyState
            icon={<Server />}
            title="No hosts found"
            description={search || typeFilter || stateFilter ? 'No hosts match your filters.' : 'Add your first host to get started.'}
            action={{ label: 'Add Host', icon: <Plus />, onClick: () => setCreateOpen(true) }}
          />
        }
      />

      <span className="typo-caption text-[var(--text-tertiary)]">
        Showing {filtered.length} of {hosts.length} hosts
      </span>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add Host"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => { setCreateOpen(false); toast({ type: 'success', title: 'Host Created' }) }}>Add Host</Button>
          </>
        }
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Hostname" placeholder="e.g. prod-web-01" />
          <Select label="Host Type" placeholder="Select type" options={hostTypeOptions.slice(1)} />
          <Input label="Operating System" placeholder="e.g. Ubuntu 24.04 LTS" />
          <Input label="Serial Number" placeholder="Serial number" />
          <Input label="CPU Cores" type="number" placeholder="8" />
          <Input label="Memory (GB)" type="number" placeholder="16" />
          <Input label="Disk (GB)" type="number" placeholder="500" />
          <Select label="State" options={stateOptions.slice(1)} />
          <div className="sm:col-span-2">
            <Input label="Description" placeholder="Brief description" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
