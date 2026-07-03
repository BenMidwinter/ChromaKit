import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getProfile, updateProfile, getMyWorkplace } from '../../lib/store'

export default function ProfileDetails() {
  const context = useOutletContext()
  const session = context?.session
  const refreshClients = context?.refreshClients
  const myWorkplace = context?.myWorkplace

  const [fullName, setFullName] = useState('')
  const [hcpcNumber, setHcpcNumber] = useState('')
  const [jobTitle, setJobTitle] = useState('Music Therapist')
  const [signatureText, setSignatureText] = useState('')
  const [saving, setSaving] = useState(false)

  const workplace = session ? (myWorkplace || getMyWorkplace(session.user.id)) : null

  useEffect(() => {
    if (!session) return
    const profile = getProfile(session.user.id)
    if (profile) {
      setFullName(profile.full_name || '')
      setHcpcNumber(profile.hcpc_number || '')
      setJobTitle(profile.job_title || 'Music Therapist')
      setSignatureText(profile.signature_text || profile.full_name || '')
    }
  }, [session])

  if (!session) {
    return <p className="text-muted">Profile session unavailable. Return to Home and try again.</p>
  }

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
    <div className="profile-details">
      <form onSubmit={handleSave} className="profile-panel">
        <h2 className="profile-panel__title">Clinician details</h2>
        <div className="form-group">
          <label htmlFor="profile-full-name">Full name</label>
          <input
            id="profile-full-name"
            className="paper-input"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profile-hcpc">HCPC number</label>
          <input
            id="profile-hcpc"
            className="paper-input"
            value={hcpcNumber}
            onChange={e => setHcpcNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profile-job-title">Job title</label>
          <input
            id="profile-job-title"
            className="paper-input"
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profile-signature">Signature line</label>
          <input
            id="profile-signature"
            className="paper-input"
            value={signatureText}
            onChange={e => setSignatureText(e.target.value)}
            placeholder="Printed name for progress notes"
          />
          <p className="text-small text-muted profile-panel__hint">
            Used when you insert a signature in progress notes — typically your printed name or sign-off.
          </p>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>

      <section className="profile-panel">
        <h2 className="profile-panel__title">Workplace</h2>
        {workplace ? (
          <p className="text-muted">
            <strong>{workplace.name}</strong> — {workplace.role.replace(/_/g, ' ')}
          </p>
        ) : (
          <p className="text-muted">No workplace linked yet.</p>
        )}
      </section>
    </div>
  )
}
