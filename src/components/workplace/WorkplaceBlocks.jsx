import { useNavigate, Link } from 'react-router-dom'
import RoleBlockShell from '../RoleBlockShell'
import { FindWorkplacePanel } from './WorkplacePanels'
import {
  JoinRequestsPanel,
  InviteCliniciansPanel,
  AuditLogPanel,
  formatMemberRole,
} from './WorkplaceLeadPanels'

export function TeamTable({
  members,
  showCaseload = false,
  canEditRoles = false,
  onRoleChange,
  roleBusyId,
}) {
  const navigate = useNavigate()

  if (members.length === 0) {
    return <div className="empty-state">No team members yet.</div>
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table role-block__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Job title</th>
            {showCaseload && <th>Caseload</th>}
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr
              key={m.user_id}
              className={canEditRoles ? '' : 'hover-row'}
              onClick={canEditRoles ? undefined : () => navigate(`/workplace/team/${m.user_id}`)}
            >
              <td><strong>{m.full_name}</strong></td>
              <td>
                {canEditRoles ? (
                  <select
                    className="paper-input paper-input--compact"
                    value={m.role}
                    disabled={roleBusyId === m.user_id}
                    onChange={e => onRoleChange?.(m.user_id, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    aria-label={`Role for ${m.full_name}`}
                  >
                    <option value="clinician">clinician</option>
                    <option value="administrator">administrator</option>
                    <option value="clinical_lead">clinical lead</option>
                  </select>
                ) : (
                  formatMemberRole(m.role)
                )}
              </td>
              <td className="text-small text-muted">{m.job_title || '—'}</td>
              {showCaseload && <td>{m.caseload_count}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Clinicians: read-only team roster + request to join other workplaces. */
export default function WorkplaceClinicianBlock({
  session,
  myWorkplace,
  members,
  revision,
  onChanged,
}) {
  return (
    <RoleBlockShell blockId="clinician">
      {myWorkplace && (
        <div className="role-block__panel">
          <h3 className="role-block__panel-title">Your team ({members.length})</h3>
          <p className="text-muted text-small role-block__intro">
            Colleagues at {myWorkplace.name}. Open a profile to view their caseload overview — not their journal.
          </p>
          <TeamTable members={members} />
        </div>
      )}

      <FindWorkplacePanel userId={session.user.id} revision={revision} onChanged={onChanged} />
    </RoleBlockShell>
  )
}

/** Administrators & clinical leads: team management, caseload, invites, audit. */
export function WorkplaceManagementBlock({
  myWorkplace,
  workplaceId,
  userId,
  members,
  revision,
  onChanged,
  onRoleChange,
  roleBusyId,
  showPortfolioSearch = false,
}) {
  return (
    <RoleBlockShell
      blockId="administrator"
      actions={<Link to="/clients" className="role-block__link">All clients</Link>}
    >
      <div className="role-block__panel">
        <h3 className="role-block__panel-title">Team &amp; caseload ({members.length})</h3>
        <p className="text-muted text-small role-block__intro">
          Adjust roles, review caseload numbers, and manage membership.
        </p>
        <TeamTable
          members={members}
          showCaseload
          canEditRoles
          onRoleChange={onRoleChange}
          roleBusyId={roleBusyId}
        />
      </div>

      <JoinRequestsPanel
        workplaceId={workplaceId}
        userId={userId}
        myWorkplace={myWorkplace}
        revision={revision}
        onChanged={onChanged}
      />

      <InviteCliniciansPanel
        workplaceId={workplaceId}
        userId={userId}
        myWorkplace={myWorkplace}
        revision={revision}
        onChanged={onChanged}
      />

      <AuditLogPanel workplaceId={workplaceId} myWorkplace={myWorkplace} revision={revision} />

      {showPortfolioSearch && (
        <FindWorkplacePanel userId={userId} revision={revision} onChanged={onChanged} />
      )}
    </RoleBlockShell>
  )
}
