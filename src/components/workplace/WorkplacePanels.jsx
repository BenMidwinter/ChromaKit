import { useMemo, useState } from 'react'
import { searchWorkplacesForUser } from '../../lib/store'
import {
  useMyMembershipRequestsQuery,
  useRequestWorkplaceMembershipMutation,
} from '../../lib/workplaceQueries'

function requestStatusLabel(status) {
  if (status === 'pending') return 'Pending'
  if (status === 'approved') return 'Approved'
  if (status === 'declined') return 'Declined'
  return status
}

export function FindWorkplacePanel({ userId, onChanged }) {
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { data: myRequests = [] } = useMyMembershipRequestsQuery(userId)
  const requestMutation = useRequestWorkplaceMembershipMutation()

  const results = useMemo(
    () => (query.trim().length >= 2 ? searchWorkplacesForUser(userId, query) : []),
    [userId, query],
  )

  const handleRequest = async (workplaceId) => {
    setError('')
    setBusy(true)
    try {
      await requestMutation.mutateAsync({ userId, workplaceId, message })
      setMessage('')
      setQuery('')
      setSelectedId(null)
      onChanged?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="role-block__panel">
      <h3 className="role-block__panel-title">Find a workplace</h3>
      <p className="text-muted text-small role-block__intro">
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
    </div>
  )
}
