export interface ProcessStep {
  title: string
  when: string
  description: string
  services: string
}

/**
 * The engagement, start to opening, as a plain numbered list: one ruled row
 * per stage, the number in the gutter, when it happens and the service that
 * covers it, then the stage itself. Static on purpose (05/11/2026): no pin, no
 * scroll scrub, no photographs. The rows carry it.
 */
export function ProcessTimeline({ steps, heading }: { steps: ProcessStep[]; heading: React.ReactNode }) {
  return (
    <div className="proc">
      <div className="proc-head">{heading}</div>
      <ol className="proc-list">
        {steps.map((s, i) => (
          <li key={s.title} className="pr-row">
            <span className="pr-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="pr-main">
              <h3 className="pr-title">{s.title}</h3>
              <p className="t-body pr-desc">{s.description}</p>
            </div>
            <dl className="pr-meta">
              <div>
                <dt className="t-micro">When</dt>
                <dd>{s.when}</dd>
              </div>
              <div>
                <dt className="t-micro">Service</dt>
                <dd>{s.services}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  )
}
