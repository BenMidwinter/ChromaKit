import { useState } from 'react'
import { useAppSession } from '../../lib/AppSessionContext'
import { getProfile } from '../../lib/store'
import { usePermissions } from '../../lib/usePermissions'
import ClientProfileOverlay from './ClientProfileOverlay'

export default function ClientDetailsBar({ client, onClientUpdated, embedded = false }) {
  const { refreshClients } = useAppSession()
  const perms = usePermissions(client)
  const [showEdit, setShowEdit] = useState(false)
  const lead = getProfile(client.user_id)

  const items = [
    { label: 'Lead clinician', value: lead?.full_name || 'Unassigned' },
    { label: 'School / setting', value: client.school || '—' },
    { label: 'Diagnosis', value: client.diagnosis || '—' },
    { label: 'Medication', value: client.medication || '—' },
    { label: 'Context', value: client.workplace_id ? client.workplace_name : 'Private practice' },
    { label: 'Status', value: client.is_active ? 'Active' : 'Discharged' },
  ]

  const handleSaved = (updated) => {
    refreshClients?.()
    onClientUpdated?.(updated)
  }

  const bar = (
    <div
      className={[
        'flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3.5 py-2.5',
        embedded ? '' : 'card mb-1 border-b border-line-light bg-transparent',
      ].filter(Boolean).join(' ')}
    >
      <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-1">
        {items.map(item => (
          <div key={item.label} className="flex min-w-0 flex-row items-baseline gap-1.5">
            <span className="whitespace-nowrap text-[0.65rem] font-bold uppercase tracking-wide text-subtle after:content-[':']">
              {item.label}
            </span>
            <span className="text-[0.8125rem] font-semibold text-ink">{item.value}</span>
          </div>
        ))}
      </div>
      {perms.canEditClientDetails && (
        <button
          type="button"
          className="secondary shrink-0 self-center"
          onClick={() => setShowEdit(true)}
        >
          Edit
        </button>
      )}
    </div>
  )

  return (
    <>
      {bar}

      {showEdit && (
        <ClientProfileOverlay
          client={client}
          onClose={() => setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
