import { Link, useNavigate } from 'react-router-dom'
import RoleBlockShell from '../RoleBlockShell'
import BlurredName from '../BlurredName'
import { APPOINTMENT_TYPES } from '../../lib/store'
import { formatDisplayDate } from '../../lib/dateArchitecture'
import { formatSessionDateTime } from '../../lib/appointmentUtils'

function AttendanceSummary({ attendance }) {
  if (!attendance) return null
  return (
    <div className="role-block__stat-row">
      <div className="role-block__stat">
        <span className="role-block__stat-value">{attendance.total}</span>
        <span className="role-block__stat-label">Sessions this week</span>
      </div>
      <div className="role-block__stat">
        <span className="role-block__stat-value role-block__stat-value--ok">{attendance.attended}</span>
        <span className="role-block__stat-label">Attended</span>
      </div>
      <div className="role-block__stat">
        <span className="role-block__stat-value role-block__stat-value--warn">{attendance.didNotAttend}</span>
        <span className="role-block__stat-label">DNA</span>
      </div>
      <div className="role-block__stat">
        <span className="role-block__stat-value">{attendance.pending}</span>
        <span className="role-block__stat-label">Pending</span>
      </div>
    </div>
  )
}

export default function HomeAdministratorBlock({ data, blurNames, title }) {
  const navigate = useNavigate()
  const { weekLabel, attendance, upcoming, activeCases } = data

  return (
    <RoleBlockShell
      blockId="administrator"
      title={title}
      description={weekLabel ? `Working week ${weekLabel}` : undefined}
      actions={<Link to="/calendar" className="role-block__link">Team calendar</Link>}
    >
      <AttendanceSummary attendance={attendance} />

      <div className="role-block__columns">
        <div className="role-block__panel">
          <h3 className="role-block__panel-title">Upcoming workplace appointments</h3>
          {upcoming.length === 0 ? (
            <p className="role-block__empty">No upcoming sessions at this workplace.</p>
          ) : (
            <ul className="home-feed">
              {upcoming.map(appt => (
                <li key={appt.id} className="home-feed__item">
                  <Link
                    to={blurNames ? '#' : `/clients/${appt.client_id}/appointments/${appt.id}`}
                    className="home-feed__row home-feed__row--datetime"
                    onClick={blurNames ? e => e.preventDefault() : undefined}
                  >
                    <time className="home-feed__datetime" dateTime={`${appt.session_date}T${appt.start_time || '00:00'}`}>
                      {formatSessionDateTime(appt)}
                    </time>
                    <span className="home-feed__primary">
                      <BlurredName name={appt.client_name || 'Unknown client'} blur={blurNames} />
                    </span>
                    <span className="home-feed__meta">
                      With {appt.assigned_therapist || 'Unassigned'}
                      {' · '}
                      {APPOINTMENT_TYPES[appt.appointment_type]}
                      {appt.location && ` · ${appt.location}`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="role-block__panel">
          <h3 className="role-block__panel-title">Active workplace cases ({activeCases.length})</h3>
          {activeCases.length === 0 ? (
            <p className="role-block__empty">No active cases at this workplace.</p>
          ) : (
            <ul className="home-feed">
              {activeCases.map(client => (
                <li key={client.id} className="home-feed__item">
                  <button
                    type="button"
                    className="home-feed__row home-feed__row--button"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <span className="home-feed__primary">
                      <BlurredName name={client.real_name} blur={blurNames} />
                    </span>
                    <span className="home-feed__meta">
                      Lead clinician: {client.lead_clinician || client.assigned_therapist || '—'}
                    </span>
                    <time className="home-feed__date" dateTime={client.created_at}>
                      Opened {formatDisplayDate(client.created_at)}
                    </time>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link to="/clients" className="role-block__link role-block__link--footer">All clients</Link>
        </div>
      </div>
    </RoleBlockShell>
  )
}
