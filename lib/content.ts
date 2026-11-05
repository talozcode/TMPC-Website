import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import {
  fallbackCategories,
  fallbackProjects,
  fallbackServices,
  fallbackTeam,
} from '@/lib/fallback-content'
import type {
  BlogPost,
  HeroBeforeAfter,
  Project,
  Service,
  TeamMember,
  Testimonial,
} from '@/lib/types'

/**
 * Every public read goes through here, so each page asks for what it needs by
 * name instead of repeating a Supabase query, and so a checkout with no
 * Supabase env renders the seeded content (lib/fallback-content.ts) instead of
 * crashing or hanging. With the env set, these are the same queries the pages
 * used to make inline.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const PROJECT_COLUMNS = '*, category:categories(name), project_images(url, display_order, phase)'

export function supabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return /^https?:\/\//.test(url) && !url.includes('placeholder') && key.length > 20
}

export async function getHero(): Promise<HeroBeforeAfter | null> {
  if (!supabaseConfigured()) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('hero_before_after')
    .select('*')
    .limit(1)
    .maybeSingle<HeroBeforeAfter>()
  return data ?? null
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })
  return (data as Testimonial[]) ?? []
}

export async function getServices(): Promise<Service[]> {
  if (!supabaseConfigured()) return fallbackServices
  const supabase = await createClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })
  return (data as Service[]) ?? []
}

export async function getTeam(): Promise<TeamMember[]> {
  if (!supabaseConfigured()) return fallbackTeam
  const supabase = await createClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })
  return (data as TeamMember[]) ?? []
}

export async function getProjects(): Promise<Project[]> {
  if (!supabaseConfigured()) return fallbackProjects
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select(PROJECT_COLUMNS)
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
  return (data as Project[]) ?? []
}

export async function getCategoryNames(): Promise<string[]> {
  if (!supabaseConfigured()) return fallbackCategories.map((c) => c.name)
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('name').order('display_order')
  return (data ?? []).map((c) => c.name as string)
}

/**
 * Slug first, uuid second: a project created by some path that did not set a
 * slug is still reachable rather than silently 404ing. Wrapped in cache() so
 * generateMetadata and the page body share one query per request.
 */
export const getProject = cache(async (param: string): Promise<Project | null> => {
  if (!supabaseConfigured()) {
    return fallbackProjects.find((p) => p.slug === param || p.id === param) ?? null
  }
  const supabase = await createClient()
  const bySlug = await supabase
    .from('projects')
    .select(PROJECT_COLUMNS)
    .eq('slug', param)
    .eq('published', true)
    .maybeSingle()
  if (bySlug.data) return bySlug.data as unknown as Project
  if (!UUID_RE.test(param)) return null
  const byId = await supabase
    .from('projects')
    .select(PROJECT_COLUMNS)
    .eq('id', param)
    .eq('published', true)
    .maybeSingle()
  return (byId.data as unknown as Project) ?? null
})

export async function getPosts(): Promise<BlogPost[]> {
  if (!supabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  return (data as BlogPost[]) ?? []
}

export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  if (!supabaseConfigured()) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  return (data as BlogPost | null) ?? null
})

export async function getSettings(keys: string[]): Promise<Record<string, string | null>> {
  if (!supabaseConfigured()) return {}
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('key, value').in('key', keys)
  return Object.fromEntries((data ?? []).map((s) => [s.key as string, s.value as string | null]))
}
