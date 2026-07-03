import { useState, useMemo } from 'react'
import {
  getAllClinicianProfiles,
  addClinicianUser,
  getAllWorkplaces,
  getAllMemberships,
} from '../../lib/store'

export default function ServiceLeadUsers() {
  const [users, setUsers] = useState(() => getAllClinicianProfiles())
  const [fullName, setFullName] = useState('')
  const [hcpcNumber, setHcpcNumber] = useState('')
  const [jobTitle, setJobTitle] = useState('Clinician')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const workplaces = useMemo(() => getAllWorkplaces(), [users])
  const memberships = useMemo(() => getAllMemberships(), [users])

  const refresh = () => setUsers(getAllClinicianProfiles())

  const workplaceLabelsForUser = (userId) => {
    const labels = memberships
      .filter(m => m.user_id === userId)
      .map(m => {
        const wp = workplaces.find(w => w.id === m.workplace_id)
        return wp ? wp.name : null
      })
      .filter(Boolean)
    return labels.length ? labels.join(', ') : 'Not linked'
  }

  const handleAdd = (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      addClinicianUser({
        full_name: fullName,
        hcpc_number: hcpcNumber,
        job_title: jobTitle,
        bio,
      })
      setFullName('')
      setHcpcNumber('')
      setJobTitle('Clinician')
      setBio('')
      refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="service-lead-panel">
      <header className="service-lead-panel__header">
        <div>
          <h2>Users</h2>
          <p className="text-muted text-small">
            Add clinician accounts to the organisation. They can search for a workplace and request to join — clinical leads approve membership.
          </p>
        </div>
      </header>

      <section className="service-lead-panel__section">
        <h3 className="service-lead-panel__section-title">Add clinician</h3>
        <form onSubmit={handleAdd} className="form-grid service-lead-panel__form">
          <div className="form-group">
            <label>Full name</label>
            <input className="paper-input" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="e.g. Sam Rivera" />
          </div>
          <div className="form-group">
            <label>HCPC number</label>
            <input className="paper-input" value={hcpcNumber} onChange={e => setHcpcNumber(e.target.value)} placeholder="Optional" />
          </div>
          <div className="form-group">
            <label>Job title</label>
            <input className="paper-input" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Profile summary</label>
            <textarea className="paper-input" rows={2} value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio — visible when clinical leads search for clinicians." />
          </div>
          {error && <p className="form-error" style={{ gridColumn: '1 / -1' }}>{error}</p>}
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="primary" disabled={saving}>{saving ? 'Adding…' : 'Add user'}</button>
          </div>
        </form>
      </section>

      <section className="service-lead-panel__section">
        <h3 className="service-lead-panel__section-title">All users ({users.length})</h3>
        <div className="lead-table-wrap">
          <table className="lead-table">
            <thead>
              <tr><th>Name</th><th>HCPC</th><th>Job title</th><th>Workplaces</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.full_name}</strong></td>
                  <td>{user.hcpc_number || '—'}</td>
                  <td className="text-small">{user.job_title || '—'}</td>
                  <td className="text-small text-muted">{workplaceLabelsForUser(user.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
