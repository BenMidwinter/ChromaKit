import { useMemo, useState } from 'react'

/**
 * Universal tabular list for client records, caseload, and org data.
 *
 * @param {{ key: string, label: string, className?: string, hideOnMobile?: boolean, filter?: { type: 'text' | 'select', placeholder?: string, allLabel?: string } }[]} columns
 * @param {{ id: string, cells: Record<string, React.ReactNode>, filterValues?: Record<string, string>, muted?: boolean }[]} rows
 */
export default function RecordTable({
  columns,
  rows,
  emptyMessage = 'Nothing to show yet.',
  filteredEmptyMessage = 'No rows match the current filters.',
  onRowClick,
  selectedId = null,
  className = '',
}) {
  const filterableColumns = useMemo(
    () => columns.filter(col => col.filter),
    [columns],
  )

  const [filters, setFilters] = useState(() =>
    Object.fromEntries(filterableColumns.map(col => [col.key, ''])),
  )

  const selectOptions = useMemo(() => {
    const options = {}
    filterableColumns.forEach(col => {
      if (col.filter?.type !== 'select') return
      const values = new Set()
      rows.forEach(row => {
        const value = row.filterValues?.[col.key]?.trim()
        if (value) values.add(value)
      })
      options[col.key] = [...values].sort((a, b) => a.localeCompare(b))
    })
    return options
  }, [rows, filterableColumns])

  const filteredRows = useMemo(() => {
    if (!filterableColumns.length) return rows
    return rows.filter(row =>
      filterableColumns.every(col => {
        const filterValue = filters[col.key]?.trim()
        if (!filterValue) return true
        const rowValue = (row.filterValues?.[col.key] || '').trim()
        if (col.filter?.type === 'select') {
          return rowValue.toLowerCase() === filterValue.toLowerCase()
        }
        return rowValue.toLowerCase().includes(filterValue.toLowerCase())
      }),
    )
  }, [rows, filters, filterableColumns])

  const hasActiveFilters = Object.values(filters).some(Boolean)
  const displayRows = filteredRows
  const displayEmptyMessage = rows.length && !displayRows.length && hasActiveFilters
    ? filteredEmptyMessage
    : emptyMessage

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const renderHeader = () => (
    <thead>
      <tr>
        {columns.map(col => (
          <th
            key={col.key}
            className={col.className || (col.hideOnMobile ? 'record-table__col--hide-mobile' : undefined)}
          >
            {col.label}
          </th>
        ))}
      </tr>
      {filterableColumns.length > 0 && (
        <tr className="record-table__filter-row">
          {columns.map(col => {
            if (!col.filter) {
              return (
                <th
                  key={`filter-${col.key}`}
                  className={col.className || (col.hideOnMobile ? 'record-table__col--hide-mobile' : undefined)}
                  aria-hidden
                />
              )
            }

            const filterClass = col.className || (col.hideOnMobile ? 'record-table__col--hide-mobile' : undefined)

            if (col.filter.type === 'select') {
              return (
                <th key={`filter-${col.key}`} className={filterClass}>
                  <label className="record-table__filter">
                    <span className="sr-only">Filter {col.label}</span>
                    <select
                      className="record-table__filter-input"
                      value={filters[col.key] || ''}
                      onChange={e => updateFilter(col.key, e.target.value)}
                      onClick={e => e.stopPropagation()}
                    >
                      <option value="">{col.filter.allLabel || 'All'}</option>
                      {(selectOptions[col.key] || []).map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </th>
              )
            }

            return (
              <th key={`filter-${col.key}`} className={filterClass}>
                <label className="record-table__filter">
                  <span className="sr-only">Filter {col.label}</span>
                  <input
                    type="search"
                    className="record-table__filter-input"
                    value={filters[col.key] || ''}
                    onChange={e => updateFilter(col.key, e.target.value)}
                    placeholder={col.filter.placeholder || 'Filter…'}
                    onClick={e => e.stopPropagation()}
                  />
                </label>
              </th>
            )
          })}
        </tr>
      )}
    </thead>
  )

  if (!rows.length) {
    return (
      <div className={`record-table-wrap ${className}`.trim()}>
        <table className="record-table">
          {renderHeader()}
          <tbody>
            <tr>
              <td colSpan={columns.length} className="record-table__empty">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={`record-table-wrap ${className}`.trim()}>
      <table className="record-table">
        {renderHeader()}
        <tbody>
          {!displayRows.length ? (
            <tr>
              <td colSpan={columns.length} className="record-table__empty">
                {displayEmptyMessage}
              </td>
            </tr>
          ) : displayRows.map(row => {
            const clickable = Boolean(onRowClick)
            const selected = selectedId != null && row.id === selectedId
            return (
              <tr
                key={row.id}
                className={[
                  clickable ? 'record-table__row--clickable' : '',
                  selected ? 'record-table__row--selected' : '',
                  row.muted ? 'record-table__row--muted' : '',
                ].filter(Boolean).join(' ') || undefined}
                onClick={clickable ? () => onRowClick(row) : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={clickable ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onRowClick(row)
                  }
                } : undefined}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={col.className || (col.hideOnMobile ? 'record-table__col--hide-mobile' : undefined)}
                  >
                    {row.cells[col.key]}
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
