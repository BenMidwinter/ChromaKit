import { Link } from 'react-router-dom'
import RoleBlockShell from '../../components/RoleBlockShell'
import BlurredName from '../../components/BlurredName'
import { formatDisplayDate } from '../../lib/dateArchitecture'
import { financeStatusLabel, formatGbp } from '../../lib/financeMock'

export default function HomeAdminFinanceBlock({ data, blurNames, title }) {
  const { weekLabel, timesheets, expenses, invoices, summary } = data

  return (
    <RoleBlockShell
      blockId="admin_finance"
      title={title}
      description={weekLabel ? `Working week ${weekLabel} · Mock data — not connected to Xero` : undefined}
      actions={(
        <>
          <span className="role-block__pill">Xero sync soon</span>
          <Link to="/finance" className="role-block__link">Open Finance</Link>
        </>
      )}
    >
      <div className="role-block__stat-row">
        <div className="role-block__stat">
          <span className="role-block__stat-value role-block__stat-value--ok">{summary.hoursSubmitted}h</span>
          <span className="role-block__stat-label">Hours submitted</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value">{summary.hoursDraft}h</span>
          <span className="role-block__stat-label">Hours in draft</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value role-block__stat-value--warn">{summary.expensesPending}</span>
          <span className="role-block__stat-label">Expenses pending</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value">{summary.invoicesDraft}</span>
          <span className="role-block__stat-label">Invoices to send</span>
        </div>
      </div>

      <div className="role-block__columns role-block__columns--three">
        <div className="role-block__panel">
          <h3 className="role-block__panel-title">Timesheets</h3>
          {timesheets.length === 0 ? (
            <p className="role-block__empty">No timesheet rows for this workplace.</p>
          ) : (
            <ul className="home-feed">
              {timesheets.map(row => (
                <li key={row.id} className="home-feed__item">
                  <div className="home-feed__row home-feed__row--static">
                    <span className="home-feed__primary">{row.clinician}</span>
                    <span className="home-feed__meta">
                      {row.hours}h clinical · {row.travelHours}h travel · {row.sessions} sessions
                    </span>
                    <span className={`finance-status finance-status--${row.status}`}>
                      {financeStatusLabel(row.status)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="role-block__panel">
          <h3 className="role-block__panel-title">Expenses</h3>
          {expenses.length === 0 ? (
            <p className="role-block__empty">No expense claims.</p>
          ) : (
            <ul className="home-feed">
              {expenses.slice(0, 4).map(row => (
                <li key={row.id} className="home-feed__item">
                  <div className="home-feed__row home-feed__row--static">
                    <span className="home-feed__primary">{row.description}</span>
                    <span className="home-feed__meta">
                      {row.claimant} · {formatDisplayDate(row.date)} · {formatGbp(row.amount)}
                    </span>
                    <span className={`finance-status finance-status--${row.status}`}>
                      {financeStatusLabel(row.status)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="role-block__panel">
          <h3 className="role-block__panel-title">Invoicing</h3>
          {invoices.length === 0 ? (
            <p className="role-block__empty">No invoice drafts.</p>
          ) : (
            <ul className="home-feed">
              {invoices.slice(0, 4).map(row => (
                <li key={row.id} className="home-feed__item">
                  <div className="home-feed__row home-feed__row--static">
                    <span className="home-feed__primary">
                      <BlurredName name={row.clientName} blur={blurNames} />
                      <span className="home-feed__ref"> · {row.reference}</span>
                    </span>
                    <span className="home-feed__meta">
                      {row.funder} · {row.period} · {formatGbp(row.amount)}
                    </span>
                    <span className={`finance-status finance-status--${row.status}`}>
                      {financeStatusLabel(row.status)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="role-block__footnote">
            Draft invoices stay in ChromaKit until Xero is connected. Full tables live under Finance.
          </p>
        </div>
      </div>
    </RoleBlockShell>
  )
}
