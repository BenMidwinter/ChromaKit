import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProgressNoteTemplates } from '../../lib/store'

export default function ServiceLeadNoteTemplates() {
  const navigate = useNavigate()
  const [templates] = useState(() => getProgressNoteTemplates())

  return (
    <div className="service-lead-panel">
      <div className="service-lead-panel__header">
        <div>
          <h2>Progress note templates</h2>
          <p className="text-muted text-small">Standard structures clinicians start from when writing session notes. Use merge fields for client and session details.</p>
        </div>
        <button type="button" className="primary" onClick={() => navigate('/service-lead/progress-note-templates/new')}>
          + New template
        </button>
      </div>

      <div className="card">
        {templates.length === 0 ? (
          <div className="empty-state">No templates yet.</div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Scope</th><th>Description</th><th>Status</th></tr>
              </thead>
              <tbody>
                {templates.map(t => (
                  <tr key={t.id} className="hover-row" onClick={() => navigate(`/service-lead/progress-note-templates/${t.id}`)}>
                    <td><strong>{t.name}</strong></td>
                    <td><span className="badge badge-blue">{t.workplace_name}</span></td>
                    <td className="text-small text-muted">{t.description || '—'}</td>
                    <td>{t.is_active ? <span className="badge badge-green">Active</span> : <span className="badge badge-grey">Inactive</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
