import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PageHeader, { PageHeaderFilter } from '../../components/PageHeader'
import { useAppSession } from '../../lib/AppSessionContext'
import { canAccessFinanceArea } from '../../lib/permissions'
import { getFinanceMockForWorkplace, financeStatusLabel, formatGbp } from '../../lib/financeMock'
import { formatDisplayDate } from '../../lib/dateArchitecture'
import { shouldBlurClientIdentity } from '../../lib/demoPersonas'
import BlurredName from '../../components/BlurredName'

const TABS = [
  { id: 'timesheets', label: 'Timesheets' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'invoices', label: 'Invoices' },
]

export default function FinancePage() {
  const { demoRole, myWorkplace, myWorkplaces, activeWorkplaceId, setActiveWorkplaceId, activePersona } = useAppSession()
  const [tab, setTab] = useState('timesheets')
  const blurNames = shouldBlurClientIdentity(activePersona)
  const canAccess = canAccessFinanceArea(demoRole)

  const workplace = myWorkplace || myWorkplaces.find(w => w.id === activeWorkplaceId) || myWorkplaces[0] || null
  const data = useMemo(() => getFinanceMockForWorkplace(workplace), [workplace])

  if (!canAccess) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="page page--finance">
      <PageHeader
        title="Finance"
        subtitle={`${data.workplaceName || 'Workplace'} · timesheets, expenses, and invoicing (mock — Xero not connected)`}
        toolbar={(
          <>
            {myWorkplaces.length > 1 && (
              <PageHeaderFilter id="finance-workplace" label="Workplace">
                <select
                  id="finance-workplace"
                  className="paper-input"
                  value={workplace?.id || ''}
                  onChange={e => setActiveWorkplaceId(e.target.value)}
                >
                  {myWorkplaces.map(wp => (
                    <option key={wp.id} value={wp.id}>{wp.name}</option>
                  ))}
                </select>
              </PageHeaderFilter>
            )}
            <span className="finance-page__xero-pill">Xero sync soon</span>
          </>
        )}
      />

      <div className="role-block__stat-row finance-page__stats">
        <div className="role-block__stat">
          <span className="role-block__stat-value role-block__stat-value--ok">{data.summary.hoursSubmitted}h</span>
          <span className="role-block__stat-label">Hours submitted</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value">{data.summary.hoursDraft}h</span>
          <span className="role-block__stat-label">Hours in draft</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value role-block__stat-value--warn">{data.summary.expensesPending}</span>
          <span className="role-block__stat-label">Expenses pending</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value">{data.summary.invoicesDraft}</span>
          <span className="role-block__stat-label">Invoices to send</span>
        </div>
        <div className="role-block__stat">
          <span className="role-block__stat-value">{formatGbp(data.summary.invoiceValueOpen || 0)}</span>
          <span className="role-block__stat-label">Open invoice value</span>
        </div>
      </div>

      <div className="finance-tabs" role="tablist" aria-label="Finance sections">
        {TABS.map(item => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`finance-tabs__btn${tab === item.id ? ' finance-tabs__btn--active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'timesheets' && (
        <div className="finance-panel">
          {data.timesheets.map(sheet => (
            <section key={sheet.id} className="finance-card">
              <header className="finance-card__header">
                <div>
                  <h2 className="finance-card__title">{sheet.clinician}</h2>
                  <p className="finance-card__meta">
                    Week {sheet.weekLabel} · {sheet.hours}h clinical · {sheet.travelHours}h travel · {sheet.adminHours}h admin
                  </p>
                </div>
                <span className={`finance-status finance-status--${sheet.status}`}>
                  {financeStatusLabel(sheet.status)}
                </span>
              </header>
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client / activity</th>
                    <th>Service</th>
                    <th>Location</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {sheet.lines.map((line, idx) => (
                    <tr key={`${sheet.id}-${idx}`}>
                      <td>{formatDisplayDate(line.date)}</td>
                      <td><BlurredName name={line.client} blur={blurNames} /></td>
                      <td>{line.service}</td>
                      <td>{line.location}</td>
                      <td>{line.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      )}

      {tab === 'expenses' && (
        <div className="finance-panel">
          <table className="finance-table finance-table--full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Claimant</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Receipt</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.expenses.map(row => (
                <tr key={row.id}>
                  <td>{formatDisplayDate(row.date)}</td>
                  <td>{row.claimant}</td>
                  <td>{row.description}</td>
                  <td>{row.category}</td>
                  <td>{formatGbp(row.amount)}</td>
                  <td>{row.receipt ? 'Attached' : 'Missing'}</td>
                  <td>
                    <span className={`finance-status finance-status--${row.status}`}>
                      {financeStatusLabel(row.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'invoices' && (
        <div className="finance-panel">
          <table className="finance-table finance-table--full">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Client / contract</th>
                <th>Funder</th>
                <th>Period</th>
                <th>Sessions</th>
                <th>Amount</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.invoices.map(row => (
                <tr key={row.id}>
                  <td>{row.reference}</td>
                  <td><BlurredName name={row.clientName} blur={blurNames} /></td>
                  <td>{row.funder}</td>
                  <td>{row.period}</td>
                  <td>{row.sessions}</td>
                  <td>{formatGbp(row.amount)}</td>
                  <td>{formatDisplayDate(row.dueDate)}</td>
                  <td>
                    <span className={`finance-status finance-status--${row.status}`}>
                      {financeStatusLabel(row.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="finance-page__footnote">
            Push to Xero and payment reconciliation will land here once accounting is connected.
          </p>
        </div>
      )}
    </div>
  )
}
