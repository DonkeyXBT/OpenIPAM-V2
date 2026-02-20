import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Network } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { CapacityBar } from '@/components/ui/ProgressRing'
import { PageHeader } from '@/components/layout/PageHeader'
import { toast } from '@/components/ui/Toast'
import { subnets, companies, vlans } from '@/data/mock'
import type { Subnet } from '@/types'

export function Subnets() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!search) return subnets
    const q = search.toLowerCase()
    return subnets.filter(
      (s) => s.network.includes(q) || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    )
  }, [search])

  const columns = [
    {
      key: 'network',
      label: 'Network',
      sortable: true,
      render: (_v: unknown, row: unknown) => {
        const s = row as unknown as Subnet
        return <span className="typo-mono font-medium text-[var(--text-primary)]">{s.network}/{s.cidr}</span>
      },
    },
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'companyId',
      label: 'Company',
      sortable: true,
      render: (val: unknown) => {
        const c = companies.find((c) => c.id === String(val))
        return c ? <Badge variant="custom" size="sm" color={c.color} dot>{c.code}</Badge> : '—'
      },
    },
    {
      key: 'vlanId',
      label: 'VLAN',
      render: (val: unknown) => {
        const v = vlans.find((v) => v.id === String(val))
        return v ? <Badge variant="info" size="sm">VLAN {v.vlanId}</Badge> : '—'
      },
    },
    { key: 'gateway', label: 'Gateway', render: (v: unknown) => <span className="typo-mono text-[var(--text-tertiary)]">{String(v)}</span> },
    {
      key: 'totalHosts',
      label: 'Capacity',
      width: '200px',
      render: (_v: unknown, row: unknown) => {
        const s = row as unknown as Subnet
        return <CapacityBar used={s.assignedCount} reserved={s.reservedCount} total={s.totalHosts} showLabels={false} height={4} />
      },
    },
    {
      key: 'assignedCount',
      label: 'Usage',
      sortable: true,
      width: '80px',
      align: 'right' as const,
      render: (_v: unknown, row: unknown) => {
        const s = row as unknown as Subnet
        const pct = Math.round((s.assignedCount / s.totalHosts) * 100)
        return (
          <span className={`typo-callout font-medium ${pct > 90 ? 'text-system-red' : pct > 75 ? 'text-system-orange' : 'text-[var(--text-secondary)]'}`}>
            {pct}%
          </span>
        )
      },
    },
  ]

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-4 animate-fade-in">
      <PageHeader
        title="Subnets"
        description={`${subnets.length} subnets configured`}
        actions={
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
            Create Subnet
          </Button>
        }
      />

      <Card padding="sm">
        <Input placeholder="Search subnets..." icon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
      </Card>

      <Table
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        keyField="id"
        onRowClick={(row) => navigate(`/subnets/${(row as unknown as Subnet).id}`)}
        emptyState={<EmptyState icon={<Network />} title="No subnets" description="Create your first subnet to start managing IP space." action={{ label: 'Create Subnet', icon: <Plus />, onClick: () => setCreateOpen(true) }} />}
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Subnet"
        footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={() => { setCreateOpen(false); toast({ type: 'success', title: 'Subnet Created' }) }}>Create</Button></>}
      >
        <div className="space-y-4">
          <Input label="Network Address" placeholder="e.g. 10.0.1.0" />
          <Select label="CIDR" options={[{value:'24',label:'/24 (254 hosts)'},{value:'22',label:'/22 (1022 hosts)'},{value:'20',label:'/20 (4094 hosts)'},{value:'16',label:'/16 (65534 hosts)'}]} />
          <Input label="Name" placeholder="e.g. Production Servers" />
          <Input label="Gateway" placeholder="e.g. 10.0.1.1" />
          <Input label="DNS Servers" placeholder="e.g. 10.0.1.10, 10.0.1.11" />
        </div>
      </Modal>
    </div>
  )
}
