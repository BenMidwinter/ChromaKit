import { Navigate, useOutletContext } from 'react-router-dom'
import { ROLES } from '../lib/permissions'
import { usePermissions } from '../lib/usePermissions'
import PageHeader from './PageHeader'
import HomeDashboard from './home/HomeDashboard'

export default function Home() {
  const { session, myWorkplaces, activePersona, demoRole } = useOutletContext()
  const perms = usePermissions()

  if (demoRole === ROLES.SERVICE_LEAD) {
    return <Navigate to="/service-lead" replace />
  }

  return (
    <div className="page page--home">
      <PageHeader title={`Welcome back, ${activePersona.name}`} />
      <HomeDashboard
        session={session}
        myWorkplaces={myWorkplaces}
        activePersona={activePersona}
        demoRole={demoRole}
        blurNames={perms.blurClientIdentity}
      />
    </div>
  )
}
