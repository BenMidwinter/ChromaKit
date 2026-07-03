import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/service-lead', label: 'Overview', end: true },
  { to: '/service-lead/workplaces', label: 'Workplaces' },
  { to: '/service-lead/users', label: 'Users' },
  { to: '/service-lead/services', label: 'Services' },
  { to: '/service-lead/progress-note-templates', label: 'Note templates' },
  { to: '/service-lead/letter-templates', label: 'Letter templates' },
  { to: '/service-lead/outcome-forms', label: 'Outcome forms' },
]

export default function ServiceLeadNav() {
  return (
    <nav className="overflow-x-auto border-b border-line-light bg-surface" aria-label="Service Lead">
      <ul className="m-0 flex list-none flex-nowrap gap-0 px-7 py-0">
        {NAV_ITEMS.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `block whitespace-nowrap border-b-[3px] px-5 py-[0.9rem] text-[0.9375rem] no-underline max-md:px-4 max-md:py-3 max-md:text-[0.875rem] ${
                  isActive
                    ? 'border-b-primary font-bold text-primary-dark'
                    : 'border-b-transparent font-medium text-subtle hover:text-accent hover:no-underline'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
