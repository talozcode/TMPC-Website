import type { ProjectPhase } from '@/lib/project-phases'

export interface Category {
  id: string
  name: string
  slug: string
  display_order: number
  created_at: string
}

export interface ProjectImage {
  id: string
  project_id: string
  storage_path: string
  url: string
  /** Scoped per phase, not global: each phase numbers its own images from 0. */
  display_order: number
  /** First of its phase, so up to three rows per project can be true. */
  is_primary: boolean
  phase: ProjectPhase
  created_at: string
}

export interface Project {
  id: string
  title: string
  subtitle: string | null
  category_id: string | null
  location: string | null
  scope: string | null
  role: string | null
  brief: string | null
  deliverables: string[]
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
  slug: string | null
  category?: Category | null
  project_images?: ProjectImage[]
}

export interface Service {
  id: string
  number: string | null
  title: string
  description: string | null
  scope_items: string[]
  display_order: number
  active: boolean
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role_title: string | null
  description: string | null
  display_order: number
  active: boolean
  created_at: string
}

export interface SiteSetting {
  key: string
  value: string | null
  label: string | null
  updated_at: string
}

export interface PageSection {
  id: string
  page: string
  section: string
  field: string
  value: string | null
  updated_at: string
}

export interface ContactInquiry {
  id: string
  name: string
  company: string | null
  email: string
  phone: string | null
  project_type: string | null
  message: string | null
  read: boolean
  archived: boolean
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image_url: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  client_title: string | null
  client_company: string | null
  quote: string
  project_id: string | null
  display_order: number
  active: boolean
  created_at: string
  project?: Project | null
}

export interface MediaFile {
  id: string
  filename: string
  storage_path: string
  url: string
  file_size: number | null
  mime_type: string | null
  alt_text: string | null
  created_at: string
}

export interface SeoMetadata {
  page: string
  title: string | null
  description: string | null
  og_title: string | null
  og_description: string | null
  updated_at: string
}
