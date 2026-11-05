'use client'

import { useEffect } from 'react'

const KEY = 'tmpc-type'

/**
 * Review aid for the heading typeface, to be removed once a face is chosen.
 * ?type=serif shows candidate B (Source Serif 4) and remembers it in
 * localStorage so it holds across pages; ?type=sans (or any other value)
 * goes back to candidate A (IBM Plex Sans), the default. Read on the client
 * only, so no page becomes dynamic.
 */
export function TypeSwitch() {
  useEffect(() => {
    let type: string | null = null
    try {
      const param = new URLSearchParams(window.location.search).get('type')
      if (param) {
        type = param === 'serif' ? 'serif' : null
        if (type) localStorage.setItem(KEY, type)
        else localStorage.removeItem(KEY)
      } else {
        type = localStorage.getItem(KEY)
      }
    } catch {
      // Storage blocked (private mode): the query string alone still works.
      type = new URLSearchParams(window.location.search).get('type') === 'serif' ? 'serif' : null
    }
    if (type === 'serif') document.documentElement.dataset.type = 'serif'
    else delete document.documentElement.dataset.type
  }, [])
  return null
}
