import { useState, useMemo } from 'react'
import { Plus, Search, Hash } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { toast } from '@/components/ui/Toast'
import { vlans, companies, subnets } from '@/data/mock'
import type { VLAN } from '@/types'

const typeColors: Record<string, string> = {
  data: 'var(--color-system-blue)',
  voice: 'var(--color-system-green)',
  management: 'var(--color-system-purple)',
  dmz: 'var(--color-system-red)',
  guest: 'var(--color-system-orange)',
  iot: 'var(--color-system-teal)',
  storage: 'var(--color-system-indigo)',
  backup: 'var(--color-system-cyan)',
  native: 'var(--color-neutral-500)',
}

export function VLANs() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!search) return vlans
    const q = search.toLowerCase()
    return vlans.filter(
      (v) =>
        String(v.vlanId).includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.type.includes(q)
    )
  }, [search])

  const columns = [
    {
      key: 'vlanId',
      label: 'VLAN ID',
      sortable: true,
      width: '100px',
      render: (val: unknown) => <span className="typo-mono font-semibold text-[var(--text-primary)]">{String(val)}</span>,
    },
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      width: '120px',
      render: (val: unknown) => {
        const t = String(val)
        return <Badge variant="custom" size="sm" color={typeColors[t] || typeColors.native}>{t}</Badge>
      },
    },
    { key: 'description', label: 'Description', render: (v: unknown) => <span className="text-[var(--text-secondary)]">{String(v)}</span> },
    {
      key: 'companyId',
      label: 'Company',
      render: (val: unknown) => {
        const c = companies.find((c) => c.id === String(val))
        return c ? <Badge variant="custom" size="sm" color={c.color} dot>{c.code}</Badge> : '—'
      },
    },
    {
      key: 'id',
      label: 'Subnets',
      width: '80px',
      align: 'right' as const,
      render: (val: unknown) => {
        const count = subnets.filter((s) => s.vlanId === String(val)).length
        return <span className="typo-callout text-[var(--text-secondary)]">{count}</span>
      },
    },
  ]

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-4 animate-fade-in">
      <PageHeader
        title="VLANs"
        description={`${vlans.length} VLANs across ${new Set(vlans.map((v) => v.type)).size} types`}
        actions={<Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>Create VLAN</Button>}
      />

      <Card padding="sm">
        <Input placeholder="Search VLANs..." icon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
      </Card>

      <Table
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        keyField="id"
        emptyState={<EmptyState icon={<Hash />} title="No VLANs" description="Create your first VLAN." action={{ label: 'Create VLAN', icon: <Plus />, onClick: () => setCreateOpen(true) }} />}
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create VLAN"
        footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={() => { setCreateOpen(false); toast({ type: 'success', title: 'VLAN Created' }) }}>Create</Button></>}
      >
        <div className="space-y-4">
          <Input label="VLAN ID" type="number" placeholder="1-4094" />
          <Input label="Name" placeholder="e.g. VLAN-Prod" />
          <Select label="Type" options={Object.keys(typeColors).map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} />
          <Input label="Description" placeholder="Description" />
        </div>
      </Modal>
    </div>
  )
}
