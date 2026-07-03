import { Outlet, useOutletContext } from 'react-router-dom'
import { ROLES } from '../../lib/permissions'
import ServiceLeadNav from './ServiceLeadNav'

export default function ServiceLeadLayout() {
  const parentContext = useOutletContext()
  const { demoRole } = parentContext || {}

  if (demoRole !== ROLES.SERVICE_LEAD) {
    return (
      <div className="page">
        <header className="border-b border-line-light bg-surface px-7 pb-4 pt-5">
          <h1 className="m-0 text-[1.35rem] text-accent">Service Lead</h1>
          <p className="mt-[0.35rem] mb-0 text-[0.9375rem] text-subtle">Organisation administration and oversight.</p>
        </header>
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
      <header className="border-b border-line-light bg-surface px-7 pb-4 pt-5">
        <h1 className="m-0 text-[1.35rem] text-accent">Service Lead</h1>
        <p className="mt-[0.35rem] mb-0 text-[0.9375rem] text-subtle">Organisation oversight — workplaces, compliance, and configuration.</p>
      </header>
      <ServiceLeadNav />
      <div className="min-w-0 flex-1 bg-page px-7 pb-8 max-md:pb-6">
        <Outlet context={parentContext} />
      </div>
    </div>
  )
}
