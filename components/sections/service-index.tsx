/**
 * The services page's left rail: every service, numbered, sticky beside the
 * articles. A plain list of anchors; the browser handles the jump.
 */
export function ServiceIndex({ items }: { items: { slug: string; number: string; title: string }[] }) {
  return (
    <nav aria-label="Services on this page" className="sticky top-[calc(var(--hdr-h)+2.5rem)]">
      <ol className="border-t border-line">
        {items.map((i) => (
          <li key={i.slug}>
            <a
              href={`#${i.slug}`}
              className="grid grid-cols-[2.5rem_1fr] items-baseline py-3.5 border-b border-line text-ink-secondary hover:text-accent transition-colors duration-200"
            >
              <span className="t-meta text-ink-muted">{i.number}</span>
              <span className="font-medium">{i.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
