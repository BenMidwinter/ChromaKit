import { useState } from 'react'
import { useAddWorkplaceMutation, useOrgWorkplacesQuery } from '../../lib/orgQueries'
import OrgConfigBlock from './blocks/OrgConfigBlock'

export default function ServiceLeadWorkplaces() {
  const { data: workplaces = [] } = useOrgWorkplacesQuery()
  const addWorkplace = useAddWorkplaceMutation()
  const [name, setName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await addWorkplace.mutateAsync({ name, join_code: joinCode })
      setName('')
      setJoinCode('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <OrgConfigBlock blockId="org_workplaces">
      <div className="role-block__panel">
        <h3 className="role-block__panel-title">Add workplace</h3>
        <form onSubmit={handleAdd} className="form-grid role-block__form">
          <div className="form-group">
            <label>Workplace name</label>
            <input className="paper-input" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Chroma North Hub" />
          </div>
          <div className="form-group">
            <label>Join code</label>
            <input className="paper-input" value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="Auto-generated if blank" />
          </div>
          {error && <p className="form-error" style={{ gridColumn: '1 / -1' }}>{error}</p>}
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="primary" disabled={addWorkplace.isPending}>
              {addWorkplace.isPending ? 'Adding…' : 'Add workplace'}
            </button>
          </div>
        </form>
      </div>

      <div className="role-block__panel">
        <h3 className="role-block__panel-title">All workplaces ({workplaces.length})</h3>
        <div className="lead-table-wrap">
          <table className="lead-table">
            <thead>
              <tr><th>Name</th><th>Join code</th><th>ID</th></tr>
            </thead>
            <tbody>
              {workplaces.map(wp => (
                <tr key={wp.id}>
                  <td><strong>{wp.name}</strong></td>
                  <td><code>{wp.join_code}</code></td>
                  <td className="text-small text-muted">{wp.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </OrgConfigBlock>
  )
}
