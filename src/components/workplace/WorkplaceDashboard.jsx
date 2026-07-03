import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getWorkplaceMembers, updateWorkplaceMemberRole } from '../../lib/store'
import { usePermissions } from '../../lib/usePermissions'
import { getVisibleWorkplaceBlocks } from '../../lib/roleBlocks'
import { ROLES } from '../../lib/permissions'
import PageHeader from '../PageHeader'
import WorkplaceContextPicker from '../WorkplaceContextPicker'
import WorkplaceClinicianBlock, {
  WorkplaceManagementBlock,
} from './WorkplaceBlocks'
import { FindWorkplacePanel } from './WorkplacePanels'

export default function WorkplaceDashboard() {
  const {
    myWorkplace,
    myWorkplaces,
    activeWorkplaceId,
    setActiveWorkplaceId,
    session,
    refreshMemberships,
  } = useOutletContext()
  const perms = usePermissions()
  const [tick, setTick] = useState(0)
  const [roleBusyId, setRoleBusyId] = useState(null)
  const [roleError, setRoleError] = useState('')

  const bump = () => {
    refreshMemberships?.()
    setTick(t => t + 1)
  }

  const blocks = useMemo(() => getVisibleWorkplaceBlocks(perms.role), [perms.role])
  const isClinicalLead = perms.role === ROLES.CLINICAL_LEAD

  if (!myWorkplace || !myWorkplaces.length) {
    return (
      <div className="page workplace-hub">
        <PageHeader
          title="My workplace & team"
          subtitle="Search for a workplace and request to join — a clinical lead will review your request."
        />
        <div className="role-block-stack">
          <FindWorkplacePanel userId={session.user.id} revision={tick} onChanged={bump} />
        </div>
      </div>
    )
  }

  const members = getWorkplaceMembers(myWorkplace.id, myWorkplace)
  void tick

  const handleRoleChange = async (memberUserId, newRole) => {
    setRoleError('')
    setRoleBusyId(memberUserId)
    try {
      updateWorkplaceMemberRole(myWorkplace.id, memberUserId, newRole, session.user.id, myWorkplace)
      bump()
    } catch (err) {
      setRoleError(err.message)
    } finally {
      setRoleBusyId(null)
    }
  }

  return (
    <div className="page workplace-hub">
      <PageHeader
        title="My workplace & team"
        subtitle={`${myWorkplace.name} · ${perms.roleLabel}`}
        toolbar={(
          <WorkplaceContextPicker
            compact
            workplaces={myWorkplaces}
            value={activeWorkplaceId}
            onChange={setActiveWorkplaceId}
          />
        )}
      />

      {roleError && <p className="form-error">{roleError}</p>}

      <div className="role-block-stack">
        {blocks.includes('clinician') && (
          <WorkplaceClinicianBlock
            session={session}
            myWorkplace={myWorkplace}
            members={members}
            revision={tick}
            onChanged={bump}
          />
        )}
        {blocks.includes('administrator') && (
          <WorkplaceManagementBlock
            myWorkplace={myWorkplace}
            workplaceId={myWorkplace.id}
            userId={session.user.id}
            members={members}
            revision={tick}
            onChanged={bump}
            onRoleChange={handleRoleChange}
            roleBusyId={roleBusyId}
            showPortfolioSearch={isClinicalLead}
          />
        )}
      </div>
    </div>
  )
}
