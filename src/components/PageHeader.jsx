export default function PageHeader({ title, subtitle, actions, toolbar }) {
  return (
    <header className={`page-header${toolbar ? ' page-header--stacked' : ''}`}>
      <div className="page-header__main">
        <div className="page-header__text">
          <h1 className="page-header__title">{title}</h1>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </div>
      {toolbar && <div className="page-header__toolbar">{toolbar}</div>}
    </header>
  )
}

/** Compact filter control for page header toolbars. */
export function PageHeaderFilter({ id, label, children, className = '' }) {
  return (
    <div className={`page-header__filter ${className}`.trim()}>
      {label && <label htmlFor={id}>{label}</label>}
      {children}
    </div>
  )
}
