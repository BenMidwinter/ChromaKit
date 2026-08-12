import { MYCONCERN_WORKFLOW_STEPS } from '../../lib/safeguardingConcerns'

export default function SafeguardingConcernModal({ client, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal card safeguarding-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="safeguarding-concern-title"
      >
        <div className="client-details-modal__header">
          <h2 id="safeguarding-concern-title">How safeguarding reporting will work</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <p className="safeguarding-modal__intro">
          For <strong>{client.real_name}</strong>, reporting stays on one screen: MyConcern embedded
          beside ChromaKit’s internal capture. This is the planned flow — the live iframe is not
          connected yet.
        </p>

        <div className="safeguarding-mock-layout" aria-hidden="true">
          <div className="safeguarding-mock-layout__frame">
            <span className="safeguarding-mock-layout__label">MyConcern Community Reporting Tool</span>
            <p>Embedded form (iframe) — complete the concern here</p>
          </div>
          <div className="safeguarding-mock-layout__capture">
            <span className="safeguarding-mock-layout__label">ChromaKit internal submission</span>
            <p>Paste MyConcern reference · saved to Safeguarding as Open</p>
          </div>
        </div>

        <ol className="safeguarding-steps">
          {MYCONCERN_WORKFLOW_STEPS.map((step, index) => (
            <li key={step.title} className="safeguarding-steps__item">
              <span className="safeguarding-steps__index">{index + 1}</span>
              <div>
                <strong className="safeguarding-steps__title">{step.title}</strong>
                <p className="safeguarding-steps__detail">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="form-actions">
          <button type="button" className="primary" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  )
}
