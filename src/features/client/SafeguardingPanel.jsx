import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import RecordListLayout from '../../components/RecordListLayout'
import { useToast } from '../../components/ui'
import { useAppSession } from '../../lib/AppSessionContext'
import { usePermissions } from '../../lib/usePermissions'
import { formatDisplayDate } from '../../lib/dateArchitecture'
import {
  listSafeguardingConcerns,
  closeSafeguardingConcern,
} from '../../lib/safeguardingConcerns'

export default function SafeguardingPanel() {
  const { client } = useOutletContext()
  const toast = useToast()
  const { activePersona, session } = useAppSession()
  const perms = usePermissions(client)
  const [tick, setTick] = useState(0)
  void tick

  const concerns = listSafeguardingConcerns(client.id)
  const canClose = perms.canCloseSafeguardingConcern

  const handleClose = (concernId) => {
    if (!canClose) {
      toast.error('Only a clinical lead or safeguarding lead can close a concern.')
      return
    }
    const closedBy = activePersona?.name || session?.user?.name || 'Clinical lead'
    closeSafeguardingConcern(client.id, concernId, closedBy)
    setTick(n => n + 1)
    toast.success('Safeguarding concern marked Closed.')
  }

  return (
    <RecordListLayout
      title="Safeguarding"
      subtitle="MyConcern references linked to this client. Open concerns stay visible until a clinical lead or safeguarding lead closes them."
    >
      {concerns.length === 0 ? (
        <p className="role-block__empty">No safeguarding references logged for this client yet.</p>
      ) : (
        <ul className="safeguarding-list">
          {concerns.map(concern => (
            <li key={concern.id} className="safeguarding-list__item">
              <div className="safeguarding-list__main">
                <div className="safeguarding-list__head">
                  <strong className="safeguarding-list__ref">{concern.myconcern_ref}</strong>
                  <span className={`safeguarding-tag safeguarding-tag--${concern.status}`}>
                    {concern.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>
                <p className="safeguarding-list__summary">{concern.summary}</p>
                <p className="safeguarding-list__meta">
                  Logged {formatDisplayDate(concern.created_at)} by {concern.created_by}
                  {concern.status === 'closed' && concern.closed_at
                    ? ` · Closed ${formatDisplayDate(concern.closed_at)} by ${concern.closed_by}`
                    : ''}
                </p>
              </div>
              {concern.status === 'open' && (
                <div className="safeguarding-list__actions">
                  {canClose ? (
                    <button type="button" className="secondary" onClick={() => handleClose(concern.id)}>
                      Mark closed
                    </button>
                  ) : (
                    <span className="safeguarding-list__hint">
                      Clinicians and admin officers cannot close
                    </span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </RecordListLayout>
  )
}
