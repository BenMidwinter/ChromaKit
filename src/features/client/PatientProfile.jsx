import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSession } from '../../lib/AppSessionContext'
import { useAppClients } from '../../lib/queries'
import BodyMap from './BodyMap'
import ClientDetailsBar from './ClientDetailsBar'
import ClientNav from './ClientNav'
import ClientClinicalAlerts from './ClientClinicalAlerts'
import SafeguardingConcernModal from './SafeguardingConcernModal'
import BlurredName from '../../components/BlurredName'
import ErrorBoundary from '../../components/ErrorBoundary'
import { usePermissions } from '../../lib/usePermissions'
import { shouldBlurClientIdentity } from '../../lib/demoPersonas'
import { getSafeguardingAlerts } from '../../lib/safeguardingConcerns'

export default function PatientProfile({ client: initialClient }) {
  const navigate = useNavigate()
  const { activePersona, session } = useAppSession()
  const { clients } = useAppClients()
  const [client, setClient] = useState(initialClient)
  const [showBodyMap, setShowBodyMap] = useState(false)
  const [showSafeguarding, setShowSafeguarding] = useState(false)
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

  const openConcernCount = getSafeguardingAlerts(client.id).length

  return (
    <div className="page page--client">
      <header className="client-shell__header">
        <div className="client-shell__identity">
          <h1>
            <BlurredName name={client.real_name} blur={blurNames} />
          </h1>
          <p className="client-shell__subtitle">
            DOB {client.dob}{assignmentHint}
          </p>
        </div>

        <ClientDetailsBar
          client={client}
          embedded
          onClientUpdated={handleClientUpdated}
        />

        <div className="client-shell__actions">
          <button
            type="button"
            className="secondary"
            onClick={() => setShowSafeguarding(true)}
          >
            Report safeguarding{openConcernCount > 0 ? ` (${openConcernCount} open)` : ''}
          </button>
          {perms.canUseBodyMap && (
            <button type="button" className="secondary" onClick={() => setShowBodyMap(true)}>Body map</button>
          )}
          <button type="button" className="secondary" onClick={() => navigate('/clients')}>Back</button>
        </div>
      </header>

      <ClientClinicalAlerts clientId={client.id} />

      <div className="client-layout">
        <ClientNav clientId={client.id} client={client} />
        <div className="client-layout__main">
          <Outlet context={{ client }} />
        </div>
      </div>

      {showBodyMap && (
        <ErrorBoundary label="body-map">
          <BodyMap client={client} onClose={() => setShowBodyMap(false)} />
        </ErrorBoundary>
      )}

      {showSafeguarding && (
        <SafeguardingConcernModal
          client={client}
          onClose={() => setShowSafeguarding(false)}
        />
      )}
    </div>
  )
}
