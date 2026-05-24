import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hero Concepts - TMPC Design Review',
  robots: { index: false },
}

// Compute node position on a ring div of given radius
// angle 0 = top, clockwise positive
function orb(angleDeg: number, radius: number, nodeW = 92, nodeH = 26) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    left: `${radius + radius * Math.sin(rad) - nodeW / 2}px`,
    top: `${radius - radius * Math.cos(rad) - nodeH / 2}px`,
  }
}

type RingNode = { label: string; angle: number }

function OrbRing({
  radius,
  dur,
  dir,
  borderOpacity,
  nodes,
  nodeW = 92,
  nodeH = 26,
}: {
  radius: number
  dur: string
  dir: 'cw' | 'ccw'
  borderOpacity: string
  nodes: RingNode[]
  nodeW?: number
  nodeH?: number
}) {
  const fwd = dir === 'cw' ? 'orbit-cw' : 'orbit-ccw'
  const rev = dir === 'cw' ? 'orbit-ccw' : 'orbit-cw'
  const size = radius * 2
  return (
    <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%,-50%)' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `1px dashed ${borderOpacity}`,
          position: 'relative',
          overflow: 'visible',
          animation: `${fwd} ${dur} linear infinite`,
        }}
      >
        {nodes.map(({ label, angle }) => (
          <div
            key={label}
            style={{
              position: 'absolute',
              ...orb(angle, radius, nodeW, nodeH),
              animation: `${rev} ${dur} linear infinite`,
            }}
          >
            <div
              style={{ width: nodeW }}
              className="border border-white/20 bg-[#0A1628]/88 text-center px-2 py-1 text-[0.58rem] text-white/65 whitespace-nowrap leading-tight"
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Network diagram node positions (radial around center)
const cx = 290
const cy = 168
const netR = 128
const netNodes = [
  { label: 'Owner / Investor', angle: 0 },
  { label: 'Architect', angle: 45 },
  { label: 'MEP Engineers', angle: 90 },
  { label: 'Main Contractor', angle: 135 },
  { label: 'Subcontractors', angle: 180 },
  { label: 'Operations', angle: 225 },
  { label: 'Government', angle: 270 },
  { label: 'Interior Design', angle: 315 },
]

function netPt(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + netR * Math.sin(rad), y: cy - netR * Math.cos(rad) }
}

const Label = ({ letter, title, note }: { letter: string; title: string; note: string }) => (
  <div className="bg-[#0A1628] border-b border-t border-white/[0.08] px-6 py-3 flex flex-wrap items-center gap-3">
    <span className="text-[0.6rem] font-bold border border-accent/50 text-accent px-2.5 py-1 uppercase tracking-[0.2em]">
      Concept {letter}
    </span>
    <span className="text-sm font-semibold text-white">{title}</span>
    <span className="text-xs text-white/40">{note}</span>
  </div>
)

export default function HeroConceptsPage() {
  return (
    <div>
      {/* Page header */}
      <div className="bg-canvas-subtle border-b border-line px-6 py-3 flex flex-wrap items-center gap-4">
        <Link href="/" className="text-xs font-semibold text-accent uppercase tracking-[0.2em] hover:text-accent-dark transition-colors">
          ← Back to Site
        </Link>
        <span className="text-xs text-ink-muted">Design review: scroll to compare, then tell me which to deploy</span>
        <nav className="ml-auto hidden md:flex items-center gap-5 text-xs text-ink-muted">
          {['A', 'B', 'C', 'D', 'E'].map((c) => (
            <a key={c} href={`#concept-${c}`} className="hover:text-accent transition-colors font-medium">
              {c}
            </a>
          ))}
        </nav>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT A: Current: Light Split + Bangkok Photo            */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-A">
        <Label letter="A" title="Current direction: Light split + Bangkok photo" note="In production now" />
        <section className="bg-canvas border-b border-line overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_460px] gap-10 items-center py-20 lg:py-24">
              <div>
                <div className="inline-flex items-center gap-2 border border-line bg-canvas-subtle px-3 py-1.5 text-xs text-ink-muted mb-8 tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  Bangkok, Thailand
                </div>
                <h1 className="font-display font-bold text-5xl lg:text-[4.5rem] text-ink leading-[1.06] tracking-tight mb-7">
                  Project Consulting and Development Management in Thailand
                </h1>
                <p className="text-lg text-ink-secondary leading-relaxed max-w-lg mb-10">
                  Structured coordination, development management, and execution oversight for complex projects across Thailand.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5">Discuss Your Project</span>
                  <span className="inline-flex gap-2 text-sm font-semibold text-ink border border-line px-6 py-3.5">Our Services &#8594;</span>
                </div>
              </div>
              <div className="hidden lg:block relative overflow-hidden h-[540px]">
                <Image src="/images/hero-home.jpg" alt="Bangkok" fill className="object-cover" sizes="460px" />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas-dark via-canvas-dark/75 to-canvas-dark/15" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="mb-3">
                    <p className="text-[0.52rem] text-white/35 uppercase tracking-[0.25em] mb-2">Project Parties</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Owner / Investor', 'Architect', 'MEP Engineers', 'Main Contractor', 'Interior Design', 'Operations'].map((p) => (
                        <div key={p} className="border border-white/15 bg-white/[0.05] px-2.5 py-1.5 text-[0.62rem] text-white/65">{p}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-white/10 via-accent/50 to-accent/80 animate-flow-pulse" />
                    <span className="text-accent/70 text-xs">&#8595;</span>
                  </div>
                  <div className="border border-accent/55 bg-canvas-dark/92 px-5 py-4 mb-3 animate-hub-glow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[0.48rem] text-accent uppercase tracking-[0.3em] mb-1.5">Coordination Layer</p>
                        <p className="font-display font-bold text-[1.75rem] text-white leading-none">TMPC</p>
                      </div>
                      <div className="flex gap-1">
                        {[0, 0.4, 0.8].map((d) => (
                          <span key={d} className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink" style={{ animationDelay: `${d}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Aligned Scope', 'Clear Communication', 'Execution Visibility', 'Operational Readiness'].map((r) => (
                      <div key={r} className="border border-accent/25 bg-accent/[0.07] px-2.5 py-1.5 text-[0.62rem] text-accent/85">{r}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT B: Orbital Coordination System                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-B">
        <Label letter="B" title="Orbital coordination system" note="TMPC as the gravitational center: all parties orbit it" />
        <section className="bg-[#0A1628] border-b border-white/[0.08] overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-40" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-16">
            <div className="grid lg:grid-cols-[1fr_560px] gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-xs text-white/50 mb-8 tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  Bangkok, Thailand
                </div>
                <h1 className="font-display font-bold text-5xl lg:text-[4.5rem] text-white leading-[1.06] tracking-tight mb-7">
                  Project Consulting and Development Management in Thailand
                </h1>
                <p className="text-lg text-white/50 leading-relaxed max-w-md mb-10">
                  Every party, every phase, every workstream. TMPC is the single coordination hub that holds the entire project system together.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5">Discuss Your Project</span>
                  <span className="text-sm text-white/45 flex items-center gap-1.5">Our Services &#8594;</span>
                </div>
              </div>

              {/* Orbital diagram */}
              <div className="hidden lg:flex items-center justify-center py-8">
                <div className="relative" style={{ width: '520px', height: '520px' }}>
                  <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(8,145,178,0.07) 0%, transparent 65%)' }} />

                  <OrbRing radius={238} dur="22s" dir="cw" borderOpacity="rgba(8,145,178,0.12)" nodeW={80} nodeH={24}
                    nodes={[
                      { label: 'Government', angle: 30 },
                      { label: 'Operations', angle: 120 },
                      { label: 'Suppliers', angle: 210 },
                      { label: 'Finance', angle: 300 },
                    ]}
                  />
                  <OrbRing radius={170} dur="15s" dir="ccw" borderOpacity="rgba(8,145,178,0.22)" nodeW={98} nodeH={24}
                    nodes={[
                      { label: 'Owner / Investor', angle: 60 },
                      { label: 'Main Contractor', angle: 180 },
                      { label: 'Subcontractors', angle: 300 },
                    ]}
                  />
                  <OrbRing radius={105} dur="9s" dir="cw" borderOpacity="rgba(8,145,178,0.40)" nodeW={90} nodeH={24}
                    nodes={[
                      { label: 'Architect', angle: 0 },
                      { label: 'MEP Engineers', angle: 120 },
                      { label: 'Interior Design', angle: 240 },
                    ]}
                  />

                  {/* TMPC center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                    <div className="border-2 border-accent bg-[#0A1628] flex flex-col items-center justify-center animate-hub-glow" style={{ width: '96px', height: '96px' }}>
                      <p className="text-[0.42rem] text-accent uppercase tracking-[0.28em] mb-1">Hub</p>
                      <p className="font-display font-bold text-[1.6rem] text-white leading-none tracking-tight">TMPC</p>
                      <div className="flex gap-1 mt-2">
                        {[0, 0.5, 1].map((d) => (
                          <span key={d} className="w-1 h-1 rounded-full bg-accent animate-dot-blink" style={{ animationDelay: `${d}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT C: Project Journey Swimlane                         */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-C">
        <Label letter="C" title="Project journey swimlane" note="TMPC as the central spine of a multi-party project timeline" />
        <section className="bg-canvas border-b border-line overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[420px_1fr] gap-12 items-center py-20 lg:py-24">
              <div>
                <div className="inline-flex items-center gap-2 border border-line bg-canvas-subtle px-3 py-1.5 text-xs text-ink-muted mb-8 tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  Bangkok, Thailand
                </div>
                <h1 className="font-display font-bold text-5xl lg:text-[3.5rem] text-ink leading-[1.07] tracking-tight mb-7">
                  Project Consulting and Development Management in Thailand
                </h1>
                <p className="text-base text-ink-secondary leading-relaxed mb-10">
                  TMPC runs through every phase of your project, coordinating every stakeholder from brief to delivery.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5">Discuss Your Project</span>
                  <span className="inline-flex gap-2 text-sm font-semibold text-ink border border-line px-6 py-3.5">Our Services &#8594;</span>
                </div>
              </div>

              {/* Swimlane SVG */}
              <div className="hidden lg:block">
                <svg viewBox="0 0 580 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  {/* Phase labels (bottom) */}
                  {[
                    { x: 140, label: 'PLAN' },
                    { x: 230, label: 'COORDINATE' },
                    { x: 330, label: 'EXECUTE' },
                    { x: 430, label: 'MONITOR' },
                    { x: 520, label: 'DELIVER' },
                  ].map(({ x, label }) => (
                    <text key={label} x={x} y={172} textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#0891B2" letterSpacing="1.5" fontFamily="system-ui">{label}</text>
                  ))}

                  {/* TMPC spine */}
                  <line x1="60" y1="155" x2="560" y2="155" stroke="#0F2040" strokeWidth="2.5" />

                  {/* Phase marker dots on spine */}
                  {[140, 230, 330, 430, 520].map((x) => (
                    <circle key={x} cx={x} cy={155} r="4" fill="#0891B2" />
                  ))}

                  {/* TMPC label */}
                  <text x="20" y="151" fontSize="10" fontWeight="700" fill="#0891B2" letterSpacing="2" fontFamily="system-ui">TMPC</text>
                  <text x="20" y="162" fontSize="5.5" fontWeight="400" fill="#6B7280" letterSpacing="1" fontFamily="system-ui">COORDINATION</text>

                  {/* Upper stakeholder lanes */}
                  {[
                    { y: 25, label: 'Owner / Investor', connects: [140, 330, 520], delay: '0s', dur: '5s' },
                    { y: 70, label: 'Architect + Consultants', connects: [230, 430], delay: '-2s', dur: '5.5s' },
                    { y: 115, label: 'MEP Engineers', connects: [230, 330, 430], delay: '-1s', dur: '6s' },
                  ].map(({ y, label, connects, delay, dur }) => (
                    <g key={label}>
                      <line x1="60" y1={y} x2="560" y2={y} stroke="#E5E9EF" strokeWidth="1" />
                      <text x="18" y={y + 4} fontSize="7.5" fill="#374151" textAnchor="middle" fontFamily="system-ui"
                        style={{ writingMode: 'horizontal-tb' }}
                      />
                      <text x="58" y={y - 5} fontSize="7" fill="#374151" fontFamily="system-ui">{label}</text>
                      {connects.map((x) => (
                        <line key={x} x1={x} y1={y} x2={x} y2={155} stroke="#0891B2" strokeWidth="1" strokeDasharray="3 4" opacity="0.35" />
                      ))}
                      {/* Animated dot */}
                      <circle r="3.5" fill="#0891B2" opacity="0.85">
                        <animateMotion dur={dur} repeatCount="indefinite" begin={delay}
                          path={`M 60 ${y} L 560 ${y}`} />
                      </circle>
                      <circle r="2.5" fill="#0891B2" opacity="0.45">
                        <animateMotion dur={dur} repeatCount="indefinite" begin={`${parseFloat(delay) - 2.5}s`}
                          path={`M 60 ${y} L 560 ${y}`} />
                      </circle>
                    </g>
                  ))}

                  {/* Lower stakeholder lanes */}
                  {[
                    { y: 185, label: 'Main Contractor', connects: [230, 330, 430], delay: '-0.5s', dur: '5s' },
                    { y: 230, label: 'Subcontractors', connects: [330, 430], delay: '-3s', dur: '5.5s' },
                    { y: 270, label: 'Operations Team', connects: [430, 520], delay: '-1.5s', dur: '6s' },
                  ].map(({ y, label, connects, delay, dur }) => (
                    <g key={label}>
                      <line x1="60" y1={y} x2="560" y2={y} stroke="#E5E9EF" strokeWidth="1" />
                      <text x="58" y={y - 5} fontSize="7" fill="#374151" fontFamily="system-ui">{label}</text>
                      {connects.map((x) => (
                        <line key={x} x1={x} y1={155} x2={x} y2={y} stroke="#0891B2" strokeWidth="1" strokeDasharray="3 4" opacity="0.35" />
                      ))}
                      <circle r="3.5" fill="#0891B2" opacity="0.85">
                        <animateMotion dur={dur} repeatCount="indefinite" begin={delay}
                          path={`M 60 ${y} L 560 ${y}`} />
                      </circle>
                      <circle r="2.5" fill="#0891B2" opacity="0.45">
                        <animateMotion dur={dur} repeatCount="indefinite" begin={`${parseFloat(delay) - 2.5}s`}
                          path={`M 60 ${y} L 560 ${y}`} />
                      </circle>
                    </g>
                  ))}

                  {/* Start / End labels on spine */}
                  <circle cx="60" cy="155" r="4" fill="#0F2040" />
                  <circle cx="560" cy="155" r="6" fill="#0891B2" opacity="0.9" />
                  <text x="560" y="178" textAnchor="middle" fontSize="7" fill="#0891B2" fontWeight="600" fontFamily="system-ui">READY</text>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT D: Typography + Radial Network Diagram              */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-D">
        <Label letter="D" title="Typography + radial network" note="Pure white, no photo dependency, TMPC at the center of a stakeholder map" />
        <section className="bg-canvas border-b border-line overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
            <div className="grid lg:grid-cols-[1fr_580px] gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 border border-line bg-canvas-subtle px-3 py-1.5 text-xs text-ink-muted mb-10 tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  Bangkok, Thailand
                </div>
                <h1 className="font-display font-bold text-5xl lg:text-[5rem] text-ink leading-[1.04] tracking-tight mb-8">
                  Project Consulting and Development Management in Thailand
                </h1>
                <div className="w-16 h-0.5 bg-accent mb-8" />
                <p className="text-lg text-ink-secondary leading-relaxed max-w-md mb-10">
                  One coordination layer. Every stakeholder aligned. Every phase structured. Bangkok-based, internationally fluent.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5">Discuss Your Project</span>
                  <span className="inline-flex gap-2 text-sm font-semibold text-ink border border-line px-6 py-3.5">Our Services &#8594;</span>
                </div>
              </div>

              {/* Radial network SVG */}
              <div className="hidden lg:block">
                <svg viewBox="0 0 580 336" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  {/* Outer ring guide circle */}
                  <circle cx={cx} cy={cy} r={netR + 2} stroke="#E5E9EF" strokeWidth="1" strokeDasharray="3 6" />

                  {/* Connection lines with animated dash-flow */}
                  {netNodes.map(({ label, angle }, i) => {
                    const pt = netPt(angle)
                    return (
                      <line
                        key={label}
                        x1={pt.x} y1={pt.y}
                        x2={cx} y2={cy}
                        stroke="#0891B2"
                        strokeWidth="1"
                        strokeDasharray="4 8"
                        opacity="0.5"
                        style={{ animation: `dash-flow 2.2s linear infinite`, animationDelay: `${i * 0.28}s` }}
                      />
                    )
                  })}

                  {/* Stakeholder nodes */}
                  {netNodes.map(({ label, angle }, i) => {
                    const pt = netPt(angle)
                    const isRight = pt.x > cx + 20
                    const isLeft = pt.x < cx - 20
                    const anchor = isRight ? 'start' : isLeft ? 'end' : 'middle'
                    const labelX = isRight ? pt.x + 10 : isLeft ? pt.x - 10 : pt.x
                    const labelY = pt.y < cy - 20 ? pt.y - 12 : pt.y > cy + 20 ? pt.y + 18 : pt.y + 4
                    return (
                      <g key={label}>
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#0F2040" />
                        <circle cx={pt.x} cy={pt.y} r="8" stroke="#0F2040" strokeWidth="1" fill="none" opacity="0.2" />
                        <text
                          x={labelX}
                          y={labelY}
                          textAnchor={anchor}
                          fontSize="8.5"
                          fill="#374151"
                          fontFamily="system-ui"
                          fontWeight="500"
                        >{label}</text>
                      </g>
                    )
                  })}

                  {/* TMPC center node */}
                  <circle cx={cx} cy={cy} r="38" fill="#0A1628" />
                  <circle cx={cx} cy={cy} r="38" stroke="#0891B2" strokeWidth="1.5" fill="none" opacity="0.7">
                    <animate attributeName="r" values="38;44;38" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0.15;0.7" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x={cx} y={cy - 7} textAnchor="middle" fontSize="7" fill="#0891B2" fontWeight="600" letterSpacing="2.5" fontFamily="system-ui">COORDINATION</text>
                  <text x={cx} y={cy + 11} textAnchor="middle" fontSize="20" fill="white" fontWeight="800" fontFamily="system-ui, Arial Black">TMPC</text>
                  <text x={cx} y={cy + 24} textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.4)" letterSpacing="1.5" fontFamily="system-ui">BANGKOK</text>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT E: Bold Navy / White Two-Panel Split                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-E">
        <Label letter="E" title="Bold navy / white two-panel split" note="No photo dependency: color contrast is the entire visual statement" />
        <section className="border-b border-line overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[580px]">

            {/* Left: navy panel */}
            <div className="bg-[#0A1628] relative overflow-hidden flex flex-col justify-center px-12 py-20 lg:py-24">
              <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-40" />
              <div className="relative z-10">
                <p className="text-[0.52rem] text-accent uppercase tracking-[0.3em] mb-8">Bangkok, Thailand</p>
                <p className="font-display font-black text-[4.5rem] text-white leading-none tracking-tight mb-6">TMPC</p>
                <p className="text-xs text-white/30 uppercase tracking-[0.25em] mb-12">Development Co., Ltd.</p>

                <div className="space-y-2 mb-12">
                  {['Project Consulting', 'Development Management', 'Project Coordination', 'Execution Oversight', 'Operational Setup'].map((s, i) => (
                    <div key={s} className="flex items-center gap-3">
                      <span className="text-[0.52rem] text-accent font-bold w-4">0{i + 1}</span>
                      <div className="flex-1 h-px bg-white/8" />
                      <span className="text-xs text-white/50">{s}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-dot-blink" />
                  <span className="text-[0.6rem] text-white/25 uppercase tracking-[0.2em]">Active coordination</span>
                </div>
              </div>
            </div>

            {/* Right: white panel */}
            <div className="bg-canvas flex flex-col justify-center px-12 py-20 lg:py-24">
              <div className="inline-flex items-center gap-2 border border-line bg-canvas-subtle px-3 py-1.5 text-xs text-ink-muted mb-10 self-start tracking-[0.2em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                Project Consulting
              </div>
              <h1 className="font-display font-bold text-4xl lg:text-[3.5rem] text-ink leading-[1.07] tracking-tight mb-7">
                Project Consulting and Development Management in Thailand
              </h1>
              <p className="text-base text-ink-secondary leading-relaxed max-w-md mb-10">
                TMPC provides structured coordination, development management, and execution oversight for complex projects across Thailand.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-14">
                <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5">Discuss Your Project</span>
                <span className="inline-flex gap-2 text-sm font-semibold text-ink border border-line px-6 py-3.5">Our Services &#8594;</span>
              </div>

              {/* Process strip */}
              <div className="pt-6 border-t border-line">
                <div className="flex items-center gap-0">
                  {['Project Review', 'Planning', 'Coordination', 'Execution', 'Handover'].map((s, i) => (
                    <div key={s} className="flex items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[0.55rem] font-bold text-accent tabular-nums">0{i + 1}</span>
                        <span className="text-[0.65rem] text-ink-muted whitespace-nowrap">{s}</span>
                      </div>
                      {i < 4 && <span className="mx-2.5 text-line text-sm" aria-hidden="true">&#8594;</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="bg-canvas-subtle border-t border-line px-6 py-6 text-center">
        <p className="text-sm text-ink-muted mb-3">Which concept do you want to deploy?</p>
        <div className="flex flex-wrap justify-center gap-3">
          {['A', 'B', 'C', 'D', 'E'].map((c) => (
            <a key={c} href={`#concept-${c}`} className="text-xs font-semibold border border-line px-4 py-2 text-ink-muted hover:border-accent hover:text-accent transition-all duration-150">
              Concept {c}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
