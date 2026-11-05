import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Anon client for the public pages. It reads no cookies, so a page that uses
 * it can be cached and revalidated instead of being rendered on every
 * request (the cookie-reading client in ./server.ts forces dynamic
 * rendering). RLS still applies: only published/active rows come back.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
