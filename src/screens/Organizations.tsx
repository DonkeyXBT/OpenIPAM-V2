import { useState, useMemo } from 'react'
import {
  Plus, Search, Building2, Edit, Trash2, Users, Network,
  Globe, MoreHorizontal, Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { toast } from '@/components/ui/toastStore'
import { companies, subnets, hosts, vlans, ipAddresses } from '@/data/mock'
import type { Company } from '@/types'

export function Organizations() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Company | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Company | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  // Form state
  const [formName, setFormName] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formContact, setFormContact] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formColor, setFormColor] = useState('#0A84FF')
  const [formNotes, setFormNotes] = useState('')

  const filtered = useMemo(() => {
    if (!search) return companies
    const q = search.toLowerCase()
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.contact.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    )
  }, [search])

  const getOrgStats = (companyId: string) => ({
    subnets: subnets.filter((s) => s.companyId === companyId).length,
    hosts: hosts.filter((h) => h.companyId === companyId).length,
    vlans: vlans.filter((v) => v.companyId === companyId).length,
    ips: ipAddresses.filter((ip) => {
      const subnet = subnets.find((s) => s.id === ip.subnetId)
      return subnet && subnet.companyId === companyId
    }).length,
  })

  const openCreate = () => {
    setFormName('')
    setFormCode('')
    setFormContact('')
    setFormEmail('')
    setFormColor('#0A84FF')
    setFormNotes('')
    setCreateOpen(true)
  }

  const openEdit = (org: Company) => {
    setFormName(org.name)
    setFormCode(org.code)
    setFormContact(org.contact)
    setFormEmail(org.email)
    setFormColor(org.color)
    setFormNotes(org.notes)
    setEditingOrg(org)
  }

  const handleCreate = () => {
    setCreateOpen(false)
    toast({ type: 'success', title: 'Organization Created', message: `${formName} has been added.` })
  }

  const handleEdit = () => {
    setEditingOrg(null)
    toast({ type: 'success', title: 'Organization Updated', message: `${formName} has been updated.` })
  }

  const handleDelete = () => {
    const name = deleteConfirm?.name
    setDeleteConfirm(null)
    toast({ type: 'success', title: 'Organization Deleted', message: `${name} has been removed.` })
  }

  const colorPresets = [
    '#0A84FF', '#30D158', '#FF9F0A', '#FF453A',
    '#BF5AF2', '#64D2FF', '#5E5CE6', '#FF375F',
  ]

  const columns = [
    {
      key: 'name',
      label: 'Organization',
      sortable: true,
      render: (_v: unknown, row: unknown) => {
        const org = row as Company
        return (
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-bold"
              style={{ backgroundColor: org.color }}
            >
              {org.code.slice(0, 2)}
            </div>
            <div>
              <p className="typo-callout font-medium text-[var(--text-primary)]">{org.name}</p>
              <p className="typo-caption text-[var(--text-tertiary)]">{org.code}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'contact',
      label: 'Contact',
      sortable: true,
      render: (_v: unknown, row: unknown) => {
        const org = row as Company
        return (
          <div>
            <p className="typo-callout text-[var(--text-primary)]">{org.contact}</p>
            <p className="typo-caption text-[var(--text-tertiary)]">{org.email}</p>
          </div>
        )
      },
    },
    {
      key: 'id',
      label: 'Resources',
      render: (val: unknown) => {
        const stats = getOrgStats(String(val))
        return (
          <div className="flex items-center gap-3">
            <span className="typo-caption text-[var(--text-secondary)]">{stats.subnets} subnets</span>
            <span className="typo-caption text-[var(--text-secondary)]">{stats.hosts} hosts</span>
            <span className="typo-caption text-[var(--text-secondary)]">{stats.ips} IPs</span>
          </div>
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
          {new Date(String(val)).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: '_actions',
      label: '',
      width: '80px',
      render: (_val: unknown, row: unknown) => {
        const org = row as Company
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); openEdit(org) }}
              className="p-1.5 rounded-md hover:bg-[var(--surface-tertiary)] transition-colors"
              aria-label="Edit organization"
            >
              <Edit className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setDeleteConfirm(org) }}
              className="p-1.5 rounded-md hover:bg-system-red/10 transition-colors"
              aria-label="Delete organization"
            >
              <Trash2 className="w-3.5 h-3.5 text-[var(--text-tertiary)] hover:text-system-red" />
            </button>
          </div>
        )
      },
    },
  ]

  const formContent = (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Organization Name"
          placeholder="e.g. Acme Corp"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
        <Input
          label="Code"
          placeholder="e.g. ACME"
          value={formCode}
          onChange={(e) => setFormCode(e.target.value.toUpperCase())}
          hint="Short identifier (2-6 chars)"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Contact Name"
          placeholder="e.g. John Smith"
          value={formContact}
          onChange={(e) => setFormContact(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="e.g. john@acme.com"
          value={formEmail}
          onChange={(e) => setFormEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="typo-callout font-medium text-[var(--text-primary)] block mb-1.5">Color</label>
        <div className="flex items-center gap-2">
          {colorPresets.map((c) => (
            <button
              key={c}
              onClick={() => setFormColor(c)}
              className={`w-7 h-7 rounded-lg transition-all ${formColor === c ? 'ring-2 ring-offset-2 ring-[var(--border-focus)] ring-offset-[var(--surface-primary)]' : ''}`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
          <input
            type="color"
            value={formColor}
            onChange={(e) => setFormColor(e.target.value)}
            className="w-7 h-7 rounded-lg border border-[var(--border-primary)] cursor-pointer"
          />
        </div>
      </div>
      <Input
        label="Notes"
        placeholder="Optional notes about this organization"
        value={formNotes}
        onChange={(e) => setFormNotes(e.target.value)}
      />
    </div>
  )

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5 animate-fade-in">
      <PageHeader
        title="Organizations"
        description={`${companies.length} organizations managing network resources`}
        actions={
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
            Add Organization
          </Button>
        }
      />

      <Card padding="md" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search organizations..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 bg-[var(--surface-tertiary)] border border-[var(--border-secondary)] rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-2.5 py-1 rounded-md text-[12px] font-medium transition-all ${viewMode === 'cards' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'}`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-md text-[12px] font-medium transition-all ${viewMode === 'table' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'}`}
          >
            Table
          </button>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 />}
          title="No organizations found"
          description={search ? 'No organizations match your search.' : 'Add your first organization to start managing resources.'}
          action={{ label: 'Add Organization', icon: <Plus />, onClick: openCreate }}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger">
          {filtered.map((org) => {
            const stats = getOrgStats(org.id)
            return (
              <Card key={org.id} padding="lg" hover>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[13px] font-bold"
                    style={{ backgroundColor: org.color }}
                  >
                    {org.code.slice(0, 2)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(org)}
                      className="p-1.5 rounded-md hover:bg-[var(--surface-tertiary)] transition-colors"
                      aria-label="Edit"
                    >
                      <Edit className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(org)}
                      className="p-1.5 rounded-md hover:bg-system-red/10 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                    </button>
                  </div>
                </div>

                <h3 className="typo-headline text-[var(--text-primary)] mb-0.5">{org.name}</h3>
                <p className="typo-caption text-[var(--text-tertiary)] mb-3">{org.code}</p>

                <div className="flex items-center gap-1.5 mb-3">
                  <Users className="w-3.5 h-3.5 text-[var(--text-quaternary)]" />
                  <span className="typo-caption text-[var(--text-secondary)]">{org.contact}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border-secondary)] divide-x divide-[var(--border-secondary)]">
                  <div className="text-center">
                    <p className="typo-headline text-[var(--text-primary)]">{stats.subnets}</p>
                    <p className="typo-caption text-[var(--text-tertiary)]">Subnets</p>
                  </div>
                  <div className="text-center">
                    <p className="typo-headline text-[var(--text-primary)]">{stats.hosts}</p>
                    <p className="typo-caption text-[var(--text-tertiary)]">Hosts</p>
                  </div>
                  <div className="text-center">
                    <p className="typo-headline text-[var(--text-primary)]">{stats.ips}</p>
                    <p className="typo-caption text-[var(--text-tertiary)]">IPs</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Table
          columns={columns}
          data={filtered as unknown as Record<string, unknown>[]}
          keyField="id"
          emptyState={
            <EmptyState
              icon={<Building2 />}
              title="No organizations"
              description="Add an organization to get started."
              action={{ label: 'Add Organization', icon: <Plus />, onClick: openCreate }}
            />
          }
        />
      )}

      <span className="typo-caption text-[var(--text-tertiary)]">
        Showing {filtered.length} of {companies.length} organizations
      </span>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add Organization"
        description="Create a new organization to manage network resources."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!formName || !formCode}>
              Add Organization
            </Button>
          </>
        }
      >
        {formContent}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editingOrg}
        onClose={() => setEditingOrg(null)}
        title={`Edit ${editingOrg?.name || 'Organization'}`}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingOrg(null)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </>
        }
      >
        {formContent}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Organization"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        {deleteConfirm && (
          <div className="space-y-3">
            <p className="typo-callout text-[var(--text-primary)]">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
            </p>
            <p className="typo-caption text-[var(--text-secondary)]">
              This will remove the organization and unlink all associated resources. This action cannot be undone.
            </p>
            {(() => {
              const stats = getOrgStats(deleteConfirm.id)
              const total = stats.subnets + stats.hosts + stats.vlans
              if (total > 0) {
                return (
                  <div className="p-3 rounded-lg bg-system-orange/5 border border-system-orange/20">
                    <p className="typo-caption font-medium text-system-orange">
                      Warning: This organization has {stats.subnets} subnets, {stats.hosts} hosts, and {stats.vlans} VLANs associated.
                    </p>
                  </div>
                )
              }
              return null
            })()}
          </div>
        )}
      </Modal>
    </div>
  )
}
