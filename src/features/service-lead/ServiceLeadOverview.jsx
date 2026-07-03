import { useOutletContext } from 'react-router-dom'
import ServiceLeadDashboard from './blocks/ServiceLeadDashboard'

export default function ServiceLeadOverview() {
  const { session, activePersona } = useOutletContext()

  return (
    <ServiceLeadDashboard session={session} activePersona={activePersona} />
  )
}
