import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Globe, Network, Hash, Server, Wifi,
  MapPin, FileText, ClipboardList, Search, Settings,
  Sun, Moon, Monitor, ChevronLeft, ChevronRight, Shield,
  Building2,
} from 'lucide-react'
import type { Theme } from '@/types'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
  onSearchOpen: () => void
}

const navigation = [
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
      { path: '/organizations', label: 'Organizations', icon: <Building2 /> },
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
  light: <Sun className="w-3.5 h-3.5" />,
  dark: <Moon className="w-3.5 h-3.5" />,
  system: <Monitor className="w-3.5 h-3.5" />,
}

const themeLabels: Theme[] = ['light', 'dark', 'system']

export function Sidebar({ collapsed, onToggle, theme, onThemeChange, onSearchOpen }: SidebarProps) {
  const location = useLocation()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 252 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-screen flex flex-col shrink-0 bg-[var(--sidebar-bg)] border-r border-white/[0.06] overflow-hidden select-none"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-[56px] shrink-0 border-b border-white/[0.04]">
        <div className="w-[32px] h-[32px] rounded-[8px] bg-system-blue flex items-center justify-center shrink-0">
          <Shield className="w-[16px] h-[16px] text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col overflow-hidden"
          >
            <span className="text-[14px] font-semibold text-white leading-tight tracking-[-0.01em]">OpenIPAM</span>
            <span className="text-[10px] text-[var(--sidebar-text-muted)] leading-tight">v2.0</span>
          </motion.div>
        )}
      </div>

      {/* Search Trigger */}
      <div className="px-2.5 pt-3 pb-1">
        <button
          onClick={onSearchOpen}
          className={`w-full flex items-center gap-2 h-[34px] rounded-[8px] bg-white/[0.06] hover:bg-white/[0.1] transition-colors duration-150 ${collapsed ? 'justify-center px-0' : 'px-2.5'}`}
          aria-label="Open search"
        >
          <Search className="w-[14px] h-[14px] text-[var(--sidebar-text-muted)] shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-[12px] text-[var(--sidebar-text-muted)] text-left">Search...</span>
              <kbd className="text-[10px] text-[var(--sidebar-text-muted)] bg-white/[0.08] px-[6px] py-[2px] rounded-[4px] font-mono">/</kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 pt-2 pb-2 space-y-5">
        {navigation.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <span className="text-[10px] font-semibold text-[var(--sidebar-text-muted)] uppercase tracking-[0.06em] px-2 mb-[6px] block">
                {section.title}
              </span>
            )}
            <ul className="space-y-1" role="list">
              {section.items.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path)

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`relative flex items-center gap-2.5 h-[36px] rounded-[8px] transition-all duration-150 ${collapsed ? 'justify-center px-0' : 'px-2.5'} ${isActive ? 'bg-[var(--sidebar-active)] text-white' : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]'}`}
                      aria-current={isActive ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-full bg-[var(--sidebar-accent)]"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="shrink-0 [&>svg]:w-[17px] [&>svg]:h-[17px] [&>svg]:stroke-[1.8]">
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="text-[13px] font-medium truncate">{item.label}</span>
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
      <div className="px-2.5 py-2.5 space-y-1.5 border-t border-white/[0.04]">
        {/* Theme Switcher */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-[2px]'} bg-white/[0.06] rounded-[8px] p-[3px]`}>
          {themeLabels.map((t) => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`flex items-center justify-center rounded-[6px] transition-all duration-150 ${collapsed ? 'w-[28px] h-[26px]' : 'flex-1 h-[26px] gap-1.5'} ${theme === t ? 'bg-white/[0.12] text-white shadow-sm' : 'text-[var(--sidebar-text-muted)] hover:text-white'}`}
              aria-label={`Switch to ${t} theme`}
              aria-pressed={theme === t}
              title={t.charAt(0).toUpperCase() + t.slice(1)}
            >
              {themeIcons[t]}
              {!collapsed && <span className="text-[11px] font-medium capitalize">{t}</span>}
            </button>
          ))}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center h-[32px] rounded-[8px] text-[var(--sidebar-text-muted)] hover:text-white hover:bg-[var(--sidebar-hover)] transition-colors duration-150"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  )
}
