export default function PageHeader({ title, subtitle, actions, toolbar, className = '' }) {
  const withToolbar = Boolean(toolbar)

  return (
    <header
      className={[
        'relative flex w-auto flex-wrap items-center',
        'mx-[calc(-1*var(--space-inline))] mb-[var(--section-gap)]',
        'border-b border-line-light bg-surface px-[var(--space-inline)] py-3.5',
        withToolbar ? 'flex-nowrap gap-x-4 gap-y-2' : 'gap-x-5 gap-y-3',
        "before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:bg-gradient-to-b before:from-primary before:to-primary-dark before:content-['']",
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className={`min-w-0 flex-[0_0_auto] ${withToolbar ? '' : 'max-w-[22rem]'}`}>
        <h1
          className={`m-0 font-bold leading-tight text-accent ${withToolbar ? 'text-[1.35rem]' : 'text-[1.65rem]'}`}
        >
          {title}
        </h1>
        {subtitle && !withToolbar && (
          <p className="mt-1 mb-0 max-w-[42rem] text-[0.9375rem] leading-snug text-subtle">{subtitle}</p>
        )}
      </div>
      {toolbar && <div className="min-w-0 flex-1 overflow-visible">{toolbar}</div>}
      {actions && (
        <div className="flex flex-[0_0_auto] flex-wrap items-center gap-2.5">{actions}</div>
      )}
    </header>
  )
}

/** Compact filter control for page header toolbars. */
export function PageHeaderFilter({ id, label, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 text-sm ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="text-[0.75rem] font-semibold text-subtle">
          {label}
        </label>
      )}
      {children}
    </div>
  )
}
