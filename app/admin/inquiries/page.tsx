import { createAdminClient } from '@/lib/supabase/admin'
import { markRead, archiveInquiry, deleteInquiry } from './actions'
import type { ContactInquiry } from '@/lib/types'

export default async function InquiriesPage() {
  const supabase = createAdminClient()
  const { data: inquiries } = await supabase
    .from('contact_inquiries')
    .select('*')
    .eq('archived', false)
    .order('created_at', { ascending: false })

  const unread = inquiries?.filter((i) => !i.read).length ?? 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inquiries</h1>
          {unread > 0 && (
            <span className="bg-accent text-white text-xs font-bold px-2 py-0.5">{unread} new</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">{inquiries?.length ?? 0} active inquiries</p>
      </div>

      {!inquiries?.length ? (
        <div className="text-center py-20 text-gray-400 text-sm">No inquiries yet.</div>
      ) : (
        <div className="space-y-3">
          {(inquiries as ContactInquiry[]).map((inq) => (
            <details
              key={inq.id}
              className={`bg-white border group ${inq.read ? 'border-gray-200' : 'border-accent/40'}`}
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                <div className="flex items-center gap-4 min-w-0">
                  {!inq.read && <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className={`text-sm ${inq.read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
                      {inq.name}
                      {inq.company && <span className="font-normal text-gray-500"> · {inq.company}</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{inq.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  {inq.project_type && (
                    <span className="text-[0.6rem] font-semibold text-gray-400 uppercase tracking-wider hidden sm:block">
                      {inq.project_type}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </summary>

              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${inq.email}`} className="text-accent hover:underline">{inq.email}</a>
                  </div>
                  {inq.phone && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                      <p className="text-gray-700">{inq.phone}</p>
                    </div>
                  )}
                </div>
                {inq.message && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Message</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{inq.message}</p>
                  </div>
                )}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <form action={markRead.bind(null, inq.id, !inq.read)}>
                    <button type="submit" className="text-xs text-accent hover:text-accent-dark font-semibold transition-colors">
                      {inq.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                  </form>
                  <form action={archiveInquiry.bind(null, inq.id)}>
                    <button type="submit" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                      Archive
                    </button>
                  </form>
                  <form action={deleteInquiry.bind(null, inq.id)}>
                    <button type="submit" className="text-xs text-red-400 hover:text-red-600 transition-colors">
                      Delete
                    </button>
                  </form>
                  <a href={`mailto:${inq.email}`}
                    className="ml-auto text-xs bg-accent text-white font-semibold px-4 py-1.5 hover:bg-accent-dark transition-colors">
                    Reply by Email
                  </a>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
