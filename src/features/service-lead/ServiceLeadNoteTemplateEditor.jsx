import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import RichTextEditor from '../../components/RichTextEditor'
import { getAllWorkplaces, getProfile } from '../../lib/store'
import { buildDemoTemplateMergeContext } from '../../lib/demoPersonas'
import { useToast } from '../../components/ui'
import {
  useOrgWorkplacesQuery,
  useProgressNoteTemplateQuery,
  useSaveProgressNoteTemplateMutation,
} from '../../lib/orgQueries'
import OrgConfigBlock from './blocks/OrgConfigBlock'

const DEMO_MERGE_CONTEXT = buildDemoTemplateMergeContext()

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
  const [initialized, setInitialized] = useState(isNew)
  const [errors, setErrors] = useState({})

  const { data: template, isError } = useProgressNoteTemplateQuery(templateId, { enabled: !isNew })
  const { data: workplaces = [] } = useOrgWorkplacesQuery()
  const saveTemplate = useSaveProgressNoteTemplateMutation()
  const clinicianProfile = session?.user?.id ? getProfile(session.user.id) : null

  useEffect(() => {
    if (isNew) {
      setInitialized(true)
      return
    }
    if (!template) return
    setName(template.name)
    setDescription(template.description || '')
    setWorkplaceId(template.workplace_id || '')
    setContent(template.content)
    setIsActive(template.is_active !== false)
    setInitialized(true)
  }, [template, isNew])

  useEffect(() => {
    if (!isNew && isError) {
      navigate('/service-lead/progress-note-templates', { replace: true })
    }
  }, [isNew, isError, navigate])

  const handleSave = async () => {
    if (!name.trim()) {
      setErrors({ name: 'Template name is required.' })
      return
    }
    setErrors({})
    try {
      const saved = await saveTemplate.mutateAsync({
        id: isNew ? undefined : templateId,
        name,
        description,
        workplace_id: workplaceId || null,
        content,
        is_active: isActive,
      })
      navigate(`/service-lead/progress-note-templates/${saved.id}`, { replace: true })
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (!initialized) return null

  return (
    <OrgConfigBlock
      blockId="org_note_template_editor"
      actions={(
        <>
          <button type="button" className="secondary" onClick={() => navigate('/service-lead/progress-note-templates')}>Back</button>
          <button type="button" className="primary" onClick={handleSave} disabled={saveTemplate.isPending}>
            {saveTemplate.isPending ? 'Saving…' : 'Save template'}
          </button>
        </>
      )}
    >
      <div className="card mb-1">
        <div className="form-grid">
          <div className="form-group">
            <label>Template name</label>
            <input
              className="paper-input"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(prev => (prev.name ? { ...prev, name: undefined } : prev)) }}
              aria-invalid={!!errors.name}
              required
            />
            {errors.name && <p className="mt-1 text-[0.8rem] text-secondary">{errors.name}</p>}
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
    </OrgConfigBlock>
  )
}
