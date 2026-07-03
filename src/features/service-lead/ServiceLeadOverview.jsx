import { useOutletContext } from 'react-router-dom'
import LeadDashboard from '../../components/LeadDashboard'

export default function ServiceLeadOverview() {
  const { session, clients, activePersona } = useOutletContext()

  return (
    <LeadDashboard
      scope="organisation"
      userId={session.user.id}
      demoRole={activePersona.role}
      clients={clients}
      blurNames
    />
  )
}
