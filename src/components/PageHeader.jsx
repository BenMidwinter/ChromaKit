export default function PageHeader({
  title,
  subtitle,
  actions,
  toolbar,
  className = '',
  /** When false, skip negative horizontal margins (e.g. `page--service-lead` has no inline padding). */
  bleed = true,
}) {
  const withToolbar = Boolean(toolbar)

  return (
    <header
      className={[
        'relative flex flex-wrap items-center',
        'border-b border-l-4 border-line-light border-l-primary bg-surface px-[var(--space-inline)] py-3.5',
        bleed
          ? 'mx-[calc(-1*var(--space-inline))] mb-[var(--section-gap)] w-auto'
          : 'mx-0 mb-0 w-full shrink-0',
        withToolbar ? 'flex-nowrap gap-x-4 gap-y-2' : 'gap-x-5 gap-y-3',
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
