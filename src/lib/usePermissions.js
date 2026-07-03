import { useOutletContext } from 'react-router-dom'
import { buildPermissions, ROLES } from './permissions'

/** Permissions for the current user, optional client, and demo role override. */
export function usePermissions(client = null) {
  const { session, myWorkplace, demoRole } = useOutletContext()
  const base = buildPermissions(myWorkplace, client, session?.user?.id)
  return {
    ...base,
    blurClientIdentity: demoRole === ROLES.SERVICE_LEAD,
    isServiceLeadView: demoRole === ROLES.SERVICE_LEAD,
  }
}
