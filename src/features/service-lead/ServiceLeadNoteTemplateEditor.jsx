import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import RichTextEditor from '../../components/RichTextEditor'
import {
  getProgressNoteTemplate,
  saveProgressNoteTemplate,
  getAllWorkplaces,
  getProfile,
} from '../../lib/store'
import { buildMergeContext } from '../../lib/mergeFields'
import { useToast } from '../../components/ui'

const DEMO_MERGE_CONTEXT = buildMergeContext({
  client: { real_name: 'Alex Johnson', dob: '2008-04-12' },
  appointment: { appointment_type: 'one_to_one', location: 'Oak Academy — music room' },
  profile: { full_name: 'Ben Midwinter', job_title: 'Music Therapist', hcpc_number: 'MT12345' },
  sessionDate: '2026-06-26',
})

export default function ServiceLeadNoteTemplateEditor() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const { session } = useOutletContext()
  const toast = useToast()
  const isNew = templateId === 'new'

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [workplaceId, setWorkplaceId] = useState('')
  const [content, setContent] = useState('<p></p>')
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ready, setReady] = useState(isNew)

  const workplaces = useMemo(() => getAllWorkplaces(), [])
  const clinicianProfile = session?.user?.id ? getProfile(session.user.id) : null

  useEffect(() => {
    if (isNew) {
      setReady(true)
      return
    }
    const tpl = getProgressNoteTemplate(templateId)
    if (!tpl) {
      navigate('/service-lead/progress-note-templates', { replace: true })
      return
    }
    setName(tpl.name)
    setDescription(tpl.description || '')
    setWorkplaceId(tpl.workplace_id || '')
    setContent(tpl.content)
    setIsActive(tpl.is_active !== false)
    setReady(true)
  }, [templateId, isNew, navigate])

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Template name is required.')
      return
    }
    setSaving(true)
    try {
      const saved = saveProgressNoteTemplate({
        id: isNew ? undefined : templateId,
        name,
        description,
        workplace_id: workplaceId || null,
        content,
        is_active: isActive,
      })
      navigate(`/service-lead/progress-note-templates/${saved.id}`, { replace: true })
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return null

  return (
    <div className="service-lead-panel">
      <div className="service-lead-panel__header">
        <div>
          <h2>{isNew ? 'New progress note template' : 'Edit progress note template'}</h2>
          <p className="text-muted text-small">Use the {'{ }'} menu to insert merge fields. Preview values below are sample data.</p>
        </div>
        <div className="service-lead-panel__header-actions">
          <button type="button" className="secondary" onClick={() => navigate('/service-lead/progress-note-templates')}>Back</button>
          <button type="button" className="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save template'}</button>
        </div>
      </div>

      <div className="card mb-1">
        <div className="form-grid">
          <div className="form-group">
            <label>Template name</label>
            <input className="paper-input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Scope</label>
            <select className="paper-input" value={workplaceId} onChange={e => setWorkplaceId(e.target.value)}>
              <option value="">All workplaces</option>
              {workplaces.map(wp => (
                <option key={wp.id} value={wp.id}>{wp.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <input className="paper-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="When should clinicians use this template?" />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
              Active (available to clinicians)
            </label>
          </div>
        </div>
      </div>

      <RichTextEditor
        key={templateId}
        content={content}
        onChange={setContent}
        variant="a4"
        mode="clinical"
        mergeContext={DEMO_MERGE_CONTEXT}
        clinicianProfile={clinicianProfile}
      />
    </div>
  )
}
