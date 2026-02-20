import { useState } from 'react'
import { Plus, FileText, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { toast } from '@/components/ui/Toast'

interface SubnetTemplate {
  id: string
  name: string
  cidr: number
  description: string
  gateway: string
  dnsServers: string
  builtin: boolean
}

const templates: SubnetTemplate[] = [
  { id: '1', name: 'Small Office', cidr: 24, description: '254 hosts — Standard office network', gateway: '.1', dnsServers: '8.8.8.8, 8.8.4.4', builtin: true },
  { id: '2', name: 'Medium Campus', cidr: 22, description: '1,022 hosts — Campus or building network', gateway: '.1', dnsServers: '8.8.8.8', builtin: true },
  { id: '3', name: 'Large Enterprise', cidr: 20, description: '4,094 hosts — Large-scale deployment', gateway: '.1', dnsServers: '8.8.8.8', builtin: true },
  { id: '4', name: 'Server Farm', cidr: 24, description: '254 hosts — Optimized for server density', gateway: '.1', dnsServers: 'Internal DNS', builtin: true },
  { id: '5', name: 'DMZ', cidr: 28, description: '14 hosts — Minimal DMZ segment', gateway: '.1', dnsServers: 'External DNS', builtin: true },
  { id: '6', name: 'Point-to-Point', cidr: 30, description: '2 hosts — Router interconnect', gateway: '.1', dnsServers: '', builtin: true },
]

export function Templates() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-4 animate-fade-in">
      <PageHeader
        title="Subnet Templates"
        description="Pre-configured subnet templates for quick provisioning"
        actions={
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
            Create Template
          </Button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {templates.map((tpl) => (
          <Card key={tpl.id} padding="lg" hover>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-system-indigo/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-system-indigo" />
              </div>
              <div className="flex items-center gap-1">
                {tpl.builtin && <Badge variant="default" size="sm">Built-in</Badge>}
                <Badge variant="info" size="sm">/{tpl.cidr}</Badge>
              </div>
            </div>
            <h3 className="typo-headline text-[var(--text-primary)] mb-0.5">{tpl.name}</h3>
            <p className="typo-caption text-[var(--text-secondary)] mb-3">{tpl.description}</p>
            <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-secondary)]">
              <Button
                variant="secondary"
                size="sm"
                icon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => toast({ type: 'success', title: 'Subnet Created', message: `Created subnet from "${tpl.name}" template` })}
              >
                Use Template
              </Button>
              {!tpl.builtin && (
                <Button variant="ghost" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />} />
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Template"
        footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={() => { setCreateOpen(false); toast({ type: 'success', title: 'Template Created' }) }}>Create</Button></>}
      >
        <div className="space-y-4">
          <Input label="Template Name" placeholder="e.g. Custom Template" />
          <Select label="CIDR" options={[{value:'24',label:'/24'},{value:'22',label:'/22'},{value:'20',label:'/20'},{value:'16',label:'/16'},{value:'28',label:'/28'},{value:'30',label:'/30'}]} />
          <Input label="Description" placeholder="Brief description" />
          <Input label="Gateway Pattern" placeholder="e.g. .1" />
          <Input label="DNS Servers" placeholder="e.g. 8.8.8.8, 8.8.4.4" />
        </div>
      </Modal>
    </div>
  )
}
