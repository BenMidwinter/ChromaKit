import { getClientClinicalAlerts } from '../../lib/intakeForm'
import { getSafeguardingAlerts } from '../../lib/safeguardingConcerns'

export default function ClientClinicalAlerts({ clientId }) {
  const alerts = [...getSafeguardingAlerts(clientId), ...getClientClinicalAlerts(clientId)]
  if (!alerts.length) return null

  return (
    <div className="client-clinical-alerts" role="region" aria-label="Clinical and safeguarding alerts">
      {alerts.map(alert => (
        <span
          key={alert.id}
          className={`clinical-alert clinical-alert--${alert.level}`}
          title={alert.source === 'safeguarding' ? 'Open safeguarding concern' : 'From creative care intake form'}
        >
          {alert.label}
        </span>
      ))}
    </div>
  )
}
