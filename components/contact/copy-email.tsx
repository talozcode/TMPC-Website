'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A small square "Copy" beside the email address, for the visitor who writes
 * from their own mail client or passes the address on. The label hands over
 * to "Copied" with a tick drawn under it, then hands back.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      // Older browsers or a blocked clipboard: select-and-copy fallback.
      const ta = document.createElement('textarea')
      ta.value = email
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } finally {
        ta.remove()
      }
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button type="button" onClick={copy} className="copy-btn t-meta press" data-copied={copied}>
      <span className="copy-stack" aria-hidden="true">
        <span>Copy</span>
        <span className="copy-done">
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
            <path d="m3 8.5 3 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" pathLength={1} />
          </svg>
          Copied
        </span>
      </span>
      <span className="sr-only">{copied ? 'Email address copied' : 'Copy email address'}</span>
    </button>
  )
}
