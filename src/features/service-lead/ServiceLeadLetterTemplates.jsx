import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLetterTemplates } from '../../lib/store'

export default function ServiceLeadLetterTemplates() {
  const navigate = useNavigate()
  const [templates] = useState(() => getLetterTemplates())

  return (
    <div className="service-lead-panel">
      <div className="service-lead-panel__header">
        <div>
          <h2>Letter templates</h2>
          <p className="text-muted text-small">Reusable letter structures for GPs, schools, referrers, and discharge summaries.</p>
        </div>
        <button type="button" className="primary" onClick={() => navigate('/service-lead/letter-templates/new')}>
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
                  <tr key={t.id} className="hover-row" onClick={() => navigate(`/service-lead/letter-templates/${t.id}`)}>
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
