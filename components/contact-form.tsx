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
  'w-full border border-line bg-canvas text-ink text-sm px-4 py-3 rounded outline-none focus:border-ink transition-colors duration-150 placeholder:text-ink-muted'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Form submission: wire to backend or email service when ready
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="border border-line bg-canvas p-10 lg:p-14 text-center rounded-sm">
        <p className="text-base font-semibold text-ink mb-3">
          Thank you for your inquiry.
        </p>
        <p className="text-sm text-ink-muted leading-relaxed max-w-sm mx-auto">
          TMPC will review your project details and be in touch to arrange an initial discussion.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Row 1: Name + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-ink mb-2">
            Company / Organization
          </label>
          <input
            type="text"
            id="company"
            name="company"
            autoComplete="organization"
            placeholder="Optional"
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 2: Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
            Email Address <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink mb-2">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            placeholder="+66 or international"
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 3: Project Type */}
      <div>
        <label htmlFor="project-type" className="block text-sm font-medium text-ink mb-2">
          Project Type
        </label>
        <div className="relative">
          <select
            id="project-type"
            name="projectType"
            defaultValue=""
            className={`${inputClass} appearance-none pr-10 cursor-pointer`}
          >
            <option value="" disabled>
              Select a project type
            </option>
            {projectTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="w-4 h-4 text-ink-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m6 9 6 6 6-6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 4: Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-ink mb-2">
          Project Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Briefly describe your project, timeline, or coordination requirements."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit */}
      <div className="pt-1">
        <button
          type="submit"
          className="inline-flex items-center text-sm font-medium bg-ink text-canvas px-6 py-3 rounded hover:bg-ink-secondary transition-colors duration-150"
        >
          Discuss Your Project
        </button>
      </div>
    </form>
  )
}
