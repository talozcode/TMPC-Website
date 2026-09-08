import { createAdminClient } from '@/lib/supabase/admin'
import { HeroBeforeAfterForm } from '@/components/admin/hero-before-after-form'
import { SavedBanner } from '@/components/admin/saved-banner'
import type { HeroBeforeAfter } from '@/lib/types'

export default async function HeroAdminPage() {
  const supabase = createAdminClient()
  const { data: record } = await supabase.from('hero_before_after').select('*').limit(1).single()

  return (
    <div className="p-8">
      <SavedBanner />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Homepage Hero</h1>
        <p className="text-sm text-gray-500 mt-1">
          The before/after comparison at the top of the homepage, and its link to Projects.
        </p>
      </div>

      {record ? (
        <div className="max-w-3xl">
          <HeroBeforeAfterForm initial={record as HeroBeforeAfter} />
        </div>
      ) : (
        <p className="text-sm text-red-600">
          No hero row found. Run supabase/migrations/003_hero_before_after.sql against the database.
        </p>
      )}
    </div>
  )
}
