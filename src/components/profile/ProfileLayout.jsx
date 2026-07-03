import { NavLink, Outlet, useOutletContext } from 'react-router-dom'
import PageHeader from '../PageHeader'

export default function ProfileLayout() {
  const parentContext = useOutletContext()

  return (
    <div className="page page--profile">
      <PageHeader
        title="Profile"
        subtitle="Clinician settings, workplace membership, and reflective journal."
        toolbar={(
          <nav className="profile-actions profile-actions--inline" aria-label="Profile sections">
            <NavLink to="/profile" end className="profile-actions__link">
              Clinician details
            </NavLink>
            <NavLink to="/profile/journal" className="profile-actions__link">
              Journal
            </NavLink>
          </nav>
        )}
      />
      <Outlet context={parentContext} />
    </div>
  )
}
