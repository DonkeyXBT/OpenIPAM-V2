import { useState, useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { SearchOverlay } from '@/components/ui/SearchOverlay'
import { ToastContainer } from '@/components/ui/Toast'
import { useTheme } from '@/hooks/useTheme'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), [])
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  useKeyboardShortcuts({
    '/': openSearch,
    'mod+k': openSearch,
  })

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-secondary)]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        theme={theme}
        onThemeChange={setTheme}
        onSearchOpen={openSearch}
      />

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
        id="main-content"
        role="main"
      >
        <Outlet />
      </main>

      {/* Overlays */}
      <SearchOverlay
        open={searchOpen}
        onClose={closeSearch}
        onNavigate={(path) => navigate(path)}
      />
      <ToastContainer />
    </div>
  )
}
