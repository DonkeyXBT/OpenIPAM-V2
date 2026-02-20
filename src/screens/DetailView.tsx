import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Edit, Trash2, Copy, ExternalLink, Clock,
  Server, Globe, Network, Hash, MapPin, Shield,
  AlertTriangle, CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { IPStatusBadge, HostStateBadge } from '@/components/ui/StatusBadge'
import { CapacityBar } from '@/components/ui/ProgressRing'
import { Table } from '@/components/ui/Table'
import { ErrorState } from '@/components/ui/EmptyState'
import { toast } from '@/components/ui/Toast'
import { hosts, subnets, vlans, ipAddresses, companies, auditLog } from '@/data/mock'

/*
 * ─── Screen 4: Detail View ───────────────────────────────────────────────────
 *
 * WIREFRAME:
 *   Top: Back button + Entity name + status badge + action buttons
 *   Left column (2/3): Core attributes in grouped sections
 *   Right column (1/3): Related records + quick info
 *   Bottom: Related records table + audit history
 *
 * COMPONENT INVENTORY:
 *   - Back button + breadcrumb
 *   - Entity title with status badge
 *   - Attribute groups (key-value pairs in cards)
 *   - Related records cards
 *   - Audit timeline
 *   - Action buttons (Edit, Delete, Copy)
 *
 * INTERACTION SPECS:
 *   - Back: Navigate to parent list
 *   - Edit: Open edit modal
 *   - Related records: Click to navigate
 *   - Copy: Copy entity details to clipboard
 *
 * EMPTY STATES:
 *   - Entity not found: 404 with back link
 *   - No related records: "No related records" message
 *
 * LOADING STATES:
 *   - Skeleton layout matching final structure
 */

function AttributeRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start py-2.5 border-b border-[var(--border-secondary)] last:border-b-0">
      <dt className="w-40 shrink-0 typo-subhead text-[var(--text-tertiary)]">{label}</dt>
      <dd className={`flex-1 typo-callout text-[var(--text-primary)] ${mono ? 'typo-mono' : ''}`}>
        {value || <span className="text-[var(--text-quaternary)]">—</span>}
      </dd>
    </div>
  )
}

// ─── Host Detail ─────────────────────────────────────────────────────────────

function HostDetail({ id }: { id: string }) {
  const navigate = useNavigate()
  const host = hosts.find((h) => h.id === id)

  if (!host) {
    return (
      <ErrorState
        title="Host Not Found"
        description={`No host with ID "${id}" exists.`}
        onRetry={() => navigate('/hosts')}
      />
    )
  }

  const company = companies.find((c) => c.id === host.companyId)
  const hostIPs = ipAddresses.filter((ip) => ip.hostId === host.id)
  const relatedAudit = auditLog.filter((a) => a.entityType === 'host' && a.entityId === host.id).slice(0, 5)
  const memPercent = host.memoryTotalGB > 0 ? Math.round((host.memoryUsedGB / host.memoryTotalGB) * 100) : 0
  const diskPercent = host.diskSizeGB > 0 ? Math.round((host.diskUsedGB / host.diskSizeGB) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-system-purple/15 flex items-center justify-center">
              <Server className="w-5 h-5 text-system-purple" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="typo-title-2 text-[var(--text-primary)]">{host.vmName}</h1>
                <HostStateBadge state={host.state} />
              </div>
              <p className="typo-callout text-[var(--text-secondary)]">{host.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Copy className="w-4 h-4" />} onClick={() => {
            navigator.clipboard.writeText(host.vmName)
            toast({ type: 'success', title: 'Copied' })
          }}>
            Copy
          </Button>
          <Button variant="secondary" size="sm" icon={<Edit className="w-4 h-4" />}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" icon={<Trash2 className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left Column — Core Info */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="lg">
            <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
            <dl>
              <AttributeRow label="Host Type" value={<Badge variant="info">{host.hostType}</Badge>} />
              <AttributeRow label="Operating System" value={host.operatingSystem} />
              <AttributeRow label="Serial Number" value={host.serialNumber} mono />
              <AttributeRow label="Asset Tag" value={host.assetTag} mono />
              <AttributeRow label="Vendor / Model" value={`${host.vendor} ${host.model}`} />
              <AttributeRow
                label="Company"
                value={
                  company ? (
                    <Badge variant="custom" color={company.color} dot>{company.name}</Badge>
                  ) : '—'
                }
              />
              <AttributeRow label="Location" value={host.location || '—'} />
              <AttributeRow label="Node" value={host.node} />
            </dl>
          </Card>

          {/* Resources */}
          <Card padding="lg">
            <CardHeader><CardTitle>Resources</CardTitle></CardHeader>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="typo-subhead text-[var(--text-tertiary)] mb-1">CPU</p>
                <p className="typo-title-3 text-[var(--text-primary)]">{host.cpuCount} <span className="typo-callout text-[var(--text-tertiary)]">cores</span></p>
              </div>
              <div>
                <p className="typo-subhead text-[var(--text-tertiary)] mb-1">Memory</p>
                <p className="typo-headline text-[var(--text-primary)]">{host.memoryUsedGB} / {host.memoryTotalGB} GB</p>
                <div className="mt-1 h-1.5 rounded-full bg-[var(--surface-tertiary)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${memPercent > 90 ? 'bg-system-red' : memPercent > 75 ? 'bg-system-orange' : 'bg-system-blue'}`}
                    style={{ width: `${memPercent}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="typo-subhead text-[var(--text-tertiary)] mb-1">Disk</p>
                <p className="typo-headline text-[var(--text-primary)]">{host.diskUsedGB} / {host.diskSizeGB} GB</p>
                <div className="mt-1 h-1.5 rounded-full bg-[var(--surface-tertiary)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${diskPercent > 90 ? 'bg-system-red' : diskPercent > 75 ? 'bg-system-orange' : 'bg-system-blue'}`}
                    style={{ width: `${diskPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* IP Addresses */}
          <Card padding="none">
            <div className="p-4">
              <CardHeader><CardTitle>IP Addresses ({hostIPs.length})</CardTitle></CardHeader>
            </div>
            {hostIPs.length > 0 ? (
              <Table
                columns={[
                  { key: 'ipAddress', label: 'Address', sortable: true, render: (v) => <span className="typo-mono">{String(v)}</span> },
                  { key: 'status', label: 'Status', render: (v) => <IPStatusBadge status={v as any} /> },
                  { key: 'dnsName', label: 'DNS', render: (v) => String(v) || '—' },
                  { key: 'macAddress', label: 'MAC', render: (v) => <span className="typo-mono text-[var(--text-tertiary)]">{String(v) || '—'}</span> },
                ]}
                data={hostIPs as unknown as Record<string, unknown>[]}
                compact
              />
            ) : (
              <div className="pb-6 text-center typo-callout text-[var(--text-tertiary)]">No IP addresses assigned</div>
            )}
          </Card>
        </div>

        {/* Right Column — Sidebar Info */}
        <div className="space-y-4">
          {/* Lifecycle */}
          <Card padding="lg">
            <CardHeader><CardTitle>Lifecycle</CardTitle></CardHeader>
            <dl className="space-y-3">
              <div>
                <dt className="typo-caption text-[var(--text-tertiary)]">Purchase Date</dt>
                <dd className="typo-callout text-[var(--text-primary)]">{host.purchaseDate || '—'}</dd>
              </div>
              <div>
                <dt className="typo-caption text-[var(--text-tertiary)]">Warranty Expiry</dt>
                <dd className="typo-callout text-[var(--text-primary)]">
                  {host.warrantyExpiry || '—'}
                  {host.warrantyExpiry && new Date(host.warrantyExpiry) < new Date() && (
                    <Badge variant="error" size="sm" className="ml-2">Expired</Badge>
                  )}
                </dd>
              </div>
              <div>
                <dt className="typo-caption text-[var(--text-tertiary)]">End of Life</dt>
                <dd className="typo-callout text-[var(--text-primary)]">{host.eolDate || '—'}</dd>
              </div>
              <div>
                <dt className="typo-caption text-[var(--text-tertiary)]">Status</dt>
                <dd>
                  <Badge variant={host.lifecycleStatus === 'active' ? 'success' : 'error'}>
                    {host.lifecycleStatus}
                  </Badge>
                </dd>
              </div>
            </dl>
          </Card>

          {/* Timestamps */}
          <Card padding="lg">
            <CardHeader><CardTitle>Timestamps</CardTitle></CardHeader>
            <dl className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--text-quaternary)]" />
                <div>
                  <dt className="typo-caption text-[var(--text-tertiary)]">Created</dt>
                  <dd className="typo-callout">{new Date(host.createdAt).toLocaleString()}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--text-quaternary)]" />
                <div>
                  <dt className="typo-caption text-[var(--text-tertiary)]">Updated</dt>
                  <dd className="typo-callout">{new Date(host.updatedAt).toLocaleString()}</dd>
                </div>
              </div>
            </dl>
          </Card>

          {/* Audit History */}
          <Card padding="lg">
            <CardHeader><CardTitle>Recent Changes</CardTitle></CardHeader>
            {relatedAudit.length > 0 ? (
              <div className="space-y-3">
                {relatedAudit.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[var(--surface-tertiary)] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[9px] font-bold text-[var(--text-tertiary)]">
                        {entry.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="typo-caption text-[var(--text-primary)]">{entry.details}</p>
                      <p className="typo-caption text-[var(--text-quaternary)]">
                        {entry.userName} · {new Date(entry.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="typo-caption text-[var(--text-tertiary)]">No recent changes</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Subnet Detail ───────────────────────────────────────────────────────────

function SubnetDetail({ id }: { id: string }) {
  const navigate = useNavigate()
  const subnet = subnets.find((s) => s.id === id)

  if (!subnet) {
    return <ErrorState title="Subnet Not Found" onRetry={() => navigate('/subnets')} />
  }

  const company = companies.find((c) => c.id === subnet.companyId)
  const vlan = vlans.find((v) => v.id === subnet.vlanId)
  const subnetIPs = ipAddresses.filter((ip) => ip.subnetId === subnet.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-system-indigo/15 flex items-center justify-center">
          <Network className="w-5 h-5 text-system-indigo" />
        </div>
        <div>
          <h1 className="typo-title-2 text-[var(--text-primary)]">{subnet.network}/{subnet.cidr}</h1>
          <p className="typo-callout text-[var(--text-secondary)]">{subnet.name} — {subnet.description}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card padding="lg">
            <CardHeader><CardTitle>Subnet Information</CardTitle></CardHeader>
            <dl>
              <AttributeRow label="Network" value={<span className="typo-mono">{subnet.network}/{subnet.cidr}</span>} />
              <AttributeRow label="Gateway" value={<span className="typo-mono">{subnet.gateway}</span>} />
              <AttributeRow label="DNS Servers" value={subnet.dnsServers} mono />
              <AttributeRow label="VLAN" value={vlan ? <Badge variant="info">VLAN {vlan.vlanId} — {vlan.name}</Badge> : '—'} />
              <AttributeRow label="Company" value={company ? <Badge variant="custom" color={company.color} dot>{company.name}</Badge> : '—'} />
            </dl>
          </Card>

          <Card padding="lg">
            <CardHeader><CardTitle>Capacity</CardTitle></CardHeader>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-system-blue/5">
                <p className="typo-title-3 text-system-blue">{subnet.assignedCount}</p>
                <p className="typo-caption text-[var(--text-tertiary)]">Assigned</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-system-orange/5">
                <p className="typo-title-3 text-system-orange">{subnet.reservedCount}</p>
                <p className="typo-caption text-[var(--text-tertiary)]">Reserved</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-system-green/5">
                <p className="typo-title-3 text-system-green">{subnet.availableCount}</p>
                <p className="typo-caption text-[var(--text-tertiary)]">Available</p>
              </div>
            </div>
            <CapacityBar
              used={subnet.assignedCount}
              reserved={subnet.reservedCount}
              total={subnet.totalHosts}
            />
          </Card>

          <Card padding="none">
            <div className="p-4">
              <CardHeader><CardTitle>IP Addresses ({subnetIPs.length})</CardTitle></CardHeader>
            </div>
            <Table
              columns={[
                { key: 'ipAddress', label: 'Address', sortable: true, render: (v) => <span className="typo-mono">{String(v)}</span> },
                { key: 'status', label: 'Status', render: (v) => <IPStatusBadge status={v as any} /> },
                { key: 'dnsName', label: 'DNS', render: (v) => String(v) || '—' },
                { key: 'macAddress', label: 'MAC', render: (v) => <span className="typo-mono text-[var(--text-tertiary)]">{String(v) || '—'}</span> },
              ]}
              data={subnetIPs as unknown as Record<string, unknown>[]}
              compact
              onRowClick={(row) => navigate(`/ips/${(row as any).id}`)}
            />
          </Card>
        </div>

        <div className="space-y-4">
          <Card padding="lg">
            <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
            <div className="space-y-3">
              <div>
                <p className="typo-caption text-[var(--text-tertiary)]">Utilization</p>
                <p className="typo-title-3 text-[var(--text-primary)]">
                  {Math.round(((subnet.assignedCount + subnet.reservedCount) / subnet.totalHosts) * 100)}%
                </p>
              </div>
              <div>
                <p className="typo-caption text-[var(--text-tertiary)]">Total Addresses</p>
                <p className="typo-headline text-[var(--text-primary)]">{subnet.totalHosts}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Detail View Router ──────────────────────────────────────────────────────

export function DetailView({ type }: { type: 'host' | 'ip' | 'subnet' | 'vlan' }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    return <ErrorState title="No ID provided" onRetry={() => navigate(-1 as any)} />
  }

  const labels: Record<string, string> = {
    host: 'Hosts',
    ip: 'IP Addresses',
    subnet: 'Subnets',
    vlan: 'VLANs',
  }

  const paths: Record<string, string> = {
    host: '/hosts',
    ip: '/ips',
    subnet: '/subnets',
    vlan: '/vlans',
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Back navigation */}
      <button
        onClick={() => navigate(paths[type])}
        className="inline-flex items-center gap-1.5 typo-callout text-system-blue hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {labels[type]}
      </button>

      {type === 'host' && <HostDetail id={id} />}
      {type === 'subnet' && <SubnetDetail id={id} />}
      {(type === 'ip' || type === 'vlan') && <HostDetail id={id} />}
    </div>
  )
}
