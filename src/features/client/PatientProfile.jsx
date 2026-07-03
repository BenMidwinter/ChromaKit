import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSession } from '../../lib/AppSessionContext'
import { useAppClients } from '../../lib/queries'
import BodyMap from './BodyMap'
import ClientDetailsBar from './ClientDetailsBar'
import ClientNav from './ClientNav'
import ClientClinicalAlerts from './ClientClinicalAlerts'
import BlurredName from '../../components/BlurredName'
import ErrorBoundary from '../../components/ErrorBoundary'
import { usePermissions } from '../../lib/usePermissions'
import { shouldBlurClientIdentity } from '../../lib/demoPersonas'

export default function PatientProfile({ client: initialClient }) {
  const navigate = useNavigate()
  const { activePersona, session } = useAppSession()
  const { clients } = useAppClients()
  const [client, setClient] = useState(initialClient)
  const [showBodyMap, setShowBodyMap] = useState(false)
  const perms = usePermissions(client)
  const blurNames = shouldBlurClientIdentity(activePersona)

  useEffect(() => {
    setClient(initialClient)
  }, [initialClient])

  useEffect(() => {
    const fresh = clients?.find(c => c.id === initialClient.id)
    if (fresh) setClient(fresh)
  }, [clients, initialClient.id])

  const handleClientUpdated = (updated) => {
    if (updated) setClient(updated)
  }

  const assignmentHint = !perms.canViewFullCaseload && client.workplace_id && client.user_id !== session?.user?.id
    ? ' · Assigned to another clinician'
    : ''

  return (
    <div className="page page--client">
      <header className="flex flex-wrap items-stretch border-b-2 border-primary bg-surface">
        <div className="flex min-w-44 flex-col justify-center gap-0.5 border-r border-line-light bg-gradient-to-br from-primary-light to-surface px-3.5 py-2.5">
          <h1 className="m-0 text-[1.2rem] leading-tight">
            <BlurredName name={client.real_name} blur={blurNames} />
          </h1>
          <p className="m-0 text-xs text-subtle">
            DOB {client.dob}{assignmentHint}
          </p>
        </div>

        <ClientDetailsBar
          client={client}
          embedded
          onClientUpdated={handleClientUpdated}
        />

        <div className="ml-auto flex shrink-0 items-center gap-1.5 px-3.5 py-2">
          {perms.canUseBodyMap && (
            <button type="button" className="secondary" onClick={() => setShowBodyMap(true)}>Body map</button>
          )}
          <button type="button" className="secondary" onClick={() => navigate('/clients')}>Back</button>
        </div>
      </header>

      <ClientClinicalAlerts clientId={client.id} />

      <div className="client-layout flex min-h-0 flex-1">
        <ClientNav clientId={client.id} client={client} />
        <div className="client-layout__main min-w-0 flex-1">
          <Outlet context={{ client }} />
        </div>
      </div>

      {showBodyMap && (
        <ErrorBoundary label="body-map">
          <BodyMap client={client} onClose={() => setShowBodyMap(false)} />
        </ErrorBoundary>
      )}
    </div>
  )
}
