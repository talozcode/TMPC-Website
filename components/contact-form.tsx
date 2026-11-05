'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowSwap } from '@/components/ui/arrow-link'
import { RollLabel } from '@/components/ui/roll-label'
import { animate, createDrawable, motionOk, outExpo } from '@/components/anim/anime'
import { CONTACT_PROGRESS_EVENT, type ContactProgress } from '@/components/contact/contact-steps'

/** Fired by the hero's two ways in; the form switches to that mode. */
export const CONTACT_MODE_EVENT = 'tmpc:contact-mode'

export type ContactMode = 'inquiry' | 'call'

const projectTypeOptions = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial / Factory' },
  { value: 'real-estate', label: 'Real Estate / Renovation' },
  { value: 'wellness', label: 'Wellness / Hospitality' },
  { value: 'warehouse', label: 'Warehouse / Operations' },
  { value: 'other', label: 'Other' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const WINDOWS = [
  { value: 'Morning', hint: '08:00 to 11:00' },
  { value: 'Midday', hint: '11:00 to 14:00' },
  { value: 'Afternoon', hint: '14:00 to 17:00' },
  { value: 'Evening', hint: '17:00 to 20:00' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = Partial<Record<'name' | 'email', string>>

function validate(fd: FormData): Errors {
  const errors: Errors = {}
  if (!String(fd.get('name') ?? '').trim()) errors.name = 'Please tell us your name.'
  const email = String(fd.get('email') ?? '').trim()
  if (!email) errors.email = 'We need an email address to reply to.'
  else if (!EMAIL_RE.test(email)) errors.email = 'That email address does not look complete.'
  return errors
}

// What "filled in" means for the steps beside the form: who you are, how to
// reach you, what kind of project, and either a description or, for a call,
// when suits you.
function progressOf(fd: FormData, mode: ContactMode): number {
  const has = (k: string) => !!String(fd.get(k) ?? '').trim()
  return [
    has('name'),
    EMAIL_RE.test(String(fd.get('email') ?? '').trim()),
    has('projectType'),
    mode === 'call' ? fd.getAll('days').length > 0 || has('window') : has('description'),
  ].filter(Boolean).length
}

function report(detail: ContactProgress) {
  window.dispatchEvent(new CustomEvent(CONTACT_PROGRESS_EVENT, { detail }))
}

/**
 * One form, two modes. "Send an inquiry" is the short project form; "Book a
 * call" adds preferred days, a time window and the visitor's time zone. Both
 * post the same JSON to /api/contact with unchanged field names; a call
 * request is marked by a "[Call request]" line at the top of `message`, so it
 * reads plainly in the admin inbox without a schema change.
 *
 * Validation runs on blur and on submit, each message sits under its field,
 * and the first invalid field takes focus on a failed submit.
 */
export function ContactForm({ initialMode = 'inquiry', aside }: { initialMode?: ContactMode; aside?: ReactNode }) {
  const [mode, setMode] = useState<ContactMode>(initialMode)
  const [submitted, setSubmitted] = useState<ContactMode | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [ok, setOk] = useState({ name: false, email: false })
  const [moved, setMoved] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)
  const tzRef = useRef<HTMLInputElement>(null)
  const uid = useId()

  useEffect(() => {
    // Prefill the visitor's time zone; the field stays editable.
    try {
      if (tzRef.current && !tzRef.current.value) tzRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    } catch {
      /* leave blank; the visitor can type it */
    }
  }, [])

  useEffect(() => {
    if (!submitted) return
    doneRef.current?.focus()
    // The tick is drawn once the mark has opened, as if signed off by hand.
    const tick = doneRef.current?.querySelector<SVGPathElement>('[data-tick]')
    if (tick && motionOk()) {
      const [line] = createDrawable(tick)
      animate(line, { draw: ['0 0', '0 1'], duration: 650, delay: 380, ease: outExpo })
    }
  }, [submitted])

  function track(nextMode: ContactMode = mode) {
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    const name = !!String(fd.get('name') ?? '').trim()
    const email = EMAIL_RE.test(String(fd.get('email') ?? '').trim())
    setOk((prev) => (prev.name === name && prev.email === email ? prev : { name, email }))
    report({ filled: progressOf(fd, nextMode), total: 4, sent: false })
  }

  function switchMode(next: ContactMode) {
    if (next === mode) return
    setMode(next)
    setMoved(true)
    track(next)
    // Keep the address shareable without a navigation or a scroll jump.
    const url = new URL(window.location.href)
    if (next === 'call') url.searchParams.set('mode', 'call')
    else url.searchParams.delete('mode')
    window.history.replaceState(window.history.state, '', url)
  }

  // The hero's rows pick a mode from above the fold.
  const switchRef = useRef(switchMode)
  useEffect(() => {
    switchRef.current = switchMode
  })
  useEffect(() => {
    const on = (e: Event) => switchRef.current((e as CustomEvent<ContactMode>).detail)
    window.addEventListener(CONTACT_MODE_EVENT, on)
    return () => window.removeEventListener(CONTACT_MODE_EVENT, on)
  }, [])

  function onTabKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = mode === 'inquiry' ? 'call' : 'inquiry'
    switchMode(next)
    document.getElementById(`${uid}-tab-${next}`)?.focus()
  }

  function checkField(field: keyof Errors) {
    if (!formRef.current) return
    const next = validate(new FormData(formRef.current))
    setErrors((prev) => (prev[field] === next[field] ? prev : { ...prev, [field]: next[field] }))
  }

  // Clear an error as soon as the field is fixed, while typing. Waiting for
  // blur would collapse the message during the next click and shift the
  // layout under the pointer.
  function recheckField(field: keyof Errors) {
    if (errors[field]) checkField(field)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const found = validate(fd)
    setErrors(found)
    const firstInvalid = (Object.keys(found) as (keyof Errors)[])[0]
    if (firstInvalid) {
      form.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    let message = String(fd.get('description') ?? '').trim()
    if (mode === 'call') {
      const days = fd.getAll('days').map(String)
      const window = String(fd.get('window') ?? '')
      const tz = String(fd.get('timezone') ?? '').trim()
      const parts = [
        `Days: ${days.length ? days.join(', ') : 'any weekday'}`,
        `Window: ${window || 'any'}`,
        `Time zone: ${tz || 'not given'}`,
      ]
      message = `[Call request] ${parts.join('. ')}.${message ? `\n\n${message}` : ''}`
    }

    setSubmitting(true)
    setError('')
    const body = {
      name: fd.get('name'),
      company: fd.get('company'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      projectType: fd.get('projectType'),
      message,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.status === 429) {
        setError('You have sent a few inquiries already. Please wait a little, or email us directly.')
        return
      }
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(mode)
      report({ filled: 4, total: 4, sent: true })
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldError = (field: keyof Errors) =>
    errors[field] ? (
      <p id={`${uid}-${field}-error`} className="field-error">
        {errors[field]}
      </p>
    ) : null

  const call = mode === 'call'

  const lead = call
    ? 'A 30 minute introductory call with Tom or Tal. Tell us when suits you and we will confirm by email.'
    : 'Share a few details about your project. TMPC will follow up to set up an initial call.'
  const shown = submitted ?? mode

  const body = submitted ? (
      <div ref={doneRef} tabIndex={-1} role="status" className="done outline-none">
        <span className="done-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path data-tick d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </span>
        <h2 className="t-h1 mt-8">{call ? <>Call request <em>received.</em></> : <>Thank you for your <em>inquiry.</em></>}</h2>
        <p className="t-lead mt-6 !max-w-[44ch]">
          {call
            ? 'We will reply by email to confirm a time that works in your time zone.'
            : 'TMPC will review your project details and be in touch to set up an initial call.'}
        </p>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
          <Link href="/projects" className="lnk">
            See our projects <ArrowSwap className="w-[0.95rem] h-[0.95rem]" />
          </Link>
          <Link href="/services" className="lnk">
            How we work <ArrowSwap className="w-[0.95rem] h-[0.95rem]" />
          </Link>
        </div>
      </div>
  ) : (
    <>
      <div
        role="tablist"
        aria-label="How would you like to start?"
        className="seg"
        data-mode={mode}
        data-moved={moved || undefined}
        onKeyDown={onTabKey}
      >
        <span className="seg-thumb" aria-hidden="true" />
        {(['inquiry', 'call'] as const).map((m) => (
          <button
            key={m}
            id={`${uid}-tab-${m}`}
            type="button"
            role="tab"
            aria-selected={mode === m}
            aria-controls={`${uid}-panel`}
            tabIndex={mode === m ? 0 : -1}
            onClick={() => switchMode(m)}
          >
            {m === 'inquiry' ? 'Send an inquiry' : 'Book a call'}
          </button>
        ))}
      </div>


      {/* The tab panel wraps the form: role="tabpanel" is not allowed on a form element itself. */}
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${mode}`}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onInput={() => track()}
        onChange={() => track()}
        noValidate
        className="mt-10 grid gap-9"
      >
        {error && (
          <div role="alert" className="form-alert">
            {error}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-7">
          <div className="field">
            <label htmlFor={`${uid}-name`}>
              Full name <span className="text-signal-ink" aria-hidden="true">*</span>
            </label>
            <div className="input-wrap" data-ok={ok.name && !errors.name}>
            <input
              id={`${uid}-name`} type="text" name="name" required autoComplete="name"
              className="input" placeholder="Your full name" aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${uid}-name-error` : undefined}
              onBlur={() => checkField('name')} onChange={() => recheckField('name')}
            />
            <OkTick />
            </div>
            {fieldError('name')}
          </div>
          <div className="field">
            <label htmlFor={`${uid}-email`}>
              Email address <span className="text-signal-ink" aria-hidden="true">*</span>
            </label>
            <div className="input-wrap" data-ok={ok.email && !errors.email}>
            <input
              id={`${uid}-email`} type="email" name="email" required autoComplete="email" inputMode="email"
              className="input" placeholder="your@email.com" aria-invalid={!!errors.email}
              aria-describedby={errors.email ? `${uid}-email-error` : undefined}
              onBlur={() => checkField('email')} onChange={() => recheckField('email')}
            />
            <OkTick />
            </div>
            {fieldError('email')}
          </div>
          <div className="field">
            <label htmlFor={`${uid}-company`}>Company / organization</label>
            <input id={`${uid}-company`} type="text" name="company" autoComplete="organization" className="input" placeholder="Optional" />
          </div>
          <div className="field">
            <label htmlFor={`${uid}-phone`}>Phone / WhatsApp</label>
            <input id={`${uid}-phone`} type="tel" name="phone" autoComplete="tel" inputMode="tel" className="input" placeholder="+66 or international" />
          </div>
        </div>

        {/* Call details: open only in call mode, and out of the tab order otherwise. */}
        <div className="reveal-rows" data-open={call} inert={!call}>
          <div className="min-h-0">
            <div className="grid gap-7 pb-1">
              <fieldset className="field">
                <legend className="label mb-3">Best days</legend>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => (
                    <label key={d} className="opt press">
                      <input type="checkbox" name="days" value={d} className="sr-only" />
                      {d}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="field">
                <legend className="label mb-3">Time window, in your time zone</legend>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {WINDOWS.map((w) => (
                    <label key={w.value} className="opt press !grid !gap-0.5 !py-2.5">
                      <input type="radio" name="window" value={w.value} className="sr-only" />
                      <span className="font-semibold">{w.value}</span>
                      <span className="t-meta !text-[0.66rem] opacity-70">{w.hint}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="field sm:max-w-[22rem]">
                <label htmlFor={`${uid}-tz`}>Your time zone</label>
                <input
                  id={`${uid}-tz`} type="text" name="timezone" className="input"
                  ref={tzRef} autoComplete="off"
                  placeholder="For example, Europe/London"
                />
                <p className="hint">We are in Bangkok (GMT+7) and take early or late calls to suit you.</p>
              </div>
            </div>
          </div>
        </div>

        <fieldset className="field">
          <legend className="label mb-3">Project type</legend>
          <div className="flex flex-wrap gap-2">
            {projectTypeOptions.map((opt) => (
              <label key={opt.value} className="opt press">
                <input type="radio" name="projectType" value={opt.value} className="sr-only" />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor={`${uid}-description`}>{call ? 'Anything we should know before the call?' : 'Project description'}</label>
          <textarea
            id={`${uid}-description`} name="description" rows={4} className="input"
            placeholder={call ? 'Optional' : 'Briefly describe your project, timeline, or coordination requirements.'}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
          <button type="submit" disabled={submitting} data-busy={submitting || undefined} className="btn btn-send disabled:pointer-events-none">
            <RollLabel text={submitting ? 'Sending...' : call ? 'Request a call' : 'Send inquiry'} />
            <ArrowSwap className="btn-arrow" />
            <span className="btn-busy" aria-hidden="true" />
          </button>
          <p className="text-[0.84rem] text-ink-muted">
            <span className="text-signal-ink" aria-hidden="true">*</span> Required. We reply by email.
          </p>
        </div>
      </form>
      </div>
    </>
  )

  return (
    <div className="brief">
      <div className="brief-side">
        <div className="lg:sticky lg:top-[calc(var(--hdr-h)+2.5rem)]">
          <h2 className="brief-mode t-h2" data-mode={shown}>
            <span className="brief-mode-word" data-on={shown === 'inquiry'} aria-hidden={shown !== 'inquiry'}>Send an inquiry</span>
            <span className="brief-mode-word" data-on={shown === 'call'} aria-hidden={shown !== 'call'}>Book a call</span>
          </h2>
          <p className="t-body mt-6 !max-w-[40ch]" aria-live="polite">{lead}</p>
          {aside && <div className="mt-14 hidden lg:block">{aside}</div>}
        </div>
      </div>
      <div className="brief-main">
        <div className="sheet-tray">
          <div className="sheet">{body}</div>
        </div>
        {aside && <div className="mt-14 lg:hidden">{aside}</div>}
      </div>
    </div>
  )
}

/** Drawn inside a required field once what is in it will do. */
function OkTick() {
  return (
    <svg className="input-ok" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m3 8.5 3 3L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" pathLength={1} />
    </svg>
  )
}
