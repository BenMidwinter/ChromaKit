import { useMemo, useState } from 'react'
import {
  searchClinicianProfiles,
  inviteClinicianToWorkplace,
  getMembershipRequestsForWorkplace,
  approveMembershipRequest,
  declineMembershipRequest,
  getAuditLogs,
} from '../../lib/store'
import { WORKPLACE_MEMBERSHIP_ROLES } from '../../lib/roleBlocks'
import { normalizeRole } from '../../lib/permissions'

export function InviteCliniciansPanel({ workplaceId, userId, myWorkplace, revision, onChanged }) {
  const [query, setQuery] = useState('')
  const [inviteRole, setInviteRole] = useState('clinician')
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
      inviteClinicianToWorkplace(workplaceId, clinicianId, userId, myWorkplace, inviteRole)
      setQuery('')
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="role-block__panel">
      <h3 className="role-block__panel-title">Invite ChromaKit users</h3>
      <p className="text-muted text-small role-block__intro">
        Search organisation clinician profiles and add them to your team with a role.
      </p>
      <div className="role-block__inline-fields">
        <div className="workplace-hub__search role-block__inline-grow">
          <input
            type="search"
            className="paper-input"
            placeholder="Search by name, HCPC, or job title…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <label className="role-block__field-inline">
          <span className="text-small text-muted">Role</span>
          <select className="paper-input" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
            {WORKPLACE_MEMBERSHIP_ROLES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>
      {error && <p className="form-error">{error}</p>}
      {results.length > 0 && (
        <ul className="workplace-hub__results">
          {results.map(clinician => (
            <li key={clinician.id} className="workplace-hub__result">
              <div className="workplace-hub__result-main">
                <strong>{clinician.full_name}</strong>
                <span className="text-small text-muted">
                  {clinician.job_title}{clinician.hcpc_number ? ` · ${clinician.hcpc_number}` : ''}
                </span>
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
    </div>
  )
}

export function JoinRequestsPanel({ workplaceId, userId, myWorkplace, revision, onChanged }) {
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [approveRoles, setApproveRoles] = useState({})

  const requests = useMemo(
    () => getMembershipRequestsForWorkplace(workplaceId, 'pending'),
    [workplaceId, revision],
  )

  const handleApprove = async (requestId) => {
    setError('')
    setBusyId(requestId)
    try {
      const role = approveRoles[requestId] || 'clinician'
      approveMembershipRequest(requestId, userId, myWorkplace, role)
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
    <div className="role-block__panel">
      <h3 className="role-block__panel-title">Join requests ({requests.length})</h3>
      <p className="text-muted text-small role-block__intro">
        Review clinicians who have asked to join this workplace and assign their role.
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
                <span className="text-small text-muted">
                  {req.job_title}{req.hcpc_number ? ` · ${req.hcpc_number}` : ''}
                </span>
                {req.message && <p className="text-small text-muted">{req.message}</p>}
              </div>
              <div className="workplace-hub__request-actions">
                <select
                  className="paper-input"
                  value={approveRoles[req.id] || 'clinician'}
                  onChange={e => setApproveRoles(prev => ({ ...prev, [req.id]: e.target.value }))}
                  aria-label={`Role for ${req.full_name}`}
                >
                  {WORKPLACE_MEMBERSHIP_ROLES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
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
    </div>
  )
}

export function AuditLogPanel({ workplaceId, myWorkplace, revision }) {
  const logs = useMemo(
    () => getAuditLogs(workplaceId, myWorkplace),
    [workplaceId, myWorkplace, revision],
  )

  return (
    <div className="role-block__panel">
      <h3 className="role-block__panel-title">Audit log</h3>
      <p className="text-muted text-small role-block__intro">
        Historical actions recorded for this workplace.
      </p>
      {logs.length === 0 ? (
        <div className="empty-state">No audit entries yet.</div>
      ) : (
        <ul className="workplace-hub__audit text-muted">
          {logs.map(l => (
            <li key={l.id}>
              {l.detail}{' '}
              <span className="text-small">({new Date(l.created_at).toLocaleDateString()})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function formatMemberRole(role) {
  return normalizeRole(role).replace(/_/g, ' ')
}
