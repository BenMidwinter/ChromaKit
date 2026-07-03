import { useState } from 'react'
import PageHeader from './PageHeader'
import { ROLE_CAPABILITIES, DEMO_ROLE_OPTIONS } from '../lib/permissions'

export default function About() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="page">
      <PageHeader
        title="About ChromatiK"
        subtitle="Clinician portfolio platform — local prototype on dummy data."
      />

      <div className="tabs">
        {['overview', 'roles', 'architecture'].map(tab => (
          <button
            key={tab}
            type="button"
            className={`tab${activeTab === tab ? ' tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' ? 'Overview' : tab === 'roles' ? 'Roles & access' : 'Architecture'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="card">
          <h3 className="card__title">What works today</h3>
          <ul className="text-muted" style={{ paddingLeft: '1.25rem', lineHeight: 1.9 }}>
            <li>Client caseload with private vs workplace context filtering</li>
            <li>Progress notes — full-page workspace with A4 editor and side-by-side previous note preview (TipTap)</li>
            <li>Role-based access control with a top-right preview toggle (Clinical lead / Administrator / Clinician)</li>
            <li>Client page sections gated by role — progress notes and body map restricted for administrators</li>
            <li>Body map — interactive formulation canvas per client</li>
            <li>Progress notes, appointments, working documents, and letters on dummy data</li>
            <li>Local in-memory store seeded from <code>src/lib/mockData.js</code></li>
          </ul>
          <p className="text-muted text-small mt-1">
            Use the <strong>View as</strong> toggle in the top navigation to preview each role. The banner below the nav summarises what that role can and cannot do.
          </p>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="role-matrix">
          {DEMO_ROLE_OPTIONS.map(({ value, label }) => {
            const caps = ROLE_CAPABILITIES[value]
            if (!caps) return null
            return (
              <div key={value} className="card role-matrix__card">
                <h3 className="card__title">{label}</h3>
                <p className="text-muted mb-1">{caps.summary}</p>
                <div className="role-banner__grid">
                  <div>
                    <p className="role-banner__label">Can do</p>
                    <ul>
                      {caps.can.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  {caps.cannot.length > 0 && (
                    <div>
                      <p className="role-banner__label">Cannot do</p>
                      <ul className="role-banner__cannot">
                        {caps.cannot.map(item => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <div className="card">
            <h3 className="card__title">Per-workplace roles</h3>
            <p className="text-muted">
              A user may hold different roles at different workplaces. Use the workplace context selector on the
              Workplace page to switch between Chroma Main HQ and Chroma East Hub. Ben is clinical lead at HQ but
              clinician-only at East — toggle Clinician preview and switch to East to see assigned caseload only;
              Taylor Brooks (assigned to Sam) is hidden while Morgan Reed remains visible.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="card">
          <h3 className="card__title">Planned backend model</h3>
          <p className="text-muted mb-1">
            When Supabase is connected, row-level security will enforce the same rules mirrored locally in{' '}
            <code>src/lib/permissions.js</code>.
          </p>
          <p className="text-muted">No encryption layer is included in this prototype.</p>
        </div>
      )}
    </div>
  )
}
