import { ROLES, normalizeRole } from './permissions'

/** Home stacked blocks — top to bottom. */
export const ROLE_BLOCK_ORDER = ['clinician', 'administrator', 'clinical_lead']

export const ROLE_BLOCK_META = {
  clinician: {
    id: 'clinician',
    label: 'Clinician',
    title: 'Your practice',
    description: 'Your upcoming sessions and active cases.',
  },
  administrator: {
    id: 'administrator',
    label: 'Administrator',
    title: 'Team operations',
    description: 'Workplace-wide sessions, cases, and attendance.',
  },
  clinical_lead: {
    id: 'clinical_lead',
    label: 'Clinical Lead',
    title: 'Clinical oversight',
    description: 'Documentation compliance, outcomes, and caseload quality.',
  },
}

/**
 * Home: clinicians see personal block only; administrators see team ops;
 * clinical leads see all three (personal, team ops, oversight).
 */
export function getVisibleHomeBlocks(personaRole) {
  const role = normalizeRole(personaRole)
  if (role === ROLES.CLINICAL_LEAD) return [...ROLE_BLOCK_ORDER]
  if (role === ROLES.ADMINISTRATOR) return ['administrator']
  return ['clinician']
}

/**
 * Workplace: clinicians get a read-only team roster (+ join other sites).
 * Administrators and clinical leads share the management block.
 */
export function getVisibleWorkplaceBlocks(effectiveRole) {
  const role = normalizeRole(effectiveRole)
  if (role === ROLES.CLINICIAN) return ['clinician']
  return ['administrator']
}

export const WORKPLACE_MEMBERSHIP_ROLES = [
  { value: ROLES.CLINICIAN, label: 'Clinician' },
  { value: ROLES.ADMINISTRATOR, label: 'Administrator' },
  { value: ROLES.CLINICAL_LEAD, label: 'Clinical Lead' },
]
