import { useState, useMemo } from 'react'
import { Search, ClipboardList, Download, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { auditLog } from '@/data/mock'

const actionColors: Record<string, string> = {
  create: 'bg-system-green/15 text-system-green',
  update: 'bg-system-blue/15 text-system-blue',
  delete: 'bg-system-red/15 text-system-red',
}

const actionOptions = [
  { value: '', label: 'All Actions' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
]

const entityOptions = [
  { value: '', label: 'All Entities' },
  { value: 'host', label: 'Host' },
  { value: 'ip', label: 'IP Address' },
  { value: 'subnet', label: 'Subnet' },
  { value: 'vlan', label: 'VLAN' },
  { value: 'dhcp_scope', label: 'DHCP Scope' },
]

export function AuditLog() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')

  const filtered = useMemo(() => {
    return auditLog.filter((entry) => {
      if (search) {
        const q = search.toLowerCase()
        if (!entry.details.toLowerCase().includes(q) && !entry.userName.toLowerCase().includes(q)) return false
      }
      if (actionFilter && entry.action !== actionFilter) return false
      if (entityFilter && entry.entityType !== entityFilter) return false
      return true
    })
  }, [search, actionFilter, entityFilter])

  const columns = [
    {
      key: 'timestamp',
      label: 'Time',
      sortable: true,
      width: '180px',
      render: (v: unknown) => (
        <span className="typo-caption text-[var(--text-secondary)]">
          {new Date(String(v)).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'userName',
      label: 'User',
      sortable: true,
      width: '140px',
      render: (v: unknown, row: unknown) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--surface-tertiary)] flex items-center justify-center">
            <span className="text-[10px] font-bold text-[var(--text-secondary)]">{String(v).charAt(0)}</span>
          </div>
          <span className="typo-callout font-medium">{String(v)}</span>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      sortable: true,
      width: '100px',
      render: (v: unknown) => (
        <span className={`inline-flex px-2.5 py-1 typo-caption font-medium rounded-full capitalize ${actionColors[String(v)] || ''}`}>
          {String(v)}
        </span>
      ),
    },
    {
      key: 'entityType',
      label: 'Entity',
      sortable: true,
      width: '100px',
      render: (v: unknown) => <Badge variant="default" size="sm">{String(v)}</Badge>,
    },
    {
      key: 'details',
      label: 'Details',
      render: (v: unknown) => <span className="text-[var(--text-secondary)] truncate block max-w-md">{String(v)}</span>,
    },
  ]

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5 animate-fade-in">
      <PageHeader
        title="Audit Log"
        description={`${auditLog.length} logged events`}
        actions={
          <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
        }
      />

      <Card padding="md" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <Input placeholder="Search audit log..." icon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2.5">
          <Select options={actionOptions} value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} />
          <Select options={entityOptions} value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} />
        </div>
      </Card>

      <Table
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        keyField="id"
        emptyState={<EmptyState icon={<ClipboardList />} title="No audit entries" description="Activity will appear here as changes are made." />}
      />

      <span className="typo-caption text-[var(--text-tertiary)]">
        Showing {filtered.length} of {auditLog.length} entries
      </span>
    </div>
  )
}
