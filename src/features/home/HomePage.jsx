import { Navigate } from 'react-router-dom'
import { ROLES } from '../../lib/permissions'
import { usePermissions } from '../../lib/usePermissions'
import { useAppSession } from '../../lib/AppSessionContext'
import PageHeader from '../../components/PageHeader'
import HomeDashboard from './HomeDashboard'

export default function HomePage() {
  const { session, myWorkplaces, activePersona, demoRole } = useAppSession()
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
