'use client'

import { ArrowSwap } from '@/components/ui/arrow-link'
import { getLenis } from '@/components/anim/smooth-scroll'
import { CONTACT_MODE_EVENT, type ContactMode } from '@/components/contact-form'

const WAYS: { mode: ContactMode; title: string; body: string }[] = [
  {
    mode: 'inquiry',
    title: 'Send an inquiry',
    body: 'Share a few details about your project. TMPC will follow up to set up an initial call.',
  },
  {
    mode: 'call',
    title: 'Book a call',
    body: 'A 30 minute introductory call with Tom or Tal.',
  },
]

/**
 * The two ways in, set as a ledger in the opening band. Pointing at a row
 * draws its rule in orange from the left and hands the arrow on inside its
 * square; choosing one sets the form below to that mode, carries the page down
 * to it, and puts the cursor in the first field.
 */
export function ContactWays() {
  function go(mode: ContactMode) {
    window.dispatchEvent(new CustomEvent(CONTACT_MODE_EVENT, { detail: mode }))
    const target = document.getElementById('brief')
    if (!target) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const focusFirst = () => target.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true })
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(target, { offset: -24, duration: 1.2, onComplete: focusFirst })
    } else {
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      window.setTimeout(focusFirst, reduced ? 0 : 700)
    }
  }

  return (
    <ul className="ways">
      {WAYS.map((w) => (
        <li key={w.mode}>
          <button type="button" className="way" onClick={() => go(w.mode)}>
            <span className="way-rule" aria-hidden="true" />
            <span className="way-copy">
              <span className="way-title t-h3">{w.title}</span>
              <span className="way-body">{w.body}</span>
            </span>
            <span className="way-go" aria-hidden="true">
              <ArrowSwap className="w-[1.05rem] h-[1.05rem]" />
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
