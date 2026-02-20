import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Filter, Download, Upload, Globe, Search,
  MoreHorizontal, Trash2, Edit, Eye, Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { IPStatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { toast } from '@/components/ui/toastStore'
import { ipAddresses, subnets, hosts, companies } from '@/data/mock'
import type { IPAddress } from '@/types'

/*
 * ─── Screen 3: IP Addresses (Primary Task Screen) ────────────────────────────
 *
 * WIREFRAME:
 *   Top: Page header with title + "Create IP" primary CTA
 *   Below: Filter bar (search, status dropdown, subnet dropdown, company)
 *   Main: Data table with sortable columns, row selection, context actions
 *   Bottom: Pagination / result count
 *
 * COMPONENT INVENTORY:
 *   - PageHeader + primary button
 *   - Filter bar (Input search + Select dropdowns)
 *   - Badge chips for active filters
 *   - Data Table with selection checkboxes
 *   - IPStatusBadge for status column
 *   - Context menu on row (Edit, View, Copy, Delete)
 *   - Create/Edit modal (form)
 *
 * INTERACTION SPECS:
 *   - Search: Instant filter on keypress (debounced 200ms)
 *   - Column sorting: Click header to cycle asc/desc/none
 *   - Row click: Navigate to detail view
 *   - Checkbox: Multi-select for bulk actions
 *   - Cmd+C on selected row: Copy IP to clipboard
 *
 * EMPTY STATES:
 *   - No IPs: "No IP addresses yet" + CTA to create
 *   - No filter results: "No IPs match your filters" + clear filters
 *
 * LOADING STATES:
 *   - SkeletonTable with 5 columns, 8 rows
 */

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'available', label: 'Available' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'conflict', label: 'Conflict' },
]

export function IPAddresses() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [subnetFilter, setSubnetFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [contextMenuRow, setContextMenuRow] = useState<IPAddress | null>(null)

  const subnetOptions = [
    { value: '', label: 'All Subnets' },
    ...subnets.map((s) => ({ value: s.id, label: `${s.network}/${s.cidr} — ${s.name}` })),
  ]

  const filtered = useMemo(() => {
    return ipAddresses.filter((ip) => {
      if (search) {
        const q = search.toLowerCase()
        if (
          !ip.ipAddress.includes(q) &&
          !ip.dnsName.toLowerCase().includes(q) &&
          !ip.macAddress.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      if (statusFilter && ip.status !== statusFilter) return false
      if (subnetFilter && ip.subnetId !== subnetFilter) return false
      return true
    })
  }, [search, statusFilter, subnetFilter])

  const activeFilters = [statusFilter, subnetFilter].filter(Boolean).length

  const columns = [
    {
      key: 'ipAddress',
      label: 'IP Address',
      sortable: true,
      width: '160px',
      render: (val: unknown) => (
        <span className="typo-mono font-medium text-[var(--text-primary)]">
          {String(val)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '120px',
      render: (val: unknown) => <IPStatusBadge status={val as IPAddress['status']} />,
    },
    {
      key: 'dnsName',
      label: 'DNS Name',
      sortable: true,
      render: (val: unknown) => (
        <span className="text-[var(--text-secondary)]">{String(val) || '—'}</span>
      ),
    },
    {
      key: 'macAddress',
      label: 'MAC Address',
      sortable: true,
      width: '160px',
      render: (val: unknown) => (
        <span className="typo-mono text-[var(--text-tertiary)]">{String(val) || '—'}</span>
      ),
    },
    {
      key: 'subnetId',
      label: 'Subnet',
      sortable: true,
      render: (val: unknown) => {
        const subnet = subnets.find((s) => s.id === String(val))
        return subnet ? (
          <span className="text-[var(--text-secondary)]">
            {subnet.network}/{subnet.cidr}
          </span>
        ) : (
          '—'
        )
      },
    },
    {
      key: 'subnetId',
      label: 'Organization',
      sortable: true,
      render: (val: unknown) => {
        const subnet = subnets.find((s) => s.id === String(val))
        if (!subnet) return <span className="text-[var(--text-quaternary)]">—</span>
        const company = companies.find((c) => c.id === subnet.companyId)
        return company ? (
          <Badge variant="custom" size="sm" color={company.color} dot>
            {company.code}
          </Badge>
        ) : (
          <span className="text-[var(--text-quaternary)]">—</span>
        )
      },
    },
    {
      key: 'hostId',
      label: 'Host',
      sortable: true,
      render: (val: unknown) => {
        const host = hosts.find((h) => h.id === String(val))
        return host ? (
          <Badge variant="custom" size="sm" color="var(--color-system-purple)">
            {host.vmName}
          </Badge>
        ) : (
          <span className="text-[var(--text-quaternary)]">—</span>
        )
      },
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
      width: '140px',
      render: (val: unknown) => (
        <span className="typo-caption text-[var(--text-tertiary)]">
          {val ? new Date(String(val)).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: '_actions',
      label: '',
      width: '48px',
      render: (_val: unknown, row: unknown) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setContextMenuRow(row as IPAddress)
          }}
          className="p-1 rounded-md hover:bg-[var(--surface-tertiary)] transition-colors"
          aria-label="Row actions"
        >
          <MoreHorizontal className="w-4 h-4 text-[var(--text-tertiary)]" />
        </button>
      ),
    },
  ]

  const handleCopyIP = (ip: string) => {
    navigator.clipboard.writeText(ip)
    toast({ type: 'success', title: 'Copied', message: `${ip} copied to clipboard` })
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-4 animate-fade-in">
      <PageHeader
        title="IP Addresses"
        description={`${ipAddresses.length} total addresses across ${subnets.length} subnets`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateModalOpen(true)}>
              Create IP
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <Card padding="sm" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by IP, DNS name, or MAC..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search IP addresses"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          />
          <Select
            options={subnetOptions}
            value={subnetFilter}
            onChange={(e) => setSubnetFilter(e.target.value)}
            aria-label="Filter by subnet"
          />
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setStatusFilter(''); setSubnetFilter(''); setSearch('') }}
            >
              Clear ({activeFilters})
            </Button>
          )}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <Card padding="sm" className="flex items-center gap-3 bg-system-blue/5 border-system-blue/20">
          <span className="typo-callout font-medium text-system-blue">
            {selectedIds.size} selected
          </span>
          <Button variant="ghost" size="sm" icon={<Copy className="w-3.5 h-3.5" />}>
            Copy IPs
          </Button>
          <Button variant="ghost" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Export Selected
          </Button>
          <div className="flex-1" />
          <Button
            variant="destructive"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => toast({ type: 'warning', title: 'Delete', message: `${selectedIds.size} IPs would be deleted` })}
          >
            Delete
          </Button>
        </Card>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        keyField="id"
        onRowClick={(row) => navigate(`/ips/${(row as unknown as IPAddress).id}`)}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        emptyState={
          search || statusFilter || subnetFilter ? (
            <EmptyState
              icon={<Search />}
              title="No matching IPs"
              description="No IP addresses match your current filters. Try adjusting your search."
              action={{ label: 'Clear Filters', onClick: () => { setSearch(''); setStatusFilter(''); setSubnetFilter('') } }}
            />
          ) : (
            <EmptyState
              icon={<Globe />}
              title="No IP addresses"
              description="Get started by creating your first IP address entry."
              action={{ label: 'Create IP', icon: <Plus />, onClick: () => setCreateModalOpen(true) }}
            />
          )
        }
      />

      {/* Result Count */}
      <div className="flex items-center justify-between">
        <span className="typo-caption text-[var(--text-tertiary)]">
          Showing {filtered.length} of {ipAddresses.length} addresses
        </span>
      </div>

      {/* ─── Create IP Modal ──────────────────────────────────────── */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create IP Address"
        description="Add a new IP address entry to the system."
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setCreateModalOpen(false)
                toast({ type: 'success', title: 'IP Created', message: 'New IP address has been added successfully.' })
              }}
            >
              Create IP
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="IP Address" placeholder="e.g. 10.0.1.100" />
          <Select
            label="Subnet"
            placeholder="Select subnet"
            options={subnets.map((s) => ({
              value: s.id,
              label: `${s.network}/${s.cidr} — ${s.name}`,
            }))}
          />
          <Select
            label="Status"
            options={[
              { value: 'available', label: 'Available' },
              { value: 'assigned', label: 'Assigned' },
              { value: 'reserved', label: 'Reserved' },
            ]}
          />
          <Input label="DNS Name" placeholder="e.g. server.acme.local" />
          <Input label="MAC Address" placeholder="e.g. 00:50:56:A1:B2:C3" />
          <Input label="Description" placeholder="Optional description" />
        </div>
      </Modal>

      {/* ─── Context Menu (simplified as modal action sheet) ───── */}
      <Modal
        open={!!contextMenuRow}
        onClose={() => setContextMenuRow(null)}
        title={contextMenuRow ? `Actions: ${contextMenuRow.ipAddress}` : ''}
        size="sm"
      >
        {contextMenuRow && (
          <div className="space-y-1 -mx-5 -my-2">
            <button
              className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-[var(--table-row-hover)] transition-colors"
              onClick={() => { navigate(`/ips/${contextMenuRow.id}`); setContextMenuRow(null) }}
            >
              <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="typo-callout text-[var(--text-primary)]">View Details</span>
            </button>
            <button
              className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-[var(--table-row-hover)] transition-colors"
              onClick={() => { setContextMenuRow(null) }}
            >
              <Edit className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="typo-callout text-[var(--text-primary)]">Edit</span>
            </button>
            <button
              className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-[var(--table-row-hover)] transition-colors"
              onClick={() => { handleCopyIP(contextMenuRow.ipAddress); setContextMenuRow(null) }}
            >
              <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="typo-callout text-[var(--text-primary)]">Copy IP Address</span>
            </button>
            <div className="my-1 border-t border-[var(--border-secondary)]" />
            <button
              className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-system-red/5 transition-colors"
              onClick={() => {
                toast({ type: 'success', title: 'Deleted', message: `IP ${contextMenuRow.ipAddress} has been removed.` })
                setContextMenuRow(null)
              }}
            >
              <Trash2 className="w-4 h-4 text-system-red" />
              <span className="typo-callout text-system-red">Delete</span>
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
