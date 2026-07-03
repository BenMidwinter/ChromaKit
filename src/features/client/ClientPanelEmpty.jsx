import { useParams, useOutletContext } from 'react-router-dom'
import ClientTimeline from './ClientTimeline'
import ClientClinicalProfileSummary from './ClientClinicalProfileSummary'
import { getClientTimeline } from '../../lib/store'

export default function ClientPanelEmpty() {
  const { id: clientId } = useParams()
  const { client } = useOutletContext()
  const timeline = getClientTimeline(clientId)

  return (
    <div className="client-overview">
      <section className="client-overview__profile" aria-label="Clinical profile">
        <ClientClinicalProfileSummary client={client} />
      </section>
      <section className="client-overview__timeline" aria-label="Client timeline">
        <ClientTimeline events={timeline} orientation="horizontal" />
      </section>
    </div>
  )
}
