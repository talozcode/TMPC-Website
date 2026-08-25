'use client'

import { useState } from 'react'

const projectTypeOptions = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial / Factory' },
  { value: 'real-estate', label: 'Real Estate / Renovation' },
  { value: 'wellness', label: 'Wellness / Hospitality' },
  { value: 'warehouse', label: 'Warehouse / Operations' },
  { value: 'other', label: 'Other' },
]

const inputClass =
  'w-full rounded-[14px] border border-line bg-canvas-subtle text-ink text-[0.95rem] px-4.5 py-3.5 outline-none focus:border-accent focus:bg-canvas focus:shadow-[0_0_0_4px_rgba(8,145,178,0.1)] transition-all duration-200 placeholder:text-ink-muted'

const labelClass =
  'block text-[0.62rem] font-bold text-ink-secondary uppercase tracking-[0.14em] mb-2.5'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const body = {
      name: fd.get('name'),
      company: fd.get('company'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      projectType: fd.get('projectType'),
      message: fd.get('description'),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="card border-accent/25 bg-accent/[0.04] p-10 lg:p-14 text-center">
        <div className="w-11 h-11 rounded-full bg-accent/12 text-accent flex items-center justify-center mx-auto mb-5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <p className="t-h3 text-ink mb-3">Thank you for your inquiry.</p>
        <p className="text-[0.95rem] text-ink-muted leading-relaxed max-w-sm mx-auto">
          TMPC will review your project details and be in touch to set up an initial call.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div role="alert" className="rounded-[14px] border border-red-200 bg-red-50 text-red-700 text-sm px-4.5 py-3.5">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full Name <span className="text-accent">*</span>
          </label>
          <input type="text" id="name" name="name" required autoComplete="name" placeholder="Your full name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Company / Organization
          </label>
          <input type="text" id="company" name="company" autoComplete="organization" placeholder="Optional" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address <span className="text-accent">*</span>
          </label>
          <input type="email" id="email" name="email" required autoComplete="email" placeholder="your@email.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone / WhatsApp
          </label>
          <input type="tel" id="phone" name="phone" autoComplete="tel" placeholder="+66 or international" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="project-type" className={labelClass}>
          Project Type
        </label>
        <div className="relative">
          <select id="project-type" name="projectType" defaultValue="" className={`${inputClass} appearance-none pr-10 cursor-pointer`}>
            <option value="" disabled>Select a project type</option>
            {projectTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Project Description
        </label>
        <textarea id="description" name="description" rows={5} placeholder="Briefly describe your project, timeline, or coordination requirements." className={`${inputClass} resize-none`} />
      </div>

      <div className="pt-1">
        <button type="submit" disabled={submitting} className="btn disabled:opacity-50 disabled:pointer-events-none">
          {submitting ? 'Sending...' : 'Discuss Your Project'}
        </button>
      </div>
    </form>
  )
}
