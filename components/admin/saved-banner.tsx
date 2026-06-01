'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function Banner() {
  const params = useSearchParams()
  const router = useRouter()
  const saved = params.get('saved')
  const formError = params.get('formError')

  useEffect(() => {
    if (!saved && !formError) return
    const t = setTimeout(() => {
      const url = new URL(window.location.href)
      url.searchParams.delete('saved')
      url.searchParams.delete('formError')
      router.replace(url.pathname, { scroll: false })
    }, 3000)
    return () => clearTimeout(t)
  }, [saved, formError, router])

  if (!saved && !formError) return null

  return (
    <div
      className={`fixed bottom-5 right-5 text-sm font-semibold px-5 py-3 shadow-lg z-50 transition-opacity ${
        saved ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      }`}
    >
      {saved ? '✓ Saved' : `✗ ${formError}`}
    </div>
  )
}

export function SavedBanner() {
  return (
    <Suspense>
      <Banner />
    </Suspense>
  )
}
