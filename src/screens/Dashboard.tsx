import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Globe, Link, CircleDot, AlertTriangle, Server, Network,
  Wifi, Activity, TrendingUp, TrendingDown, ArrowRight,
  Clock, AlertCircle,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CapacityBar } from '@/components/ui/ProgressRing'
import { PageHeader } from '@/components/layout/PageHeader'
import { dashboardStats, subnets, auditLog, conflictAlerts, hosts, companies } from '@/data/mock'

/*
 * ─── Screen 2: Dashboard ─────────────────────────────────────────────────────
 *
 * WIREFRAME:
 *   Top: 4-column stat cards (Total IPs, Assigned, Available, Conflicts)
 *   Middle-left: IP Utilization donut chart with legend
 *   Middle-right: Conflict alerts feed (scrollable)
 *   Bottom-left: Subnet capacity bars (top 5)
 *   Bottom-right: Recent activity timeline
 *
 * COMPONENT INVENTORY:
 *   - StatCard with trend indicator
 *   - Donut chart (Recharts)
 *   - ConflictAlert card
 *   - SubnetCapacity bar
 *   - ActivityTimeline entry
 *   - Quick actions bar
 *
 * INTERACTION SPECS:
 *   - Stat cards: Click to navigate to related entity list
 *   - Donut segments: Hover for tooltip with count
 *   - Alert cards: Click to view conflict details
 *   - Activity entries: Click to view audit detail
 *
 * EMPTY STATES:
 *   - No conflicts: "All clear" message with green checkmark
 *   - No activity: "No recent activity" with clock icon
 *
 * LOADING STATES:
 *   - Skeleton cards for stats (4 pulsing rectangles)
 *   - Skeleton donut (circular shimmer)
 *   - Skeleton lines for activity
 */

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-5 h-5" />,
  Link: <Link className="w-5 h-5" />,
  CircleDot: <CircleDot className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Network: <Network className="w-5 h-5" />,
  Wifi: <Wifi className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
}

const donutData = [
  { name: 'Assigned', value: 2193, color: 'var(--color-system-blue)' },
  { name: 'Reserved', value: 303, color: 'var(--color-system-orange)' },
  { name: 'Available', value: 3636, color: 'var(--color-system-green)' },
]

const severityStyles = {
  critical: 'border-l-system-red bg-system-red/5',
  warning: 'border-l-system-orange bg-system-orange/5',
  info: 'border-l-system-blue bg-system-blue/5',
}

const actionLabels: Record<string, { label: string; color: string }> = {
  create: { label: 'Created', color: 'bg-system-green/15 text-system-green' },
  update: { label: 'Updated', color: 'bg-system-blue/15 text-system-blue' },
  delete: { label: 'Deleted', color: 'bg-system-red/15 text-system-red' },
}

export function Dashboard() {
  const navigate = useNavigate()

  const topSubnets = useMemo(
    () =>
      [...subnets]
        .sort((a, b) => (b.assignedCount / b.totalHosts) - (a.assignedCount / a.totalHosts))
        .slice(0, 5),
    []
  )

  const recentActivity = auditLog.slice(0, 6)
  const activeHosts = hosts.filter((h) => h.state === 'running').length

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description={`${activeHosts} hosts running across ${companies.length} organizations`}
        actions={
          <Button variant="secondary" size="sm" onClick={() => navigate('/ips')}>
            View All IPs
          </Button>
        }
      />

      {/* ─── Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {dashboardStats.slice(0, 4).map((stat, i) => (
          <Card key={stat.label} hover className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="typo-subhead text-[var(--text-secondary)]">{stat.label}</p>
                  <p className="typo-title-1 text-[var(--text-primary)] mt-1">{stat.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  {iconMap[stat.icon]}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 min-h-[20px]">
                {stat.change !== undefined && (
                  <>
                    {stat.change > 0 ? (
                      <TrendingUp className="w-3 h-3 text-system-green" />
                    ) : stat.change < 0 ? (
                      <TrendingDown className="w-3 h-3 text-system-red" />
                    ) : null}
                    <span
                      className={`typo-caption font-medium ${
                        stat.change > 0 ? 'text-system-green' : stat.change < 0 ? 'text-system-red' : 'text-[var(--text-tertiary)]'
                      }`}
                    >
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                    <span className="typo-caption text-[var(--text-quaternary)]">{stat.changeLabel}</span>
                  </>
                )}
              </div>
            </Card>
        ))}
      </div>

      {/* ─── Second Row: Stat Cards (smaller) ────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {dashboardStats.slice(4).map((stat) => (
          <Card key={stat.label} padding="sm" className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
            >
              {iconMap[stat.icon]}
            </div>
            <div>
              <p className="typo-footnote text-[var(--text-tertiary)]">{stat.label}</p>
              <p className="typo-headline text-[var(--text-primary)]">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── Main Grid ───────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Donut Chart */}
        <Card padding="lg" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>IP Utilization</CardTitle>
            <Badge variant="info">Live</Badge>
          </CardHeader>

          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [Number(value).toLocaleString(), '']}
                    contentStyle={{
                      background: 'var(--surface-elevated)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '10px',
                      fontSize: '13px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="typo-title-2 text-[var(--text-primary)]">6,132</span>
                <span className="typo-caption text-[var(--text-tertiary)]">Total IPs</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-5 mt-4">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="typo-caption text-[var(--text-secondary)]">{d.name}</span>
                <span className="typo-caption font-semibold text-[var(--text-primary)]">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Conflict Alerts */}
        <Card padding="none" className="lg:col-span-3">
          <div className="px-5 pt-5 pb-3">
            <CardHeader>
              <CardTitle>Conflict Alerts</CardTitle>
              <Badge variant={conflictAlerts.some((a) => a.severity === 'critical') ? 'error' : 'success'}>
                {conflictAlerts.length} active
              </Badge>
            </CardHeader>
          </div>

          {conflictAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-system-green/15 flex items-center justify-center mb-3">
                <Activity className="w-6 h-6 text-system-green" />
              </div>
              <p className="typo-callout font-medium text-[var(--text-primary)]">All Clear</p>
              <p className="typo-caption text-[var(--text-tertiary)]">No IP conflicts detected</p>
            </div>
          ) : (
            <div className="px-4 pb-4 space-y-2">
              {conflictAlerts.map((alert) => (
                <button
                  key={alert.id}
                  className={`
                    w-full text-left p-3 rounded-lg border-l-[3px] transition-colors
                    hover:bg-black/[0.03] dark:hover:bg-white/[0.03]
                    ${severityStyles[alert.severity]}
                  `}
                  onClick={() => navigate(`/ips/${alert.entityId}`)}
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-system-red' :
                      alert.severity === 'warning' ? 'text-system-orange' :
                      'text-system-blue'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="typo-callout font-medium text-[var(--text-primary)] truncate">
                        {alert.message}
                      </p>
                      <p className="typo-caption text-[var(--text-tertiary)] mt-0.5">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ─── Bottom Row ──────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Subnet Capacity */}
        <Card padding="lg" className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Subnets by Usage</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/subnets')} iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
              View All
            </Button>
          </CardHeader>

          <div className="space-y-4">
            {topSubnets.map((subnet) => {
              const company = companies.find((c) => c.id === subnet.companyId)
              return (
                <div key={subnet.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="typo-callout font-medium text-[var(--text-primary)]">
                        {subnet.network}/{subnet.cidr}
                      </span>
                      <span className="typo-caption text-[var(--text-tertiary)]">{subnet.name}</span>
                      {company && (
                        <Badge variant="custom" size="sm" color={company.color} dot>
                          {company.code}
                        </Badge>
                      )}
                    </div>
                    <span className="typo-caption font-medium text-[var(--text-secondary)]">
                      {Math.round((subnet.assignedCount / subnet.totalHosts) * 100)}%
                    </span>
                  </div>
                  <CapacityBar
                    used={subnet.assignedCount}
                    reserved={subnet.reservedCount}
                    total={subnet.totalHosts}
                    showLabels={false}
                    height={4}
                  />
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card padding="none" className="lg:col-span-2">
          <div className="px-5 pt-5 pb-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/audit')} iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
                View All
              </Button>
            </CardHeader>
          </div>

          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock className="w-8 h-8 text-[var(--text-quaternary)] mb-2" />
              <p className="typo-callout text-[var(--text-tertiary)]">No recent activity</p>
            </div>
          ) : (
            <div className="px-4 pb-4">
              {recentActivity.map((entry, i) => {
                const actionConfig = actionLabels[entry.action] || actionLabels.update
                return (
                  <div
                    key={entry.id}
                    className={`
                      flex items-start gap-3 py-3
                      ${i < recentActivity.length - 1 ? 'border-b border-[var(--border-secondary)]' : ''}
                    `}
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--surface-tertiary)] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                        {entry.userName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="typo-callout text-[var(--text-primary)] truncate">
                        <span className="font-medium">{entry.userName}</span>{' '}
                        <span className={`inline-flex px-1.5 py-0 text-[10px] font-medium rounded-full ${actionConfig.color}`}>
                          {actionConfig.label}
                        </span>{' '}
                        <span className="text-[var(--text-secondary)]">{entry.entityType}</span>
                      </p>
                      <p className="typo-caption text-[var(--text-tertiary)] truncate mt-0.5">
                        {entry.details}
                      </p>
                      <p className="typo-caption text-[var(--text-quaternary)] mt-0.5">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
