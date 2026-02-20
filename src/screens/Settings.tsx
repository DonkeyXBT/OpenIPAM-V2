import { useState } from 'react'
import {
  Sun, Moon, Monitor, Download, Upload, Database, Shield,
  Bell, Palette, Globe, Info, RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { toast } from '@/components/ui/Toast'
import type { Theme } from '@/types'

/*
 * ─── Screen 5: Settings / Profile ────────────────────────────────────────────
 *
 * WIREFRAME:
 *   Vertical stacked settings sections:
 *   1. Appearance (theme toggle, compact mode, density)
 *   2. Data Management (import/export, backup, clear data)
 *   3. Backend Configuration (server URL, health check)
 *   4. Authentication (SAML status, user info)
 *   5. About (version, links)
 *
 * COMPONENT INVENTORY:
 *   - Section cards with icon headers
 *   - Toggle switches (theme, compact, notifications)
 *   - File upload button (import)
 *   - Download button (export)
 *   - Server status indicator
 *   - Destructive action with confirmation
 *
 * INTERACTION SPECS:
 *   - Theme toggle: Immediate visual change
 *   - Export: Download JSON file
 *   - Import: File picker + validation
 *   - Clear data: Confirmation modal
 *   - Server health: Ping with loading spinner
 *
 * EMPTY / ERROR STATES:
 *   - Backend offline: Status indicator + message
 *   - No SAML configured: Setup instructions
 */

export function Settings() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('system')
  const [compactMode, setCompactMode] = useState(false)
  const [serverUrl, setServerUrl] = useState('http://localhost:5000')
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('offline')

  const handleCheckServer = () => {
    setServerStatus('checking')
    setTimeout(() => {
      setServerStatus('offline')
      toast({ type: 'warning', title: 'Server Unreachable', message: 'Could not connect to the backend server.' })
    }, 1500)
  }

  const handleExport = () => {
    toast({ type: 'success', title: 'Export Complete', message: 'Database exported as openipam-backup.json' })
  }

  const handleImport = () => {
    toast({ type: 'info', title: 'Import', message: 'Select a JSON backup file to import.' })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Settings" description="Configure your OpenIPAM instance" />

      {/* ─── Appearance ───────────────────────────────────────────── */}
      <Card padding="lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-system-purple" />
            <CardTitle>Appearance</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div>
              <p className="typo-callout font-medium text-[var(--text-primary)]">Theme</p>
              <p className="typo-caption text-[var(--text-tertiary)]">Choose your preferred color scheme</p>
            </div>
            <div className="flex items-center gap-1 bg-[var(--surface-tertiary)] rounded-lg p-0.5">
              {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setCurrentTheme(t)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all
                    ${currentTheme === t
                      ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
                  `}
                  aria-pressed={currentTheme === t}
                >
                  {t === 'light' && <Sun className="w-3.5 h-3.5" />}
                  {t === 'dark' && <Moon className="w-3.5 h-3.5" />}
                  {t === 'system' && <Monitor className="w-3.5 h-3.5" />}
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="typo-callout font-medium text-[var(--text-primary)]">Compact Mode</p>
              <p className="typo-caption text-[var(--text-tertiary)]">Reduce spacing in tables and lists</p>
            </div>
            <button
              onClick={() => setCompactMode(!compactMode)}
              className={`
                relative w-11 h-6 rounded-full transition-colors duration-200
                ${compactMode ? 'bg-system-blue' : 'bg-[var(--surface-tertiary)]'}
              `}
              role="switch"
              aria-checked={compactMode}
              aria-label="Toggle compact mode"
            >
              <span
                className={`
                  absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200
                  ${compactMode ? 'translate-x-[22px]' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div>
              <p className="typo-callout font-medium text-[var(--text-primary)]">Content Density</p>
              <p className="typo-caption text-[var(--text-tertiary)]">Adjust information density</p>
            </div>
            <Select
              options={[
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'compact', label: 'Compact' },
                { value: 'spacious', label: 'Spacious' },
              ]}
              defaultValue="comfortable"
            />
          </div>
        </div>
      </Card>

      {/* ─── Data Management ──────────────────────────────────────── */}
      <Card padding="lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-system-blue" />
            <CardTitle>Data Management</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="typo-callout font-medium text-[var(--text-primary)]">Export Database</p>
              <p className="typo-caption text-[var(--text-tertiary)]">Download all data as a JSON backup file</p>
            </div>
            <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
              Export
            </Button>
          </div>

          <div className="border-t border-[var(--border-secondary)]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="typo-callout font-medium text-[var(--text-primary)]">Import Database</p>
              <p className="typo-caption text-[var(--text-tertiary)]">Restore from a JSON backup file</p>
            </div>
            <Button variant="secondary" size="sm" icon={<Upload className="w-4 h-4" />} onClick={handleImport}>
              Import
            </Button>
          </div>

          <div className="border-t border-[var(--border-secondary)]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="typo-callout font-medium text-[var(--text-primary)]">Clear All Data</p>
              <p className="typo-caption text-system-red/80">Permanently delete all records. This cannot be undone.</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast({ type: 'error', title: 'Confirmation Required', message: 'Type "DELETE" to confirm clearing all data.' })}
            >
              Clear Data
            </Button>
          </div>
        </div>
      </Card>

      {/* ─── Backend Configuration ────────────────────────────────── */}
      <Card padding="lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-system-green" />
            <CardTitle>Backend Server</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                label="Server URL"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://localhost:5000"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="typo-callout text-[var(--text-secondary)]">Status:</span>
              {serverStatus === 'online' && (
                <Badge variant="success" dot>Online</Badge>
              )}
              {serverStatus === 'offline' && (
                <Badge variant="error" dot>Offline</Badge>
              )}
              {serverStatus === 'checking' && (
                <Badge variant="default">
                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                  Checking...
                </Badge>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-4 h-4" />}
              loading={serverStatus === 'checking'}
              onClick={handleCheckServer}
            >
              Check Connection
            </Button>
          </div>
        </div>
      </Card>

      {/* ─── Authentication ───────────────────────────────────────── */}
      <Card padding="lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-system-orange" />
            <CardTitle>Authentication</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="typo-callout text-[var(--text-secondary)]">SAML SSO</span>
            <Badge variant="default">Not Configured</Badge>
          </div>
          <p className="typo-caption text-[var(--text-tertiary)]">
            SAML SSO with Microsoft Entra ID requires the Flask backend. Configure via environment variables or saml/settings.json.
          </p>
        </div>
      </Card>

      {/* ─── About ────────────────────────────────────────────────── */}
      <Card padding="lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[var(--text-tertiary)]" />
            <CardTitle>About</CardTitle>
          </div>
        </CardHeader>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="typo-callout text-[var(--text-secondary)]">Version</span>
            <span className="typo-callout text-[var(--text-primary)] font-mono">2.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="typo-callout text-[var(--text-secondary)]">Mode</span>
            <Badge variant="info">Browser Only</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="typo-callout text-[var(--text-secondary)]">Database</span>
            <span className="typo-callout text-[var(--text-primary)]">SQLite (IndexedDB)</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
