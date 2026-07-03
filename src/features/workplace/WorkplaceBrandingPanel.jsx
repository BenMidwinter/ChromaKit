import { useEffect, useMemo, useState } from 'react'
import LetterheadBrandingForm from '../../components/LetterheadBrandingForm'
import { resolveWorkplaceBranding } from '../../lib/workplaceBranding'
import {
  useUpdateWorkplaceBrandingMutation,
  useWorkplaceRecordQuery,
} from '../../lib/workplaceQueries'

export default function WorkplaceBrandingPanel({ workplaceId, userId, myWorkplace, onChanged }) {
  const { data: workplace } = useWorkplaceRecordQuery(workplaceId, myWorkplace)
  const updateMutation = useUpdateWorkplaceBrandingMutation()
  const [logoUrl, setLogoUrl] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [addressLine3, setAddressLine3] = useState('')
  const [postcode, setPostcode] = useState('')
  const [country, setCountry] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!workplace) return
    const branding = resolveWorkplaceBranding(workplace)
    setLogoUrl(workplace.logo_url || '')
    setAddressLine1(branding.address_line1)
    setAddressLine2(branding.address_line2)
    setAddressLine3(branding.address_line3)
    setPostcode(branding.postcode)
    setCountry(branding.country)
  }, [workplace])

  const previewBranding = useMemo(() => resolveWorkplaceBranding({
    name: workplace?.name || myWorkplace?.name,
    logo_url: logoUrl || null,
    address_line1: addressLine1,
    address_line2: addressLine2,
    address_line3: addressLine3,
    postcode,
    country,
  }), [workplace?.name, myWorkplace?.name, logoUrl, addressLine1, addressLine2, addressLine3, postcode, country])

  const handleSave = async (event) => {
    event.preventDefault()
    setError('')
    setSaved(false)
    try {
      await updateMutation.mutateAsync({
        workplaceId,
        actorId: userId,
        myWorkplace,
        payload: {
          logo_url: logoUrl,
          address_line1: addressLine1,
          address_line2: addressLine2,
          address_line3: addressLine3,
          postcode,
          country,
        },
      })
      setSaved(true)
      onChanged?.()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!workplace) return null

  return (
    <div className="role-block__panel">
      <LetterheadBrandingForm
        displayName={previewBranding.name}
        logoUrl={logoUrl}
        addressLine1={addressLine1}
        addressLine2={addressLine2}
        addressLine3={addressLine3}
        postcode={postcode}
        country={country}
        onLogoUrlChange={setLogoUrl}
        onAddressLine1Change={setAddressLine1}
        onAddressLine2Change={setAddressLine2}
        onAddressLine3Change={setAddressLine3}
        onPostcodeChange={setPostcode}
        onCountryChange={setCountry}
        previewBranding={previewBranding}
        error={error}
        savedMessage={saved ? 'Workplace information saved — new downloads will use these details.' : ''}
        saving={updateMutation.isPending}
        saveLabel="Save workplace information"
        onSubmit={handleSave}
      />
    </div>
  )
}
