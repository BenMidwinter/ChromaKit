import { useAppSession } from '../../lib/AppSessionContext'
import ServiceLeadDashboard from './blocks/ServiceLeadDashboard'

export default function ServiceLeadOverview() {
  const { session, activePersona } = useAppSession()

  return (
    <ServiceLeadDashboard session={session} activePersona={activePersona} />
  )
}
