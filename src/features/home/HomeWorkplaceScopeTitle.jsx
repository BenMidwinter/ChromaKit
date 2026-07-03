/** Inline workplace carousel for home oversight blocks — local to the dashboard, not global context. */
export default function HomeWorkplaceScopeTitle({ baseTitle, workplaces, index, onIndexChange }) {
  if (!workplaces?.length) {
    return baseTitle
  }

  const workplace = workplaces[index] ?? workplaces[0]
  const title = `${baseTitle} — ${workplace.name}`
  const canCarousel = workplaces.length > 1

  if (!canCarousel) {
    return title
  }

  const go = (delta) => {
    const next = (index + delta + workplaces.length) % workplaces.length
    onIndexChange(next)
  }

  return (
    <span className="home-workplace-scope">
      <button
        type="button"
        className="home-workplace-scope__btn"
        onClick={() => go(-1)}
        aria-label={`Previous workplace: ${workplaces[(index - 1 + workplaces.length) % workplaces.length].name}`}
      >
        ←
      </button>
      <span className="home-workplace-scope__label">{title}</span>
      <button
        type="button"
        className="home-workplace-scope__btn"
        onClick={() => go(1)}
        aria-label={`Next workplace: ${workplaces[(index + 1) % workplaces.length].name}`}
      >
        →
      </button>
    </span>
  )
}
