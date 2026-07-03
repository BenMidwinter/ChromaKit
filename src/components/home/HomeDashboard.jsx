import { useEffect, useMemo, useState } from 'react'
import {
  buildClinicianBlockData,
  buildAdministratorBlockData,
  buildClinicalLeadBlockData,
  filterHomeOversightWorkplaces,
} from '../../lib/homeBlocks'
import { getVisibleHomeBlocks, ROLE_BLOCK_META } from '../../lib/roleBlocks'
import HomeClinicianBlock from './HomeClinicianBlock'
import HomeAdministratorBlock from './HomeAdministratorBlock'
import HomeClinicalLeadBlock from './HomeClinicalLeadBlock'
import HomeWorkplaceScopeTitle from './HomeWorkplaceScopeTitle'

export default function HomeDashboard({
  session,
  myWorkplaces,
  activePersona,
  demoRole,
  blurNames,
}) {
  const blocks = useMemo(() => getVisibleHomeBlocks(demoRole), [demoRole])

  const oversightWorkplaces = useMemo(
    () => filterHomeOversightWorkplaces(myWorkplaces),
    [myWorkplaces],
  )

  const [oversightIndex, setOversightIndex] = useState(0)

  useEffect(() => {
    if (oversightIndex >= oversightWorkplaces.length) {
      setOversightIndex(0)
    }
  }, [oversightIndex, oversightWorkplaces.length])

  const oversightWorkplace = oversightWorkplaces[oversightIndex] ?? null

  const scopeTitleProps = {
    workplaces: oversightWorkplaces,
    index: oversightIndex,
    onIndexChange: setOversightIndex,
  }

  const clinicianData = useMemo(
    () => buildClinicianBlockData({ session, persona: activePersona }),
    [session, activePersona],
  )

  const administratorData = useMemo(
    () => buildAdministratorBlockData({ session, workplace: oversightWorkplace }),
    [session, oversightWorkplace],
  )

  const clinicalLeadData = useMemo(
    () => buildClinicalLeadBlockData({ session, workplace: oversightWorkplace, demoRole }),
    [session, oversightWorkplace, demoRole],
  )

  return (
    <div className="role-block-stack">
      {blocks.includes('clinician') && (
        <HomeClinicianBlock data={clinicianData} blurNames={blurNames} />
      )}
      {blocks.includes('administrator') && (
        <HomeAdministratorBlock
          data={administratorData}
          blurNames={blurNames}
          title={(
            <HomeWorkplaceScopeTitle
              baseTitle={ROLE_BLOCK_META.administrator.title}
              {...scopeTitleProps}
            />
          )}
        />
      )}
      {blocks.includes('clinical_lead') && (
        <HomeClinicalLeadBlock
          data={clinicalLeadData}
          blurNames={blurNames}
          title={(
            <HomeWorkplaceScopeTitle
              baseTitle={ROLE_BLOCK_META.clinical_lead.title}
              {...scopeTitleProps}
            />
          )}
        />
      )}
    </div>
  )
}
