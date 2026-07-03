import { useState } from 'react'
import { getAllWorkplaces, addWorkplace } from '../../lib/store'

export default function ServiceLeadWorkplaces() {
  const [workplaces, setWorkplaces] = useState(() => getAllWorkplaces())
  const [name, setName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refresh = () => setWorkplaces(getAllWorkplaces())

  const handleAdd = (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      addWorkplace({ name, join_code: joinCode })
      setName('')
      setJoinCode('')
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
          <h2>Workplaces</h2>
          <p className="text-muted text-small">
            Create organisation workplaces. Clinicians search for a site and request to join; clinical leads approve membership. Join codes are for internal reference only.
          </p>
        </div>
      </header>

      <section className="service-lead-panel__section">
        <h3 className="service-lead-panel__section-title">Add workplace</h3>
        <form onSubmit={handleAdd} className="form-grid service-lead-panel__form">
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
            <button type="submit" className="primary" disabled={saving}>{saving ? 'Adding…' : 'Add workplace'}</button>
          </div>
        </form>
      </section>

      <section className="service-lead-panel__section">
        <h3 className="service-lead-panel__section-title">All workplaces ({workplaces.length})</h3>
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
      </section>
    </div>
  )
}
