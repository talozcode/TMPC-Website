import Image from 'next/image'
import Link from 'next/link'
import type { ProjectPhoto as Photo } from '@/lib/projects'

/**
 * A real project photograph with its caption underneath: the project's name
 * (linking to it) and where it is. Every photograph on the marketing pages
 * goes through this, so none of them is ever an unattributed mood picture.
 */
export function ProjectPhoto({
  photo,
  aspect = 'aspect-[4/3]',
  sizes = '(max-width: 1024px) 100vw, 50vw',
  priority = false,
  note,
}: {
  photo: Photo
  aspect?: string
  sizes?: string
  priority?: boolean
  /** A short qualifier after the location, e.g. "On site". */
  note?: string
}) {
  return (
    <figure className="m-0">
      <div className={`photo relative ${aspect}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      <figcaption className="photo-cap">
        <Link href={`/projects/${photo.slug}`} className="photo-cap-title">
          {photo.title}
        </Link>
        <span className="t-micro text-ink-muted">
          {[photo.location, note].filter(Boolean).join(' / ')}
        </span>
      </figcaption>
    </figure>
  )
}
