import { useMemo } from 'react'
import {
  buildClinicianBlockData,
  buildAdministratorBlockData,
  buildClinicalLeadBlockData,
} from '../../lib/homeBlocks'
import { getVisibleHomeBlocks } from '../../lib/roleBlocks'
import HomeClinicianBlock from './HomeClinicianBlock'
import HomeAdministratorBlock from './HomeAdministratorBlock'
import HomeClinicalLeadBlock from './HomeClinicalLeadBlock'

export default function HomeDashboard({
  session,
  myWorkplace,
  clients,
  activePersona,
  demoRole,
  blurNames,
}) {
  const blocks = useMemo(() => getVisibleHomeBlocks(demoRole), [demoRole])

  const clinicianData = useMemo(
    () => buildClinicianBlockData({ session, myWorkplace, persona: activePersona }),
    [session, myWorkplace, activePersona],
  )

  const administratorData = useMemo(
    () => buildAdministratorBlockData({ session, myWorkplace }),
    [session, myWorkplace],
  )

  const clinicalLeadData = useMemo(
    () => buildClinicalLeadBlockData({ session, myWorkplace, clients, demoRole }),
    [session, myWorkplace, clients, demoRole],
  )

  return (
    <div className="role-block-stack">
      {blocks.includes('clinician') && (
        <HomeClinicianBlock data={clinicianData} blurNames={blurNames} />
      )}
      {blocks.includes('administrator') && (
        <HomeAdministratorBlock data={administratorData} blurNames={blurNames} />
      )}
      {blocks.includes('clinical_lead') && (
        <HomeClinicalLeadBlock data={clinicalLeadData} blurNames={blurNames} />
      )}
    </div>
  )
}
