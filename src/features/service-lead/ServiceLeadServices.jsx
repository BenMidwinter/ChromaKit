import { useState } from 'react'
import { ORG_SERVICE_TYPES } from '../../lib/mockData'
import {
  SERVICE_COLOR_PRESETS,
  defaultServiceColor,
  normalizeServiceColor,
} from '../../lib/serviceColors'
import { useAddOrgServiceMutation, useOrgServicesQuery } from '../../lib/orgQueries'
import OrgConfigBlock from './blocks/OrgConfigBlock'

const SERVICE_TYPE_HINTS = {
  appointment: 'Direct clinical sessions with clients — tracked on client profiles.',
  admin: 'Documentation, notetaking, and indirect clinical work.',
  busy: 'Travel, breaks, and protected non-input time.',
}

export default function ServiceLeadServices() {
  const { data: services = [] } = useOrgServicesQuery()
  const addService = useAddOrgServiceMutation()
  const [serviceType, setServiceType] = useState('appointment')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(defaultServiceColor('appointment'))
  const [error, setError] = useState('')

  const handleTypeChange = (type) => {
    setServiceType(type)
    setColor(defaultServiceColor(type))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await addService.mutateAsync({
        service_type: serviceType,
        name,
        description,
        color: normalizeServiceColor(color, serviceType),
      })
      setName('')
      setDescription('')
      setServiceType('appointment')
      setColor(defaultServiceColor('appointment'))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <OrgConfigBlock blockId="org_services">
      <div className="role-block__panel">
        <h3 className="role-block__panel-title">Add service</h3>
        <form onSubmit={handleAdd} className="role-block__form form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <span className="form-label">Service type</span>
            <div className="svc-type-picker" role="radiogroup" aria-label="Service type">
              {Object.entries(ORG_SERVICE_TYPES).map(([key, label]) => (
                <label key={key} className={`svc-type-picker__option svc-type-picker__option--${key}`}>
                  <input
                    type="radio"
                    name="service_type"
                    value={key}
                    checked={serviceType === key}
                    onChange={() => handleTypeChange(key)}
                  />
                  <span className="svc-type-picker__label">{label}</span>
                </label>
              ))}
            </div>
            <p className="text-small text-muted svc-type-picker__hint">
              {SERVICE_TYPE_HINTS[serviceType]}
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="svc-name">Service name</label>
            <input
              id="svc-name"
              className="paper-input"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="e.g. Music Therapy or Notetaking"
            />
          </div>

          <div className="form-group">
            <span className="form-label">Service colour</span>
            <div className="svc-color-picker" role="group" aria-label="Service colour">
              {SERVICE_COLOR_PRESETS.map(preset => (
                <button
                  key={preset}
                  type="button"
                  className={`svc-color-picker__swatch${color === preset ? ' svc-color-picker__swatch--active' : ''}`}
                  style={{ '--svc-color': preset }}
                  onClick={() => setColor(preset)}
                  aria-label={`Colour ${preset}`}
                  aria-pressed={color === preset}
                />
              ))}
              <label className="svc-color-picker__custom">
                <span className="sr-only">Custom colour</span>
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="svc-desc">Description</label>
            <textarea
              id="svc-desc"
              className="paper-input"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of what this service covers…"
            />
          </div>

          {error && <p className="form-error" style={{ gridColumn: '1 / -1' }}>{error}</p>}
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="primary" disabled={addService.isPending}>
              {addService.isPending ? 'Adding…' : 'Add service'}
            </button>
          </div>
        </form>
      </div>

      <div className="role-block__panel">
        <h3 className="role-block__panel-title">All services ({services.length})</h3>
        <div className="svc-list">
          {services.map(svc => (
            <article
              key={svc.id}
              className={`svc-card svc-card--${svc.service_type}`}
              style={{ '--svc-color': svc.color || defaultServiceColor(svc.service_type) }}
            >
              <span className="svc-card__color" aria-hidden />
              <span className={`svc-card__type svc-card__type--${svc.service_type}`}>
                {ORG_SERVICE_TYPES[svc.service_type] || svc.service_type}
              </span>
              <h4 className="svc-card__name">{svc.name}</h4>
              {svc.description && (
                <p className="svc-card__desc text-small text-muted">{svc.description}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </OrgConfigBlock>
  )
}
