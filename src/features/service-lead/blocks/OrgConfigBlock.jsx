/** Config-route chrome — coloured block shell without duplicating the layout PageHeader title. */
export default function OrgConfigBlock({ blockId, actions, children }) {
  return (
    <section className={`role-block role-block--${blockId} role-block--org_config`}>
      {actions && (
        <header className="role-block__header role-block__header--actions-only">
          <div className="role-block__actions">{actions}</div>
        </header>
      )}
      <div className="role-block__body">{children}</div>
    </section>
  )
}
