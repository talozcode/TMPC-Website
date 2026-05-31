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
  'w-full border border-line bg-canvas-subtle text-ink text-sm px-4 py-3 outline-none focus:border-accent focus:bg-canvas transition-colors duration-150 placeholder:text-ink-muted'

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
      <div className="border border-accent/30 bg-accent/5 p-10 lg:p-14 text-center">
        <p className="text-base font-semibold text-ink mb-3">Thank you for your inquiry.</p>
        <p className="text-sm text-ink-muted leading-relaxed max-w-sm mx-auto">
          TMPC will review your project details and be in touch to set up an initial call.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
            Full Name <span className="text-accent">*</span>
          </label>
          <input type="text" id="name" name="name" required autoComplete="name" placeholder="Your full name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="company" className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
            Company / Organization
          </label>
          <input type="text" id="company" name="company" autoComplete="organization" placeholder="Optional" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
            Email Address <span className="text-accent">*</span>
          </label>
          <input type="email" id="email" name="email" required autoComplete="email" placeholder="your@email.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
            Phone / WhatsApp
          </label>
          <input type="tel" id="phone" name="phone" autoComplete="tel" placeholder="+66 or international" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="project-type" className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
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
        <label htmlFor="description" className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">
          Project Description
        </label>
        <textarea id="description" name="description" rows={5} placeholder="Briefly describe your project, timeline, or coordination requirements." className={`${inputClass} resize-none`} />
      </div>

      <div className="pt-1">
        <button type="submit" disabled={submitting}
          className="inline-flex items-center text-sm font-semibold bg-accent text-white px-7 py-3.5 hover:bg-accent-dark transition-colors duration-200 disabled:opacity-50">
          {submitting ? 'Sending…' : 'Discuss Your Project'}
        </button>
      </div>
    </form>
  )
}
