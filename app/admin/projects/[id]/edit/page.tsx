import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ProjectForm } from '@/components/admin/project-form'
import { updateProject } from '../../actions'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const [{ data: project }, { data: categories }] = await Promise.all([
    supabase
      .from('projects')
      .select('*, project_images(*)')
      .eq('id', id)
      .order('display_order', { referencedTable: 'project_images', ascending: true })
      .single(),
    supabase.from('categories').select('*').order('display_order'),
  ])

  if (!project) notFound()

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/projects" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
          ← Projects
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{project.title}</h1>
      </div>
      <ProjectForm
        project={project as any}
        categories={categories ?? []}
        onSave={updateProject.bind(null, id)}
      />
    </div>
  )
}
