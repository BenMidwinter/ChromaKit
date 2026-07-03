import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import PageHeader from './PageHeader'
import { getProfile, updateProfile, getMyWorkplace } from '../lib/store'

export default function Profile() {
  const { session, refreshClients, myWorkplace } = useOutletContext()
  const [fullName, setFullName] = useState('')
  const [hcpcNumber, setHcpcNumber] = useState('')
  const [jobTitle, setJobTitle] = useState('Music Therapist')
  const [signatureText, setSignatureText] = useState('')
  const [saving, setSaving] = useState(false)

  const workplace = myWorkplace || getMyWorkplace(session.user.id)

  useEffect(() => {
    const profile = getProfile(session.user.id)
    if (profile) {
      setFullName(profile.full_name || '')
      setHcpcNumber(profile.hcpc_number || '')
      setJobTitle(profile.job_title || 'Music Therapist')
      setSignatureText(profile.signature_text || profile.full_name || '')
    }
  }, [session.user.id])

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    updateProfile(session.user.id, {
      full_name: fullName,
      hcpc_number: hcpcNumber,
      job_title: jobTitle,
      signature_text: signatureText,
    })
    refreshClients()
    setSaving(false)
  }

  return (
    <div className="page">
      <PageHeader title="Profile" subtitle="Your clinician profile and workplace membership." />

      <form onSubmit={handleSave} className="card" style={{ maxWidth: '560px', marginBottom: '1.25rem' }}>
        <h3 className="card__title">Clinician details</h3>
        <div className="form-group">
          <label>Full name</label>
          <input className="paper-input" value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>HCPC number</label>
          <input className="paper-input" value={hcpcNumber} onChange={e => setHcpcNumber(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Job title</label>
          <input className="paper-input" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Signature line</label>
          <input
            className="paper-input"
            value={signatureText}
            onChange={e => setSignatureText(e.target.value)}
            placeholder="Printed name for progress notes"
          />
          <p className="text-small text-muted" style={{ marginTop: '0.35rem' }}>
            Used when you insert a signature in progress notes — typically your printed name or sign-off.
          </p>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
        </div>
      </form>

      <div className="card" style={{ maxWidth: '560px' }}>
        <h3 className="card__title">Workplace</h3>
        {workplace ? (
          <p className="text-muted">
            <strong>{workplace.name}</strong> — {workplace.role.replace(/_/g, ' ')}
          </p>
        ) : (
          <p className="text-muted">No workplace linked yet.</p>
        )}
      </div>
    </div>
  )
}
