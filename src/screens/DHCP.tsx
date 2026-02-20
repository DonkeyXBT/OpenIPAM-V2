import { useState } from 'react'
import { Plus, Wifi, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { CapacityBar } from '@/components/ui/ProgressRing'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { toast } from '@/components/ui/Toast'
import { dhcpScopes, dhcpLeases, subnets } from '@/data/mock'

type Tab = 'scopes' | 'leases' | 'reservations'

export function DHCP() {
  const [activeTab, setActiveTab] = useState<Tab>('scopes')
  const [createOpen, setCreateOpen] = useState(false)

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'scopes', label: 'Scopes', count: dhcpScopes.length },
    { key: 'leases', label: 'Leases', count: dhcpLeases.length },
    { key: 'reservations', label: 'Reservations', count: 0 },
  ]

  const scopeColumns = [
    { key: 'name', label: 'Scope Name', sortable: true, render: (v: unknown) => <span className="font-medium text-[var(--text-primary)]">{String(v)}</span> },
    {
      key: 'enabled',
      label: 'Status',
      width: '100px',
      render: (v: unknown) => v ? <Badge variant="success" dot>Active</Badge> : <Badge variant="default">Disabled</Badge>,
    },
    {
      key: 'startIP',
      label: 'Range',
      render: (_v: unknown, row: unknown) => {
        const s = row as any
        return <span className="typo-mono text-[var(--text-secondary)]">{s.startIP} — {s.endIP}</span>
      },
    },
    {
      key: 'activeLeases',
      label: 'Utilization',
      width: '180px',
      render: (_v: unknown, row: unknown) => {
        const s = row as any
        return (
          <div>
            <CapacityBar used={s.activeLeases} reserved={0} total={s.totalAddresses} showLabels={false} height={4} />
            <span className="typo-caption text-[var(--text-tertiary)]">{s.activeLeases}/{s.totalAddresses}</span>
          </div>
        )
      },
    },
    { key: 'domain', label: 'Domain', render: (v: unknown) => <span className="text-[var(--text-tertiary)]">{String(v) || '—'}</span> },
    {
      key: 'leaseTime',
      label: 'Lease Time',
      render: (v: unknown) => {
        const secs = Number(v)
        const hrs = Math.round(secs / 3600)
        return <span className="text-[var(--text-secondary)]">{hrs}h</span>
      },
    },
  ]

  const leaseColumns = [
    { key: 'ipAddress', label: 'IP Address', sortable: true, render: (v: unknown) => <span className="typo-mono">{String(v)}</span> },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: (v: unknown) => {
        const s = String(v)
        if (s === 'active') return <Badge variant="success" dot>Active</Badge>
        if (s === 'expired') return <Badge variant="default" dot>Expired</Badge>
        return <Badge variant="warning" dot>Reserved</Badge>
      },
    },
    { key: 'macAddress', label: 'MAC Address', render: (v: unknown) => <span className="typo-mono text-[var(--text-tertiary)]">{String(v)}</span> },
    { key: 'hostname', label: 'Hostname' },
    {
      key: 'endTime',
      label: 'Expires',
      render: (v: unknown) => {
        const d = new Date(String(v))
        const isExpired = d < new Date()
        return (
          <span className={`typo-caption ${isExpired ? 'text-system-red' : 'text-[var(--text-secondary)]'}`}>
            {d.toLocaleString()}
          </span>
        )
      },
    },
  ]

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-4 animate-fade-in">
      <PageHeader
        title="DHCP Management"
        description={`${dhcpScopes.length} scopes · ${dhcpLeases.filter((l) => l.status === 'active').length} active leases`}
        actions={
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
            {activeTab === 'scopes' ? 'Create Scope' : activeTab === 'leases' ? 'Add Lease' : 'Add Reservation'}
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[var(--surface-tertiary)] rounded-lg p-0.5 w-fit" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all
              ${activeTab === tab.key
                ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
            `}
            role="tab"
            aria-selected={activeTab === tab.key}
          >
            {tab.label}
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--surface-tertiary)]">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'scopes' && (
        <Table
          columns={scopeColumns}
          data={dhcpScopes as unknown as Record<string, unknown>[]}
          keyField="id"
          emptyState={<EmptyState icon={<Wifi />} title="No DHCP Scopes" description="Create a DHCP scope to manage address allocation." action={{ label: 'Create Scope', icon: <Plus />, onClick: () => setCreateOpen(true) }} />}
        />
      )}

      {activeTab === 'leases' && (
        <Table
          columns={leaseColumns}
          data={dhcpLeases as unknown as Record<string, unknown>[]}
          keyField="id"
          emptyState={<EmptyState icon={<Clock />} title="No Leases" description="No active DHCP leases found." />}
        />
      )}

      {activeTab === 'reservations' && (
        <EmptyState icon={<Wifi />} title="No Reservations" description="Create static IP-to-MAC reservations." action={{ label: 'Add Reservation', icon: <Plus />, onClick: () => setCreateOpen(true) }} />
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={activeTab === 'scopes' ? 'Create DHCP Scope' : 'Add Entry'}
        footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={() => { setCreateOpen(false); toast({ type: 'success', title: 'Created' }) }}>Create</Button></>}
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="e.g. Office-DHCP" />
          <Select label="Subnet" placeholder="Select subnet" options={subnets.map((s) => ({ value: s.id, label: `${s.network}/${s.cidr}` }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start IP" placeholder="e.g. 10.0.1.100" />
            <Input label="End IP" placeholder="e.g. 10.0.1.200" />
          </div>
          <Input label="Lease Time (seconds)" type="number" placeholder="86400" />
          <Input label="DNS Server" placeholder="e.g. 10.0.1.10" />
          <Input label="Gateway" placeholder="e.g. 10.0.1.1" />
        </div>
      </Modal>
    </div>
  )
}
