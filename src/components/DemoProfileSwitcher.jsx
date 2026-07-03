import { DEMO_PERSONAS } from '../lib/demoPersonas'

export default function DemoProfileSwitcher({ value, onChange }) {
  const active = DEMO_PERSONAS.find(p => p.id === value) || DEMO_PERSONAS[0]

  return (
    <div className="role-select demo-profile-switcher">
      <label htmlFor="demo-profile-select" className="role-select__label">
        View as
      </label>
      <select
        id="demo-profile-select"
        className="role-select__control demo-profile-switcher__control"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Demo profile switcher"
      >
        {DEMO_PERSONAS.map(persona => (
          <option key={persona.id} value={persona.id}>
            {persona.name} — {persona.label}
          </option>
        ))}
      </select>
      <span className="demo-profile-switcher__hint" title={`Active demo identity: ${active.name}`}>
        {active.name}
      </span>
    </div>
  )
}
