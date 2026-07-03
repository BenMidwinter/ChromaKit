import { normalizeRole } from '../lib/permissions'

function formatRole(role) {
  return normalizeRole(role).replace(/_/g, ' ')
}

export default function WorkplaceContextPicker({ workplaces, value, onChange, compact = false }) {
  if (!workplaces?.length || workplaces.length < 2) return null

  if (compact) {
    return (
      <div className="page-header__filter page-header__filter--grow workplace-context-picker--compact">
        <label htmlFor="workplace-context">Context</label>
        <select
          id="workplace-context"
          className="paper-input"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        >
          {workplaces.map(wp => (
            <option key={wp.id} value={wp.id}>
              {wp.name} ({formatRole(wp.role)})
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="workplace-context-picker card mb-1">
      <div className="workplace-context-picker__field">
        <label htmlFor="workplace-context">Workplace context</label>
        <select
          id="workplace-context"
          className="paper-input"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        >
          {workplaces.map(wp => (
            <option key={wp.id} value={wp.id}>
              {wp.name} ({formatRole(wp.role)})
            </option>
          ))}
        </select>
      </div>
      <p className="text-small text-muted workplace-context-picker__hint">
        Switch between workplaces to view each team and caseload. Your role may differ at each site.
      </p>
    </div>
  )
}
