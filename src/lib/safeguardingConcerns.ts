/** Safeguarding concerns linked via MyConcern reference (demo store). */

type SafeguardingStatus = 'open' | 'closed'

export type SafeguardingConcern = {
  id: string
  client_id: string
  myconcern_ref: string
  status: SafeguardingStatus
  summary: string
  created_at: string
  created_by: string
  closed_at?: string | null
  closed_by?: string | null
}

const concernsByClient = new Map<string, SafeguardingConcern[]>()

function seedIfNeeded(clientId: string) {
  if (concernsByClient.has(clientId)) return
  if (clientId === 'client-1') {
    concernsByClient.set(clientId, [
      {
        id: 'sg-seed-1',
        client_id: clientId,
        myconcern_ref: 'MC-2026-44821',
        status: 'open',
        summary: 'MyConcern Community Reporting Tool submission',
        created_at: '2026-06-20T14:30:00Z',
        created_by: 'Sarah',
        closed_at: null,
        closed_by: null,
      },
    ])
    return
  }
  if (clientId === 'client-4') {
    concernsByClient.set(clientId, [
      {
        id: 'sg-seed-2',
        client_id: clientId,
        myconcern_ref: 'MC-2025-11904',
        status: 'closed',
        summary: 'MyConcern Community Reporting Tool submission',
        created_at: '2025-11-12T09:15:00Z',
        created_by: 'Ben',
        closed_at: '2025-12-02T16:00:00Z',
        closed_by: 'Ben',
      },
      {
        id: 'sg-seed-3',
        client_id: clientId,
        myconcern_ref: 'MC-2026-40112',
        status: 'open',
        summary: 'MyConcern Community Reporting Tool submission',
        created_at: '2026-06-18T11:05:00Z',
        created_by: 'Sarah',
        closed_at: null,
        closed_by: null,
      },
    ])
    return
  }
  concernsByClient.set(clientId, [])
}

export function listSafeguardingConcerns(clientId: string): SafeguardingConcern[] {
  seedIfNeeded(clientId)
  return [...(concernsByClient.get(clientId) || [])]
}

export function addSafeguardingConcern(clientId: string, payload: {
  myconcern_ref: string
  created_by?: string
  summary?: string
}): SafeguardingConcern {
  seedIfNeeded(clientId)
  const list = concernsByClient.get(clientId) || []
  const record: SafeguardingConcern = {
    id: `sg-${Date.now()}-${list.length + 1}`,
    client_id: clientId,
    myconcern_ref: String(payload.myconcern_ref || '').trim(),
    status: 'open',
    summary: payload.summary || 'MyConcern Community Reporting Tool submission',
    created_at: new Date().toISOString(),
    created_by: payload.created_by || 'Clinician',
    closed_at: null,
    closed_by: null,
  }
  concernsByClient.set(clientId, [record, ...list])
  return record
}

export function closeSafeguardingConcern(
  clientId: string,
  concernId: string,
  closedBy: string,
): SafeguardingConcern | null {
  seedIfNeeded(clientId)
  const list = concernsByClient.get(clientId) || []
  const idx = list.findIndex(c => c.id === concernId)
  if (idx === -1) return null
  if (list[idx].status === 'closed') return list[idx]
  list[idx] = {
    ...list[idx],
    status: 'closed',
    closed_at: new Date().toISOString(),
    closed_by: closedBy,
  }
  concernsByClient.set(clientId, [...list])
  return list[idx]
}

/** Open concerns only — for profile header alert chips. */
export function getSafeguardingAlerts(clientId: string) {
  return listSafeguardingConcerns(clientId)
    .filter(concern => concern.status === 'open')
    .map(concern => ({
      id: concern.id,
      label: `Safeguarding open · ${concern.myconcern_ref}`,
      level: 'critical' as const,
      source: 'safeguarding',
    }))
}

export const MYCONCERN_WORKFLOW_STEPS = [
  {
    title: 'Complete the embedded MyConcern form',
    detail: 'The MyConcern Community Reporting Tool sits in an embedded frame on this page — no leaving ChromaKit, no new tab.',
  },
  {
    title: 'Receive a MyConcern reference number',
    detail: 'When the MyConcern submission finishes, MyConcern returns a reference number for the concern.',
  },
  {
    title: 'Paste the reference into ChromaKit on the same page',
    detail: 'Copy that reference into the internal submission field beside the frame. Same screen, zero borders, no swapping between systems.',
  },
  {
    title: 'It appears under Safeguarding as Open',
    detail: 'The reference is stored on the client’s Safeguarding section and tagged Open until a clinical lead or safeguarding lead closes it. Clinicians and admin officers cannot close concerns themselves.',
  },
]
