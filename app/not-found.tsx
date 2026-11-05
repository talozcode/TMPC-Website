import { ButtonLink } from '@/components/ui/arrow-link'

export default function NotFound() {
  return (
    <section className="dark-band min-h-[100svh] flex items-end" data-tone="dark">
      <div className="wrap pb-[clamp(3rem,8vw,6rem)] pt-[calc(var(--hdr-h)+4rem)]">
        <p className="t-meta text-fog-muted flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-signal" aria-hidden="true" />
          Error 404
        </p>
        <h1 className="t-display text-fog mt-7 max-w-[14ch]">
          This page is not <em>on the plans.</em>
        </h1>
        <p className="t-lead mt-8">The page you are looking for has moved or does not exist.</p>
        <div className="flex flex-wrap gap-3 mt-10">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">Discuss Your Project</ButtonLink>
        </div>
      </div>
    </section>
  )
}
