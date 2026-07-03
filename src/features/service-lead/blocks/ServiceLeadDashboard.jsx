import { ORG_OVERVIEW_BLOCK_ORDER } from '../../../lib/orgBlocks'
import { useServiceLeadOverviewQuery } from '../../../lib/orgQueries'
import IdentityVisibilityBanner from '../../../components/IdentityVisibilityBanner'
import OrgPulseBlock from './OrgPulseBlock'
import SitePerformanceBlock from './SitePerformanceBlock'
import ComplianceActivityBlock from './ComplianceActivityBlock'

export default function ServiceLeadDashboard({ session, activePersona }) {
  const { data: overview } = useServiceLeadOverviewQuery(session.user.id)

  if (!overview) return null

  return (
    <div className="service-lead-overview">
      <IdentityVisibilityBanner
        persona={activePersona}
        visibleCount={overview.bannerTotalCount}
        totalCount={overview.bannerTotalCount}
        context="service-lead"
      />

      <div className="role-block-stack">
        {ORG_OVERVIEW_BLOCK_ORDER.map(blockId => {
          if (blockId === 'org_pulse') {
            return <OrgPulseBlock key={blockId} data={overview.pulse} />
          }
          if (blockId === 'site_performance') {
            return <SitePerformanceBlock key={blockId} data={overview.sitePerformance} />
          }
          if (blockId === 'compliance_activity') {
            return <ComplianceActivityBlock key={blockId} data={overview.complianceActivity} />
          }
          return null
        })}
      </div>
    </div>
  )
}
