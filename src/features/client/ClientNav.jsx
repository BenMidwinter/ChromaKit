import { NavLink } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { canAccessClientNavSection } from '../../lib/permissions'

const NAV_SECTIONS = [
  {
    items: [
      { segment: '', label: 'Overview', end: true, section: 'overview' },
    ],
  },
  {
    label: 'Clinical',
    items: [
      { segment: 'notes-history', label: 'Notes history', section: 'notes-history' },
      { segment: 'appointments', label: 'Appointments', section: 'appointments' },
      { segment: 'case-history', label: 'Case history', section: 'case-history' },
    ],
  },
  {
    label: 'Records',
    items: [
      { segment: 'letters', label: 'Letters', section: 'letters' },
      { segment: 'documents', label: 'Working documents', section: 'documents' },
      { segment: 'files', label: 'Files', section: 'files' },
      { segment: 'forms', label: 'Forms', section: 'forms' },
      { segment: 'contacts', label: 'Contacts', section: 'contacts' },
      { segment: 'outcomes', label: 'Outcome measures', section: 'outcomes' },
    ],
  },
]

export default function ClientNav({ clientId, client }) {
  const base = `/clients/${clientId}`
  const { session, myWorkplace } = useOutletContext()
  const userId = session?.user?.id

  const isVisible = (section) => {
    if (section === 'overview') return true
    return canAccessClientNavSection(section, myWorkplace, client, userId)
  }

  return (
    <nav className="client-sidebar" aria-label="Client sections">
      {NAV_SECTIONS.map((section, i) => {
        const items = section.items.filter(item => isVisible(item.section))
        if (!items.length) return null

        return (
          <div key={section.label || `section-${i}`} className="client-sidebar__section">
            {section.label && (
              <h3 className="client-sidebar__heading">{section.label}</h3>
            )}
            <ul className="client-sidebar__list">
              {items.map(({ segment, label, end }) => (
                <li key={segment || 'overview'}>
                  <NavLink
                    to={segment ? `${base}/${segment}` : base}
                    end={end}
                    className={({ isActive }) =>
                      `client-sidebar__link${isActive ? ' client-sidebar__link--active' : ''}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
