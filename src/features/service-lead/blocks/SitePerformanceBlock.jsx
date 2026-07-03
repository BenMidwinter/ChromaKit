import { Link } from 'react-router-dom'
import RoleBlockShell from '../../../components/RoleBlockShell'

function AttendancePills({ attended, didNotAttend, pending }) {
  return (
    <span className="lead-attendance-pills">
      {attended > 0 && <span className="lead-pill lead-pill--attended">{attended} attended</span>}
      {didNotAttend > 0 && <span className="lead-pill lead-pill--dna">{didNotAttend} DNA</span>}
      {pending > 0 && <span className="lead-pill lead-pill--pending">{pending} pending</span>}
    </span>
  )
}

export default function SitePerformanceBlock({ data }) {
  const { weekLabel, workplaceRows } = data

  return (
    <RoleBlockShell
      blockId="site_performance"
      description={weekLabel ? `Working week ${weekLabel}` : undefined}
      actions={(
        <>
          <Link to="/service-lead/workplaces" className="role-block__link">Manage workplaces</Link>
          <Link to="/service-lead/users" className="role-block__link">Clinician accounts</Link>
        </>
      )}
    >
      {workplaceRows.length === 0 ? (
        <p className="role-block__empty">No workplace activity recorded this working week.</p>
      ) : (
        <div className="lead-table-wrap">
          <table className="lead-table role-block__table">
            <thead>
              <tr>
                <th>Workplace</th>
                <th>Clinicians</th>
                <th>Active clients</th>
                <th>Sessions</th>
                <th>Attendance</th>
                <th>Notes on time</th>
              </tr>
            </thead>
            <tbody>
              {workplaceRows.map(row => (
                <tr key={row.id}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.clinicians}</td>
                  <td>{row.activeClients}</td>
                  <td>{row.total}</td>
                  <td>
                    <AttendancePills
                      attended={row.attended}
                      didNotAttend={row.didNotAttend}
                      pending={row.pending}
                    />
                  </td>
                  <td>
                    {row.noteCompliancePct != null ? `${row.noteCompliancePct}%` : '—'}
                    {(row.notesMissing > 0 || row.notesLate > 0) && (
                      <span className="lead-table__warn">
                        {row.notesMissing > 0 && ` ${row.notesMissing} missing`}
                        {row.notesLate > 0 && ` ${row.notesLate} late`}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </RoleBlockShell>
  )
}
