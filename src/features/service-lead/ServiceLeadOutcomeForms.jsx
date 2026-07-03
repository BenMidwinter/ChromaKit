import ClientSectionPlaceholder from '../client/ClientSectionPlaceholder'
import OrgConfigBlock from './blocks/OrgConfigBlock'

export default function ServiceLeadOutcomeForms() {
  return (
    <OrgConfigBlock blockId="org_outcome_forms">
      <ClientSectionPlaceholder
        title="Outcome form builder"
        description="Create and edit outcome measures (e.g. SDQ, GAD-7, custom scales) for clinicians to complete within client records. Form designer and scoring will connect here when the backend is ready."
        icon="📊"
      />
    </OrgConfigBlock>
  )
}
