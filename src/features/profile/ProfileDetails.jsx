import { useAppSession } from '../../lib/AppSessionContext'
import {
  ProfileIdentityBlock,
  ProfileAvailabilityBlock,
  ProfileLetterheadBlock,
  ProfileWorkplaceBlock,
} from './ProfileBlocks'

export default function ProfileDetails() {
  const { session, refreshClients, myWorkplace, myWorkplaces } = useAppSession()

  if (!session) {
    return <p className="text-muted">Profile session unavailable. Return to Home and try again.</p>
  }

  return (
    <div className="role-block-stack profile-hub">
      <div className="profile-hub__identity-row">
        <ProfileIdentityBlock session={session} onSaved={refreshClients} />
        <ProfileWorkplaceBlock
          session={session}
          myWorkplace={myWorkplace}
          myWorkplaces={myWorkplaces}
        />
      </div>
      <ProfileAvailabilityBlock userId={session.user.id} onSaved={refreshClients} />
      <ProfileLetterheadBlock userId={session.user.id} />
    </div>
  )
}
