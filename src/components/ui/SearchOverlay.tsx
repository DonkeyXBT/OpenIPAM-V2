import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, X, Server, Globe, Network, Hash, Wifi, MapPin,
} from 'lucide-react'
import { hosts, ipAddresses, subnets, vlans, dhcpScopes, locations } from '@/data/mock'
import type { SearchResult } from '@/types'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
  onNavigate: (path: string) => void
}

const typeIcons: Record<string, React.ReactNode> = {
  host: <Server className="w-4 h-4" />,
  ip: <Globe className="w-4 h-4" />,
  subnet: <Network className="w-4 h-4" />,
  vlan: <Hash className="w-4 h-4" />,
  dhcp: <Wifi className="w-4 h-4" />,
  location: <MapPin className="w-4 h-4" />,
}

const typeColors: Record<string, string> = {
  host: 'text-system-purple',
  ip: 'text-system-blue',
  subnet: 'text-system-indigo',
  vlan: 'text-system-teal',
  dhcp: 'text-system-orange',
  location: 'text-system-green',
}

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []

  hosts.forEach((h) => {
    results.push({
      id: h.id,
      type: 'host',
      title: h.vmName,
      subtitle: `${h.hostType} · ${h.operatingSystem || 'N/A'} · ${h.state}`,
      icon: 'Server',
      path: `/hosts/${h.id}`,
    })
  })

  ipAddresses.forEach((ip) => {
    results.push({
      id: ip.id,
      type: 'ip',
      title: ip.ipAddress,
      subtitle: `${ip.status} · ${ip.dnsName || 'No DNS'} · ${ip.macAddress || 'No MAC'}`,
      icon: 'Globe',
      path: `/ips/${ip.id}`,
    })
  })

  subnets.forEach((s) => {
    results.push({
      id: s.id,
      type: 'subnet',
      title: `${s.network}/${s.cidr}`,
      subtitle: `${s.name} · ${s.assignedCount}/${s.totalHosts} used`,
      icon: 'Network',
      path: `/subnets/${s.id}`,
    })
  })

  vlans.forEach((v) => {
    results.push({
      id: v.id,
      type: 'vlan',
      title: `VLAN ${v.vlanId}`,
      subtitle: `${v.name} · ${v.type}`,
      icon: 'Hash',
      path: `/vlans/${v.id}`,
    })
  })

  dhcpScopes.forEach((d) => {
    results.push({
      id: d.id,
      type: 'dhcp',
      title: d.name,
      subtitle: `${d.startIP} — ${d.endIP} · ${d.activeLeases} active leases`,
      icon: 'Wifi',
      path: `/dhcp/${d.id}`,
    })
  })

  locations.forEach((l) => {
    results.push({
      id: l.id,
      type: 'location',
      title: l.name,
      subtitle: `${l.type} · ${l.address}`,
      icon: 'MapPin',
      path: `/locations/${l.id}`,
    })
  })

  return results
}

export function SearchOverlay({ open, onClose, onNavigate }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const allResults = useMemo(buildSearchIndex, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allResults.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q)
    )
  }, [query, allResults])

  // Group by type
  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    filtered.forEach((r) => {
      if (!groups[r.type]) groups[r.type] = []
      groups[r.type].push(r)
    })
    return groups
  }, [filtered])

  const flatResults = useMemo(() => filtered, [filtered])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        if (flatResults[selectedIndex]) {
          onNavigate(flatResults[selectedIndex].path)
          onClose()
        }
        break
      case 'Escape':
        onClose()
        break
    }
  }

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-selected="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0" style={{ zIndex: 450 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="flex justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-2xl bg-[var(--surface-elevated)] rounded-2xl shadow-2xl border border-[var(--border-primary)] overflow-hidden"
              role="combobox"
              aria-expanded="true"
              aria-haspopup="listbox"
              aria-label="Search across all entities"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border-secondary)]">
                <Search className="w-5 h-5 text-[var(--text-tertiary)] shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search hosts, IPs, subnets, VLANs, DHCP..."
                  className="flex-1 bg-transparent text-body text-[var(--text-primary)] placeholder:text-[var(--text-quaternary)] outline-none"
                  aria-label="Search"
                  aria-autocomplete="list"
                  aria-controls="search-results"
                />
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-caption font-medium text-[var(--text-quaternary)] bg-[var(--surface-tertiary)] rounded">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                id="search-results"
                className="max-h-[50vh] overflow-y-auto"
                role="listbox"
              >
                {query.trim() === '' ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-callout text-[var(--text-tertiary)]">
                      Type to search across all entities
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <kbd className="px-1.5 py-0.5 text-caption bg-[var(--surface-tertiary)] rounded">/</kbd>
                      <span className="text-caption text-[var(--text-quaternary)]">to open search</span>
                    </div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-callout text-[var(--text-secondary)]">
                      No results for "{query}"
                    </p>
                    <p className="text-caption text-[var(--text-tertiary)] mt-1">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {Object.entries(grouped).map(([type, results]) => (
                      <div key={type}>
                        <div className="px-4 py-1.5">
                          <span className="text-caption font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                            {type === 'ip' ? 'IP Addresses' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                          </span>
                        </div>
                        {results.map((result) => {
                          const globalIdx = flatResults.indexOf(result)
                          const isSelected = globalIdx === selectedIndex
                          return (
                            <button
                              key={`${result.type}-${result.id}`}
                              data-selected={isSelected}
                              className={`
                                w-full flex items-center gap-3 px-4 py-2.5 text-left
                                transition-colors duration-75
                                ${isSelected ? 'bg-system-blue/10' : 'hover:bg-[var(--table-row-hover)]'}
                              `}
                              onClick={() => {
                                onNavigate(result.path)
                                onClose()
                              }}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <span className={`shrink-0 ${typeColors[result.type]}`}>
                                {typeIcons[result.type]}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-callout font-medium text-[var(--text-primary)] truncate">
                                  {result.title}
                                </p>
                                <p className="text-caption text-[var(--text-tertiary)] truncate">
                                  {result.subtitle}
                                </p>
                              </div>
                              {isSelected && (
                                <kbd className="shrink-0 px-1.5 py-0.5 text-caption bg-[var(--surface-tertiary)] rounded text-[var(--text-quaternary)]">
                                  Enter
                                </kbd>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {filtered.length > 0 && (
                <div className="px-4 py-2 border-t border-[var(--border-secondary)] flex items-center gap-4">
                  <span className="text-caption text-[var(--text-quaternary)]">
                    {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-caption text-[var(--text-quaternary)] flex items-center gap-1">
                    <kbd className="px-1 bg-[var(--surface-tertiary)] rounded text-[10px]">↑↓</kbd> navigate
                  </span>
                  <span className="text-caption text-[var(--text-quaternary)] flex items-center gap-1">
                    <kbd className="px-1 bg-[var(--surface-tertiary)] rounded text-[10px]">↵</kbd> select
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
