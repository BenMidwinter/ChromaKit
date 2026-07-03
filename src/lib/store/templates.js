import { db, uid } from '../data/collections'

/* ── Progress note templates ──────────────────────────────────────────── */

export function getProgressNoteTemplates() {
  return [...db.progressNoteTemplates].sort((a, b) => a.name.localeCompare(b.name))
}

export function getAvailableProgressNoteTemplates(workplaceId) {
  return getProgressNoteTemplates().filter(
    t => t.is_active !== false && (!t.workplace_id || t.workplace_id === workplaceId),
  )
}

export function getProgressNoteTemplate(templateId) {
  return db.progressNoteTemplates.find(t => t.id === templateId) || null
}

export function saveProgressNoteTemplate(payload) {
  const now = new Date().toISOString()
  const workplace = payload.workplace_id
    ? db.workplaces.find(w => w.id === payload.workplace_id)
    : null

  if (payload.id) {
    const idx = db.progressNoteTemplates.findIndex(t => t.id === payload.id)
    if (idx === -1) throw new Error('Template not found')
    db.progressNoteTemplates[idx] = {
      ...db.progressNoteTemplates[idx],
      name: payload.name?.trim() || db.progressNoteTemplates[idx].name,
      description: payload.description ?? '',
      workplace_id: payload.workplace_id || null,
      workplace_name: workplace?.name || 'All workplaces',
      content: payload.content ?? db.progressNoteTemplates[idx].content,
      is_active: payload.is_active ?? db.progressNoteTemplates[idx].is_active,
      updated_at: now,
    }
    return db.progressNoteTemplates[idx]
  }

  const created = {
    id: uid('pnt'),
    name: payload.name?.trim() || 'Untitled template',
    description: payload.description || '',
    workplace_id: payload.workplace_id || null,
    workplace_name: workplace?.name || 'All workplaces',
    content: payload.content || '<p></p>',
    is_active: payload.is_active ?? true,
    created_at: now,
    updated_at: now,
  }
  db.progressNoteTemplates.push(created)
  return created
}

/* ── Letter templates ─────────────────────────────────────────────────── */

export function getLetterTemplates() {
  return [...db.letterTemplates].sort((a, b) => a.name.localeCompare(b.name))
}

export function getAvailableLetterTemplates(workplaceId) {
  return getLetterTemplates().filter(
    t => t.is_active !== false && (!t.workplace_id || t.workplace_id === workplaceId),
  )
}

export function getLetterTemplate(templateId) {
  return db.letterTemplates.find(t => t.id === templateId) || null
}

export function saveLetterTemplate(payload) {
  const now = new Date().toISOString()
  const workplace = payload.workplace_id
    ? db.workplaces.find(w => w.id === payload.workplace_id)
    : null

  if (payload.id) {
    const idx = db.letterTemplates.findIndex(t => t.id === payload.id)
    if (idx === -1) throw new Error('Template not found')
    db.letterTemplates[idx] = {
      ...db.letterTemplates[idx],
      name: payload.name?.trim() || db.letterTemplates[idx].name,
      description: payload.description ?? '',
      workplace_id: payload.workplace_id || null,
      workplace_name: workplace?.name || 'All workplaces',
      content: payload.content ?? db.letterTemplates[idx].content,
      is_active: payload.is_active ?? db.letterTemplates[idx].is_active,
      updated_at: now,
    }
    return db.letterTemplates[idx]
  }

  const created = {
    id: uid('lt'),
    name: payload.name?.trim() || 'Untitled template',
    description: payload.description || '',
    workplace_id: payload.workplace_id || null,
    workplace_name: workplace?.name || 'All workplaces',
    content: payload.content || '<p></p>',
    is_active: payload.is_active ?? true,
    created_at: now,
    updated_at: now,
  }
  db.letterTemplates.push(created)
  return created
}
