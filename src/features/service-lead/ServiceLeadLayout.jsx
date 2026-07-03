import { Outlet, useOutletContext, useLocation } from 'react-router-dom'
import { ROLES } from '../../lib/permissions'
import { getServiceLeadPageMeta } from '../../lib/serviceLeadPages'
import PageHeader from '../../components/PageHeader'
import ServiceLeadNav from './ServiceLeadNav'

export default function ServiceLeadLayout() {
  const parentContext = useOutletContext()
  const { demoRole } = parentContext || {}
  const location = useLocation()
  const pageMeta = getServiceLeadPageMeta(location.pathname)

  if (demoRole !== ROLES.SERVICE_LEAD) {
    return (
      <div className="page">
        <PageHeader
          title="Service Lead"
          subtitle="Organisation administration and oversight."
        />
        <div className="permission-notice">
          <p><strong>Access restricted.</strong></p>
          <p className="text-subtle text-[0.85rem]">
            Select <strong>Ben — Service Lead</strong> from the profile switcher in the top right to access these tools.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page page--service-lead">
      <PageHeader
        bleed={false}
        title={pageMeta.title}
        subtitle={pageMeta.subtitle}
      />
      <ServiceLeadNav />
      <div className="service-lead-outlet">
        <Outlet context={parentContext} />
      </div>
    </div>
  )
}
