import { Navigate, useOutletContext } from 'react-router-dom'
import { ROLES } from '../lib/permissions'
import { usePermissions } from '../lib/usePermissions'
import PageHeader from './PageHeader'
import HomeDashboard from './home/HomeDashboard'

export default function Home() {
  const { session, myWorkplace, clients, activePersona, demoRole } = useOutletContext()
  const perms = usePermissions()

  if (demoRole === ROLES.SERVICE_LEAD) {
    return <Navigate to="/service-lead" replace />
  }

  const subtitle = myWorkplace
    ? `${myWorkplace.name} · ${perms.roleLabel} overview`
    : `${perms.roleLabel} overview`

  return (
    <div className="page page--home">
      <PageHeader
        title={`Welcome back, ${activePersona.name}`}
        subtitle={subtitle}
      />
      <HomeDashboard
        session={session}
        myWorkplace={myWorkplace}
        clients={clients}
        activePersona={activePersona}
        demoRole={demoRole}
        blurNames={perms.blurClientIdentity}
      />
    </div>
  )
}
