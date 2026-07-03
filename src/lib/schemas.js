import { z } from 'zod'
import { APPOINTMENT_TYPES, ATTENDANCE_STATUSES } from './mockData'

/**
 * Validation boundary for everything that writes into the store. Today the store
 * is an in-memory mock; when it becomes a real API these same schemas guard the
 * network seam. Keep schemas permissive on optional fields (the store applies its
 * own defaults) but strict on the identifiers and required inputs a write needs.
 */

const YMD = /^\d{4}-\d{2}-\d{2}$/
const HHMM = /^\d{2}:\d{2}$/

const requiredText = (label) =>
  z.string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)

const optionalText = z.string().trim().optional()
const dateString = z.string().regex(YMD, 'Date must be YYYY-MM-DD.')
const timeString = z.string().regex(HHMM, 'Time must be HH:mm.')

export const clientInputSchema = z.object({
  id: z.string().optional(),
  first_name: requiredText('First name'),
  surname: requiredText('Surname'),
  dob: z.string({ error: 'Date of birth is required.' }).regex(YMD, 'Date of birth must be YYYY-MM-DD.'),
  school: optionalText,
  diagnosis: optionalText,
  medication: optionalText,
  workplace_id: z.string().nullish(),
})

export const progressNoteInputSchema = z
  .object({
    id: z.string().optional(),
    client_id: z.string().optional(),
    appointment_id: z.string().nullish(),
    title: optionalText,
    content: z.string().optional(),
    session_date: dateString.optional(),
    modality_used: z.string().nullish(),
    therapeutic_theme: optionalText,
    artwork_attachments: z.array(z.any()).optional(),
  })
  .refine((p) => Boolean(p.id || p.client_id), {
    message: 'A client is required to create a progress note.',
    path: ['client_id'],
  })

export const workingDocumentInputSchema = z
  .object({
    id: z.string().optional(),
    client_id: z.string().optional(),
    title: optionalText,
    content: z.string().optional(),
  })
  .refine((p) => Boolean(p.id || p.client_id), {
    message: 'A client is required to create a document.',
    path: ['client_id'],
  })

export const letterInputSchema = z
  .object({
    id: z.string().optional(),
    client_id: z.string().optional(),
    title: optionalText,
    content: z.string().optional(),
    recipient: optionalText,
    letter_date: dateString.optional(),
  })
  .refine((p) => Boolean(p.id || p.client_id), {
    message: 'A client is required to create a letter.',
    path: ['client_id'],
  })

export const appointmentInputSchema = z
  .object({
    id: z.string().optional(),
    client_id: z.string().optional(),
    episode_id: z.string().nullish(),
    clinician_id: z.string().nullish(),
    session_date: dateString.optional(),
    start_time: timeString.optional(),
    end_time: timeString.optional(),
    scheduled_at: z.string().optional(),
    duration_minutes: z.coerce.number().positive().optional(),
    appointment_type: z.enum(Object.keys(APPOINTMENT_TYPES)).optional(),
    therapy_modality: z.string().optional(),
    attendance_status: z.enum(Object.keys(ATTENDANCE_STATUSES)).nullish(),
    location: optionalText,
    notes: z.string().optional(),
  })
  .refine((p) => Boolean(p.id || p.client_id), {
    message: 'A client is required to schedule an appointment.',
    path: ['client_id'],
  })
  .refine((p) => Boolean(p.id || p.session_date || p.scheduled_at), {
    message: 'A date is required to schedule an appointment.',
    path: ['session_date'],
  })

/**
 * Parse `data` against `schema`, throwing a single human-readable Error on
 * failure. Existing call sites already surface `err.message`, so validation
 * failures flow straight to the user without new plumbing.
 */
export function parseOrThrow(schema, data, label = 'Input') {
  const result = schema.safeParse(data)
  if (result.success) return result.data
  const issue = result.error.issues[0]
  const where = issue?.path?.length ? `${issue.path.join('.')}: ` : ''
  throw new Error(`${label} — ${where}${issue?.message || 'Invalid input.'}`)
}
