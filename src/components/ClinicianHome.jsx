import { Link, useNavigate } from 'react-router-dom'
import PageHeader from './PageHeader'
import BlurredName from './BlurredName'
import { getUpcomingAppointments, APPOINTMENT_TYPES } from '../lib/store'
import { sortLatestFirst } from '../lib/dateArchitecture'
import { formatSessionDateTime } from '../lib/appointmentUtils'
import { filterAppointmentsForPersona } from '../lib/calendarAccess'
import { formatDisplayDate } from '../lib/dateArchitecture'

function sortUpcomingSoonestFirst(notes) {
  return [...notes].sort((a, b) => {
    const dateCmp = String(a.session_date || '').localeCompare(String(b.session_date || ''))
    if (dateCmp !== 0) return dateCmp
    return String(a.start_time || '').localeCompare(String(b.start_time || ''))
  })
}

export default function ClinicianHome({ session, myWorkplace, clients, activePersona, blurNames }) {
  const navigate = useNavigate()

  const upcomingRaw = getUpcomingAppointments(session.user.id, myWorkplace, {
    organisationWide: false,
  })
  const upcomingFiltered = filterAppointmentsForPersona(upcomingRaw, activePersona)
  const upcoming = sortUpcomingSoonestFirst(upcomingFiltered).slice(0, 8)

  const activeCases = sortLatestFirst(
    clients.filter(c => c.is_active),
    'created_at',
  ).slice(0, 8)

  const clientName = (clientId) => clients.find(c => c.id === clientId)?.real_name || 'Unknown client'

  return (
    <div className="page page--home">
      <PageHeader
        title={`Welcome back, ${activePersona.name}`}
        subtitle="Your caseload and upcoming sessions."
      />

      <div className="home-dashboard">
        <section className="home-panel" aria-labelledby="home-upcoming-heading">
          <header className="home-panel__header">
            <div>
              <h2 id="home-upcoming-heading" className="home-panel__title">Upcoming appointments</h2>
              <p className="home-panel__subtitle">Date and time for each session</p>
            </div>
            <Link to="/calendar" className="home-panel__link">Open calendar</Link>
          </header>

          {upcoming.length === 0 ? (
            <p className="home-panel__empty">No upcoming sessions scheduled.</p>
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
                      <BlurredName name={clientName(appt.client_id)} blur={blurNames} />
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
        </section>

        <section className="home-panel" aria-labelledby="home-cases-heading">
          <header className="home-panel__header">
            <div>
              <h2 id="home-cases-heading" className="home-panel__title">Active cases</h2>
              <p className="home-panel__subtitle">{activeCases.length} open case{activeCases.length === 1 ? '' : 's'}</p>
            </div>
            <Link to="/active-cases" className="home-panel__link">View all</Link>
          </header>

          {activeCases.length === 0 ? (
            <p className="home-panel__empty">No active cases on your caseload.</p>
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
                      {client.assigned_therapist && ` · ${client.assigned_therapist}`}
                    </span>
                    <time className="home-feed__date" dateTime={client.created_at}>
                      Opened {formatDisplayDate(client.created_at)}
                    </time>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
