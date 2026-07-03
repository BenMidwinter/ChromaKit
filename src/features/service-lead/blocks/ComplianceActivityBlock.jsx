import { Link } from 'react-router-dom'
import { formatDisplayDate } from '../../../lib/dateArchitecture'
import RoleBlockShell from '../../../components/RoleBlockShell'

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

export default function ComplianceActivityBlock({ data }) {
  const {
    outcomeBars,
    exceptions,
    sessionGroups,
    caseloadByWorkplace,
    orgKpis,
  } = data

  return (
    <RoleBlockShell
      blockId="compliance_activity"
      actions={(
        <>
          <Link to="/service-lead/progress-note-templates" className="role-block__link">Note templates</Link>
          <Link to="/service-lead/letter-templates" className="role-block__link">Letter templates</Link>
          <Link to="/service-lead/outcome-forms" className="role-block__link">Outcome forms</Link>
        </>
      )}
    >
      <OutcomeBars bars={outcomeBars} />

      <div className="role-block__columns">
        <div className="role-block__panel">
          <h3 className="role-block__panel-title">Attention this week</h3>
          {exceptions.length === 0 ? (
            <p className="role-block__empty">No compliance exceptions across workplaces.</p>
          ) : (
            <ul className="home-feed">
              {exceptions.map(row => (
                <li key={row.workplaceId} className="home-feed__item">
                  <div className="home-feed__row home-feed__row--datetime">
                    <span className="home-feed__datetime">{row.workplaceName}</span>
                    <span className="home-feed__primary">Compliance exceptions</span>
                    <span className="home-feed__meta">
                      {row.notesMissing > 0 && `${row.notesMissing} missing notes`}
                      {row.notesLate > 0 && `${row.notesMissing > 0 ? ' · ' : ''}${row.notesLate} late notes`}
                      {row.didNotAttend > 0 && `${(row.notesMissing > 0 || row.notesLate > 0) ? ' · ' : ''}${row.didNotAttend} DNA`}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {(orgKpis.notesMissing > 0 || orgKpis.pendingAttendance > 0) && (
            <p className="text-muted text-small role-block__intro">
              Organisation-wide: {orgKpis.notesMissing} missing notes · {orgKpis.notesLate} late · {orgKpis.pendingAttendance} sessions awaiting attendance
            </p>
          )}
        </div>

        <div className="role-block__panel">
          <h3 className="role-block__panel-title">Upcoming session volume</h3>
          {sessionGroups.length === 0 ? (
            <p className="role-block__empty">No upcoming sessions scheduled.</p>
          ) : (
            <ul className="home-feed">
              {sessionGroups.map(group => (
                <li key={`${group.session_date}-${group.workplaceId}`} className="home-feed__item">
                  <div className="home-feed__row home-feed__row--datetime">
                    <time className="home-feed__datetime" dateTime={group.session_date}>
                      {formatDisplayDate(group.session_date)}
                    </time>
                    <span className="home-feed__primary">{group.workplaceName}</span>
                    <span className="home-feed__meta">
                      {group.sessionCount} session{group.sessionCount === 1 ? '' : 's'}
                      {' · '}
                      {group.clinicianCount} clinician{group.clinicianCount === 1 ? '' : 's'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="role-block__panel">
        <h3 className="role-block__panel-title">Active caseload by workplace</h3>
        {caseloadByWorkplace.length === 0 ? (
          <p className="role-block__empty">No active caseload recorded.</p>
        ) : (
          <div className="lead-table-wrap">
            <table className="lead-table role-block__table">
              <thead>
                <tr>
                  <th>Workplace</th>
                  <th>Active clients</th>
                  <th>Clinicians</th>
                </tr>
              </thead>
              <tbody>
                {caseloadByWorkplace.map(row => (
                  <tr key={row.workplaceId}>
                    <td><strong>{row.workplaceName}</strong></td>
                    <td>{row.activeClients}</td>
                    <td>{row.clinicians}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleBlockShell>
  )
}
