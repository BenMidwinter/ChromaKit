import { useEffect, useState, useCallback, useMemo } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CLINICIAN_PROFILES } from '../lib/mockData'
import { getMyWorkplace } from '../lib/store'
import { useWorkplaceContextsQuery, useStoreRefreshers } from '../lib/queries'
import { ROLES, workplaceRoleForDemo } from '../lib/permissions'
import { DEFAULT_PERSONA_ID, getPersonaById } from '../lib/demoPersonas'
import DemoProfileSwitcher from './DemoProfileSwitcher'
import ThemeToggle from './ThemeToggle'
import { RouteErrorBoundary } from './ErrorBoundary'
import { AppSessionProvider } from '../lib/AppSessionContext'

const NAV_ITEMS = [
  { to: '/home', label: 'Home', end: true },
  { to: '/calendar', label: 'Calendar' },
  { to: '/active-cases', label: 'Active Cases' },
  { to: '/clients', label: 'All Clients' },
  { to: '/reporting', label: 'Reporting' },
]

function BuildingIcon() {
  return (
    <svg className="top-nav__utility-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M4 21V8l8-4 8 4v13h-6v-7H10v7H4zm2-2h2v-5h4v5h2V9.5l-6-3-6 3V19z"
      />
    </svg>
  )
}

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [personaId, setPersonaId] = useState(DEFAULT_PERSONA_ID)
  const activePersona = useMemo(() => getPersonaById(personaId), [personaId])
  const demoRole = activePersona.role

  const session = useMemo(() => {
    const profile = CLINICIAN_PROFILES.find(p => p.id === activePersona.userId)
    return {
      user: {
        id: activePersona.userId,
        email: `${activePersona.name.toLowerCase()}@chromakit.local`,
        name: activePersona.name,
        full_name: profile?.full_name || activePersona.name,
        isAdmin: demoRole === ROLES.ADMINISTRATOR || demoRole === ROLES.SERVICE_LEAD,
        isServiceLead: activePersona.serviceLead === true,
      },
    }
  }, [activePersona, demoRole])

  const [menuOpen, setMenuOpen] = useState(false)

  const workplaceContextsQuery = useWorkplaceContextsQuery({
    userId: session.user.id,
    demoRole,
  })
  const myWorkplaces = useMemo(
    () => workplaceContextsQuery.data ?? [],
    [workplaceContextsQuery.data],
  )

  const [activeWorkplaceId, setActiveWorkplaceId] = useState(() => myWorkplaces[0]?.id ?? null)

  useEffect(() => {
    if (!activeWorkplaceId && myWorkplaces.length) {
      setActiveWorkplaceId(myWorkplaces[0].id)
    } else if (activeWorkplaceId && !myWorkplaces.some(w => w.id === activeWorkplaceId)) {
      setActiveWorkplaceId(myWorkplaces[0]?.id ?? null)
    }
  }, [activeWorkplaceId, myWorkplaces])

  const baseWorkplace = useMemo(() => {
    if (!activeWorkplaceId) return null
    if (demoRole === ROLES.SERVICE_LEAD) {
      const wp = myWorkplaces.find(w => w.id === activeWorkplaceId)
      return wp || null
    }
    return getMyWorkplace(session.user.id, activeWorkplaceId)
  }, [session.user.id, activeWorkplaceId, demoRole, myWorkplaces])

  const myWorkplace = useMemo(() => {
    if (!baseWorkplace) return null
    return { ...baseWorkplace, effectiveRole: workplaceRoleForDemo(demoRole) }
  }, [baseWorkplace, demoRole])

  const { refreshClients, refreshMemberships } = useStoreRefreshers()

  const handlePersonaChange = useCallback((nextPersonaId) => {
    setPersonaId(nextPersonaId)
    setActiveWorkplaceId(null)
    refreshMemberships()
    refreshClients()
    const next = getPersonaById(nextPersonaId)
    if (next.role === ROLES.SERVICE_LEAD) {
      navigate('/service-lead')
    } else if (location.pathname.startsWith('/service-lead')) {
      navigate('/home')
    }
  }, [location.pathname, navigate, refreshClients, refreshMemberships])

  const handleBuildingClick = useCallback(() => {
    if (demoRole === ROLES.SERVICE_LEAD) {
      navigate('/service-lead')
    } else {
      navigate('/workplace')
    }
  }, [demoRole, navigate])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const isProgressNotes = location.pathname.includes('/progress-notes')

  const appSession = useMemo(() => ({
    session,
    activePersona,
    personaId,
    demoRole,
    myWorkplace,
    myWorkplaces,
    activeWorkplaceId,
    setActiveWorkplaceId,
    refreshClients,
    refreshMemberships,
  }), [
    session,
    activePersona,
    personaId,
    demoRole,
    myWorkplace,
    myWorkplaces,
    activeWorkplaceId,
    refreshClients,
    refreshMemberships,
  ])

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="top-nav__inner">
          <NavLink to="/home" className="top-nav__brand">
            <span className="top-nav__brand-mark" aria-hidden="true" />
            <span className="top-nav__brand-text">
              <span className="top-nav__brand-name">Chroma</span>
              <span className="top-nav__brand-suffix">tiK</span>
            </span>
          </NavLink>

          <nav className={`top-nav__links${menuOpen ? ' top-nav__links--open' : ''}`}>
            {NAV_ITEMS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `top-nav__link${isActive ? ' top-nav__link--active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="top-nav__actions">
            <div className="top-nav__utilities">
              <button
                type="button"
                className="top-nav__utility-btn"
                onClick={handleBuildingClick}
                aria-label={demoRole === ROLES.SERVICE_LEAD ? 'Organisation workplaces' : 'Workplace'}
                title={demoRole === ROLES.SERVICE_LEAD ? 'Organisation workplaces' : 'Workplace'}
              >
                <BuildingIcon />
              </button>
              <button
                type="button"
                className="top-nav__profile-btn"
                onClick={() => navigate('/profile')}
                aria-label={`Profile — ${activePersona.name}`}
              >
                {activePersona.name}
              </button>
              <ThemeToggle />
              <DemoProfileSwitcher value={personaId} onChange={handlePersonaChange} />
            </div>
            <button type="button" className="top-nav__menu-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      <main className={`main-content${isProgressNotes ? ' main-content--progress-notes' : ''}`}>
        <RouteErrorBoundary>
          <AppSessionProvider value={appSession}>
            <Outlet />
          </AppSessionProvider>
        </RouteErrorBoundary>
      </main>
    </div>
  )
}
