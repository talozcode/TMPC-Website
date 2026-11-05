import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/motion'

export interface FeaturedProject {
  slug: string
  title: string
  subtitle?: string
  category: string
  location: string
  image: string
  /** TMPC's role and the project's scope: the facts that make a photo proof. */
  role?: string
  scope?: string
}

/**
 * Three projects, not three equal cards: one tall lead on the left, two on
 * the right stepped down the page. Every image takes the same treatment,
 * comes to full colour on hover, and picks up the survey marks. On a phone
 * the same idea in one column: the lead photo runs to the screen edges and
 * the other two step in from the left, so the list never reads as a stack
 * of identical cards.
 */
export function FeaturedProjects({ projects }: { projects: FeaturedProject[] }) {
  const [lead, ...rest] = projects
  if (!lead) return null
  return (
    <div className="grid md:grid-cols-12 gap-x-8 gap-y-14">
      <Reveal className="md:col-span-7">
        <ProjectTile project={lead} tall bleed />
      </Reveal>
      <div className="md:col-span-5 grid gap-14 md:pt-[clamp(4rem,12vw,10rem)]">
        {rest.map((p, i) => (
          <Reveal key={p.slug} delay={100 + i * 100} className="max-md:ml-[14%]">
            <ProjectTile project={p} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function ProjectTile({
  project,
  tall,
  priority,
  bleed,
}: {
  project: FeaturedProject
  tall?: boolean
  priority?: boolean
  /** Below 768px the photo runs to the screen edges (the text keeps the gutter). */
  bleed?: boolean
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className={`marks ${bleed ? 'max-md:-mx-[var(--gutter)] max-md:before:hidden max-md:after:hidden' : ''}`}>
        <span className={`mk ${bleed ? 'max-md:hidden' : ''}`} />
        <div className={`relative overflow-hidden bg-ink ${tall ? 'aspect-[4/5]' : 'aspect-[4/3]'}`} data-pm-par data-pm-live>
          <Image
            src={project.image}
            alt=""
            fill
            priority={priority}
            sizes={tall ? '(max-width: 768px) 100vw, 58vw' : '(max-width: 768px) 100vw, 42vw'}
            className="object-cover photo"
          />
          <div className="photo-tint" />
        </div>
      </div>
      <p className="t-meta text-ink-muted mt-5 flex flex-wrap gap-x-3">
        <span>{project.category}</span>
        {project.location && (
          <>
            <span aria-hidden="true" className="opacity-50">/</span>
            <span>{project.location}</span>
          </>
        )}
      </p>
      <h3 className="t-h3 mt-2.5 transition-colors duration-300">
        <span className="pt-title bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] group-hover:bg-[length:100%_1px] transition-[background-size] duration-700 ease-[var(--ease-out-expo)]">
          {project.title}
        </span>
      </h3>
      {project.subtitle && <p className="text-[0.95rem] text-ink-muted mt-1.5">{project.subtitle}</p>}
      {(project.role || project.scope) && (
        <dl className="mt-5 pt-4 rule-t grid gap-2.5 text-[0.92rem]">
          {[
            { label: 'TMPC role', value: project.role },
            { label: 'Scope', value: project.scope },
          ]
            .filter((f) => f.value)
            .map((f) => (
              <div key={f.label} className="grid grid-cols-[5.5rem_1fr] gap-4">
                <dt className="t-meta text-ink-muted pt-[0.2em]">{f.label}</dt>
                <dd className="text-ink-soft leading-snug">{f.value}</dd>
              </div>
            ))}
        </dl>
      )}
    </Link>
  )
}
