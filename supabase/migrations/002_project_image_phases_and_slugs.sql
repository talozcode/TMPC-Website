-- TMPC Website CMS: project image phases, project slugs
-- Run this in: Supabase Dashboard > SQL Editor > Run
-- Safe to run more than once.

-- ============================================================
-- PART 1: PROJECT IMAGE PHASES
-- ============================================================

-- text + CHECK rather than a Postgres ENUM. The phases are fixed but their
-- spellings are not, and a CHECK can be dropped and re-added in one paste
-- whereas an enum value cannot be renamed or removed. There is no generated
-- type layer here that would benefit from a real enum.
--
-- The DEFAULT is load-bearing, not cosmetic. Several inserts and updates in
-- components/admin/image-uploader.tsx and scripts/seed-projects.mjs send
-- partial rows, and a NOT NULL column without a DEFAULT would reject them.
-- Defaulting to 'completed' also puts every existing image in a single phase,
-- so every current project keeps rendering exactly as it does today until
-- someone starts classifying images.
ALTER TABLE project_images
  ADD COLUMN IF NOT EXISTS phase text NOT NULL DEFAULT 'completed';

-- Only does anything if an earlier partial run left the column nullable.
UPDATE project_images SET phase = 'completed' WHERE phase IS NULL;

ALTER TABLE project_images DROP CONSTRAINT IF EXISTS project_images_phase_check;
ALTER TABLE project_images
  ADD CONSTRAINT project_images_phase_check
  CHECK (phase IN ('rendering', 'in_progress', 'completed'));

COMMENT ON COLUMN project_images.phase IS
  'Fixed lifecycle stage: rendering, in_progress, completed. display_order is scoped per phase, and is_primary means first of its phase, so up to three rows per project can be primary. Public pages hide the phase control when a project has images in only one phase.';

-- The foreign key had no index, so every cascade delete and every embedded
-- project_images(...) select was a sequential scan. The composite serves the
-- lookup and the ordering in one index.
CREATE INDEX IF NOT EXISTS project_images_project_id_display_order_idx
  ON project_images (project_id, display_order);

-- Deliberately no index on phase: cardinality is 3 and every query narrows to
-- a single project first. Grouping by phase happens in TypeScript.
-- Deliberately no unique index on is_primary: the reorder helpers renumber a
-- whole phase in one batch and pass through transient duplicate states.

-- ============================================================
-- PART 2: PROJECT SLUGS
-- ============================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug text;

-- Backfill from the title. Nullable on purpose, so a title that slugifies to
-- nothing (an all-Thai title, for instance) falls back to a uuid prefix rather
-- than colliding on the empty string.
WITH slugged AS (
  SELECT
    id,
    regexp_replace(
      regexp_replace(lower(trim(title)), '[^a-z0-9]+', '-', 'g'),
      '(^-+|-+$)', '', 'g'
    ) AS base,
    row_number() OVER (
      PARTITION BY regexp_replace(
        regexp_replace(lower(trim(title)), '[^a-z0-9]+', '-', 'g'),
        '(^-+|-+$)', '', 'g')
      ORDER BY display_order, created_at
    ) AS n
  FROM projects
  WHERE slug IS NULL
)
UPDATE projects p
SET slug = CASE
             WHEN s.n = 1 THEN COALESCE(NULLIF(s.base, ''), 'project-' || left(p.id::text, 8))
             ELSE COALESCE(NULLIF(s.base, ''), 'project') || '-' || s.n
           END
FROM slugged s
WHERE p.id = s.id;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_slug_key;
ALTER TABLE projects ADD CONSTRAINT projects_slug_key UNIQUE (slug);

COMMENT ON COLUMN projects.slug IS
  'URL segment for /projects/<slug>. Generated from the title on create, then stable: editing a title does not change it. Nullable, and the route falls back to matching the uuid, so a null slug degrades to a working URL rather than a 404.';
