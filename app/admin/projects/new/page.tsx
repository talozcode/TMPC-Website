import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ProjectForm } from '@/components/admin/project-form'
import { createProject } from '../actions'

export default async function NewProjectPage() {
  const supabase = createAdminClient()
  const { data: categories } = await supabase.from('categories').select('*').order('display_order')

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/projects" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
          ← Projects
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">New Project</h1>
      </div>
      <ProjectForm categories={categories ?? []} onSave={createProject} />
    </div>
  )
}
