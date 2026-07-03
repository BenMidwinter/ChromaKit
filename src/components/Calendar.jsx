import { useOutletContext } from 'react-router-dom'
import PageHeader from './PageHeader'
import CalendarModule from './CalendarModule'
import ErrorBoundary from './ErrorBoundary'

export default function Calendar() {
  const { activePersona } = useOutletContext()

  return (
    <div className="page">
      <PageHeader title="Calendar" subtitle="Session scheduling filtered by your demo profile." />
      <ErrorBoundary
        label="calendar-module"
        resetKeys={[activePersona?.id]}
        fallback={({ reset }) => (
          <div className="card empty-state" role="alert">
            <p><strong>The calendar failed to render.</strong></p>
            <p className="text-muted text-small">This is isolated to the calendar — the rest of the app is unaffected.</p>
            <div className="form-actions" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <button type="button" className="primary" onClick={reset}>Reload calendar</button>
            </div>
          </div>
        )}
      >
        <CalendarModule persona={activePersona} />
      </ErrorBoundary>
    </div>
  )
}
