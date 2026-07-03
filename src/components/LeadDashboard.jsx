import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BlurredName from './BlurredName'
import { buildLeadDashboard } from '../lib/leadDashboard'
import {
  getAllAppointments,
  getAllProgressNotes,
  getAllMemberships,
  getAllWorkplacesList,
  getOrganisationClients,
  APPOINTMENT_TYPES,
} from '../lib/store'
import { formatSessionDateTime, attendanceLabel, attendanceBadgeClass } from '../lib/appointmentUtils'
import { formatDisplayDate } from '../lib/dateArchitecture'

function KpiTile({ label, value, hint }) {
  return (
    <div className="lead-kpi">
      <span className="lead-kpi__label">{label}</span>
      <span className="lead-kpi__value">{value}</span>
      {hint && <span className="lead-kpi__hint">{hint}</span>}
    </div>
  )
}

function AttendancePills({ attended, didNotAttend, pending }) {
  return (
    <span className="lead-attendance-pills">
      {attended > 0 && <span className="lead-pill lead-pill--attended">{attended} attended</span>}
      {didNotAttend > 0 && <span className="lead-pill lead-pill--dna">{didNotAttend} DNA</span>}
      {pending > 0 && <span className="lead-pill lead-pill--pending">{pending} pending</span>}
    </span>
  )
}

export default function LeadDashboard({
  scope,
  workplaceId = null,
  workplaceName = null,
  userId,
  demoRole,
  clients,
  blurNames = false,
}) {
  const navigate = useNavigate()

  const dashboard = useMemo(() => buildLeadDashboard({
    scope,
    workplaceId,
    userId,
    demoRole,
    clients,
    allClients: scope === 'organisation' ? getOrganisationClients() : clients,
    appointments: getAllAppointments(),
    progressNotes: getAllProgressNotes(),
    workplaces: getAllWorkplacesList(),
    memberships: getAllMemberships(),
    blurNames,
  }), [scope, workplaceId, userId, demoRole, clients, blurNames])

  const { kpis, workplaceRows, clientRows, upcoming, activeCases, weekLabel } = dashboard

  const clientName = (clientId) => clients.find(c => c.id === clientId)?.real_name || 'Unknown client'

  return (
    <div className="lead-dashboard">
      <section className="lead-dashboard__section" aria-labelledby="lead-kpi-heading">
        <header className="lead-dashboard__section-head">
          <div>
            <h2 id="lead-kpi-heading" className="lead-dashboard__section-title">This week</h2>
            <p className="lead-dashboard__section-subtitle">{weekLabel}{workplaceName ? ` · ${workplaceName}` : ''}</p>
          </div>
        </header>

        <div className="lead-kpi-grid">
          {scope === 'organisation' && (
            <>
              <KpiTile label="Workplaces" value={kpis.workplaces} hint="Under organisation review" />
              <KpiTile label="Clinicians" value={kpis.clinicians} hint="Across all sites" />
            </>
          )}
          {scope === 'workplace' && (
            <KpiTile label="Active clients" value={kpis.activeClients} hint={workplaceName || 'Workplace caseload'} />
          )}
          <KpiTile label="Sessions this week" value={kpis.weekAppointments} />
          <KpiTile
            label="Attendance logged"
            value={kpis.attended + kpis.didNotAttend}
            hint={`${kpis.attended} attended · ${kpis.didNotAttend} DNA · ${kpis.pending} pending`}
          />
          <KpiTile
            label="Notes on time"
            value={kpis.noteCompliancePct != null ? `${kpis.noteCompliancePct}%` : '—'}
            hint={`${kpis.notesOnTime} on time · ${kpis.notesMissing} missing · ${kpis.notesLate} late`}
          />
        </div>
      </section>

      {scope === 'organisation' && workplaceRows.length > 0 && (
        <section className="lead-dashboard__section" aria-labelledby="lead-workplaces-heading">
          <header className="lead-dashboard__section-head">
            <h2 id="lead-workplaces-heading" className="lead-dashboard__section-title">By workplace</h2>
          </header>
          <div className="lead-table-wrap">
            <table className="lead-table">
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
                    <td><AttendancePills attended={row.attended} didNotAttend={row.didNotAttend} pending={row.pending} /></td>
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
        </section>
      )}

      {clientRows.length > 0 && (
        <section className="lead-dashboard__section" aria-labelledby="lead-clients-heading">
          <header className="lead-dashboard__section-head">
            <h2 id="lead-clients-heading" className="lead-dashboard__section-title">Client attendance this week</h2>
          </header>
          <div className="lead-table-wrap">
            <table className="lead-table">
              <thead>
                <tr>
                  <th>Client</th>
                  {scope === 'organisation' && <th>Workplace</th>}
                  <th>Sessions</th>
                  <th>Attendance</th>
                  <th>Progress notes</th>
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
                    {scope === 'organisation' && <td>{row.workplaceName}</td>}
                    <td>{row.total}</td>
                    <td><AttendancePills attended={row.attended} didNotAttend={row.didNotAttend} pending={row.pending} /></td>
                    <td>
                      {row.notesOnTime > 0 && <span className="lead-pill lead-pill--attended">{row.notesOnTime} on time</span>}
                      {row.notesMissing > 0 && <span className="lead-pill lead-pill--dna">{row.notesMissing} missing</span>}
                      {row.notesLate > 0 && <span className="lead-pill lead-pill--pending">{row.notesLate} late</span>}
                      {row.attended === 0 && row.total > 0 && <span className="text-muted text-small">Awaiting attendance</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="lead-dashboard__columns">
        <section className="lead-dashboard__section lead-dashboard__section--half" aria-labelledby="lead-upcoming-heading">
          <header className="lead-dashboard__section-head">
            <div>
              <h2 id="lead-upcoming-heading" className="lead-dashboard__section-title">Upcoming appointments</h2>
              <p className="lead-dashboard__section-subtitle">Date and time shown for each session</p>
            </div>
            <Link to="/calendar" className="lead-dashboard__link">Calendar</Link>
          </header>

          {upcoming.length === 0 ? (
            <p className="lead-dashboard__empty">No upcoming sessions scheduled.</p>
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
                      {appt.attendance_status && (
                        <> · <span className={`badge ${attendanceBadgeClass(appt.attendance_status)}`}>{attendanceLabel(appt.attendance_status)}</span></>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lead-dashboard__section lead-dashboard__section--half" aria-labelledby="lead-cases-heading">
          <header className="lead-dashboard__section-head">
            <div>
              <h2 id="lead-cases-heading" className="lead-dashboard__section-title">Active cases</h2>
              <p className="lead-dashboard__section-subtitle">{activeCases.length} open</p>
            </div>
            <Link to="/active-cases" className="lead-dashboard__link">View all</Link>
          </header>

          {activeCases.length === 0 ? (
            <p className="lead-dashboard__empty">No active cases.</p>
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
