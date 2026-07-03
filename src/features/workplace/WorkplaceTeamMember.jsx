import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppSession } from '../../lib/AppSessionContext'
import { normalizeRole } from '../../lib/permissions'
import { getAppointmentOrgServices } from '../../lib/store'
import {
  formatWeeklyHoursSummary,
  profileInitials,
  resolveOfferedServiceNames,
} from '../../lib/clinicianAvailability'
import { useTeamMemberProfileQuery } from '../../lib/workplaceQueries'
import PageHeader from '../../components/PageHeader'

function formatRole(role) {
  return normalizeRole(role).replace(/_/g, ' ')
}

export default function WorkplaceTeamMember() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { myWorkplace, session } = useAppSession()

  const { data: member, isPending } = useTeamMemberProfileQuery(
    userId,
    myWorkplace?.id,
    myWorkplace,
  )

  if (!myWorkplace) {
    return (
      <div className="page">
        <PageHeader title="Team member" subtitle="Select a workplace to view team profiles." />
        <div className="card"><p className="text-muted">No workplace linked.</p></div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="page">
        <PageHeader title="Team member" subtitle={myWorkplace.name} />
        <div className="card"><p className="text-muted">Loading profile…</p></div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="page">
        <PageHeader title="Team member" subtitle={myWorkplace.name} />
        <div className="card empty-state">Profile not found or this person is not on your team.</div>
        <button type="button" className="secondary" onClick={() => navigate('/workplace')}>Back to workplace</button>
      </div>
    )
  }

  const isSelf = member.id === session.user.id
  const appointmentServices = getAppointmentOrgServices()
  const offeredServices = resolveOfferedServiceNames(member.workplace_setting, appointmentServices)
  const hoursSummary = member.workplace_setting
    ? formatWeeklyHoursSummary(member.workplace_setting.weekly_hours)
    : null

  return (
    <div className="page">
      <PageHeader
        title={member.full_name}
        subtitle={`${myWorkplace.name} · ${formatRole(member.role)}`}
        actions={(
          <button type="button" className="secondary" onClick={() => navigate('/workplace')}>
            Back to team
          </button>
        )}
      />

      <div className="workplace-profile card">
        <div className="workplace-profile__hero">
          <div className="workplace-profile__photo" aria-hidden={!member.photo_url}>
            {member.photo_url ? (
              <img src={member.photo_url} alt="" />
            ) : (
              <span>{profileInitials(member.full_name)}</span>
            )}
          </div>
          <div className="workplace-profile__hero-text">
            <p className="text-muted">{member.job_title || '—'}</p>
            {member.professional_title && (
              <p className="text-small text-muted">{member.professional_title}</p>
            )}
            {member.hcpc_number && (
              <p className="text-small text-muted">HCPC {member.hcpc_number}</p>
            )}
          </div>
        </div>

        <div className="workplace-profile__grid">
          <div className="workplace-profile__field">
            <span className="workplace-profile__label">Job title</span>
            <span>{member.job_title || '—'}</span>
          </div>
          <div className="workplace-profile__field">
            <span className="workplace-profile__label">Professional title</span>
            <span>{member.professional_title || '—'}</span>
          </div>
          <div className="workplace-profile__field">
            <span className="workplace-profile__label">HCPC number</span>
            <span>{member.hcpc_number || '—'}</span>
          </div>
          <div className="workplace-profile__field">
            <span className="workplace-profile__label">Role at this site</span>
            <span>{formatRole(member.role)}</span>
          </div>
          <div className="workplace-profile__field">
            <span className="workplace-profile__label">Caseload here</span>
            <span>{member.active_caseload} active · {member.caseload_count} total</span>
          </div>
        </div>

        {member.bio && (
          <div className="workplace-profile__bio">
            <span className="workplace-profile__label">About</span>
            <p className="text-muted">{member.bio}</p>
          </div>
        )}

        {(hoursSummary || offeredServices.length > 0) && (
          <div className="workplace-profile__availability">
            <span className="workplace-profile__label">At this site</span>
            {hoursSummary && <p className="text-muted">{hoursSummary}</p>}
            {offeredServices.length > 0 && (
              <ul className="workplace-profile__service-tags">
                {offeredServices.map(name => (
                  <li key={name} className="badge badge-blue">{name}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {member.other_workplaces?.length > 0 && (
          <div className="workplace-profile__other">
            <span className="workplace-profile__label">Also at</span>
            <ul className="workplace-profile__sites">
              {member.other_workplaces.map(wp => (
                <li key={wp.id}>{wp.name} ({formatRole(wp.role)})</li>
              ))}
            </ul>
          </div>
        )}

        {isSelf && (
          <p className="text-small text-muted workplace-profile__self-note">
            This is your profile. Edit your details from{' '}
            <Link to="/profile">Profile settings</Link>.
          </p>
        )}
      </div>
    </div>
  )
}
