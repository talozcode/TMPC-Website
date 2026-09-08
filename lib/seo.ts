import { createClient } from '@/lib/supabase/server'

/**
 * Reads one page's row from the seo_metadata CMS table. Every public page's
 * generateMetadata() calls this and falls back to a hardcoded default when
 * the row (or a field on it) is empty, so the admin at /admin/seo can now
 * actually change what ships, instead of writing to a table nothing read.
 */
export async function getSeoRow(page: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('seo_metadata')
    .select('title, description, og_title, og_description')
    .eq('page', page)
    .maybeSingle()
  return data
}
