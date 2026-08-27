import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/motion'
import { ProjectImageStage } from '@/components/project-image-stage'
import { createClient } from '@/lib/supabase/server'
import { pickLeadImage, toPhaseGroups } from '@/lib/project-phases'
import type { Project } from '@/lib/types'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const COLUMNS = '*, category:categories(name), project_images(url, display_order, phase)'

/**
 * generateMetadata and the page body both need the row, and supabase-js is not
 * deduped by React's fetch memoisation, so this is wrapped in cache() to keep it
 * to one query per request.
 *
 * Slug first, uuid second: a project created by some path that did not set a
 * slug is still reachable rather than silently 404ing.
 */
const getProject = cache(async (param: string): Promise<Project | null> => {
  const supabase = await createClient()

  const bySlug = await supabase
    .from('projects')
    .select(COLUMNS)
    .eq('slug', param)
    .eq('published', true)
    .maybeSingle()
  if (bySlug.data) return bySlug.data as unknown as Project

  if (!UUID_RE.test(param)) return null

  const byId = await supabase
    .from('projects')
    .select(COLUMNS)
    .eq('id', param)
    .eq('published', true)
    .maybeSingle()
  return (byId.data as unknown as Project) ?? null
})

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

  return (
    <>
      <section className="on-dark relative bg-canvas-dark overflow-hidden">
        <div className="wrap relative z-10 py-[clamp(3rem,6vw,5rem)]">
          <Reveal>
            <p className="eye">{project.category?.name ?? 'Project'}</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="t-display text-white mt-6 max-w-[20ch]">{project.title}</h1>
          </Reveal>
          {project.subtitle && (
            <Reveal delay={170}>
              <p className="t-lead !text-white/60 mt-6">{project.subtitle}</p>
            </Reveal>
          )}
        </div>
      </section>

      <section className="bg-canvas-subtle sec-tight">
        <div className="wrap">
          <Reveal>
            <ProjectImageStage title={project.title} phases={phases} variant="detail" />
          </Reveal>

          <div className="grid lg:grid-cols-[1.35fr_1fr] gap-6 mt-6">
            <Reveal className="flex">
              <div className="card flex-1 p-8 lg:p-10">
                <p className="eye">The Project</p>
                {project.brief ? (
                  <p className="t-body text-ink-secondary mt-6">{project.brief}</p>
                ) : (
                  <p className="t-body text-ink-muted mt-6">Details for this project are being prepared.</p>
                )}

                {facts.length > 0 && (
                  <dl className="mt-8 pt-6 border-t border-line-subtle space-y-3">
                    {facts.map((f) => (
                      <div key={f.label} className="flex gap-4">
                        <dt className="w-20 flex-shrink-0 text-[0.62rem] font-bold text-ink-muted uppercase tracking-[0.12em] pt-1">
                          {f.label}
                        </dt>
                        <dd className="flex-1 text-[0.95rem] text-ink-secondary leading-snug">
                          {f.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </Reveal>

            {project.deliverables.length > 0 && (
              <Reveal delay={100} className="flex">
                <div className="card flex-1 p-8 lg:p-10">
                  <p className="eye">TMPC Scope</p>
                  <ul className="mt-6 space-y-2.5">
                    {project.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-[0.92rem] text-ink-muted leading-snug">
                        <span className="w-1 h-1 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>

          <div className="mt-10">
            <Link href="/projects" className="lnk">
              <span aria-hidden="true">&#8592;</span> All projects
            </Link>
          </div>
        </div>
      </section>

      <section className="on-dark bg-canvas-dark">
        <div className="wrap sec-tight">
          <Reveal className="max-w-2xl mx-auto text-center">
            <p className="eye">Start a Conversation</p>
            <h2 className="t-h1 text-white mt-6">Planning something similar?</h2>
            <p className="t-lead !text-white/55 mt-6 mx-auto">
              Tell us what you are building. We will give you an honest picture of what it takes to
              deliver it in Thailand.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link href="/contact" className="btn">Discuss Your Project</Link>
              <Link href="/projects" className="btn-2">
                See our work <span aria-hidden="true">&#8594;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
