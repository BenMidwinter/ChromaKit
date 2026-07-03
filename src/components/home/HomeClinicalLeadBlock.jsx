import { Link } from 'react-router-dom'
import RoleBlockShell from '../RoleBlockShell'
import BlurredName from '../BlurredName'

function OutcomeBars({ bars }) {
  if (!bars?.length) return null
  return (
    <div className="home-outcomes role-block__outcomes">
      <ul className="home-outcomes__bars">
        {bars.map(bar => (
          <li key={bar.label} className="home-outcomes__bar-row">
            <span className="home-outcomes__bar-label">{bar.label}</span>
            <span className="home-outcomes__bar-track">
              <span className="home-outcomes__bar-fill" style={{ width: `${Math.min(100, bar.pct)}%` }} />
            </span>
            <span className="home-outcomes__bar-pct">{bar.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function HomeClinicalLeadBlock({ data, blurNames }) {
  const { weekLabel, kpis, clientRows, outcomeBars } = data

  return (
    <RoleBlockShell
      blockId="clinical_lead"
      description={weekLabel ? `Working week ${weekLabel}` : undefined}
      actions={(
        <>
          <Link to="/clients" className="role-block__link">All clients</Link>
          <Link to="/reporting" className="role-block__link">Reporting</Link>
        </>
      )}
    >
      {kpis && (
        <div className="role-block__stat-row">
          <div className="role-block__stat">
            <span className="role-block__stat-value">
              {kpis.noteCompliancePct != null ? `${kpis.noteCompliancePct}%` : '—'}
            </span>
            <span className="role-block__stat-label">Notes on time</span>
          </div>
          <div className="role-block__stat">
            <span className="role-block__stat-value role-block__stat-value--warn">{kpis.notesMissing}</span>
            <span className="role-block__stat-label">Missing notes</span>
          </div>
          <div className="role-block__stat">
            <span className="role-block__stat-value">{kpis.notesLate}</span>
            <span className="role-block__stat-label">Late notes</span>
          </div>
          <div className="role-block__stat">
            <span className="role-block__stat-value">{kpis.activeClients}</span>
            <span className="role-block__stat-label">Active clients</span>
          </div>
        </div>
      )}

      <OutcomeBars bars={outcomeBars} />

      <h3 className="role-block__panel-title">Client attendance &amp; documentation this week</h3>
      {clientRows.length === 0 ? (
        <p className="role-block__empty">No sessions recorded this working week yet.</p>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table role-block__table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Sessions</th>
                <th>Attendance</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {clientRows.map(row => (
                <tr key={row.clientId}>
                  <td>
                    <strong>
                      <BlurredName name={row.clientName} blur={blurNames} />
                    </strong>
                  </td>
                  <td>{row.total}</td>
                  <td>
                    {row.attended > 0 && <span className="lead-pill lead-pill--attended">{row.attended} attended</span>}
                    {row.didNotAttend > 0 && <span className="lead-pill lead-pill--dna">{row.didNotAttend} DNA</span>}
                    {row.pending > 0 && <span className="lead-pill lead-pill--pending">{row.pending} pending</span>}
                  </td>
                  <td>
                    {row.notesOnTime > 0 && <span className="lead-pill lead-pill--attended">{row.notesOnTime} on time</span>}
                    {row.notesMissing > 0 && <span className="lead-pill lead-pill--dna">{row.notesMissing} missing</span>}
                    {row.notesLate > 0 && <span className="lead-pill lead-pill--pending">{row.notesLate} late</span>}
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
