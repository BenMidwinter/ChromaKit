/**
 * Consistent shell for list-first client modules (appointments, notes, letters, etc.).
 */
export default function RecordListLayout({
  title,
  subtitle,
  newLabel,
  onNew,
  headerActions,
  toolbar,
  children,
  editor,
  className = '',
}) {
  return (
    <div className={`client-panel record-module ${className}`.trim()}>
      <header className="record-module__header">
        <div className="record-module__header-text">
          <h2 className="record-module__title">{title}</h2>
          {subtitle && <p className="record-module__subtitle">{subtitle}</p>}
        </div>
        <div className="record-module__actions">
          {headerActions}
          {newLabel && onNew && (
            <button type="button" className="primary" onClick={onNew}>
              + New {newLabel}
            </button>
          )}
        </div>
      </header>

      {toolbar && <div className="record-module__toolbar">{toolbar}</div>}

      <div className="record-module__body">{children}</div>

      {editor && <div className="record-module__editor">{editor}</div>}
    </div>
  )
}
