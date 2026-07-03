import { NavLink, useLocation } from 'react-router-dom'
import { isServiceLeadNavItemActive, SERVICE_LEAD_NAV_GROUPS } from '../../lib/serviceLeadNav'

export default function ServiceLeadNav() {
  const { pathname } = useLocation()

  return (
    <nav className="service-lead-nav" aria-label="Service Lead">
      <div className="service-lead-nav__groups">
        {SERVICE_LEAD_NAV_GROUPS.map((group, groupIndex) => (
          <div
            key={group.id}
            className={`service-lead-nav__group${group.label ? ' service-lead-nav__group--labeled' : ''}`}
          >
            {group.label && (
              <span className="service-lead-nav__group-label" aria-hidden>
                {group.label}
              </span>
            )}
            <ul className="service-lead-nav__list">
              {group.items.map(item => {
                const active = isServiceLeadNavItemActive(pathname, item)
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={`service-lead-nav__link${active ? ' service-lead-nav__link--active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
            {groupIndex < SERVICE_LEAD_NAV_GROUPS.length - 1 && (
              <span className="service-lead-nav__divider" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
