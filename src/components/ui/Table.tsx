import { useState, useMemo, type ReactNode } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T, index: number) => ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField?: string
  onRowClick?: (row: T) => void
  selectedIds?: Set<string>
  onSelectionChange?: (ids: Set<string>) => void
  emptyState?: ReactNode
  className?: string
  compact?: boolean
}

type SortDirection = 'asc' | 'desc' | null

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id',
  onRowClick,
  selectedIds,
  onSelectionChange,
  emptyState,
  className = '',
  compact = false,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'))
      if (sortDir === 'desc') setSortKey(null)
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  const toggleSelect = (id: string) => {
    if (!onSelectionChange || !selectedIds) return
    const next = new Set(selectedIds)
    next.has(id) ? next.delete(id) : next.add(id)
    onSelectionChange(next)
  }

  const toggleAll = () => {
    if (!onSelectionChange || !selectedIds) return
    if (selectedIds.size === data.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(data.map((r) => String(r[keyField]))))
    }
  }

  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3'

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] ${className}`}>
      <table className="w-full text-left" role="grid">
        <thead>
          <tr className="border-b-2 border-[var(--border-primary)]">
            {onSelectionChange && (
              <th className={`${cellPadding} w-10`}>
                <input
                  type="checkbox"
                  checked={selectedIds?.size === data.length && data.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded accent-system-blue cursor-pointer"
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  ${cellPadding} typo-subhead font-semibold text-[var(--text-secondary)]
                  bg-[var(--table-header-bg)] select-none
                  ${col.sortable ? 'cursor-pointer hover:text-[var(--text-primary)]' : ''}
                  ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}
                `}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="text-[var(--text-quaternary)]" aria-hidden="true">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => {
            const id = String(row[keyField])
            const isSelected = selectedIds?.has(id)
            return (
              <tr
                key={id}
                className={`
                  border-b border-[var(--border-secondary)] last:border-b-0
                  transition-colors duration-100
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${isSelected ? 'bg-[var(--table-row-selected)]' : 'hover:bg-[var(--table-row-hover)]'}
                `}
                onClick={() => onRowClick?.(row)}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onRowClick?.(row)
                  }
                }}
                role={onRowClick ? 'button' : undefined}
                aria-selected={isSelected}
              >
                {onSelectionChange && (
                  <td className={cellPadding} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => toggleSelect(id)}
                      className="w-4 h-4 rounded accent-system-blue cursor-pointer"
                      aria-label={`Select row ${idx + 1}`}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`
                      ${cellPadding} typo-callout text-[var(--text-primary)]
                      ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}
                    `}
                  >
                    {col.render
                      ? col.render(row[col.key], row, idx)
                      : String(row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
