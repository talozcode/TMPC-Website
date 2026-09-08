-- TMPC Website CMS: split the hero before/after caption into a project
-- name/details label, matching what the old hero carousel showed.
-- Run this in: Supabase Dashboard > SQL Editor > Run
-- Safe to run more than once.

ALTER TABLE hero_before_after
  ADD COLUMN IF NOT EXISTS project_name text,
  ADD COLUMN IF NOT EXISTS project_details text;

-- Carry any existing caption over as the project name, then drop the column.
-- Guarded so a second run (caption already gone) is a no-op rather than an
-- error on a column that no longer exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_before_after' AND column_name = 'caption'
  ) THEN
    UPDATE hero_before_after SET project_name = caption WHERE project_name IS NULL AND caption IS NOT NULL;
    ALTER TABLE hero_before_after DROP COLUMN caption;
  END IF;
END $$;
