import {
  CLIENTS as SEED_CLIENTS,
  BODY_MAPS as SEED_BODY_MAPS,
  CLINICIAN_PROFILES as SEED_PROFILES,
  CLINICIAN_WORKPLACES as SEED_MEMBERSHIPS,
  WORKPLACES as SEED_WORKPLACES,
  WORKPLACE_AUDIT_LOGS as SEED_LOGS,
  MEMBERSHIP_REQUESTS as SEED_MEMBERSHIP_REQUESTS,
  TIMELINE_EVENTS as SEED_TIMELINE,
  PROGRESS_NOTES as SEED_NOTES,
  WORKING_DOCUMENTS as SEED_DOCS,
  EPISODES as SEED_EPISODES,
  LETTERS as SEED_LETTERS,
  APPOINTMENTS as SEED_APPOINTMENTS,
  PROGRESS_NOTE_TEMPLATES as SEED_NOTE_TEMPLATES,
  LETTER_TEMPLATES as SEED_LETTER_TEMPLATES,
  ORG_SERVICES as SEED_ORG_SERVICES,
  CLINICIAN_JOURNAL_ENTRIES as SEED_JOURNAL,
} from '../mockData'

/**
 * Thin data-access layer. This module owns *persistence* only — the mutable
 * collections plus generic CRUD primitives. It knows nothing about business
 * rules, permissions, or validation; domain modules in `../store/` layer those
 * on top. Today the backing store is an in-memory clone of the mock seed data;
 * swapping to a real API/database means changing only this file.
 */

function seed() {
  return {
    clients: structuredClone(SEED_CLIENTS),
    bodyMaps: structuredClone(SEED_BODY_MAPS),
    profiles: structuredClone(SEED_PROFILES),
    memberships: structuredClone(SEED_MEMBERSHIPS),
    workplaces: structuredClone(SEED_WORKPLACES),
    auditLogs: structuredClone(SEED_LOGS),
    membershipRequests: structuredClone(SEED_MEMBERSHIP_REQUESTS),
    timelineEvents: structuredClone(SEED_TIMELINE),
    progressNotes: structuredClone(SEED_NOTES),
    workingDocuments: structuredClone(SEED_DOCS),
    episodes: structuredClone(SEED_EPISODES),
    letters: structuredClone(SEED_LETTERS),
    appointments: structuredClone(SEED_APPOINTMENTS),
    progressNoteTemplates: structuredClone(SEED_NOTE_TEMPLATES),
    letterTemplates: structuredClone(SEED_LETTER_TEMPLATES),
    orgServices: structuredClone(SEED_ORG_SERVICES),
    journalEntries: structuredClone(SEED_JOURNAL),
  }
}

/** Live, mutable collections. Domain modules read/write via `db.<collection>`. */
export const db = seed()

/** Restore every collection to a fresh clone of the seed data. */
export function resetDb() {
  Object.assign(db, seed())
}

export function uid(prefix = 'id') {
  return `${prefix}-${crypto.randomUUID()}`
}

/* ── Generic array primitives ─────────────────────────────────────────────
   Small, intention-revealing accessors so domain modules don't hand-roll the
   same find/index/splice dance. Object-keyed collections (e.g. bodyMaps) are
   accessed directly via `db`. */

export function list(name) {
  return [...db[name]]
}

export function findById(name, id) {
  return db[name].find(record => record.id === id) || null
}

export function insert(name, record) {
  db[name].push(record)
  return record
}

export function replaceById(name, id, next) {
  const idx = db[name].findIndex(record => record.id === id)
  if (idx === -1) return null
  db[name][idx] = next
  return db[name][idx]
}

export function indexOfId(name, id) {
  return db[name].findIndex(record => record.id === id)
}
