import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams, Link, useOutletContext } from 'react-router-dom'
import {
  WorkspaceLayout,
  StickyContextBar,
  SplitWorkspace,
  ClinicalPaper,
} from '../../components/LayoutComponents'
import RichTextEditor from '../../components/RichTextEditor'
import TemplatePicker, { hasMeaningfulEditorContent } from '../../components/TemplatePicker'
import ClinicalInsightsSidebar from './ClinicalInsightsSidebar'
import ArtworkAttachmentZone from './ArtworkAttachmentZone'
import { usePermissions } from '../../lib/usePermissions'
import { buildMergeContext } from '../../lib/mergeFields'
import { MODALITY_OPTIONS } from '../../lib/intakeForm'
import { formatDisplayDate, DEMO_TODAY } from '../../lib/dateArchitecture'
import {
  getProgressNotes,
  getProgressNote,
  getProgressNoteByAppointment,
  getAppointment,
  saveProgressNote,
  getProfile,
  getAvailableProgressNoteTemplates,
  APPOINTMENT_TYPES,
} from '../../lib/store'
import {
  formatAppointmentDateTime,
  formatAppointmentDate,
  sessionDateFromAppointment,
} from '../../lib/appointmentUtils'
import { useToast, useConfirm } from '../../components/ui'
import ErrorBoundary from '../../components/ErrorBoundary'

const RAIL_TABS = {
  INSIGHTS: 'insights',
  HISTORY: 'history',
}

function sortNotesLatestFirst(notes) {
  return [...notes].sort((a, b) =>
    String(b.session_date || '').localeCompare(String(a.session_date || '')),
  )
}

function getDefaultPreviewNote(notes, currentNoteId) {
  const sorted = sortNotesLatestFirst(notes)
  if (!sorted.length) return null
  if (!currentNoteId) return sorted[0]
  const others = sorted.filter(n => n.id !== currentNoteId)
  return others[0] || null
}

function getPreviewableNotes(notes, currentNoteId) {
  const sorted = sortNotesLatestFirst(notes)
  if (!currentNoteId) return sorted
  return sorted.filter(n => n.id !== currentNoteId)
}

function PastCaseNotesPanel({
  previewableNotes,
  previewNote,
  previewNoteId,
  previewIndex,
  onSelectNote,
  onCycle,
}) {
  if (!previewableNotes.length) {
    return (
      <div className="progress-notes-page__preview-empty">
        <p className="text-muted text-small">No earlier notes to preview — this may be the first session record.</p>
      </div>
    )
  }

  const author = previewNote ? getProfile(previewNote.author_id) : null

  return (
    <section className="progress-notes-page__preview" aria-label="Past case notes">
      <div className="progress-notes-page__preview-toolbar">
        <div className="progress-notes-page__preview-toolbar-row">
          <span className="text-small text-muted">
            {previewIndex >= 0 ? `${previewIndex + 1} of ${previewableNotes.length}` : '—'}
          </span>
          <div className="progress-notes-page__preview-nav">
            <button
              type="button"
              className="secondary"
              onClick={() => onCycle(-1)}
              disabled={previewableNotes.length < 2}
              aria-label="Newer note"
            >
              ‹
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => onCycle(1)}
              disabled={previewableNotes.length < 2}
              aria-label="Older note"
            >
              ›
            </button>
          </div>
        </div>

        <select
          className="paper-input progress-notes-page__preview-select"
          value={previewNoteId || ''}
          onChange={e => onSelectNote(e.target.value)}
          aria-label="Choose note to preview"
        >
          {previewableNotes.map(note => (
            <option key={note.id} value={note.id}>
              {note.title} — {formatDisplayDate(note.session_date)}
            </option>
          ))}
        </select>

        <div className="progress-notes-page__preview-tabs" role="tablist" aria-label="Previous notes by date">
          {previewableNotes.map(note => (
            <button
              key={note.id}
              type="button"
              role="tab"
              aria-selected={previewNoteId === note.id}
              className={`progress-notes-page__preview-tab${previewNoteId === note.id ? ' progress-notes-page__preview-tab--active' : ''}`}
              onClick={() => onSelectNote(note.id)}
              title={note.title}
            >
              {formatDisplayDate(note.session_date)}
            </button>
          ))}
        </div>
      </div>

      {previewNote && (
        <div className="progress-notes-page__preview-body">
          <div className="progress-notes-page__preview-meta">
            <strong>{previewNote.title}</strong>
            <span className="text-small text-muted">
              {formatDisplayDate(previewNote.session_date)}
              {author?.full_name && <> · {author.full_name}</>}
            </span>
          </div>
          <div
            className="progress-notes-page__preview-prose clinical-prose"
            dangerouslySetInnerHTML={{ __html: previewNote.content || '' }}
          />
        </div>
      )}
    </section>
  )
}

export default function ProgressNotesPage() {
  return (
    <ErrorBoundary label="progress-notes">
      <ProgressNotesPageContent />
    </ErrorBoundary>
  )
}

function ProgressNotesPageContent() {
  const [searchParams] = useSearchParams()
  const appointmentParam = searchParams.get('appointment')
  const noteParam = searchParams.get('note')
  const navigate = useNavigate()
  const { client, session, refreshClients } = useOutletContext()
  const perms = usePermissions(client)
  const toast = useToast()
  const confirm = useConfirm()

  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [sessionDate, setSessionDate] = useState(DEMO_TODAY)
  const [content, setContent] = useState('<p></p>')
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [previewNoteId, setPreviewNoteId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [prefillReady, setPrefillReady] = useState(false)
  const [editorVersion, setEditorVersion] = useState(0)
  const [modalityUsed, setModalityUsed] = useState('')
  const [therapeuticTheme, setTherapeuticTheme] = useState('')
  const [artworkAttachments, setArtworkAttachments] = useState([])
  const [noteEditor, setNoteEditor] = useState(null)
  const [railTab, setRailTab] = useState(RAIL_TABS.INSIGHTS)

  const linkedAppointment = useMemo(() => {
    if (!appointmentParam || !client?.id) return null
    const appt = getAppointment(appointmentParam)
    if (!appt || appt.client_id !== client.id) return null
    return appt
  }, [appointmentParam, client?.id])

  const isStandalone = !linkedAppointment
  const clinicianProfile = session?.user?.id ? getProfile(session.user.id) : null

  const noteTemplates = useMemo(
    () => getAvailableProgressNoteTemplates(client?.workplace_id),
    [client?.workplace_id],
  )

  const refreshNotes = () => setNotes(getProgressNotes(client?.id))

  useEffect(() => {
    if (client?.id) refreshNotes()
  }, [client?.id])

  useEffect(() => {
    if (noteParam && client?.id && !appointmentParam) {
      const existing = getProgressNote(noteParam)
      if (existing && existing.client_id === client.id) {
        setTitle(existing.title)
        setContent(existing.content)
        setSessionDate(existing.session_date)
        setModalityUsed(existing.modality_used || '')
        setTherapeuticTheme(existing.therapeutic_theme || '')
        setArtworkAttachments(existing.artwork_attachments || [])
        setActiveNoteId(existing.id)
        setPrefillReady(true)
        return
      }
    }

    if (!appointmentParam || !client?.id) {
      if (!noteParam) {
        setTitle('')
        setContent('<p></p>')
        setSessionDate(DEMO_TODAY)
        setModalityUsed('')
        setTherapeuticTheme('')
        setArtworkAttachments([])
        setActiveNoteId(null)
      }
      setPrefillReady(true)
      return
    }

    const appt = linkedAppointment
    if (!appt) {
      setPrefillReady(true)
      return
    }

    const existing = getProgressNoteByAppointment(appointmentParam)
    if (existing) {
      setTitle(existing.title)
      setContent(existing.content)
      setSessionDate(existing.session_date)
      setModalityUsed(existing.modality_used || '')
      setTherapeuticTheme(existing.therapeutic_theme || '')
      setArtworkAttachments(existing.artwork_attachments || [])
      setActiveNoteId(existing.id)
      setPrefillReady(true)
      return
    }

    const typeLabel = APPOINTMENT_TYPES[appt.appointment_type] || 'Session'
    setTitle(`${typeLabel} — ${formatAppointmentDate(appt.scheduled_at)}`)
    setSessionDate(sessionDateFromAppointment(appt.scheduled_at))
    setContent('<p></p>')
    setModalityUsed('')
    setTherapeuticTheme('')
    setArtworkAttachments([])
    setActiveNoteId(null)
    setPrefillReady(true)
  }, [appointmentParam, noteParam, client?.id, linkedAppointment])

  const noteHeading = activeNoteId
    ? (isStandalone ? 'Progress note' : 'Session note')
    : (isStandalone ? 'New progress note' : 'New session note')

  const previewableNotes = useMemo(
    () => getPreviewableNotes(notes, activeNoteId),
    [notes, activeNoteId],
  )

  useEffect(() => {
    const defaultPreview = getDefaultPreviewNote(notes, activeNoteId)
    setPreviewNoteId(defaultPreview?.id ?? null)
  }, [notes, activeNoteId])

  const previewNote = previewNoteId
    ? notes.find(n => n.id === previewNoteId) ?? null
    : null

  const previewIndex = previewNote
    ? previewableNotes.findIndex(n => n.id === previewNote.id)
    : -1

  const cyclePreview = (direction) => {
    if (!previewableNotes.length) return
    const nextIndex = previewIndex === -1
      ? (direction > 0 ? 0 : previewableNotes.length - 1)
      : (previewIndex + direction + previewableNotes.length) % previewableNotes.length
    setPreviewNoteId(previewableNotes[nextIndex].id)
  }

  const mergeContext = useMemo(
    () => buildMergeContext({
      client,
      appointment: linkedAppointment,
      profile: clinicianProfile,
      sessionDate,
    }),
    [client, linkedAppointment, clinicianProfile, sessionDate],
  )

  const applyNoteTemplate = async (template) => {
    if (hasMeaningfulEditorContent(content)) {
      const ok = await confirm({
        title: 'Replace note content?',
        message: 'This replaces the current note content with the selected template.',
        confirmLabel: 'Replace',
      })
      if (!ok) return
    }
    setContent(template.content)
    setEditorVersion(v => v + 1)
  }

  const insertIntoNote = useCallback((text) => {
    if (!noteEditor || noteEditor.isDestroyed) return
    noteEditor.chain().focus().insertContent(`${text} `).run()
  }, [noteEditor])

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please add a title for this note.')
      return
    }
    if (!session?.user?.id) {
      toast.error('Session unavailable — please refresh the page.')
      return
    }
    setSaving(true)
    try {
      const saved = saveProgressNote({
        id: activeNoteId || undefined,
        client_id: client.id,
        appointment_id: linkedAppointment?.id ?? null,
        title: title.trim(),
        content,
        session_date: sessionDate,
        modality_used: modalityUsed || null,
        therapeutic_theme: therapeuticTheme.trim(),
        artwork_attachments: artworkAttachments,
      }, session.user.id)
      setActiveNoteId(saved.id)
      refreshNotes()
      refreshClients?.()
      if (isStandalone && !noteParam) {
        navigate(`/clients/${client.id}/progress-notes?note=${saved.id}`, { replace: true })
      }
    } finally {
      setSaving(false)
    }
  }

  if (!prefillReady) return null

  if (!perms.canWriteProgressNotes) {
    return (
      <div className="progress-notes-page">
        <header className="progress-notes-page__header">
          <div className="progress-notes-page__header-main">
            <button type="button" className="secondary" onClick={() => navigate(`/clients/${client?.id}`)}>
              ← Back to client
            </button>
            <h1>Progress notes</h1>
          </div>
        </header>
        <div className="progress-notes-page__body progress-notes-page__body--centered">
          <div className="permission-notice">
            <p><strong>{perms.roleLabel}s cannot write progress notes.</strong></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <WorkspaceLayout className="progress-notes-page">
      <StickyContextBar
        className="progress-notes-page__header"
        leading={(
          <>
            <button
              type="button"
              className="secondary"
              onClick={() => navigate(
                isStandalone
                  ? `/clients/${client.id}/notes-history`
                  : `/clients/${client.id}/appointments/${linkedAppointment.id}`,
              )}
            >
              {isStandalone ? '← Notes history' : '← Appointment'}
            </button>
            <h1>{noteHeading}</h1>
            <span className="text-small text-muted">{client.real_name}</span>
          </>
        )}
        trailing={(
          <button type="button" className="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save note'}
          </button>
        )}
      />

      {linkedAppointment ? (
        <div className="progress-notes-page__banner linked-record-banner">
          <span className="text-small">
            {formatAppointmentDateTime(linkedAppointment.scheduled_at)}
            {' · '}{APPOINTMENT_TYPES[linkedAppointment.appointment_type]}
            {linkedAppointment.location && ` · ${linkedAppointment.location}`}
          </span>
          <Link to={`/clients/${client.id}/appointments/${linkedAppointment.id}`} className="text-small">
            View appointment
          </Link>
        </div>
      ) : (
        <div className="progress-notes-page__banner progress-notes-page__banner--standalone">
          <span className="text-small text-muted">
            Standalone progress note — not linked to an appointment.
          </span>
        </div>
      )}

      <div className="progress-notes-page__meta-bar" role="group" aria-label="Note metadata">
        <label className="progress-notes-page__meta-field progress-notes-page__meta-field--title">
          <span className="progress-notes-page__meta-label">Title</span>
          <input
            className="progress-notes-page__meta-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Session note title"
          />
        </label>

        <label className="progress-notes-page__meta-field">
          <span className="progress-notes-page__meta-label">Session date</span>
          <input
            type="date"
            className="progress-notes-page__meta-input"
            value={sessionDate}
            onChange={e => setSessionDate(e.target.value)}
          />
        </label>

        <label className="progress-notes-page__meta-field">
          <span className="progress-notes-page__meta-label">Modality</span>
          <select className="progress-notes-page__meta-input" value={modalityUsed} onChange={e => setModalityUsed(e.target.value)}>
            <option value="">Select…</option>
            {MODALITY_OPTIONS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </label>

        <label className="progress-notes-page__meta-field progress-notes-page__meta-field--theme">
          <span className="progress-notes-page__meta-label">Theme</span>
          <input
            className="progress-notes-page__meta-input"
            value={therapeuticTheme}
            onChange={e => setTherapeuticTheme(e.target.value)}
            placeholder="e.g. Bridge / transition"
          />
        </label>

        <div className="progress-notes-page__meta-field progress-notes-page__meta-field--template">
          <TemplatePicker
            templates={noteTemplates}
            onApply={applyNoteTemplate}
            label="Template"
            emptyLabel="Choose template…"
          />
        </div>
      </div>

      <SplitWorkspace
        paneOpen
        className="progress-notes-page__workspace split-layout split-layout--note ck-split ck-split--pane-open"
        main={(
          <main className="split-layout__main progress-notes-page__editor">
            <div className="progress-notes-page__artwork-strip">
              <ArtworkAttachmentZone
                attachments={artworkAttachments}
                onChange={setArtworkAttachments}
              />
            </div>
            <ClinicalPaper variant="letter" className="progress-notes-page__canvas-zone">
              <RichTextEditor
                key={`${activeNoteId || 'new'}-${linkedAppointment?.id || 'standalone'}-${editorVersion}`}
                content={content}
                onChange={setContent}
                variant="a4"
                mode="clinical"
                mergeContext={mergeContext}
                clinicianProfile={clinicianProfile}
                onEditorReady={setNoteEditor}
              />
            </ClinicalPaper>
          </main>
        )}
        accessory={(
          <aside className="split-layout__side progress-notes-page__rail" aria-label="Note context">
          <div className="progress-notes-page__rail-tabs" role="tablist" aria-label="Sidebar views">
            <button
              type="button"
              role="tab"
              aria-selected={railTab === RAIL_TABS.INSIGHTS}
              className={`progress-notes-page__rail-tab${railTab === RAIL_TABS.INSIGHTS ? ' progress-notes-page__rail-tab--active' : ''}`}
              onClick={() => setRailTab(RAIL_TABS.INSIGHTS)}
            >
              Current profile & intake
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={railTab === RAIL_TABS.HISTORY}
              className={`progress-notes-page__rail-tab${railTab === RAIL_TABS.HISTORY ? ' progress-notes-page__rail-tab--active' : ''}`}
              onClick={() => setRailTab(RAIL_TABS.HISTORY)}
            >
              Past Case Notes
            </button>
          </div>

          <div className="progress-notes-page__rail-panel">
            {railTab === RAIL_TABS.INSIGHTS ? (
              <ClinicalInsightsSidebar
                clientId={client.id}
                client={client}
                onInsert={insertIntoNote}
                embedded
              />
            ) : (
              <PastCaseNotesPanel
                previewableNotes={previewableNotes}
                previewNote={previewNote}
                previewNoteId={previewNoteId}
                previewIndex={previewIndex}
                onSelectNote={setPreviewNoteId}
                onCycle={cyclePreview}
              />
            )}
          </div>
        </aside>
        )}
      />
    </WorkspaceLayout>
  )
}
