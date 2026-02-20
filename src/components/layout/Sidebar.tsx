import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Globe, Network, Hash, Server, Wifi,
  MapPin, FileText, ClipboardList, Search, Settings,
  Sun, Moon, Monitor, ChevronLeft, ChevronRight, Shield,
} from 'lucide-react'
import type { Theme } from '@/types'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
  onSearchOpen: () => void
}

interface NavSection {
  title: string
  items: {
    path: string
    label: string
    icon: React.ReactNode
    badge?: number
  }[]
}

const navigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', icon: <LayoutDashboard /> },
    ],
  },
  {
    title: 'Management',
    items: [
      { path: '/ips', label: 'IP Addresses', icon: <Globe /> },
      { path: '/subnets', label: 'Subnets', icon: <Network /> },
      { path: '/vlans', label: 'VLANs', icon: <Hash /> },
      { path: '/hosts', label: 'Hosts', icon: <Server /> },
      { path: '/dhcp', label: 'DHCP', icon: <Wifi /> },
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      { path: '/locations', label: 'Locations', icon: <MapPin /> },
      { path: '/templates', label: 'Templates', icon: <FileText /> },
    ],
  },
  {
    title: 'System',
    items: [
      { path: '/audit', label: 'Audit Log', icon: <ClipboardList /> },
      { path: '/settings', label: 'Settings', icon: <Settings /> },
    ],
  },
]

const themeIcons: Record<Theme, React.ReactNode> = {
  light: <Sun className="w-4 h-4" />,
  dark: <Moon className="w-4 h-4" />,
  system: <Monitor className="w-4 h-4" />,
}

const themeLabels: Theme[] = ['light', 'dark', 'system']

export function Sidebar({ collapsed, onToggle, theme, onThemeChange, onSearchOpen }: SidebarProps) {
  const location = useLocation()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 68 : 260 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="
        h-screen flex flex-col shrink-0
        bg-[var(--sidebar-bg)] border-r border-white/[0.06]
        overflow-hidden select-none
      "
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-system-blue flex items-center justify-center shrink-0">
          <Shield className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="text-[15px] font-semibold text-white leading-tight">OpenIPAM</span>
            <span className="text-[10px] text-[var(--sidebar-text-muted)] leading-tight">v2.0</span>
          </motion.div>
        )}
      </div>

      {/* Search Trigger */}
      <div className="px-3 mb-2">
        <button
          onClick={onSearchOpen}
          className={`
            w-full flex items-center gap-2 h-8 rounded-lg
            bg-white/[0.06] hover:bg-white/[0.1] transition-colors
            ${collapsed ? 'justify-center px-0' : 'px-2.5'}
          `}
          aria-label="Open search"
        >
          <Search className="w-3.5 h-3.5 text-[var(--sidebar-text-muted)] shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-[12px] text-[var(--sidebar-text-muted)] text-left">Search...</span>
              <kbd className="text-[10px] text-[var(--sidebar-text-muted)] bg-white/[0.06] px-1 py-0.5 rounded">
                /
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-4">
        {navigation.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <span className="text-[10px] font-semibold text-[var(--sidebar-text-muted)] uppercase tracking-[0.08em] px-2.5 mb-1 block">
                {section.title}
              </span>
            )}
            <ul className="space-y-0.5" role="list">
              {section.items.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path)

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`
                        relative flex items-center gap-2.5 h-8 rounded-lg
                        transition-all duration-150
                        ${collapsed ? 'justify-center px-0' : 'px-2.5'}
                        ${
                          isActive
                            ? 'bg-[var(--sidebar-active)] text-white'
                            : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-[var(--sidebar-accent)]"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]">
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="text-[13px] font-medium truncate">
                          {item.label}
                        </span>
                      )}
                      {!collapsed && item.badge && item.badge > 0 && (
                        <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-system-red text-white min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 space-y-2 border-t border-white/[0.06]">
        {/* Theme Switcher */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-1'} bg-white/[0.06] rounded-lg p-0.5`}>
          {themeLabels.map((t) => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`
                flex items-center justify-center rounded-md transition-all duration-150
                ${collapsed ? 'w-7 h-7' : 'flex-1 h-7 gap-1.5'}
                ${theme === t ? 'bg-white/[0.12] text-white' : 'text-[var(--sidebar-text-muted)] hover:text-white'}
              `}
              aria-label={`Switch to ${t} theme`}
              aria-pressed={theme === t}
              title={t.charAt(0).toUpperCase() + t.slice(1)}
            >
              {themeIcons[t]}
              {!collapsed && (
                <span className="text-[11px] font-medium capitalize">{t}</span>
              )}
            </button>
          ))}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center h-8 rounded-lg text-[var(--sidebar-text-muted)] hover:text-white hover:bg-[var(--sidebar-hover)] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  )
}
