import ClientSectionPlaceholder from '../../components/ClientSectionPlaceholder'

export default function ServiceLeadOutcomeForms() {
  return (
    <div className="service-lead-panel">
      <div className="service-lead-panel__header">
        <h2>Outcome forms & measures</h2>
        <p className="text-muted text-small">Configure standardised outcome tools assigned to workplaces and client records.</p>
      </div>
      <ClientSectionPlaceholder
        title="Outcome form builder"
        description="Create and edit outcome measures (e.g. SDQ, GAD-7, custom scales) for clinicians to complete within client records. Form designer and scoring will connect here when the backend is ready."
        icon="📊"
      />
    </div>
  )
}
