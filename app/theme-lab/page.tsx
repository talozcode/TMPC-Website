import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Theme Lab',
  robots: { index: false, follow: false },
}

// Each palette overrides the global --color-* tokens. Because every component
// uses those tokens, wrapping a demo block in these vars re-skins it instantly.
type Vars = Record<`--color-${string}`, string>

const palettes: { name: string; desc: string; vars: Vars }[] = [
  {
    name: 'Current (baseline)',
    desc: 'White · Navy · Teal',
    vars: {
      '--color-canvas': '#FFFFFF', '--color-canvas-subtle': '#F4F7FB', '--color-canvas-muted': '#E8EDF5',
      '--color-canvas-dark': '#0A1628', '--color-navy': '#0F2040',
      '--color-ink': '#111827', '--color-ink-secondary': '#374151', '--color-ink-muted': '#6B7280',
      '--color-accent': '#0891B2', '--color-accent-light': '#22C5E0', '--color-accent-dark': '#0E7490', '--color-accent-muted': '#A5D8E6',
      '--color-line': '#E5E9EF', '--color-line-subtle': '#EFF2F7',
    },
  },
  {
    name: 'Warm premium',
    desc: 'Charcoal · Amber-gold',
    vars: {
      '--color-canvas': '#FCFBF9', '--color-canvas-subtle': '#F6F4F0', '--color-canvas-muted': '#ECE8E1',
      '--color-canvas-dark': '#1A1714', '--color-navy': '#262019',
      '--color-ink': '#1A1714', '--color-ink-secondary': '#44403A', '--color-ink-muted': '#78716A',
      '--color-accent': '#C19A3E', '--color-accent-light': '#E0BC6B', '--color-accent-dark': '#97781F', '--color-accent-muted': '#E8D9B0',
      '--color-line': '#E8E3DA', '--color-line-subtle': '#F2EEE7',
    },
  },
  {
    name: 'Architectural stone',
    desc: 'Cream · Ink · Terracotta',
    vars: {
      '--color-canvas': '#FAF7F2', '--color-canvas-subtle': '#F2EDE4', '--color-canvas-muted': '#E7DFD3',
      '--color-canvas-dark': '#2B2620', '--color-navy': '#3A332A',
      '--color-ink': '#2B2620', '--color-ink-secondary': '#544D43', '--color-ink-muted': '#857B6E',
      '--color-accent': '#B5613E', '--color-accent-light': '#CE8366', '--color-accent-dark': '#8F4A2E', '--color-accent-muted': '#E2C3B4',
      '--color-line': '#E3DBCF', '--color-line-subtle': '#EEE8DD',
    },
  },
  {
    name: 'Bold monochrome',
    desc: 'Greyscale · Electric orange',
    vars: {
      '--color-canvas': '#FFFFFF', '--color-canvas-subtle': '#F5F5F5', '--color-canvas-muted': '#E8E8E8',
      '--color-canvas-dark': '#121212', '--color-navy': '#1F1F1F',
      '--color-ink': '#0A0A0A', '--color-ink-secondary': '#3A3A3A', '--color-ink-muted': '#757575',
      '--color-accent': '#FF5A1F', '--color-accent-light': '#FF7A45', '--color-accent-dark': '#E0440E', '--color-accent-muted': '#FFC9B0',
      '--color-line': '#E3E3E3', '--color-line-subtle': '#EFEFEF',
    },
  },
  {
    name: 'Refined blue',
    desc: 'Midnight · Vivid blue',
    vars: {
      '--color-canvas': '#FFFFFF', '--color-canvas-subtle': '#F3F6FB', '--color-canvas-muted': '#E5ECF6',
      '--color-canvas-dark': '#0B1A33', '--color-navy': '#15294D',
      '--color-ink': '#0F1B2D', '--color-ink-secondary': '#334155', '--color-ink-muted': '#64748B',
      '--color-accent': '#3B6FF5', '--color-accent-light': '#6B93FF', '--color-accent-dark': '#2451C7', '--color-accent-muted': '#C2D3FB',
      '--color-line': '#E2E8F2', '--color-line-subtle': '#EEF2F8',
    },
  },
  {
    name: 'Emerald estate',
    desc: 'Cream · Forest green',
    vars: {
      '--color-canvas': '#F8F6F1', '--color-canvas-subtle': '#EFEDE5', '--color-canvas-muted': '#E2E0D5',
      '--color-canvas-dark': '#14271F', '--color-navy': '#1C3327',
      '--color-ink': '#16241D', '--color-ink-secondary': '#3C4A42', '--color-ink-muted': '#6E7A72',
      '--color-accent': '#1F7A55', '--color-accent-light': '#34A574', '--color-accent-dark': '#155C3F', '--color-accent-muted': '#B2D9C7',
      '--color-line': '#E2DFD5', '--color-line-subtle': '#EDEBE3',
    },
  },
  {
    name: 'Dark mode',
    desc: 'Near-black · Electric cyan',
    vars: {
      '--color-canvas': '#0E1116', '--color-canvas-subtle': '#161A22', '--color-canvas-muted': '#1F2530',
      '--color-canvas-dark': '#05070C', '--color-navy': '#0B0F18',
      '--color-ink': '#F3F5F8', '--color-ink-secondary': '#C2C8D2', '--color-ink-muted': '#8A93A1',
      '--color-accent': '#22D3EE', '--color-accent-light': '#67E8F9', '--color-accent-dark': '#0FB6D1', '--color-accent-muted': '#164E5B',
      '--color-line': '#232A36', '--color-line-subtle': '#1A2029',
    },
  },
  {
    name: 'Slate + coral',
    desc: 'Cool slate · Coral',
    vars: {
      '--color-canvas': '#FFFFFF', '--color-canvas-subtle': '#F4F5F7', '--color-canvas-muted': '#E6E9ED',
      '--color-canvas-dark': '#1E293B', '--color-navy': '#334155',
      '--color-ink': '#0F172A', '--color-ink-secondary': '#334155', '--color-ink-muted': '#64748B',
      '--color-accent': '#FB6F5C', '--color-accent-light': '#FF8E7D', '--color-accent-dark': '#E25542', '--color-accent-muted': '#FBCFC7',
      '--color-line': '#E2E6EC', '--color-line-subtle': '#EEF1F5',
    },
  },
  {
    name: 'Burgundy luxe',
    desc: 'Ivory · Wine · Soft gold',
    vars: {
      '--color-canvas': '#FAF7F4', '--color-canvas-subtle': '#F2ECE7', '--color-canvas-muted': '#E7DDD5',
      '--color-canvas-dark': '#3A1620', '--color-navy': '#4E2029',
      '--color-ink': '#2A1318', '--color-ink-secondary': '#51393E', '--color-ink-muted': '#836E72',
      '--color-accent': '#B08A3E', '--color-accent-light': '#CBA862', '--color-accent-dark': '#8C6B26', '--color-accent-muted': '#E4D5B2',
      '--color-line': '#E8DDD5', '--color-line-subtle': '#F1E9E2',
    },
  },
  {
    name: 'Indigo violet',
    desc: 'Soft lavender · Violet',
    vars: {
      '--color-canvas': '#FBFAFD', '--color-canvas-subtle': '#F3F1F9', '--color-canvas-muted': '#E7E3F3',
      '--color-canvas-dark': '#1E1B3A', '--color-navy': '#2A2552',
      '--color-ink': '#1A1730', '--color-ink-secondary': '#3F3A5C', '--color-ink-muted': '#716C8C',
      '--color-accent': '#6D4AE0', '--color-accent-light': '#8E6FF0', '--color-accent-dark': '#5436BE', '--color-accent-muted': '#D2C6F5',
      '--color-line': '#E5E1F0', '--color-line-subtle': '#EFECF8',
    },
  },
]

function Swatches() {
  const items: { v: string; l: string }[] = [
    { v: 'bg-canvas border border-line', l: 'canvas' },
    { v: 'bg-canvas-subtle', l: 'subtle' },
    { v: 'bg-canvas-dark', l: 'dark' },
    { v: 'bg-accent', l: 'accent' },
    { v: 'bg-accent-light', l: 'light' },
    { v: 'bg-ink', l: 'ink' },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <div key={s.l} className="text-center">
          <div className={`w-12 h-12 ${s.v}`} />
          <p className="text-[0.5rem] text-ink-muted uppercase tracking-wider mt-1">{s.l}</p>
        </div>
      ))}
    </div>
  )
}

// One representative slice of the real site, rendered with whatever --color tokens
// are active on the ancestor.
function Demo() {
  return (
    <div className="bg-canvas text-ink p-6 lg:p-8 space-y-6">
      <Swatches />

      {/* Hero-ish */}
      <div>
        <p className="text-[0.65rem] font-semibold text-ink-muted uppercase tracking-[0.2em] mb-3">Bangkok, Thailand</p>
        <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink tracking-tight leading-tight mb-3">
          Planning a project in Thailand?
        </h2>
        <p className="text-sm text-ink-secondary leading-relaxed max-w-md mb-5">
          One accountable management presence on the ground, turning fragmented input into aligned delivery.
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center text-sm font-semibold bg-accent text-white px-6 py-3">Discuss Your Project</span>
          <span className="inline-flex items-center text-sm font-semibold text-ink border border-line px-5 py-3">Our Services</span>
        </div>
      </div>

      {/* Navy band */}
      <div className="bg-canvas-dark p-6">
        <p className="text-[0.55rem] font-bold text-accent uppercase tracking-[0.25em] mb-2">One Coordination Layer</p>
        <p className="font-display text-lg text-white leading-snug mb-4">
          TMPC sits between 8+ parties, two languages, and every approval.
        </p>
        <span className="inline-flex items-center text-xs font-semibold bg-accent text-white px-4 py-2">Schedule a Consultation</span>
      </div>

      {/* Project card */}
      <div className="border border-line bg-canvas">
        <div className="relative h-40 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/scenario-commercial.jpg" alt="" className="w-full h-full object-cover" />
          <span className="absolute bottom-3 left-3 text-[0.55rem] font-bold text-accent uppercase tracking-[0.2em] border border-accent/40 bg-canvas-dark/70 px-2 py-1">Commercial</span>
        </div>
        <div className="p-5">
          <p className="text-[0.55rem] font-bold text-accent uppercase tracking-[0.2em] mb-2">TMPC Scope</p>
          <div className="flex flex-wrap gap-2">
            {['Coordination', 'Oversight', 'Reporting', 'Handover'].map((c) => (
              <span key={c} className="border border-accent/30 bg-accent/[0.06] text-accent text-[0.7rem] px-2.5 py-1">{c}</span>
            ))}
          </div>
          <a className="inline-block mt-4 text-xs font-semibold text-accent">View Projects -&gt;</a>
        </div>
      </div>
    </div>
  )
}

export default function ThemeLabPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-1">Theme Lab</h1>
        <p className="text-sm text-gray-500 mb-8">
          The same site slice rendered in each candidate palette. Pick one and I will apply it to the real tokens in globals.css.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          {palettes.map((p) => (
            <div key={p.name} className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
                <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                <p className="text-xs text-gray-400">{p.desc}</p>
              </div>
              <div style={p.vars as React.CSSProperties}>
                <Demo />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
