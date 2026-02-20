// ─── Entity Types ────────────────────────────────────────────────────────────

export interface Company {
  id: string
  name: string
  code: string
  contact: string
  email: string
  color: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type HostType =
  | 'virtual-machine'
  | 'physical'
  | 'container'
  | 'firewall'
  | 'router'
  | 'switch'
  | 'load-balancer'
  | 'storage'
  | 'wireless-ap'
  | 'printer'
  | 'voip-phone'
  | 'camera'
  | 'iot-device'
  | 'other'

export type HostState = 'running' | 'stopped' | 'suspended' | 'unknown' | 'maintenance' | 'decommissioned'

export interface Host {
  id: string
  companyId: string
  vmName: string
  hostType: HostType
  description: string
  serialNumber: string
  operatingSystem: string
  memoryTotalGB: number
  memoryUsedGB: number
  cpuCount: number
  diskSizeGB: number
  diskUsedGB: number
  state: HostState
  node: string
  favorite: boolean
  purchaseDate: string
  warrantyExpiry: string
  eolDate: string
  lifecycleStatus: string
  vendor: string
  model: string
  assetTag: string
  location: string
  locationId: string
  uPosition: number
  uHeight: number
  createdAt: string
  updatedAt: string
}

export type IPStatus = 'available' | 'assigned' | 'reserved' | 'conflict'

export interface IPAddress {
  id: string
  ipAddress: string
  subnetId: string
  hostId: string
  status: IPStatus
  reservationType: string
  reservationDescription: string
  dnsName: string
  macAddress: string
  lastSeen: string
  createdAt: string
  updatedAt: string
}

export interface Subnet {
  id: string
  companyId: string
  network: string
  cidr: number
  name: string
  description: string
  vlanId: string
  gateway: string
  dnsServers: string
  totalHosts: number
  assignedCount: number
  reservedCount: number
  availableCount: number
  createdAt: string
  updatedAt: string
}

export type VLANType = 'data' | 'voice' | 'management' | 'dmz' | 'guest' | 'iot' | 'storage' | 'backup' | 'native'

export interface VLAN {
  id: string
  vlanId: number
  name: string
  description: string
  type: VLANType
  companyId: string
  createdAt: string
  updatedAt: string
}

export interface DHCPScope {
  id: string
  name: string
  subnetId: string
  startIP: string
  endIP: string
  leaseTime: number
  dns: string
  gateway: string
  domain: string
  enabled: boolean
  notes: string
  activeLeases: number
  totalAddresses: number
  createdAt: string
  updatedAt: string
}

export interface DHCPLease {
  id: string
  scopeId: string
  ipAddress: string
  macAddress: string
  hostname: string
  status: 'active' | 'expired' | 'reserved'
  startTime: string
  endTime: string
  notes: string
}

export interface DHCPReservation {
  id: string
  scopeId: string
  ipAddress: string
  macAddress: string
  hostname: string
  description: string
}

export interface Location {
  id: string
  name: string
  type: 'datacenter' | 'building' | 'floor' | 'room' | 'rack'
  parentId: string
  address: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  action: string
  entityType: string
  entityId: string
  details: string
  oldValue: string
  newValue: string
  userId: string
  userName: string
}

export interface MaintenanceWindow {
  id: string
  title: string
  description: string
  type: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  startTime: string
  endTime: string
  impact: string
  createdBy: string
}

// ─── UI Types ────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'system'

export interface NavItem {
  id: string
  label: string
  icon: string
  path: string
  badge?: number
  section: 'overview' | 'management' | 'infrastructure' | 'system'
}

export interface StatCard {
  label: string
  value: number | string
  change?: number
  changeLabel?: string
  icon: string
  color: string
}

export interface ConflictAlert {
  id: string
  type: 'duplicate-ip' | 'subnet-mismatch' | 'broadcast-address' | 'network-address'
  severity: 'critical' | 'warning' | 'info'
  message: string
  entity: string
  entityId: string
  timestamp: string
}

export interface SearchResult {
  id: string
  type: 'host' | 'ip' | 'subnet' | 'vlan' | 'dhcp' | 'location'
  title: string
  subtitle: string
  icon: string
  path: string
}

export interface TableColumn<T = unknown> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string
  render?: (value: unknown, row: T) => React.ReactNode
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}
