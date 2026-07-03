import { NavLink } from 'react-router-dom'
import { useAppSession } from '../../lib/AppSessionContext'
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

const linkClass = ({ isActive }) => [
  'block border-l-[3px] border-transparent px-4 py-2.5 text-sm font-medium leading-snug text-subtle no-underline transition-colors',
  'hover:border-transparent hover:bg-zone-muted hover:text-accent hover:no-underline',
  isActive
    ? 'border-l-primary bg-primary-light font-bold text-primary-dark'
    : '',
].filter(Boolean).join(' ')

export default function ClientNav({ clientId, client }) {
  const base = `/clients/${clientId}`
  const { session, myWorkplace } = useAppSession()
  const userId = session?.user?.id

  const isVisible = (section) => {
    if (section === 'overview') return true
    return canAccessClientNavSection(section, myWorkplace, client, userId)
  }

  return (
    <nav
      className="sticky top-0 flex w-[13.5rem] shrink-0 flex-col gap-0 self-start overflow-x-hidden overflow-y-auto border-r border-line-light bg-surface px-0 pt-3 pb-5 max-h-[calc(100vh-8rem)]"
      aria-label="Client sections"
    >
      {NAV_SECTIONS.map((section, i) => {
        const items = section.items.filter(item => isVisible(item.section))
        if (!items.length) return null

        return (
          <div key={section.label || `section-${i}`} className={`flex flex-col ${i > 0 ? 'pt-2.5' : ''}`}>
            {section.label && (
              <h3 className="m-0 block px-4 pt-1.5 pb-2 text-[0.68rem] font-bold uppercase tracking-wide text-subtle">
                {section.label}
              </h3>
            )}
            <ul className="m-0 flex list-none flex-col gap-0 p-0">
              {items.map(({ segment, label, end }) => (
                <li key={segment || 'overview'}>
                  <NavLink to={segment ? `${base}/${segment}` : base} end={end} className={linkClass}>
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
