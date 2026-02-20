# OpenIPAM V2

**IP Address Management & CMDB Dashboard** — A complete UI redesign following Apple Human Interface Guidelines with Liquid Glass design principles.

Built with React 19, TypeScript, Tailwind CSS v4, Framer Motion, and Recharts.

![OpenIPAM V2](https://img.shields.io/badge/version-2.0.0-blue) ![React](https://img.shields.io/badge/React-19-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4)

## Features

### Network Management
- **IP Addresses** — Full CRUD with conflict detection, status tracking, MAC/DNS linking
- **Subnets** — CIDR-based management with capacity visualization and auto IP linking
- **VLANs** — 9 types (Data, Voice, Management, DMZ, Guest, IoT, Storage, Backup, Native)
- **DHCP** — Scope management, lease tracking, static reservations

### Infrastructure (CMDB)
- **Hosts** — 14 host types with hardware lifecycle, resource monitoring, favorites
- **Locations** — Datacenter/building/room/rack hierarchy
- **Templates** — Pre-configured subnet templates for quick provisioning

### Operations
- **Dashboard** — Real-time utilization charts, conflict alerts, recent activity
- **Global Search** — Instant cross-entity search with keyboard navigation (`/` or `Cmd+K`)
- **Audit Log** — Full change history with user attribution and filtering
- **Settings** — Theme, data export/import, backend configuration

### Design System
- Apple HIG typography scale (Large Title through Caption)
- Liquid Glass blur effects with depth cues
- Light / Dark / System theme with CSS custom properties
- Framer Motion micro-interactions (spring physics, layout animations)
- Staggered reveal animations for lists and grids
- WCAG AA compliant color contrast

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Architecture

```
src/
├── components/
│   ├── layout/          Sidebar, AppLayout, PageHeader
│   └── ui/              Button, Badge, Card, Modal, Toast, Table,
│                        Input, Select, Skeleton, EmptyState,
│                        StatusBadge, ProgressRing, SearchOverlay
├── screens/             All application screens
│   ├── Onboarding       Welcome flow with mode selection
│   ├── Dashboard        Stats, charts, alerts, activity feed
│   ├── IPAddresses      Primary task screen with filters & actions
│   ├── DetailView       Host/Subnet/VLAN detail pages
│   ├── Hosts            Host inventory management
│   ├── Subnets          Subnet management with capacity bars
│   ├── VLANs            VLAN management
│   ├── DHCP             Tabbed DHCP management
│   ├── Locations        Location cards
│   ├── Templates        Subnet template gallery
│   ├── AuditLog         Filterable audit history
│   └── Settings         App configuration
├── hooks/               useTheme, useBreakpoint, useReducedMotion, useKeyboardShortcuts
├── types/               TypeScript interfaces for all entities
└── data/                Mock data for development
```

## Key Screens

| Screen | Purpose |
|--------|---------|
| **Onboarding** | Welcome flow, mode selection (Browser/Server), feature tour |
| **Dashboard** | Stat cards, IP utilization donut, conflict alerts, subnet capacity bars, activity timeline |
| **IP Addresses** | Filterable/sortable table with search, bulk actions, create/edit modals, context menus |
| **Detail View** | Entity attributes, related records, resource meters, audit history, lifecycle info |
| **Settings** | Theme toggle, data import/export, server config, SAML status |
| **Search** | Global overlay with grouped results, keyboard navigation, type icons |
| **Action Completion** | Toast notifications for CRUD operations |
| **Error/Empty** | 404, no data, invalid filters, backend offline states |

## Component Library

### Buttons
- **Primary** — Filled blue, for main actions (Create Subnet, Add Host)
- **Secondary** — Gray fill, for supporting actions (Export, Cancel)
- **Ghost** — Transparent, for tertiary actions (Clear Filters, Back)
- **Destructive** — Red fill, for destructive actions (Delete)
- **Outline** — Bordered, for alternative actions

### Data Display
- **Table** — Sortable columns, row selection, keyboard navigation
- **Card** — Glass and solid variants with hover states
- **Badge** — Status indicators with dot and color variants
- **ProgressRing** — SVG donut chart for utilization
- **CapacityBar** — Segmented bar for subnet capacity

### Feedback
- **Toast** — Animated notifications (success, error, warning, info)
- **Modal** — Focus-trapped dialogs with backdrop blur
- **Skeleton** — Shimmer loading states for cards and tables
- **EmptyState** — Contextual illustrations with CTAs

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation with visible focus indicators
- `prefers-reduced-motion` respected
- WCAG AA color contrast ratios
- Semantic HTML with proper ARIA roles
- Screen reader announcements via `aria-live` regions

## Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| `< 768px` | Collapsed sidebar, stacked cards, single-column tables |
| `768 — 1024px` | Compact sidebar, 2-column grid |
| `1024 — 1440px` | Full sidebar, 3-column grid |
| `> 1440px` | Wide layout with expanded content areas |

## Tech Stack

- **React 19** + **TypeScript 5.9**
- **Vite 7** — Build tool
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Animations & micro-interactions
- **Recharts** — Data visualization
- **Lucide React** — Icon system
- **React Router v7** — Client-side routing

## Backend Compatibility

This frontend is designed to work with the OpenIPAM Flask backend. Configure the server URL in Settings to enable:

- Microsoft SAML SSO authentication
- Multi-user collaboration
- Server-side SQLite persistence
- User-attributed audit logging

## License

MIT
