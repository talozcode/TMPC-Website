-- TMPC Website CMS: homepage hero before/after comparison
-- Run this in: Supabase Dashboard > SQL Editor > Run
-- Safe to run more than once.

-- Single row, not a list: the homepage has exactly one hero, so there is
-- exactly one row here rather than a table the admin manages entries in. The
-- application always reads/writes the one existing row; no "which row is
-- active" logic is needed anywhere.
CREATE TABLE IF NOT EXISTS hero_before_after (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  before_storage_path text,
  before_url text,
  after_storage_path text,
  after_url text,
  caption text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS hero_before_after_updated_at ON hero_before_after;
CREATE TRIGGER hero_before_after_updated_at BEFORE UPDATE ON hero_before_after
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE hero_before_after ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_hero_before_after" ON hero_before_after;
CREATE POLICY "public_read_hero_before_after" ON hero_before_after FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_all_hero_before_after" ON hero_before_after;
CREATE POLICY "admin_all_hero_before_after" ON hero_before_after FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed the one row. Images point at existing public placeholders (real JPEGs,
-- not the two 29-byte HTML stubs already in public/images) until an admin
-- uploads the real before/after pair from /admin/hero.
INSERT INTO hero_before_after (before_url, after_url)
SELECT '/images/scenario-warehouse.jpg', '/images/scenario-commercial.jpg'
WHERE NOT EXISTS (SELECT 1 FROM hero_before_after);
