import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import BodyMap from './BodyMap'
import ClientDetailsBar from './ClientDetailsBar'
import ClientNav from './ClientNav'
import ClientClinicalAlerts from './ClientClinicalAlerts'
import BlurredName from '../../components/BlurredName'
import { usePermissions } from '../../lib/usePermissions'
import { shouldBlurClientIdentity } from '../../lib/demoPersonas'

export default function PatientProfile({ client: initialClient }) {
  const navigate = useNavigate()
  const parentContext = useOutletContext()
  const { activePersona } = parentContext
  const [client, setClient] = useState(initialClient)
  const [showBodyMap, setShowBodyMap] = useState(false)
  const perms = usePermissions(client)
  const blurNames = shouldBlurClientIdentity(activePersona)

  useEffect(() => {
    setClient(initialClient)
  }, [initialClient])

  useEffect(() => {
    const fresh = parentContext.clients?.find(c => c.id === initialClient.id)
    if (fresh) setClient(fresh)
  }, [parentContext.clients, initialClient.id])

  const handleClientUpdated = (updated) => {
    if (updated) setClient(updated)
  }

  const assignmentHint = !perms.canViewFullCaseload && client.workplace_id && client.user_id !== parentContext.session?.user?.id
    ? ' · Assigned to another clinician'
    : ''

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
          <Outlet context={{ ...parentContext, client }} />
        </div>
      </div>

      {showBodyMap && <BodyMap client={client} onClose={() => setShowBodyMap(false)} />}
    </div>
  )
}
