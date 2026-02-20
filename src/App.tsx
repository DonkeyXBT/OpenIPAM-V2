import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Onboarding } from '@/screens/Onboarding'
import { Dashboard } from '@/screens/Dashboard'
import { IPAddresses } from '@/screens/IPAddresses'
import { Hosts } from '@/screens/Hosts'
import { Subnets } from '@/screens/Subnets'
import { VLANs } from '@/screens/VLANs'
import { DHCP } from '@/screens/DHCP'
import { Locations } from '@/screens/Locations'
import { Templates } from '@/screens/Templates'
import { AuditLog } from '@/screens/AuditLog'
import { Settings } from '@/screens/Settings'
import { DetailView } from '@/screens/DetailView'
import { ErrorState } from '@/components/ui/EmptyState'

function NotFound() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <ErrorState
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        onRetry={() => { window.location.href = '/' }}
      />
    </div>
  )
}

export default function App() {
  const [onboarded, setOnboarded] = useState(() => {
    return localStorage.getItem('openipam-onboarded') === 'true'
  })

  const handleComplete = () => {
    localStorage.setItem('openipam-onboarded', 'true')
    setOnboarded(true)
  }

  if (!onboarded) {
    return <Onboarding onComplete={handleComplete} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ips" element={<IPAddresses />} />
          <Route path="ips/:id" element={<DetailView type="ip" />} />
          <Route path="hosts" element={<Hosts />} />
          <Route path="hosts/:id" element={<DetailView type="host" />} />
          <Route path="subnets" element={<Subnets />} />
          <Route path="subnets/:id" element={<DetailView type="subnet" />} />
          <Route path="vlans" element={<VLANs />} />
          <Route path="vlans/:id" element={<DetailView type="vlan" />} />
          <Route path="dhcp" element={<DHCP />} />
          <Route path="locations" element={<Locations />} />
          <Route path="templates" element={<Templates />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
