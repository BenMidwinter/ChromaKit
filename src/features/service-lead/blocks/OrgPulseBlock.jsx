import { Link } from 'react-router-dom'
import RoleBlockShell from '../../../components/RoleBlockShell'

export default function OrgPulseBlock({ data }) {
  const { weekLabel, kpis } = data

  return (
    <RoleBlockShell
      blockId="org_pulse"
      description={weekLabel ? `Working week ${weekLabel}` : undefined}
      actions={(
        <>
          <Link to="/service-lead/workplaces" className="role-block__link">Workplaces</Link>
          <Link to="/service-lead/users" className="role-block__link">Users</Link>
          <Link to="/service-lead/services" className="role-block__link">Services</Link>
          <Link to="/reporting" className="role-block__link">Reporting</Link>
        </>
      )}
    >
      <div className="role-block__stat-row">
        <div className="role-block__stat">
          <span className="role-block__stat-value">{kpis.workplaces}</span>
          <span className="role-block__stat-label">Workplaces</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value">{kpis.clinicians}</span>
          <span className="role-block__stat-label">Clinicians</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value">{kpis.activeClients}</span>
          <span className="role-block__stat-label">Active clients</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value">{kpis.weekAppointments}</span>
          <span className="role-block__stat-label">Sessions this week</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value role-block__stat-value--ok">
            {kpis.attended + kpis.didNotAttend}
          </span>
          <span className="role-block__stat-label">Attendance logged</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value">
            {kpis.noteCompliancePct != null ? `${kpis.noteCompliancePct}%` : '—'}
          </span>
          <span className="role-block__stat-label">Notes on time</span>
        </div>
      </div>
      <p className="text-muted text-small role-block__intro">
        {kpis.attended} attended · {kpis.didNotAttend} DNA · {kpis.pending} pending attendance
        {' · '}
        {kpis.notesOnTime} notes on time · {kpis.notesMissing} missing · {kpis.notesLate} late
      </p>
    </RoleBlockShell>
  )
}
