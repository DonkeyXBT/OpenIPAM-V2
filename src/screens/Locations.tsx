import { useState } from 'react'
import { Plus, MapPin, Building, Server } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { toast } from '@/components/ui/Toast'
import { locations, hosts } from '@/data/mock'

const typeIcons: Record<string, React.ReactNode> = {
  datacenter: <Server className="w-5 h-5 text-system-blue" />,
  building: <Building className="w-5 h-5 text-system-green" />,
  floor: <MapPin className="w-5 h-5 text-system-purple" />,
  room: <MapPin className="w-5 h-5 text-system-orange" />,
  rack: <Server className="w-5 h-5 text-system-indigo" />,
}

export function Locations() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-4 animate-fade-in">
      <PageHeader
        title="Locations"
        description={`${locations.length} locations configured`}
        actions={
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
            Add Location
          </Button>
        }
      />

      {locations.length === 0 ? (
        <EmptyState
          icon={<MapPin />}
          title="No locations"
          description="Add datacenters, buildings, and racks to organize your infrastructure."
          action={{ label: 'Add Location', icon: <Plus />, onClick: () => setCreateOpen(true) }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {locations.map((loc) => {
            const hostCount = hosts.filter((h) => h.locationId === loc.id).length
            return (
              <Card key={loc.id} padding="lg" hover>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-tertiary)] flex items-center justify-center shrink-0">
                    {typeIcons[loc.type] || <MapPin className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-headline text-[var(--text-primary)] truncate">{loc.name}</h3>
                      <Badge variant="default" size="sm">{loc.type}</Badge>
                    </div>
                    <p className="text-caption text-[var(--text-secondary)] truncate">{loc.address}</p>
                    {loc.notes && (
                      <p className="text-caption text-[var(--text-tertiary)] mt-1">{loc.notes}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-caption text-[var(--text-tertiary)]">
                        {hostCount} host{hostCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add Location"
        footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={() => { setCreateOpen(false); toast({ type: 'success', title: 'Location Created' }) }}>Add</Button></>}
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="e.g. DC1 — Primary" />
          <Select label="Type" options={[
            { value: 'datacenter', label: 'Datacenter' },
            { value: 'building', label: 'Building' },
            { value: 'floor', label: 'Floor' },
            { value: 'room', label: 'Room' },
            { value: 'rack', label: 'Rack' },
          ]} />
          <Input label="Address" placeholder="Full address" />
          <Input label="Notes" placeholder="Optional notes" />
        </div>
      </Modal>
    </div>
  )
}
