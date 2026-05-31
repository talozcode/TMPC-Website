-- ============================================================
-- TMPC Website CMS — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── CATEGORIES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_name_key UNIQUE (name),
  CONSTRAINT categories_slug_key UNIQUE (slug)
);

-- ─── PROJECTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  location text,
  scope text,
  role text,
  brief text,
  deliverables text[] DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── PROJECT IMAGES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── SERVICES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text,
  title text NOT NULL,
  description text,
  scope_items text[] DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── TEAM MEMBERS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── SITE SETTINGS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text,
  label text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── PAGE SECTIONS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section text NOT NULL,
  field text NOT NULL,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT page_sections_unique UNIQUE (page, section, field)
);

-- ─── CONTACT INQUIRIES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  project_type text,
  message text,
  read boolean NOT NULL DEFAULT false,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── BLOG POSTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── TESTIMONIALS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_title text,
  client_company text,
  quote text NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── MEDIA LIBRARY ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL,
  url text NOT NULL,
  file_size integer,
  mime_type text,
  alt_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── SEO METADATA ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seo_metadata (
  page text PRIMARY KEY,
  title text,
  description text,
  og_title text,
  og_description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── TRIGGERS ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── STORAGE BUCKETS ─────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media-library', 'media-library', true) ON CONFLICT (id) DO NOTHING;

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read_projects" ON projects FOR SELECT USING (published = true);
CREATE POLICY "public_read_project_images" ON project_images FOR SELECT USING (true);
CREATE POLICY "public_read_services" ON services FOR SELECT USING (active = true);
CREATE POLICY "public_read_team" ON team_members FOR SELECT USING (active = true);
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "public_read_page_sections" ON page_sections FOR SELECT USING (true);
CREATE POLICY "public_read_blog_posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "public_read_seo" ON seo_metadata FOR SELECT USING (true);
CREATE POLICY "anon_insert_inquiries" ON contact_inquiries FOR INSERT TO anon WITH CHECK (true);

-- Authenticated admin full access
CREATE POLICY "admin_all_categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_project_images" ON project_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_team" ON team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_page_sections" ON page_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_inquiries" ON contact_inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_blog_posts" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_media" ON media_files FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_seo" ON seo_metadata FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage policies
CREATE POLICY "public_read_project_images_storage" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "public_read_media_storage" ON storage.objects FOR SELECT USING (bucket_id = 'media-library');
CREATE POLICY "auth_upload_project_images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('project-images','media-library'));
CREATE POLICY "auth_update_storage" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('project-images','media-library'));
CREATE POLICY "auth_delete_storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('project-images','media-library'));

-- ─── SEED DATA ───────────────────────────────────────────────
INSERT INTO site_settings (key, value, label) VALUES
  ('company_name', 'TMPC Development Co., Ltd.', 'Company Name'),
  ('company_short_name', 'TMPC', 'Short Name'),
  ('email', 'info@tmpc.co.th', 'Email Address'),
  ('whatsapp', '66XXXXXXXXX', 'WhatsApp Number'),
  ('location', 'Bangkok, Thailand', 'Location'),
  ('description', 'Project consulting and development management in Thailand.', 'Site Description')
ON CONFLICT (key) DO NOTHING;

INSERT INTO categories (name, slug, display_order) VALUES
  ('Residential', 'residential', 1),
  ('Hospitality', 'hospitality', 2),
  ('Commercial', 'commercial', 3),
  ('Industrial', 'industrial', 4),
  ('Community', 'community', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO seo_metadata (page, title, description) VALUES
  ('home', 'TMPC - Project Consulting and Development Management in Thailand', 'Project consulting and development management for commercial, industrial, hospitality, and real estate projects across Thailand.'),
  ('about', 'About - TMPC', 'TMPC is a Thailand-based project consulting and development management company.'),
  ('services', 'Services - TMPC', 'Project consulting, development management, coordination and execution oversight across Thailand.'),
  ('projects', 'Projects - TMPC', 'Selected project work across residential, hospitality, commercial, industrial, and community projects in Thailand.'),
  ('contact', 'Contact - TMPC', 'Get in touch with TMPC to discuss your project in Thailand.')
ON CONFLICT (page) DO NOTHING;
