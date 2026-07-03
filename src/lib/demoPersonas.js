import { ROLES } from './permissions'
import {
  CLINICIAN_PROFILES,
  CLIENTS,
  DEMO_PERSONA_ACCOUNTS,
  DEFAULT_DEMO_PERSONA_ID,
} from './mockData'
import { buildMergeContext } from './mergeFields'

const PERSONA_ROLE_BY_ID = {
  ben: ROLES.CLINICAL_LEAD,
  sarah: ROLES.CLINICIAN,
  daniel: ROLES.SERVICE_LEAD,
  alex: ROLES.ADMINISTRATOR,
}

const PERSONA_LABEL_BY_ID = {
  ben: 'Clinical Lead',
  sarah: 'Clinician',
  daniel: 'Service Lead',
  alex: 'Administrator',
}

/** Named demo identities — drives role switcher & calendar permissions. */
export const DEMO_PERSONAS = Object.entries(DEMO_PERSONA_ACCOUNTS).map(([id, account]) => {
  const profile = CLINICIAN_PROFILES.find(p => p.id === account.userId)
  return {
    id,
    name: account.name,
    role: PERSONA_ROLE_BY_ID[id],
    userId: account.userId,
    jobTitle: profile?.job_title || account.name,
    label: PERSONA_LABEL_BY_ID[id],
    serviceLead: account.serviceLead,
  }
})

export const DEFAULT_PERSONA_ID = DEFAULT_DEMO_PERSONA_ID

export function getPersonaById(personaId) {
  return DEMO_PERSONAS.find(p => p.id === personaId) || DEMO_PERSONAS[0]
}

export function getPersonaForRole(role) {
  return DEMO_PERSONAS.find(p => p.role === role) || null
}

export function getProfileForPersona(persona) {
  if (!persona) return null
  return CLINICIAN_PROFILES.find(p => p.id === persona.userId) || null
}

/** Shared merge-field preview context for template editors (clinical lead + demo client). */
export function buildDemoTemplateMergeContext() {
  const clinicalLead = getPersonaForRole(ROLES.CLINICAL_LEAD)
  const profile = getProfileForPersona(clinicalLead)
  const client = CLIENTS.find(c => c.id === 'client-1')
  return buildMergeContext({
    client: client ? { real_name: client.real_name, dob: client.dob } : undefined,
    appointment: { appointment_type: 'one_to_one', location: 'Oak Academy — music room' },
    profile: profile
      ? {
          full_name: profile.full_name,
          job_title: profile.job_title,
          hcpc_number: profile.hcpc_number,
        }
      : null,
    sessionDate: '2026-06-26',
  })
}

/** Service Lead persona — privacy mask on client-identifying fields. */
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
