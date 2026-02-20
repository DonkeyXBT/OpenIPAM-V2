import type {
  Company, Host, IPAddress, Subnet, VLAN, DHCPScope, DHCPLease,
  Location, AuditLogEntry, MaintenanceWindow, ConflictAlert, StatCard
} from '@/types'

// ─── Companies ───────────────────────────────────────────────────────────────

export const companies: Company[] = [
  { id: '1', name: 'Acme Corp', code: 'ACME', contact: 'John Smith', email: 'john@acme.com', color: '#0A84FF', notes: 'Primary tenant', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-06-01T10:30:00Z' },
  { id: '2', name: 'Globex Industries', code: 'GLBX', contact: 'Jane Doe', email: 'jane@globex.com', color: '#30D158', notes: 'Secondary tenant', createdAt: '2025-02-20T09:00:00Z', updatedAt: '2025-05-15T14:00:00Z' },
  { id: '3', name: 'Initech', code: 'INIT', contact: 'Bill Lumbergh', email: 'bill@initech.com', color: '#FF9F0A', notes: 'Dev environment', createdAt: '2025-03-10T07:00:00Z', updatedAt: '2025-06-10T11:00:00Z' },
  { id: '4', name: 'Umbrella Corp', code: 'UMBR', contact: 'Albert Wesker', email: 'wesker@umbrella.com', color: '#FF453A', notes: 'Lab network', createdAt: '2025-04-01T08:30:00Z', updatedAt: '2025-06-12T09:15:00Z' },
]

// ─── Subnets ─────────────────────────────────────────────────────────────────

export const subnets: Subnet[] = [
  { id: '1', companyId: '1', network: '10.0.1.0', cidr: 24, name: 'Production Servers', description: 'Main production subnet', vlanId: '1', gateway: '10.0.1.1', dnsServers: '10.0.1.10, 10.0.1.11', totalHosts: 254, assignedCount: 187, reservedCount: 20, availableCount: 47, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-06-01T10:30:00Z' },
  { id: '2', companyId: '1', network: '10.0.2.0', cidr: 24, name: 'Development', description: 'Developer workstations', vlanId: '2', gateway: '10.0.2.1', dnsServers: '10.0.1.10', totalHosts: 254, assignedCount: 89, reservedCount: 10, availableCount: 155, createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-05-20T11:00:00Z' },
  { id: '3', companyId: '2', network: '172.16.0.0', cidr: 22, name: 'Globex Main', description: 'Globex production network', vlanId: '3', gateway: '172.16.0.1', dnsServers: '172.16.0.10', totalHosts: 1022, assignedCount: 456, reservedCount: 50, availableCount: 516, createdAt: '2025-02-20T09:00:00Z', updatedAt: '2025-06-05T14:30:00Z' },
  { id: '4', companyId: '1', network: '10.0.10.0', cidr: 24, name: 'DMZ', description: 'Demilitarized zone', vlanId: '4', gateway: '10.0.10.1', dnsServers: '10.0.1.10', totalHosts: 254, assignedCount: 32, reservedCount: 8, availableCount: 214, createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-06-08T16:00:00Z' },
  { id: '5', companyId: '3', network: '192.168.1.0', cidr: 24, name: 'Initech Office', description: 'Office network', vlanId: '5', gateway: '192.168.1.1', dnsServers: '192.168.1.10', totalHosts: 254, assignedCount: 142, reservedCount: 15, availableCount: 97, createdAt: '2025-03-15T08:00:00Z', updatedAt: '2025-06-10T12:00:00Z' },
  { id: '6', companyId: '4', network: '10.100.0.0', cidr: 20, name: 'Lab Network', description: 'Research lab infrastructure', vlanId: '6', gateway: '10.100.0.1', dnsServers: '10.100.0.10', totalHosts: 4094, assignedCount: 1287, reservedCount: 200, availableCount: 2607, createdAt: '2025-04-01T08:30:00Z', updatedAt: '2025-06-12T09:15:00Z' },
]

// ─── VLANs ───────────────────────────────────────────────────────────────────

export const vlans: VLAN[] = [
  { id: '1', vlanId: 100, name: 'VLAN-Prod', description: 'Production servers', type: 'data', companyId: '1', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-06-01T10:30:00Z' },
  { id: '2', vlanId: 200, name: 'VLAN-Dev', description: 'Development workstations', type: 'data', companyId: '1', createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-05-20T11:00:00Z' },
  { id: '3', vlanId: 300, name: 'VLAN-Globex', description: 'Globex production', type: 'data', companyId: '2', createdAt: '2025-02-20T09:00:00Z', updatedAt: '2025-06-05T14:30:00Z' },
  { id: '4', vlanId: 999, name: 'VLAN-DMZ', description: 'DMZ zone', type: 'dmz', companyId: '1', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-06-08T16:00:00Z' },
  { id: '5', vlanId: 150, name: 'VLAN-Office', description: 'Office network', type: 'data', companyId: '3', createdAt: '2025-03-15T08:00:00Z', updatedAt: '2025-06-10T12:00:00Z' },
  { id: '6', vlanId: 500, name: 'VLAN-Lab', description: 'Lab infrastructure', type: 'data', companyId: '4', createdAt: '2025-04-01T08:30:00Z', updatedAt: '2025-06-12T09:15:00Z' },
  { id: '7', vlanId: 10, name: 'VLAN-Mgmt', description: 'Management network', type: 'management', companyId: '1', createdAt: '2025-01-10T07:00:00Z', updatedAt: '2025-06-01T08:00:00Z' },
  { id: '8', vlanId: 50, name: 'VLAN-Voice', description: 'Voice over IP', type: 'voice', companyId: '1', createdAt: '2025-01-10T07:00:00Z', updatedAt: '2025-06-01T08:00:00Z' },
  { id: '9', vlanId: 750, name: 'VLAN-Guest', description: 'Guest wireless', type: 'guest', companyId: '1', createdAt: '2025-02-01T09:00:00Z', updatedAt: '2025-05-15T14:00:00Z' },
]

// ─── Hosts ───────────────────────────────────────────────────────────────────

export const hosts: Host[] = [
  { id: '1', companyId: '1', vmName: 'prod-web-01', hostType: 'virtual-machine', description: 'Primary web server', serialNumber: 'VM-001', operatingSystem: 'Ubuntu 24.04 LTS', memoryTotalGB: 16, memoryUsedGB: 12.4, cpuCount: 8, diskSizeGB: 500, diskUsedGB: 234, state: 'running', node: 'esxi-01', favorite: true, purchaseDate: '2025-01-15', warrantyExpiry: '2028-01-15', eolDate: '2029-01-15', lifecycleStatus: 'active', vendor: 'VMware', model: 'vSphere VM', assetTag: 'AT-001', location: 'DC1-Rack-A01', locationId: '1', uPosition: 0, uHeight: 0, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-06-01T10:30:00Z' },
  { id: '2', companyId: '1', vmName: 'prod-web-02', hostType: 'virtual-machine', description: 'Secondary web server', serialNumber: 'VM-002', operatingSystem: 'Ubuntu 24.04 LTS', memoryTotalGB: 16, memoryUsedGB: 8.2, cpuCount: 8, diskSizeGB: 500, diskUsedGB: 189, state: 'running', node: 'esxi-01', favorite: false, purchaseDate: '2025-01-15', warrantyExpiry: '2028-01-15', eolDate: '2029-01-15', lifecycleStatus: 'active', vendor: 'VMware', model: 'vSphere VM', assetTag: 'AT-002', location: 'DC1-Rack-A01', locationId: '1', uPosition: 0, uHeight: 0, createdAt: '2025-01-15T08:30:00Z', updatedAt: '2025-06-01T10:30:00Z' },
  { id: '3', companyId: '1', vmName: 'prod-db-01', hostType: 'virtual-machine', description: 'Primary database server', serialNumber: 'VM-003', operatingSystem: 'RHEL 9.4', memoryTotalGB: 64, memoryUsedGB: 52.1, cpuCount: 16, diskSizeGB: 2000, diskUsedGB: 1456, state: 'running', node: 'esxi-02', favorite: true, purchaseDate: '2025-01-20', warrantyExpiry: '2028-01-20', eolDate: '2029-01-20', lifecycleStatus: 'active', vendor: 'VMware', model: 'vSphere VM', assetTag: 'AT-003', location: 'DC1-Rack-A02', locationId: '1', uPosition: 0, uHeight: 0, createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-06-05T14:00:00Z' },
  { id: '4', companyId: '1', vmName: 'fw-edge-01', hostType: 'firewall', description: 'Edge firewall', serialNumber: 'FW-001', operatingSystem: 'FortiOS 7.4', memoryTotalGB: 8, memoryUsedGB: 3.2, cpuCount: 4, diskSizeGB: 128, diskUsedGB: 24, state: 'running', node: '', favorite: false, purchaseDate: '2024-06-01', warrantyExpiry: '2027-06-01', eolDate: '2028-06-01', lifecycleStatus: 'active', vendor: 'Fortinet', model: 'FortiGate 200F', assetTag: 'FW-AT-001', location: 'DC1-Rack-B01', locationId: '1', uPosition: 40, uHeight: 1, createdAt: '2024-06-01T10:00:00Z', updatedAt: '2025-06-08T16:00:00Z' },
  { id: '5', companyId: '1', vmName: 'sw-core-01', hostType: 'switch', description: 'Core switch', serialNumber: 'SW-001', operatingSystem: 'NX-OS 10.4', memoryTotalGB: 16, memoryUsedGB: 6.8, cpuCount: 2, diskSizeGB: 64, diskUsedGB: 12, state: 'running', node: '', favorite: false, purchaseDate: '2024-03-15', warrantyExpiry: '2029-03-15', eolDate: '2030-03-15', lifecycleStatus: 'active', vendor: 'Cisco', model: 'Nexus 9300', assetTag: 'SW-AT-001', location: 'DC1-Rack-B01', locationId: '1', uPosition: 38, uHeight: 2, createdAt: '2024-03-15T10:00:00Z', updatedAt: '2025-06-01T08:00:00Z' },
  { id: '6', companyId: '2', vmName: 'glbx-app-01', hostType: 'virtual-machine', description: 'Globex application server', serialNumber: 'VM-G001', operatingSystem: 'Windows Server 2022', memoryTotalGB: 32, memoryUsedGB: 24.6, cpuCount: 8, diskSizeGB: 1000, diskUsedGB: 678, state: 'running', node: 'hyper-v-01', favorite: false, purchaseDate: '2025-02-20', warrantyExpiry: '2028-02-20', eolDate: '2029-02-20', lifecycleStatus: 'active', vendor: 'Microsoft', model: 'Hyper-V VM', assetTag: 'G-AT-001', location: 'DC2-Rack-A01', locationId: '2', uPosition: 0, uHeight: 0, createdAt: '2025-02-20T09:00:00Z', updatedAt: '2025-06-05T14:30:00Z' },
  { id: '7', companyId: '3', vmName: 'init-printer-01', hostType: 'printer', description: 'Office printer 3rd floor', serialNumber: 'PR-001', operatingSystem: '', memoryTotalGB: 0.5, memoryUsedGB: 0.2, cpuCount: 1, diskSizeGB: 16, diskUsedGB: 4, state: 'running', node: '', favorite: false, purchaseDate: '2024-01-10', warrantyExpiry: '2027-01-10', eolDate: '2029-01-10', lifecycleStatus: 'active', vendor: 'HP', model: 'LaserJet Pro M428', assetTag: 'PR-AT-001', location: 'Building-A Floor-3', locationId: '3', uPosition: 0, uHeight: 0, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2025-06-10T12:00:00Z' },
  { id: '8', companyId: '1', vmName: 'k8s-worker-01', hostType: 'container', description: 'Kubernetes worker node', serialNumber: 'K8S-001', operatingSystem: 'Ubuntu 24.04 LTS', memoryTotalGB: 128, memoryUsedGB: 96.3, cpuCount: 32, diskSizeGB: 2000, diskUsedGB: 1234, state: 'running', node: 'bare-metal-01', favorite: true, purchaseDate: '2025-03-01', warrantyExpiry: '2028-03-01', eolDate: '2029-03-01', lifecycleStatus: 'active', vendor: 'Dell', model: 'PowerEdge R750', assetTag: 'K8S-AT-001', location: 'DC1-Rack-C01', locationId: '1', uPosition: 20, uHeight: 2, createdAt: '2025-03-01T08:00:00Z', updatedAt: '2025-06-12T09:15:00Z' },
  { id: '9', companyId: '4', vmName: 'lab-storage-01', hostType: 'storage', description: 'Lab NAS storage', serialNumber: 'ST-001', operatingSystem: 'TrueNAS Core 13', memoryTotalGB: 64, memoryUsedGB: 12.4, cpuCount: 8, diskSizeGB: 100000, diskUsedGB: 67432, state: 'running', node: '', favorite: false, purchaseDate: '2025-04-01', warrantyExpiry: '2028-04-01', eolDate: '2030-04-01', lifecycleStatus: 'active', vendor: 'Synology', model: 'RackStation RS3621xs+', assetTag: 'ST-AT-001', location: 'DC1-Rack-D01', locationId: '1', uPosition: 10, uHeight: 3, createdAt: '2025-04-01T08:30:00Z', updatedAt: '2025-06-12T09:15:00Z' },
  { id: '10', companyId: '1', vmName: 'prod-lb-01', hostType: 'load-balancer', description: 'Production load balancer', serialNumber: 'LB-001', operatingSystem: 'F5 TMOS 17.1', memoryTotalGB: 16, memoryUsedGB: 8.0, cpuCount: 4, diskSizeGB: 256, diskUsedGB: 45, state: 'running', node: '', favorite: false, purchaseDate: '2024-09-15', warrantyExpiry: '2027-09-15', eolDate: '2028-09-15', lifecycleStatus: 'active', vendor: 'F5 Networks', model: 'BIG-IP i5800', assetTag: 'LB-AT-001', location: 'DC1-Rack-B01', locationId: '1', uPosition: 36, uHeight: 1, createdAt: '2024-09-15T10:00:00Z', updatedAt: '2025-06-01T08:00:00Z' },
  { id: '11', companyId: '1', vmName: 'decom-web-legacy', hostType: 'physical', description: 'Legacy web server - decommissioned', serialNumber: 'PH-001', operatingSystem: 'CentOS 7', memoryTotalGB: 32, memoryUsedGB: 0, cpuCount: 8, diskSizeGB: 500, diskUsedGB: 234, state: 'decommissioned', node: '', favorite: false, purchaseDate: '2019-01-15', warrantyExpiry: '2022-01-15', eolDate: '2024-06-30', lifecycleStatus: 'decommissioned', vendor: 'HPE', model: 'ProLiant DL380 Gen9', assetTag: 'PH-AT-001', location: 'DC1-Rack-Z01', locationId: '1', uPosition: 42, uHeight: 2, createdAt: '2019-01-15T10:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: '12', companyId: '1', vmName: 'mon-grafana-01', hostType: 'virtual-machine', description: 'Monitoring - Grafana + Prometheus', serialNumber: 'VM-MON-001', operatingSystem: 'Ubuntu 24.04 LTS', memoryTotalGB: 8, memoryUsedGB: 5.6, cpuCount: 4, diskSizeGB: 250, diskUsedGB: 120, state: 'running', node: 'esxi-01', favorite: false, purchaseDate: '2025-02-01', warrantyExpiry: '2028-02-01', eolDate: '2029-02-01', lifecycleStatus: 'active', vendor: 'VMware', model: 'vSphere VM', assetTag: 'MON-AT-001', location: 'DC1-Rack-A01', locationId: '1', uPosition: 0, uHeight: 0, createdAt: '2025-02-01T09:00:00Z', updatedAt: '2025-06-01T10:30:00Z' },
]

// ─── IP Addresses ────────────────────────────────────────────────────────────

export const ipAddresses: IPAddress[] = [
  { id: '1', ipAddress: '10.0.1.10', subnetId: '1', hostId: '1', status: 'assigned', reservationType: '', reservationDescription: '', dnsName: 'prod-web-01.acme.local', macAddress: '00:50:56:A1:B2:C3', lastSeen: '2025-06-14T12:00:00Z', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-06-01T10:30:00Z' },
  { id: '2', ipAddress: '10.0.1.11', subnetId: '1', hostId: '2', status: 'assigned', reservationType: '', reservationDescription: '', dnsName: 'prod-web-02.acme.local', macAddress: '00:50:56:A1:B2:C4', lastSeen: '2025-06-14T12:00:00Z', createdAt: '2025-01-15T08:30:00Z', updatedAt: '2025-06-01T10:30:00Z' },
  { id: '3', ipAddress: '10.0.1.20', subnetId: '1', hostId: '3', status: 'assigned', reservationType: '', reservationDescription: '', dnsName: 'prod-db-01.acme.local', macAddress: '00:50:56:A1:D2:E5', lastSeen: '2025-06-14T12:00:00Z', createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-06-05T14:00:00Z' },
  { id: '4', ipAddress: '10.0.1.1', subnetId: '1', hostId: '', status: 'reserved', reservationType: 'Gateway', reservationDescription: 'Default gateway', dnsName: 'gw.prod.acme.local', macAddress: '00:1A:2B:3C:4D:5E', lastSeen: '2025-06-14T12:00:00Z', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: '5', ipAddress: '10.0.1.50', subnetId: '1', hostId: '10', status: 'assigned', reservationType: '', reservationDescription: '', dnsName: 'prod-lb-01.acme.local', macAddress: '00:50:56:B1:C2:D3', lastSeen: '2025-06-14T12:00:00Z', createdAt: '2024-09-15T10:00:00Z', updatedAt: '2025-06-01T08:00:00Z' },
  { id: '6', ipAddress: '10.0.1.100', subnetId: '1', hostId: '', status: 'available', reservationType: '', reservationDescription: '', dnsName: '', macAddress: '', lastSeen: '', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: '7', ipAddress: '10.0.1.101', subnetId: '1', hostId: '', status: 'available', reservationType: '', reservationDescription: '', dnsName: '', macAddress: '', lastSeen: '', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z' },
  { id: '8', ipAddress: '10.0.2.15', subnetId: '2', hostId: '', status: 'assigned', reservationType: '', reservationDescription: '', dnsName: 'dev-ws-01.acme.local', macAddress: '00:50:56:C1:D2:E3', lastSeen: '2025-06-14T11:00:00Z', createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-05-20T11:00:00Z' },
  { id: '9', ipAddress: '172.16.0.100', subnetId: '3', hostId: '6', status: 'assigned', reservationType: '', reservationDescription: '', dnsName: 'glbx-app-01.globex.local', macAddress: '00:50:56:D1:E2:F3', lastSeen: '2025-06-14T12:00:00Z', createdAt: '2025-02-20T09:00:00Z', updatedAt: '2025-06-05T14:30:00Z' },
  { id: '10', ipAddress: '10.0.1.10', subnetId: '1', hostId: '', status: 'conflict', reservationType: '', reservationDescription: 'Duplicate IP detected', dnsName: 'unknown-device.local', macAddress: 'AA:BB:CC:DD:EE:FF', lastSeen: '2025-06-14T11:45:00Z', createdAt: '2025-06-14T11:45:00Z', updatedAt: '2025-06-14T11:45:00Z' },
  { id: '11', ipAddress: '10.0.10.5', subnetId: '4', hostId: '4', status: 'assigned', reservationType: '', reservationDescription: '', dnsName: 'fw-edge-01.acme.local', macAddress: '00:09:0F:A1:B2:C3', lastSeen: '2025-06-14T12:00:00Z', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2025-06-08T16:00:00Z' },
  { id: '12', ipAddress: '192.168.1.50', subnetId: '5', hostId: '7', status: 'assigned', reservationType: '', reservationDescription: '', dnsName: 'init-printer-01.initech.local', macAddress: '00:1E:8F:A1:B2:C3', lastSeen: '2025-06-14T10:00:00Z', createdAt: '2024-01-10T10:00:00Z', updatedAt: '2025-06-10T12:00:00Z' },
  { id: '13', ipAddress: '10.0.1.200', subnetId: '1', hostId: '', status: 'reserved', reservationType: 'DHCP', reservationDescription: 'DHCP scope reservation', dnsName: '', macAddress: '', lastSeen: '', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-01T10:00:00Z' },
  { id: '14', ipAddress: '10.100.0.50', subnetId: '6', hostId: '9', status: 'assigned', reservationType: '', reservationDescription: '', dnsName: 'lab-storage-01.umbrella.local', macAddress: '00:11:32:A1:B2:C3', lastSeen: '2025-06-14T12:00:00Z', createdAt: '2025-04-01T08:30:00Z', updatedAt: '2025-06-12T09:15:00Z' },
  { id: '15', ipAddress: '10.0.1.30', subnetId: '1', hostId: '8', status: 'assigned', reservationType: '', reservationDescription: '', dnsName: 'k8s-worker-01.acme.local', macAddress: '00:50:56:E1:F2:03', lastSeen: '2025-06-14T12:00:00Z', createdAt: '2025-03-01T08:00:00Z', updatedAt: '2025-06-12T09:15:00Z' },
]

// ─── DHCP Scopes ─────────────────────────────────────────────────────────────

export const dhcpScopes: DHCPScope[] = [
  { id: '1', name: 'Prod-DHCP', subnetId: '1', startIP: '10.0.1.100', endIP: '10.0.1.200', leaseTime: 86400, dns: '10.0.1.10', gateway: '10.0.1.1', domain: 'acme.local', enabled: true, notes: 'Production DHCP scope', activeLeases: 67, totalAddresses: 101, createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-06-01T10:30:00Z' },
  { id: '2', name: 'Dev-DHCP', subnetId: '2', startIP: '10.0.2.100', endIP: '10.0.2.250', leaseTime: 43200, dns: '10.0.1.10', gateway: '10.0.2.1', domain: 'dev.acme.local', enabled: true, notes: 'Development DHCP scope', activeLeases: 34, totalAddresses: 151, createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-05-20T11:00:00Z' },
  { id: '3', name: 'Guest-DHCP', subnetId: '5', startIP: '192.168.1.100', endIP: '192.168.1.250', leaseTime: 3600, dns: '8.8.8.8', gateway: '192.168.1.1', domain: '', enabled: true, notes: 'Guest Wi-Fi DHCP', activeLeases: 23, totalAddresses: 151, createdAt: '2025-02-01T09:00:00Z', updatedAt: '2025-06-10T12:00:00Z' },
]

// ─── DHCP Leases ─────────────────────────────────────────────────────────────

export const dhcpLeases: DHCPLease[] = [
  { id: '1', scopeId: '1', ipAddress: '10.0.1.120', macAddress: '00:50:56:F1:02:13', hostname: 'workstation-01', status: 'active', startTime: '2025-06-14T08:00:00Z', endTime: '2025-06-15T08:00:00Z', notes: '' },
  { id: '2', scopeId: '1', ipAddress: '10.0.1.121', macAddress: '00:50:56:F1:02:14', hostname: 'workstation-02', status: 'active', startTime: '2025-06-14T09:30:00Z', endTime: '2025-06-15T09:30:00Z', notes: '' },
  { id: '3', scopeId: '2', ipAddress: '10.0.2.105', macAddress: '00:50:56:F1:02:15', hostname: 'dev-laptop-01', status: 'active', startTime: '2025-06-14T07:00:00Z', endTime: '2025-06-14T19:00:00Z', notes: '' },
  { id: '4', scopeId: '1', ipAddress: '10.0.1.150', macAddress: '00:50:56:F1:02:16', hostname: 'old-device', status: 'expired', startTime: '2025-06-10T08:00:00Z', endTime: '2025-06-11T08:00:00Z', notes: 'Device removed' },
  { id: '5', scopeId: '3', ipAddress: '192.168.1.110', macAddress: 'AA:BB:CC:11:22:33', hostname: 'guest-phone', status: 'active', startTime: '2025-06-14T11:00:00Z', endTime: '2025-06-14T12:00:00Z', notes: '' },
]

// ─── Locations ───────────────────────────────────────────────────────────────

export const locations: Location[] = [
  { id: '1', name: 'DC1 — Primary', type: 'datacenter', parentId: '', address: '100 Data Center Way, Austin, TX', notes: 'Primary datacenter', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
  { id: '2', name: 'DC2 — Secondary', type: 'datacenter', parentId: '', address: '200 Backup Blvd, Denver, CO', notes: 'DR site', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
  { id: '3', name: 'Building A', type: 'building', parentId: '', address: '50 Office Park Dr, Seattle, WA', notes: 'Corporate HQ', createdAt: '2024-06-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
]

// ─── Audit Log ───────────────────────────────────────────────────────────────

export const auditLog: AuditLogEntry[] = [
  { id: '1', timestamp: '2025-06-14T12:30:00Z', action: 'create', entityType: 'host', entityId: '12', details: 'Created host mon-grafana-01', oldValue: '', newValue: '{"vmName":"mon-grafana-01"}', userId: 'john@acme.com', userName: 'John Smith' },
  { id: '2', timestamp: '2025-06-14T11:45:00Z', action: 'update', entityType: 'ip', entityId: '10', details: 'IP conflict detected: 10.0.1.10', oldValue: '{"status":"available"}', newValue: '{"status":"conflict"}', userId: 'system', userName: 'System' },
  { id: '3', timestamp: '2025-06-14T10:15:00Z', action: 'update', entityType: 'subnet', entityId: '1', details: 'Updated DNS servers for Production Servers', oldValue: '{"dnsServers":"10.0.1.10"}', newValue: '{"dnsServers":"10.0.1.10, 10.0.1.11"}', userId: 'jane@globex.com', userName: 'Jane Doe' },
  { id: '4', timestamp: '2025-06-14T09:00:00Z', action: 'create', entityType: 'dhcp_scope', entityId: '3', details: 'Created DHCP scope Guest-DHCP', oldValue: '', newValue: '{"name":"Guest-DHCP"}', userId: 'john@acme.com', userName: 'John Smith' },
  { id: '5', timestamp: '2025-06-13T16:00:00Z', action: 'delete', entityType: 'host', entityId: '99', details: 'Deleted decommissioned host legacy-db-02', oldValue: '{"vmName":"legacy-db-02"}', newValue: '', userId: 'bill@initech.com', userName: 'Bill Lumbergh' },
  { id: '6', timestamp: '2025-06-13T14:30:00Z', action: 'update', entityType: 'vlan', entityId: '4', details: 'Updated VLAN-DMZ description', oldValue: '{"description":"DMZ"}', newValue: '{"description":"DMZ zone"}', userId: 'john@acme.com', userName: 'John Smith' },
  { id: '7', timestamp: '2025-06-13T11:00:00Z', action: 'create', entityType: 'ip', entityId: '15', details: 'Assigned IP 10.0.1.30 to k8s-worker-01', oldValue: '', newValue: '{"ipAddress":"10.0.1.30","hostId":"8"}', userId: 'john@acme.com', userName: 'John Smith' },
  { id: '8', timestamp: '2025-06-12T09:15:00Z', action: 'update', entityType: 'host', entityId: '9', details: 'Updated disk usage for lab-storage-01', oldValue: '{"diskUsedGB":65000}', newValue: '{"diskUsedGB":67432}', userId: 'wesker@umbrella.com', userName: 'Albert Wesker' },
]

// ─── Maintenance Windows ─────────────────────────────────────────────────────

export const maintenanceWindows: MaintenanceWindow[] = [
  { id: '1', title: 'Core Switch Firmware Update', description: 'Upgrading NX-OS on sw-core-01', type: 'firmware', status: 'scheduled', startTime: '2025-06-20T02:00:00Z', endTime: '2025-06-20T04:00:00Z', impact: 'Brief network interruption for VLAN 100, 200', createdBy: 'John Smith' },
  { id: '2', title: 'Database Maintenance', description: 'Monthly vacuum and reindex for prod-db-01', type: 'maintenance', status: 'scheduled', startTime: '2025-06-22T03:00:00Z', endTime: '2025-06-22T05:00:00Z', impact: 'Degraded DB performance during window', createdBy: 'Jane Doe' },
  { id: '3', title: 'SSL Certificate Renewal', description: 'Renew wildcard certificate for *.acme.local', type: 'configuration', status: 'completed', startTime: '2025-06-10T10:00:00Z', endTime: '2025-06-10T10:30:00Z', impact: 'None', createdBy: 'John Smith' },
]

// ─── Conflict Alerts ─────────────────────────────────────────────────────────

export const conflictAlerts: ConflictAlert[] = [
  { id: '1', type: 'duplicate-ip', severity: 'critical', message: 'Duplicate IP 10.0.1.10 detected — assigned to prod-web-01 and unknown device AA:BB:CC:DD:EE:FF', entity: 'IP Address', entityId: '10', timestamp: '2025-06-14T11:45:00Z' },
  { id: '2', type: 'subnet-mismatch', severity: 'warning', message: 'Host init-printer-01 IP 192.168.1.50 not in assigned subnet range', entity: 'Host', entityId: '7', timestamp: '2025-06-14T10:00:00Z' },
  { id: '3', type: 'broadcast-address', severity: 'info', message: 'IP 10.0.1.255 assigned — this is the broadcast address for 10.0.1.0/24', entity: 'IP Address', entityId: '', timestamp: '2025-06-13T15:00:00Z' },
]

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export const dashboardStats: StatCard[] = [
  { label: 'Total IPs', value: '6,132', change: 2.4, changeLabel: 'vs last month', icon: 'Globe', color: 'var(--color-system-blue)' },
  { label: 'Assigned', value: '2,193', change: 5.1, changeLabel: 'vs last month', icon: 'Link', color: 'var(--color-system-green)' },
  { label: 'Available', value: '3,636', change: -1.2, changeLabel: 'vs last month', icon: 'CircleDot', color: 'var(--color-system-teal)' },
  { label: 'Conflicts', value: '3', change: 50, changeLabel: 'vs last week', icon: 'AlertTriangle', color: 'var(--color-system-red)' },
  { label: 'Hosts', value: '412', change: 3.8, changeLabel: 'vs last month', icon: 'Server', color: 'var(--color-system-purple)' },
  { label: 'Subnets', value: '24', change: 0, changeLabel: 'no change', icon: 'Network', color: 'var(--color-system-indigo)' },
  { label: 'DHCP Leases', value: '124', change: -8.3, changeLabel: 'vs last week', icon: 'Wifi', color: 'var(--color-system-orange)' },
  { label: 'Uptime', value: '99.97%', change: 0.02, changeLabel: 'vs last month', icon: 'Activity', color: 'var(--color-system-green)' },
]
