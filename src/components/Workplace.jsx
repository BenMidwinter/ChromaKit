import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { usePermissions } from '../lib/usePermissions'
import {
  getWorkplaceMembers,
  getWorkplaceClients,
  getAssignedClientsAtWorkplace,
  getAuditLogs,
  getProfile,
  getMembershipRequestsForWorkplace,
  getMyMembershipRequests,
  searchClinicianProfiles,
  searchWorkplacesForUser,
  requestWorkplaceMembership,
  approveMembershipRequest,
  declineMembershipRequest,
  inviteClinicianToWorkplace,
} from '../lib/store'
import { normalizeRole } from '../lib/permissions'
import PageHeader from './PageHeader'
import WorkplaceContextPicker from './WorkplaceContextPicker'
import BlurredName from './BlurredName'

function formatRole(role) {
  return normalizeRole(role).replace(/_/g, ' ')
}

function requestStatusLabel(status) {
  if (status === 'pending') return 'Pending'
  if (status === 'approved') return 'Approved'
  if (status === 'declined') return 'Declined'
  return status
}

function FindWorkplacePanel({ userId, revision, onChanged }) {
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const results = useMemo(
    () => (query.trim().length >= 2 ? searchWorkplacesForUser(userId, query) : []),
    [userId, query],
  )

  const myRequests = useMemo(() => getMyMembershipRequests(userId), [userId, revision])

  const handleRequest = async (workplaceId) => {
    setError('')
    setBusy(true)
    try {
      requestWorkplaceMembership(userId, workplaceId, message)
      setMessage('')
      setQuery('')
      setSelectedId(null)
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="workplace-hub__section card">
      <h3 className="card__title">Find a workplace</h3>
      <p className="text-muted text-small workplace-hub__intro">
        Search organisation workplaces and send a join request. The clinical lead at that site approves membership.
      </p>
      <div className="workplace-hub__search">
        <input
          type="search"
          className="paper-input"
          placeholder="Search by workplace name…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      {results.length > 0 && (
        <ul className="workplace-hub__results">
          {results.map(wp => (
            <li key={wp.id} className="workplace-hub__result">
              <div className="workplace-hub__result-main">
                <strong>{wp.name}</strong>
              </div>
              {selectedId === wp.id ? (
                <div className="workplace-hub__request-form">
                  <textarea
                    className="paper-input"
                    rows={2}
                    placeholder="Optional message for the clinical lead…"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                  <div className="workplace-hub__request-actions">
                    <button type="button" className="primary" disabled={busy} onClick={() => handleRequest(wp.id)}>
                      {busy ? 'Sending…' : 'Send request'}
                    </button>
                    <button type="button" className="secondary" onClick={() => setSelectedId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" className="secondary" onClick={() => setSelectedId(wp.id)}>
                  Request to join
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {query.trim().length >= 2 && results.length === 0 && (
        <p className="text-muted text-small">No workplaces found — you may already be a member.</p>
      )}
      {myRequests.length > 0 && (
        <div className="workplace-hub__my-requests">
          <h4 className="workplace-hub__subheading">Your requests</h4>
          <ul className="workplace-hub__request-list">
            {myRequests.map(req => (
              <li key={req.id} className="workplace-hub__request-row">
                <span>{req.workplace_name}</span>
                <span className={`badge ${req.status === 'pending' ? 'badge-blue' : req.status === 'approved' ? 'badge-green' : 'badge-grey'}`}>
                  {requestStatusLabel(req.status)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function InviteCliniciansPanel({ workplaceId, userId, myWorkplace, revision, onChanged }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const results = useMemo(
    () => (query.trim().length >= 2
      ? searchClinicianProfiles(query, { workplaceId, excludeUserId: userId })
      : []),
    [query, workplaceId, userId],
  )

  const handleInvite = async (clinicianId) => {
    setError('')
    setBusyId(clinicianId)
    try {
      inviteClinicianToWorkplace(workplaceId, clinicianId, userId, myWorkplace)
      setQuery('')
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="workplace-hub__section card">
      <h3 className="card__title">Find clinicians</h3>
      <p className="text-muted text-small workplace-hub__intro">
        Search organisation clinician profiles and add them directly to your team.
      </p>
      <div className="workplace-hub__search">
        <input
          type="search"
          className="paper-input"
          placeholder="Search by name, HCPC, or job title…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      {results.length > 0 && (
        <ul className="workplace-hub__results">
          {results.map(clinician => (
            <li key={clinician.id} className="workplace-hub__result">
              <div className="workplace-hub__result-main">
                <strong>{clinician.full_name}</strong>
                <span className="text-small text-muted">{clinician.job_title}{clinician.hcpc_number ? ` · ${clinician.hcpc_number}` : ''}</span>
                {clinician.bio && <p className="text-small text-muted">{clinician.bio}</p>}
              </div>
              <button
                type="button"
                className="primary"
                disabled={busyId === clinician.id}
                onClick={() => handleInvite(clinician.id)}
              >
                {busyId === clinician.id ? 'Adding…' : 'Add to team'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function JoinRequestsPanel({ workplaceId, userId, myWorkplace, revision, onChanged }) {
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const requests = useMemo(
    () => getMembershipRequestsForWorkplace(workplaceId, 'pending'),
    [workplaceId, revision],
  )

  const handleApprove = async (requestId) => {
    setError('')
    setBusyId(requestId)
    try {
      approveMembershipRequest(requestId, userId, myWorkplace)
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const handleDecline = async (requestId) => {
    setError('')
    setBusyId(requestId)
    try {
      declineMembershipRequest(requestId, userId, myWorkplace)
      onChanged()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="workplace-hub__section card">
      <h3 className="card__title">Join requests ({requests.length})</h3>
      <p className="text-muted text-small workplace-hub__intro">
        Review clinicians who have asked to join this workplace.
      </p>
      {error && <p className="form-error">{error}</p>}
      {requests.length === 0 ? (
        <div className="empty-state">No pending requests.</div>
      ) : (
        <ul className="workplace-hub__results">
          {requests.map(req => (
            <li key={req.id} className="workplace-hub__result workplace-hub__result--request">
              <div className="workplace-hub__result-main">
                <strong>{req.full_name}</strong>
                <span className="text-small text-muted">{req.job_title}{req.hcpc_number ? ` · ${req.hcpc_number}` : ''}</span>
                {req.message && <p className="text-small text-muted">{req.message}</p>}
              </div>
              <div className="workplace-hub__request-actions">
                <button
                  type="button"
                  className="primary"
                  disabled={busyId === req.id}
                  onClick={() => handleApprove(req.id)}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="secondary"
                  disabled={busyId === req.id}
                  onClick={() => handleDecline(req.id)}
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function Workplace({ onViewProfile }) {
  const navigate = useNavigate()
  const {
    myWorkplace,
    myWorkplaces,
    activeWorkplaceId,
    setActiveWorkplaceId,
    session,
    refreshMemberships,
  } = useOutletContext()
  const perms = usePermissions()
  const [tick, setTick] = useState(0)

  const bump = () => {
    refreshMemberships?.()
    setTick(t => t + 1)
  }

  if (!myWorkplace || !myWorkplaces.length) {
    return (
      <div className="page workplace-hub">
        <PageHeader
          title="My workplace & team"
          subtitle="Search for a workplace and request to join — a clinical lead will review your request."
        />
        <FindWorkplacePanel userId={session.user.id} revision={tick} onChanged={bump} />
      </div>
    )
  }

  const membership = myWorkplaces.find(w => w.id === activeWorkplaceId)
  void tick

  const members = getWorkplaceMembers(myWorkplace.id, myWorkplace)
  const fullCaseload = getWorkplaceClients(myWorkplace.id, myWorkplace)
  const assignedCaseload = getAssignedClientsAtWorkplace(session.user.id, myWorkplace.id)
  const clients = perms.canViewFullCaseload ? fullCaseload : assignedCaseload
  const logs = getAuditLogs(myWorkplace.id, myWorkplace)

  return (
    <div className="page workplace-hub">
      <PageHeader
        title="My workplace & team"
        subtitle={`${myWorkplace.name} · ${formatRole(membership?.role)}${!perms.canViewFullCaseload ? ' · assigned caseload only' : ''}`}
        toolbar={(
          <WorkplaceContextPicker
            compact
            workplaces={myWorkplaces}
            value={activeWorkplaceId}
            onChange={setActiveWorkplaceId}
          />
        )}
      />

      <section className="workplace-hub__section card mb-1">
        <h3 className="card__title">Team ({members.length})</h3>
        {members.length === 0 ? (
          <div className="empty-state">No team members yet.</div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Role</th><th>Job title</th><th>Caseload</th></tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr
                    key={m.user_id}
                    className="hover-row"
                    onClick={() => navigate(`/workplace/team/${m.user_id}`)}
                  >
                    <td><strong>{m.full_name}</strong></td>
                    <td>{formatRole(m.role)}</td>
                    <td className="text-small text-muted">{m.job_title || '—'}</td>
                    <td>{m.caseload_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {perms.canManageTeamMembership && (
        <JoinRequestsPanel
          workplaceId={myWorkplace.id}
          userId={session.user.id}
          myWorkplace={myWorkplace}
          revision={tick}
          onChanged={bump}
        />
      )}

      {perms.canManageTeamMembership && (
        <InviteCliniciansPanel
          workplaceId={myWorkplace.id}
          userId={session.user.id}
          myWorkplace={myWorkplace}
          revision={tick}
          onChanged={bump}
        />
      )}

      <FindWorkplacePanel userId={session.user.id} revision={tick} onChanged={bump} />

      <section className="workplace-hub__section card mb-1">
        <h3 className="card__title">
          {perms.canViewFullCaseload ? `Workplace caseload (${clients.length})` : `Your caseload here (${clients.length})`}
          {perms.isServiceLeadView && <span className="text-small text-muted"> · client names blurred</span>}
        </h3>
        {clients.length === 0 ? (
          <div className="empty-state">
            {perms.canViewFullCaseload
              ? 'No workplace clients yet.'
              : 'No clients assigned to you at this workplace.'}
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Lead clinician</th><th>Status</th></tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr
                    key={c.id}
                    className={perms.blurClientIdentity ? '' : 'hover-row'}
                    onClick={perms.blurClientIdentity ? undefined : () => onViewProfile(c)}
                  >
                    <td><strong><BlurredName name={c.real_name} blur={perms.blurClientIdentity} /></strong></td>
                    <td>{getProfile(c.user_id)?.full_name || 'Team member'}</td>
                    <td>{c.is_active ? <span className="badge badge-green">Active</span> : <span className="badge badge-grey">Discharged</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {perms.canManageWorkplace && logs.length > 0 && (
        <section className="workplace-hub__section card">
          <h3 className="card__title">Audit log</h3>
          <ul className="workplace-hub__audit text-muted">
            {logs.map(l => (
              <li key={l.id}>
                {l.detail}{' '}
                <span className="text-small">({new Date(l.created_at).toLocaleDateString()})</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
