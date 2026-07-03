import { useNavigate } from 'react-router-dom'
import { useProgressNoteTemplatesQuery } from '../../lib/orgQueries'
import OrgConfigBlock from './blocks/OrgConfigBlock'

export default function ServiceLeadNoteTemplates() {
  const navigate = useNavigate()
  const { data: templates = [] } = useProgressNoteTemplatesQuery()

  return (
    <OrgConfigBlock
      blockId="org_note_templates"
      actions={(
        <button type="button" className="primary" onClick={() => navigate('/service-lead/progress-note-templates/new')}>
          + New template
        </button>
      )}
    >
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
    </OrgConfigBlock>
  )
}
