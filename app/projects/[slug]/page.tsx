import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/motion'
import { ProjectImageStage } from '@/components/project-image-stage'
import { SplitHeading } from '@/components/anim/split-heading'
import { CtaBand } from '@/components/sections/cta-band'
import { Arrow } from '@/components/ui/arrow-link'
import { getProject, getProjects } from '@/lib/content'
import { PHASE_LABELS, pickLeadImage, toPhaseGroups } from '@/lib/project-phases'
import { COMPARE } from '@/lib/compare-slots'
import { AnimatedGallery } from '@/components/ui/animated-gallery'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project not found' }

  const lead = pickLeadImage(project.project_images)
  return {
    title: project.title,
    description: project.brief?.slice(0, 155) ?? project.subtitle ?? undefined,
    // Both the slug and the uuid resolve, so point search engines at one of them.
    alternates: { canonical: `/projects/${project.slug ?? project.id}` },
    openGraph: {
      title: project.title,
      description: project.brief?.slice(0, 200) ?? undefined,
      images: lead ? [lead] : undefined,
    },
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  // An unpublished project is invisible to the anon key under RLS, so a draft
  // 404s rather than leaking a shell of itself.
  if (!project) notFound()

  const phases = toPhaseGroups(project.project_images)
  const facts = [
    { label: 'Location', value: project.location },
    { label: 'Scope', value: project.scope },
    { label: 'Role', value: project.role },
  ].filter((f) => f.value)

  // The next project in the published order, wrapping around, so a reader can
  // keep going without returning to the list.
  const all = await getProjects()
  const at = all.findIndex((p) => p.id === project.id)
  const next = all.length > 1 ? all[(at + 1) % all.length] : null
  const nextImage = next ? pickLeadImage(next.project_images) : null
  const phasesSlot = COMPARE['project-phases']

  return (
    <>
      <section className="dark-band" data-tone="dark">
        <div className="wrap pt-[calc(var(--hdr-h)+clamp(2.5rem,6vw,4.5rem))] pb-[clamp(9rem,16vw,14rem)]">
          <Reveal>
            <Link href="/projects" className="lnk text-fog/75 hover:text-fog">
              <span aria-hidden="true">&#8592;</span> All projects
            </Link>
          </Reveal>
          <div className="grid lg:grid-cols-12 gap-x-10 gap-y-8 items-end mt-12">
            <div className="lg:col-span-8">
              <Reveal delay={60}>
                <p className="t-meta text-fog-muted flex items-center gap-3">
                  <span className="inline-block w-2 h-2 bg-signal" aria-hidden="true" />
                  {project.category?.name ?? 'Project'}
                </p>
              </Reveal>
              <SplitHeading as="h1" on="load" delay={100} className="t-display text-fog mt-7 max-w-[16ch]">
                {project.title}
              </SplitHeading>
            </div>
            {project.subtitle && (
              <Reveal delay={260} className="lg:col-span-4">
                <p className="t-lead">{project.subtitle}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-[clamp(6rem,12vw,10rem)] bg-ink-deep" data-tone="dark" aria-hidden="true" />
          <div className="wrap relative -mt-[clamp(6rem,12vw,10rem)]">
            {/* Not behind a Reveal: it is the first photograph on screen, so it
                paints as soon as it loads instead of waiting for scripts. */}
            <ProjectImageStage title={project.title} phases={phases} variant="detail" />
          </div>
        </div>

        <div className="wrap grid lg:grid-cols-12 gap-x-10 gap-y-12 sec-sm">
          {facts.length > 0 && (
            <Reveal className="lg:col-span-4">
              <dl>
                {facts.map((f) => (
                  <div key={f.label} className="py-4 border-t border-rule">
                    <dt className="t-meta text-ink-muted">{f.label}</dt>
                    <dd className="mt-1.5 text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal>
              <h2 className="t-meta text-ink-muted">The Project</h2>
              {project.brief ? (
                <p className="text-[clamp(1.3rem,1.05rem+0.9vw,1.75rem)] leading-[1.4] tracking-[-0.012em] [font-variation-settings:'wdth'_104] mt-5">
                  {project.brief}
                </p>
              ) : (
                <p className="t-body mt-5">Details for this project are being prepared.</p>
              )}
            </Reveal>
            {project.deliverables.length > 0 && (
              <Reveal delay={100} className="mt-12">
                <h2 className="t-meta text-ink-muted">TMPC Scope</h2>
                <ul className="mt-4 grid sm:grid-cols-2 gap-x-8">
                  {project.deliverables.map((d) => (
                    <li key={d} className="flex gap-3 py-3 border-b border-rule-soft">
                      <span className="mt-[0.62em] w-1.5 h-1.5 bg-signal shrink-0" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Rendering to completion: one column per stage, standing up as you scroll */}
      <section className="bg-paper pb-[var(--sec)]">
        <div className="wrap">
          <div className="rule-t pt-[clamp(2.5rem,5vw,4rem)]">
            <SplitHeading className="t-h1 max-w-[14ch] mb-[clamp(2rem,4vw,3rem)]">
              {phasesSlot.heading.lead} <em>{phasesSlot.heading.em}</em>
            </SplitHeading>
          </div>
        </div>
        <AnimatedGallery
          label="The project from rendering to completion"
          stages={[
            { label: PHASE_LABELS.rendering, images: phasesSlot.rendering, treatment: 'grayscale-[0.85] contrast-[1.05]' },
            { label: PHASE_LABELS.in_progress, images: phasesSlot.in_progress, treatment: 'grayscale-[0.4]' },
            { label: PHASE_LABELS.completed, images: phasesSlot.completed },
          ]}
        />
      </section>

      {next && (
        <section className="bg-paper pb-[var(--sec)]">
          <div className="wrap">
            <Reveal>
              <Link href={`/projects/${next.slug ?? next.id}`} className="group block">
                <div className="marks">
                  <span className="mk" />
                  <div className="relative overflow-hidden bg-ink-deep">
                    {nextImage && (
                      <Image src={nextImage} alt="" fill sizes="100vw" className="object-cover photo opacity-45" />
                    )}
                    <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 px-6 py-12 sm:px-12 sm:py-20">
                      <div>
                        <p className="t-meta text-fog-muted">Next project</p>
                        <p className="t-h1 text-fog mt-4">{next.title}</p>
                      </div>
                      <span className="w-14 h-14 grid place-items-center bg-signal text-ink-deep transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden="true">
                        <Arrow className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <CtaBand
        title={
          <>
            Planning something <em>similar?</em>
          </>
        }
        lead="Tell us what you are building. We will give you an honest picture of what it takes to deliver it in Thailand."
      />
    </>
  )
}
