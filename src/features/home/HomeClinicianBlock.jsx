import { Link, useNavigate } from 'react-router-dom'
import RoleBlockShell from '../../components/RoleBlockShell'
import BlurredName from '../../components/BlurredName'
import { APPOINTMENT_TYPES } from '../../lib/store'
import { formatDisplayDate } from '../../lib/dateArchitecture'
import { formatSessionDateTime } from '../../lib/appointmentUtils'

export default function HomeClinicianBlock({ data, blurNames }) {
  const navigate = useNavigate()
  const { upcoming, activeCases, todayCount } = data

  return (
    <RoleBlockShell
      blockId="clinician"
      description={todayCount > 0 ? `${todayCount} session${todayCount === 1 ? '' : 's'} today` : undefined}
      actions={<Link to="/calendar" className="role-block__link">Open calendar</Link>}
    >
      <div className="role-block__columns">
        <div className="role-block__panel">
          <h3 className="role-block__panel-title">Your upcoming appointments</h3>
          {upcoming.length === 0 ? (
            <p className="role-block__empty">No upcoming sessions assigned to you.</p>
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
          <h3 className="role-block__panel-title">Your active cases</h3>
          {activeCases.length === 0 ? (
            <p className="role-block__empty">No active cases assigned to you.</p>
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
                      {client.workplace_name || 'Private practice'}
                    </span>
                    <time className="home-feed__date" dateTime={client.created_at}>
                      Opened {formatDisplayDate(client.created_at)}
                    </time>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Link to="/active-cases" className="role-block__link role-block__link--footer">View all your cases</Link>
        </div>
      </div>
    </RoleBlockShell>
  )
}
