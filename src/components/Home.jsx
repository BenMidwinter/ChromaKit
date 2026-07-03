import { Navigate, useOutletContext } from 'react-router-dom'
import { ROLES } from '../lib/permissions'
import { usePermissions } from '../lib/usePermissions'
import PageHeader from './PageHeader'
import LeadDashboard from './LeadDashboard'
import ClinicianHome from './ClinicianHome'

export default function Home() {
  const { session, myWorkplace, clients, activePersona, demoRole } = useOutletContext()
  const perms = usePermissions()

  if (demoRole === ROLES.SERVICE_LEAD) {
    return <Navigate to="/service-lead" replace />
  }

  if (demoRole === ROLES.CLINICAL_LEAD && myWorkplace) {
    return (
      <div className="page page--home">
        <PageHeader
          title={`Welcome back, ${activePersona.name}`}
          subtitle={`${myWorkplace.name} — weekly operations, caseload, and upcoming sessions.`}
        />
        <LeadDashboard
          scope="workplace"
          workplaceId={myWorkplace.id}
          workplaceName={myWorkplace.name}
          userId={session.user.id}
          demoRole={demoRole}
          clients={clients}
          blurNames={perms.blurClientIdentity}
        />
      </div>
    )
  }

  return (
    <ClinicianHome
      session={session}
      myWorkplace={myWorkplace}
      clients={clients}
      activePersona={activePersona}
      blurNames={perms.blurClientIdentity}
    />
  )
}
