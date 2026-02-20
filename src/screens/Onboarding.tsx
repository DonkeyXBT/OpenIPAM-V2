import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Globe, Server, ArrowRight, Monitor, Cloud, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/*
 * ─── Screen 1: Onboarding / Welcome ──────────────────────────────────────────
 *
 * WIREFRAME:
 *   Full-screen centered layout with animated step indicator.
 *   Step 1: Welcome hero with product logo and tagline.
 *   Step 2: Mode selection (Browser-only vs Server-backed).
 *   Step 3: SAML SSO configuration (if server mode).
 *   Step 4: Quick tour highlights.
 *
 * COMPONENT INVENTORY:
 *   - Animated logo mark
 *   - Step indicator (dots)
 *   - Mode selection cards
 *   - SAML config form (simplified)
 *   - Feature highlight cards
 *   - CTA buttons (primary/secondary)
 *
 * INTERACTION SPECS:
 *   - Keyboard: Arrow keys or Tab to navigate steps
 *   - Click: Card selection for mode choice
 *   - Transition: Slide-left between steps (200ms ease-out)
 *
 * EMPTY / ERROR STATES:
 *   - If SAML validation fails: Inline error with red border + message
 *   - Network error: "Cannot reach server" state with retry
 *
 * LOADING STATES:
 *   - SAML validation: Button spinner + "Validating..." label
 */

interface OnboardingProps {
  onComplete: () => void
}

const features = [
  { icon: <Globe className="w-6 h-6" />, title: 'IP Address Management', description: 'Track and manage IP allocations across subnets, VLANs, and DHCP scopes with conflict detection.', color: 'var(--color-system-blue)' },
  { icon: <Server className="w-6 h-6" />, title: 'Configuration Management', description: 'Full CMDB with host inventory, hardware lifecycle tracking, and datacenter rack visualization.', color: 'var(--color-system-purple)' },
  { icon: <Shield className="w-6 h-6" />, title: 'Audit & Security', description: 'Every change is logged with full user attribution. Microsoft SAML SSO for enterprise authentication.', color: 'var(--color-system-green)' },
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<'browser' | 'server' | null>(null)

  const totalSteps = 3

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)] flex flex-col items-center justify-center p-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-10" role="progressbar" aria-valuenow={step + 1} aria-valuemax={totalSteps}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 24 : 8,
              backgroundColor: i <= step ? 'var(--color-system-blue)' : 'var(--surface-tertiary)',
            }}
            className="h-2 rounded-full"
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="text-center max-w-lg"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
              className="w-20 h-20 rounded-3xl bg-system-blue mx-auto mb-6 flex items-center justify-center shadow-lg"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="typo-large-title text-[var(--text-primary)] mb-3">
              Welcome to OpenIPAM
            </h1>
            <p className="typo-body text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
              A unified dashboard for IP address management, network infrastructure, and configuration management.
            </p>

            <div className="grid gap-4 mb-8">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 text-left p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"
                >
                  <div
                    className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `color-mix(in srgb, ${f.color} 12%, transparent)`, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="typo-callout font-semibold text-[var(--text-primary)]">{f.title}</h3>
                    <p className="typo-caption text-[var(--text-secondary)] mt-0.5">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button size="lg" icon={<ArrowRight />} iconRight onClick={() => setStep(1)}>
              Get Started
            </Button>
          </motion.div>
        )}

        {/* Step 1: Mode Selection */}
        {step === 1 && (
          <motion.div
            key="mode"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="text-center max-w-xl"
          >
            <h2 className="typo-title-1 text-[var(--text-primary)] mb-2">Choose Your Mode</h2>
            <p className="typo-body text-[var(--text-secondary)] mb-8">
              OpenIPAM works in your browser or with a server backend.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {/* Browser Mode */}
              <button
                onClick={() => setMode('browser')}
                className={`
                  relative p-5 rounded-2xl border-2 text-left transition-all duration-150
                  ${mode === 'browser'
                    ? 'border-system-blue bg-system-blue/5'
                    : 'border-[var(--border-primary)] bg-[var(--card-bg)] hover:border-[var(--text-quaternary)]'}
                `}
                aria-pressed={mode === 'browser'}
              >
                {mode === 'browser' && (
                  <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-system-blue" />
                )}
                <Monitor className="w-8 h-8 text-system-blue mb-3" />
                <h3 className="typo-headline text-[var(--text-primary)] mb-1">Browser Only</h3>
                <p className="typo-caption text-[var(--text-secondary)]">
                  All data stored locally in your browser. No server required. Great for personal use or evaluation.
                </p>
              </button>

              {/* Server Mode */}
              <button
                onClick={() => setMode('server')}
                className={`
                  relative p-5 rounded-2xl border-2 text-left transition-all duration-150
                  ${mode === 'server'
                    ? 'border-system-blue bg-system-blue/5'
                    : 'border-[var(--border-primary)] bg-[var(--card-bg)] hover:border-[var(--text-quaternary)]'}
                `}
                aria-pressed={mode === 'server'}
              >
                {mode === 'server' && (
                  <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-system-blue" />
                )}
                <Cloud className="w-8 h-8 text-system-purple mb-3" />
                <h3 className="typo-headline text-[var(--text-primary)] mb-1">Server Backed</h3>
                <p className="typo-caption text-[var(--text-secondary)]">
                  Python Flask backend with SQLite. Supports SAML SSO, multi-user, and audit logging.
                </p>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
              <Button disabled={!mode} onClick={() => setStep(2)} icon={<ArrowRight />} iconRight>
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Ready */}
        {step === 2 && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-16 h-16 rounded-full bg-system-green/15 mx-auto mb-6 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-system-green" />
            </motion.div>
            <h2 className="typo-title-1 text-[var(--text-primary)] mb-2">You're All Set</h2>
            <p className="typo-body text-[var(--text-secondary)] mb-2">
              {mode === 'browser'
                ? 'Running in browser-only mode. Your data is stored locally.'
                : 'Server mode configured. Connect your Flask backend to enable multi-user features.'}
            </p>
            <p className="typo-callout text-[var(--text-tertiary)] mb-8">
              Press <kbd className="px-1.5 py-0.5 bg-[var(--surface-tertiary)] rounded text-[12px] font-mono">/</kbd> anytime to search across all entities.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button size="lg" onClick={onComplete}>
                Open Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
