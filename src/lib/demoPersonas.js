import { ROLES } from './permissions'

/** Named demo identities — drives role switcher & calendar permissions. */
export const DEMO_PERSONAS = [
  {
    id: 'daniel',
    name: 'Daniel',
    role: ROLES.CLINICAL_LEAD,
    userId: 'user-daniel',
    jobTitle: 'Clinical Lead · Music Therapist',
    label: 'Clinical Lead',
  },
  {
    id: 'sarah',
    name: 'Sarah',
    role: ROLES.CLINICIAN,
    userId: 'user-sarah',
    jobTitle: 'Clinician · Art Therapist',
    label: 'Clinician',
  },
  {
    id: 'ben',
    name: 'Ben',
    role: ROLES.SERVICE_LEAD,
    userId: 'user-ben',
    jobTitle: 'Service Lead · Organisation Admin',
    label: 'Service Lead',
  },
  {
    id: 'alex',
    name: 'Alex',
    role: ROLES.ADMINISTRATOR,
    userId: 'user-alex',
    jobTitle: 'Administrator · Operations',
    label: 'Administrator',
  },
]

export const DEFAULT_PERSONA_ID = 'daniel'

export function getPersonaById(personaId) {
  return DEMO_PERSONAS.find(p => p.id === personaId) || DEMO_PERSONAS[0]
}

/** Service Lead (Ben) — privacy mask on client-identifying fields. */
export function shouldBlurClientIdentity(persona) {
  return persona?.role === ROLES.SERVICE_LEAD
}

export function getPersonaVisibilitySummary(persona, visibleCount, totalCount) {
  const hidden = totalCount - visibleCount

  if (persona.role === ROLES.SERVICE_LEAD) {
    return {
      tone: 'restricted',
      message: `Viewing all ${totalCount} scheduled session${totalCount === 1 ? '' : 's'} — client names are blurred in Service Lead view. Aggregate counts remain visible.`,
    }
  }

  if (hidden <= 0) {
    return {
      tone: 'open',
      message: `Viewing all ${totalCount} scheduled session${totalCount === 1 ? '' : 's'} as ${persona.name} (${persona.label}).`,
    }
  }

  if (persona.role === ROLES.CLINICIAN) {
    return {
      tone: 'restricted',
      message: `Showing ${visibleCount} of ${totalCount} sessions — ${hidden} hidden (assigned to other clinicians). ${persona.name} only sees her caseload calendar.`,
    }
  }

  if (persona.role === ROLES.CLINICAL_LEAD) {
    return {
      tone: 'open',
      message: `Showing ${visibleCount} of ${totalCount} sessions — full team schedule visible to ${persona.name} (${persona.label}).`,
    }
  }

  return {
    tone: 'restricted',
    message: `Showing ${visibleCount} of ${totalCount} sessions — ${hidden} restricted by role.`,
  }
}
