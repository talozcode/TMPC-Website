import type { Metadata } from 'next'
import { siteConfig } from '@/lib/data'
import { ProjectsGallery } from '@/components/projects-gallery'

export const metadata: Metadata = {
  title: 'Projects',
  description: `Selected project work by ${siteConfig.name} across residential, hospitality, commercial, industrial, and community projects in Thailand.`,
}

export default function ProjectsPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-canvas border-b border-line py-10 lg:py-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.25em] mb-6 animate-fade-in">
              Projects
            </p>
            <h1
              className="font-display font-bold text-5xl sm:text-6xl lg:text-[4.5rem] text-ink leading-[1.08] tracking-tight mb-4 animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              Selected Work
            </h1>
            <p
              className="text-lg text-ink-secondary leading-relaxed max-w-2xl animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              TMPC works across residential, hospitality, commercial, industrial, and community
              projects throughout Bangkok and Thailand.
            </p>
          </div>
        </div>
      </section>

      <ProjectsGallery />
    </>
  )
}
