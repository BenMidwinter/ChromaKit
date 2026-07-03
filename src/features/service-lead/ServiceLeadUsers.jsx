import { useMemo, useState } from 'react'
import { getAllMemberships } from '../../lib/store'
import { useAddClinicianUserMutation, useOrgUsersQuery, useOrgWorkplacesQuery } from '../../lib/orgQueries'
import OrgConfigBlock from './blocks/OrgConfigBlock'

export default function ServiceLeadUsers() {
  const { data: users = [] } = useOrgUsersQuery()
  const { data: workplaces = [] } = useOrgWorkplacesQuery()
  const addUser = useAddClinicianUserMutation()
  const [fullName, setFullName] = useState('')
  const [hcpcNumber, setHcpcNumber] = useState('')
  const [jobTitle, setJobTitle] = useState('Clinician')
  const [bio, setBio] = useState('')
  const [error, setError] = useState('')

  const memberships = useMemo(() => getAllMemberships(), [users])

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

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await addUser.mutateAsync({
        full_name: fullName,
        hcpc_number: hcpcNumber,
        job_title: jobTitle,
        bio,
      })
      setFullName('')
      setHcpcNumber('')
      setJobTitle('Clinician')
      setBio('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <OrgConfigBlock blockId="org_users">
      <div className="role-block__panel">
        <h3 className="role-block__panel-title">Add clinician</h3>
        <form onSubmit={handleAdd} className="form-grid role-block__form">
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
            <button type="submit" className="primary" disabled={addUser.isPending}>
              {addUser.isPending ? 'Adding…' : 'Add user'}
            </button>
          </div>
        </form>
      </div>

      <div className="role-block__panel">
        <h3 className="role-block__panel-title">All users ({users.length})</h3>
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
      </div>
    </OrgConfigBlock>
  )
}
