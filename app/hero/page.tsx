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
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'].map((c) => (
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

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT F: Orbital B + Sonar Pulse + Radial Web            */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-F">
        <Label letter="F" title="Orbital + sonar broadcast" note="Concept B with radiating pulses and connection lines from TMPC outward" />
        <section className="bg-[#0A1628] border-b border-white/[0.08] overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-35" />
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
                  TMPC continuously broadcasts structure, coordination, and clarity to every party in the project system.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5">Discuss Your Project</span>
                  <span className="text-sm text-white/45 flex items-center gap-1.5">Our Services &#8594;</span>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-center py-8">
                <div className="relative" style={{ width: '520px', height: '520px' }}>

                  {/* Radial glow */}
                  <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(8,145,178,0.10) 0%, transparent 60%)' }} />

                  {/* Sonar pulse rings expanding from center */}
                  {[0, 1.1, 2.2].map((delay) => (
                    <div
                      key={delay}
                      className="absolute rounded-full border border-accent/40 pointer-events-none"
                      style={{
                        width: '490px',
                        height: '490px',
                        top: '50%',
                        left: '50%',
                        animation: `sonar-out 3.3s ease-out infinite`,
                        animationDelay: `${delay}s`,
                      }}
                    />
                  ))}

                  {/* Radial connection lines from center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] pointer-events-none">
                    <svg width="520" height="520" viewBox="0 0 520 520" fill="none">
                      {[22, 67, 112, 157, 202, 247, 292, 337].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180
                        return (
                          <line
                            key={angle}
                            x1="260" y1="260"
                            x2={260 + 245 * Math.sin(rad)}
                            y2={260 - 245 * Math.cos(rad)}
                            stroke="#0891B2"
                            strokeWidth="0.8"
                            strokeDasharray="3 9"
                            opacity="0.25"
                            style={{ animation: `dash-flow 2.4s linear infinite`, animationDelay: `${i * 0.3}s` }}
                          />
                        )
                      })}
                    </svg>
                  </div>

                  {/* Orbital rings */}
                  <OrbRing radius={238} dur="22s" dir="cw" borderOpacity="rgba(8,145,178,0.14)" nodeW={80} nodeH={24}
                    nodes={[{ label: 'Government', angle: 30 }, { label: 'Operations', angle: 120 }, { label: 'Suppliers', angle: 210 }, { label: 'Finance', angle: 300 }]}
                  />
                  <OrbRing radius={170} dur="15s" dir="ccw" borderOpacity="rgba(8,145,178,0.24)" nodeW={98} nodeH={24}
                    nodes={[{ label: 'Owner / Investor', angle: 60 }, { label: 'Main Contractor', angle: 180 }, { label: 'Subcontractors', angle: 300 }]}
                  />
                  <OrbRing radius={105} dur="9s" dir="cw" borderOpacity="rgba(8,145,178,0.42)" nodeW={90} nodeH={24}
                    nodes={[{ label: 'Architect', angle: 0 }, { label: 'MEP Engineers', angle: 120 }, { label: 'Interior Design', angle: 240 }]}
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
      {/* CONCEPT G: Full-Bleed Immersive Orbital                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-G">
        <Label letter="G" title="Full-bleed immersive orbital" note="The diagram fills the entire hero. Text overlays. No panel split." />
        <section className="bg-[#0A1628] border-b border-white/[0.08] overflow-hidden relative" style={{ minHeight: '92vh' }}>
          <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-35" />

          {/* Orbital fills the right half, slightly bleeds off-screen */}
          <div className="absolute top-1/2 right-[-80px] z-10" style={{ transform: 'translateY(-50%)' }}>
            <div className="relative" style={{ width: '680px', height: '680px' }}>
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(8,145,178,0.09) 0%, transparent 60%)' }} />

              {/* Sonar pulses */}
              {[0, 1.2, 2.4].map((delay) => (
                <div
                  key={delay}
                  className="absolute rounded-full border border-accent/30 pointer-events-none"
                  style={{
                    width: '640px',
                    height: '640px',
                    top: '50%',
                    left: '50%',
                    animation: `sonar-out 3.6s ease-out infinite`,
                    animationDelay: `${delay}s`,
                  }}
                />
              ))}

              <OrbRing radius={308} dur="26s" dir="cw" borderOpacity="rgba(8,145,178,0.10)" nodeW={84} nodeH={24}
                nodes={[{ label: 'Government', angle: 20 }, { label: 'Operations', angle: 100 }, { label: 'Suppliers', angle: 200 }, { label: 'Finance', angle: 290 }]}
              />
              <OrbRing radius={222} dur="17s" dir="ccw" borderOpacity="rgba(8,145,178,0.20)" nodeW={100} nodeH={24}
                nodes={[{ label: 'Owner / Investor', angle: 55 }, { label: 'Main Contractor', angle: 175 }, { label: 'Subcontractors', angle: 295 }]}
              />
              <OrbRing radius={136} dur="10s" dir="cw" borderOpacity="rgba(8,145,178,0.38)" nodeW={90} nodeH={24}
                nodes={[{ label: 'Architect', angle: 355 }, { label: 'MEP Engineers', angle: 118 }, { label: 'Interior Design', angle: 238 }]}
              />

              {/* TMPC center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="border-2 border-accent bg-[#0A1628] flex flex-col items-center justify-center animate-hub-glow" style={{ width: '112px', height: '112px' }}>
                  <p className="text-[0.44rem] text-accent uppercase tracking-[0.28em] mb-1.5">Hub</p>
                  <p className="font-display font-bold text-[1.9rem] text-white leading-none tracking-tight">TMPC</p>
                  <div className="flex gap-1 mt-2">
                    {[0, 0.5, 1].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left fade so text stays readable */}
          <div className="absolute inset-y-0 left-0 w-1/2 pointer-events-none" style={{ background: 'linear-gradient(to right, #0A1628 55%, transparent)' }} />

          {/* Text overlays left side */}
          <div className="relative z-20 max-w-6xl mx-auto px-6 lg:px-8 flex items-center" style={{ minHeight: '92vh' }}>
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-xs text-white/50 mb-8 tracking-[0.2em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                Bangkok, Thailand
              </div>
              <h1 className="font-display font-bold text-6xl lg:text-[5.25rem] text-white leading-[1.04] tracking-tight mb-8">
                Project Consulting and Development Management in Thailand
              </h1>
              <div className="w-16 h-0.5 bg-accent mb-8" />
              <p className="text-lg text-white/50 leading-relaxed mb-12">
                One coordination layer. Every party aligned. Bangkok-based. Internationally fluent.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex text-sm font-semibold bg-accent text-white px-8 py-4">Discuss Your Project</span>
                <span className="text-sm text-white/40 flex items-center gap-1.5">Our Services &#8594;</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT H: Orbital + Live Mission Control Panel             */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-H">
        <Label letter="H" title="Orbital + mission control readout" note="Orbital center + live coordination data panel on the right" />
        <section className="bg-[#0A1628] border-b border-white/[0.08] overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-35" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full py-16 lg:py-20">
            <div className="grid lg:grid-cols-[380px_1fr_260px] gap-8 items-center">

              {/* Left: text */}
              <div>
                <div className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-xs text-white/50 mb-8 tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  Bangkok, Thailand
                </div>
                <h1 className="font-display font-bold text-4xl lg:text-[3.25rem] text-white leading-[1.07] tracking-tight mb-6">
                  Project Consulting and Development Management in Thailand
                </h1>
                <p className="text-sm text-white/45 leading-relaxed mb-8">
                  Structured coordination for complex multi-party projects across Thailand.
                </p>
                <div className="flex flex-col gap-3">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5 self-start">Discuss Your Project</span>
                  <span className="text-sm text-white/40 flex items-center gap-1.5">Our Services &#8594;</span>
                </div>
              </div>

              {/* Center: orbital (smaller) */}
              <div className="hidden lg:flex items-center justify-center py-4">
                <div className="relative" style={{ width: '440px', height: '440px' }}>
                  <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(8,145,178,0.08) 0%, transparent 60%)' }} />

                  {[0, 1, 2].map((d) => (
                    <div
                      key={d}
                      className="absolute rounded-full border border-accent/30 pointer-events-none"
                      style={{
                        width: '414px',
                        height: '414px',
                        top: '50%',
                        left: '50%',
                        animation: `sonar-out 3s ease-out infinite`,
                        animationDelay: `${d}s`,
                      }}
                    />
                  ))}

                  <OrbRing radius={200} dur="22s" dir="cw" borderOpacity="rgba(8,145,178,0.12)" nodeW={76} nodeH={22}
                    nodes={[{ label: 'Government', angle: 30 }, { label: 'Operations', angle: 120 }, { label: 'Suppliers', angle: 210 }, { label: 'Finance', angle: 300 }]}
                  />
                  <OrbRing radius={144} dur="15s" dir="ccw" borderOpacity="rgba(8,145,178,0.24)" nodeW={92} nodeH={22}
                    nodes={[{ label: 'Owner / Investor', angle: 60 }, { label: 'Main Contractor', angle: 180 }, { label: 'Subcontractors', angle: 300 }]}
                  />
                  <OrbRing radius={88} dur="9s" dir="cw" borderOpacity="rgba(8,145,178,0.42)" nodeW={84} nodeH={22}
                    nodes={[{ label: 'Architect', angle: 0 }, { label: 'MEP Engineers', angle: 120 }, { label: 'Interior Design', angle: 240 }]}
                  />

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                    <div className="border-2 border-accent bg-[#0A1628] flex flex-col items-center justify-center animate-hub-glow" style={{ width: '84px', height: '84px' }}>
                      <p className="text-[0.38rem] text-accent uppercase tracking-[0.25em] mb-1">Hub</p>
                      <p className="font-display font-bold text-[1.4rem] text-white leading-none tracking-tight">TMPC</p>
                      <div className="flex gap-1 mt-1.5">
                        {[0, 0.5, 1].map((d) => (
                          <span key={d} className="w-1 h-1 rounded-full bg-accent animate-dot-blink" style={{ animationDelay: `${d}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: mission control panel */}
              <div className="hidden lg:block border border-white/[0.09] bg-white/[0.02] p-5">

                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.08]">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  <p className="text-[0.52rem] text-accent uppercase tracking-[0.25em]">Active Coordination</p>
                </div>

                <p className="text-[0.5rem] text-white/25 uppercase tracking-[0.2em] mb-2">Phase Status</p>
                <div className="space-y-1.5 mb-5">
                  {[
                    { label: 'Project Review', done: true },
                    { label: 'Planning', done: true },
                    { label: 'Coordination', done: false, active: true },
                    { label: 'Execution', done: false },
                    { label: 'Handover', done: false },
                  ].map(({ label, done, active }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${done ? 'bg-accent' : active ? 'bg-accent animate-dot-blink' : 'bg-white/15'}`} />
                      <span className={`text-[0.62rem] ${active ? 'text-white font-semibold' : done ? 'text-white/45' : 'text-white/20'}`}>{label}</span>
                      {active && <span className="ml-auto text-[0.48rem] text-accent uppercase tracking-wider">Live</span>}
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/[0.07] mb-4" />

                <p className="text-[0.5rem] text-white/25 uppercase tracking-[0.2em] mb-2">Parties Engaged</p>
                <div className="space-y-1 mb-5">
                  {['Owner / Investor', 'Architect', 'MEP Engineers', 'Contractor', 'Operations'].map((p) => (
                    <div key={p} className="flex items-center justify-between">
                      <span className="text-[0.62rem] text-white/50">{p}</span>
                      <span className="w-1 h-1 rounded-full bg-accent/70" />
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/[0.07] mb-4" />

                <div className="space-y-2">
                  {[
                    { label: 'Workstreams', value: '5 active' },
                    { label: 'Parties aligned', value: '10 total' },
                    { label: 'Location', value: 'Bangkok, TH' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[0.52rem] text-white/25 uppercase tracking-wider">{label}</span>
                      <span className="text-[0.62rem] text-white/60 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT I: Project Complexity Network                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-I">
        <Label letter="I" title="Project complexity network" note="Input chaos left, TMPC at center, clarity outputs right" />
        <section className="bg-canvas border-b border-line overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[440px_1fr] gap-10 items-center py-20 lg:py-24">
              <div>
                <div className="inline-flex items-center gap-2 border border-line bg-canvas-subtle px-3 py-1.5 text-xs text-ink-muted mb-8 tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  Bangkok, Thailand
                </div>
                <h1 className="font-display font-bold text-5xl lg:text-[4rem] text-ink leading-[1.06] tracking-tight mb-7">
                  Project Consulting and Development Management in Thailand
                </h1>
                <p className="text-base text-ink-secondary leading-relaxed max-w-lg mb-10">
                  Complex projects involve dozens of parties, contracts, and workstreams. TMPC is the single layer that connects every input and delivers coordinated outputs.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5">Discuss Your Project</span>
                  <span className="inline-flex gap-2 text-sm font-semibold text-ink border border-line px-6 py-3.5">Our Services &#8594;</span>
                </div>
              </div>

              <div className="hidden lg:block">
                <svg viewBox="0 0 580 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                  <text x="61" y="18" textAnchor="middle" fontSize="7" fill="#9CA3AF" fontWeight="600" letterSpacing="2" fontFamily="system-ui">PROJECT INPUTS</text>
                  <text x="518" y="56" textAnchor="middle" fontSize="7" fill="#0891B2" fontWeight="600" letterSpacing="2" fontFamily="system-ui">OUTPUTS</text>

                  {[
                    { label: 'Owner / Investor', y: 32 },
                    { label: 'Architect', y: 74 },
                    { label: 'MEP Engineers', y: 116 },
                    { label: 'Main Contractor', y: 158 },
                    { label: 'Interior Design', y: 200 },
                    { label: 'Government', y: 242 },
                    { label: 'Operations', y: 284 },
                  ].map(({ label, y }, i) => (
                    <g key={label} style={{ animation: 'fade-in 0.4s ease-out both', animationDelay: `${i * 0.1}s` }}>
                      <rect x="4" y={y - 11} width="115" height="21" rx="2" fill="#F4F7FB" stroke="#E5E9EF" strokeWidth="1" />
                      <text x="61" y={y + 4} textAnchor="middle" fontSize="7.5" fill="#374151" fontFamily="system-ui" fontWeight="500">{label}</text>
                      <line x1="120" y1={y} x2="252" y2="170" stroke="#0891B2" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.4"
                        style={{ animation: 'dash-flow 3s linear infinite', animationDelay: `${i * 0.2}s` }} />
                    </g>
                  ))}

                  {[
                    { label: 'Scope Clarity', y: 80 },
                    { label: 'Budget Control', y: 140 },
                    { label: 'Timeline Alignment', y: 200 },
                    { label: 'Operational Readiness', y: 260 },
                  ].map(({ label, y }, i) => (
                    <g key={label} style={{ animation: 'fade-in 0.4s ease-out both', animationDelay: `${0.8 + i * 0.12}s` }}>
                      <line x1="328" y1="170" x2="460" y2={y} stroke="#0891B2" strokeWidth="1" strokeDasharray="4 6" opacity="0.55"
                        style={{ animation: 'dash-flow 3s linear infinite', animationDelay: `${i * 0.25}s` }} />
                      <rect x="460" y={y - 13} width="116" height="24" rx="2" fill="#EFF8FA" stroke="#0891B2" strokeWidth="1" strokeOpacity="0.4" />
                      <text x="518" y={y + 4} textAnchor="middle" fontSize="7.5" fill="#0E7490" fontFamily="system-ui" fontWeight="600">{label}</text>
                    </g>
                  ))}

                  <circle cx="290" cy="170" r="40" fill="#0A1628" />
                  <circle cx="290" cy="170" r="40" stroke="#0891B2" strokeWidth="1.5" fill="none" opacity="0.6">
                    <animate attributeName="r" values="40;47;40" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.12;0.6" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x="290" y="163" textAnchor="middle" fontSize="6.5" fill="#0891B2" fontWeight="600" letterSpacing="2" fontFamily="system-ui">COORD.</text>
                  <text x="290" y="182" textAnchor="middle" fontSize="20" fill="white" fontWeight="800" fontFamily="system-ui, Arial Black">TMPC</text>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT J: Bangkok Project Command Center                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-J">
        <Label letter="J" title="Bangkok project command center" note="Real Bangkok image left, live coordination panel right" />
        <section className="border-b border-line overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_380px] min-h-[600px]">

            <div className="relative overflow-hidden" style={{ minHeight: '480px' }}>
              <Image src="/images/hero-home.jpg" alt="Bangkok project" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.25) 50%, rgba(10,22,40,0.1) 100%)' }} />
              <div className="absolute inset-0 flex flex-col justify-end p-10">
                <div className="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-xs text-white/60 mb-6 tracking-[0.2em] uppercase self-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  Bangkok, Thailand
                </div>
                <h1 className="font-display font-bold text-5xl lg:text-[4.25rem] text-white leading-[1.05] tracking-tight mb-6 max-w-xl">
                  Project Consulting and Development Management in Thailand
                </h1>
                <p className="text-base text-white/55 leading-relaxed max-w-md mb-8">
                  One coordination layer. Every party aligned. Every phase structured.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5">Discuss Your Project</span>
                  <span className="text-sm text-white/50 flex items-center gap-1.5">Our Services &#8594;</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0A1628] flex flex-col px-8 py-10">
              <div className="flex items-center gap-2 mb-8 pb-5 border-b border-white/[0.08]">
                <span className="w-2 h-2 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                <p className="text-[0.52rem] text-accent uppercase tracking-[0.28em] font-semibold">Active Coordination</p>
              </div>

              <p className="text-[0.5rem] text-white/25 uppercase tracking-[0.2em] mb-3">Current Phase</p>
              <div className="space-y-2 mb-8">
                {[
                  { label: 'Project Review', done: true },
                  { label: 'Planning', done: true },
                  { label: 'Coordination', active: true },
                  { label: 'Execution', done: false },
                  { label: 'Handover', done: false },
                ].map(({ label, done, active }: { label: string; done?: boolean; active?: boolean }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 ${done ? 'border-accent bg-accent/15' : active ? 'border-accent' : 'border-white/10'}`}>
                      {done && <span className="text-[0.55rem] text-accent font-bold">&#10003;</span>}
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink" />}
                    </div>
                    <span className={`text-xs ${active ? 'text-white font-semibold' : done ? 'text-white/35' : 'text-white/20'}`}>{label}</span>
                    {active && <span className="ml-auto text-[0.48rem] border border-accent/40 text-accent px-1.5 py-0.5 uppercase tracking-wide">Live</span>}
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/[0.07] mb-6" />

              <p className="text-[0.5rem] text-white/25 uppercase tracking-[0.2em] mb-3">Parties Engaged</p>
              <div className="space-y-2 mb-8">
                {[
                  { name: 'Owner / Investor', status: 'aligned' },
                  { name: 'Architect', status: 'aligned' },
                  { name: 'MEP Engineers', status: 'active' },
                  { name: 'Main Contractor', status: 'active' },
                  { name: 'Interior Design', status: 'pending' },
                  { name: 'Operations', status: 'pending' },
                ].map(({ name, status }) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-[0.65rem] text-white/50">{name}</span>
                    <span className={`text-[0.5rem] uppercase tracking-wider px-1.5 py-0.5 border ${status === 'aligned' ? 'border-accent/30 text-accent/70' : status === 'active' ? 'border-white/20 text-white/50' : 'border-white/10 text-white/25'}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/[0.07] mb-6" />

              <div className="space-y-3 mt-auto">
                {[
                  { label: 'Open RFIs', value: '3' },
                  { label: 'Active workstreams', value: '6' },
                  { label: 'Next milestone', value: '14 days' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[0.52rem] text-white/25 uppercase tracking-wider">{label}</span>
                    <span className="text-sm text-white font-semibold tabular-nums">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT K: Blueprint to Reality                              */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-K">
        <Label letter="K" title="Blueprint to reality" note="Blueprint grid bg, 3-stage project path with TMPC as the coordinating layer" />
        <section className="bg-[#071220] border-b border-white/[0.08] overflow-hidden relative" style={{ minHeight: '92vh' }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(8,145,178,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(8,145,178,0.07) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(8,145,178,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(8,145,178,0.14) 1px, transparent 1px)',
            backgroundSize: '160px 160px',
          }} />

          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 flex flex-col justify-center" style={{ minHeight: '92vh' }}>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-xs text-white/45 mb-8 tracking-[0.2em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                Bangkok, Thailand
              </div>
              <h1 className="font-display font-bold text-5xl lg:text-[5rem] text-white leading-[1.04] tracking-tight mb-8">
                From Complex Brief to Operational Reality
              </h1>
              <p className="text-lg text-white/45 leading-relaxed max-w-2xl mx-auto mb-10">
                TMPC provides the structured coordination and management layer that transforms ambiguous project briefs into delivered, operational facilities.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <span className="inline-flex text-sm font-semibold bg-accent text-white px-8 py-4">Discuss Your Project</span>
                <span className="text-sm text-white/40 flex items-center gap-2">Our Services &#8594;</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-10 left-[calc(16.5%)] right-[calc(16.5%)] h-px hidden lg:block">
                <div className="w-full h-full bg-gradient-to-r from-accent/30 via-accent to-accent/30" style={{ animation: 'flow-pulse 2.4s ease-in-out infinite' }} />
              </div>

              <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
                {[
                  {
                    num: '01',
                    title: 'Project Brief and Concept',
                    desc: 'Owner objectives, program requirements, site constraints, budget parameters. All inputs captured and structured.',
                    items: ['Owner brief', 'Site analysis', 'Budget parameters', 'Regulatory review'],
                    delay: '0s',
                    highlight: false,
                  },
                  {
                    num: '02',
                    title: 'TMPC Coordination Layer',
                    desc: 'TMPC manages every party, every document, every decision and every milestone across the full project lifecycle.',
                    items: ['Party alignment', 'RFI management', 'Scope control', 'Programme oversight'],
                    delay: '0.2s',
                    highlight: true,
                  },
                  {
                    num: '03',
                    title: 'Delivered and Operational',
                    desc: 'An on-scope, on-budget, operationally ready facility. Exactly what the brief called for. Nothing lost in coordination.',
                    items: ['Practical completion', 'Defect clearance', 'Ops handover', 'Open for business'],
                    delay: '0.4s',
                    highlight: false,
                  },
                ].map(({ num, title, desc, items, delay, highlight }) => (
                  <div
                    key={num}
                    className={`border px-7 py-8 ${highlight ? 'border-accent/60 bg-[#0A1628]' : 'border-white/[0.09] bg-white/[0.02]'}`}
                    style={{ animation: 'fade-up 0.6s ease-out both', animationDelay: delay }}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <span className={`text-[0.55rem] font-bold tabular-nums px-2 py-1 border ${highlight ? 'border-accent text-accent' : 'border-white/20 text-white/30'}`}>{num}</span>
                      {highlight && <span className="ml-auto text-[0.5rem] text-accent uppercase tracking-[0.25em] border border-accent/35 px-2 py-1">Active</span>}
                    </div>
                    <h3 className={`font-display font-bold text-xl mb-4 leading-snug ${highlight ? 'text-white' : 'text-white/70'}`}>{title}</h3>
                    <p className={`text-sm leading-relaxed mb-6 ${highlight ? 'text-white/50' : 'text-white/30'}`}>{desc}</p>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item} className="flex items-center gap-2.5">
                          <span className={`w-1 h-1 rounded-full flex-shrink-0 ${highlight ? 'bg-accent' : 'bg-white/20'}`} />
                          <span className={`text-xs ${highlight ? 'text-white/60' : 'text-white/25'}`}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT L: Multi-Project Coordination                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-L">
        <Label letter="L" title="Multi-project coordination" note="Sector image mosaic right, TMPC coordinates across every sector and type" />
        <section className="bg-canvas border-b border-line overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_520px] gap-12 items-center py-20 lg:py-24">
              <div>
                <div className="inline-flex items-center gap-2 border border-line bg-canvas-subtle px-3 py-1.5 text-xs text-ink-muted mb-8 tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  Bangkok, Thailand
                </div>
                <h1 className="font-display font-bold text-5xl lg:text-[4.25rem] text-ink leading-[1.06] tracking-tight mb-7">
                  Project Consulting and Development Management in Thailand
                </h1>
                <p className="text-base text-ink-secondary leading-relaxed max-w-md mb-8">
                  From hospitality to industrial, retail to residential: TMPC brings the same structured coordination discipline to every project sector.
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5">Discuss Your Project</span>
                  <span className="inline-flex gap-2 text-sm font-semibold text-ink border border-line px-6 py-3.5">Our Services &#8594;</span>
                </div>
                <div className="pt-6 border-t border-line">
                  <p className="text-[0.6rem] text-ink-muted uppercase tracking-[0.2em] mb-3">Project sectors</p>
                  <div className="flex flex-wrap gap-2">
                    {['Hospitality', 'Commercial', 'Industrial', 'Office', 'Retail', 'Residential'].map((s) => (
                      <span key={s} className="text-[0.65rem] border border-line px-3 py-1.5 text-ink-muted">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-3 gap-2">
                {[
                  { src: '/images/scenario-commercial.jpg', label: 'Commercial' },
                  { src: '/images/scenario-wellness.jpg', label: 'Wellness' },
                  { src: '/images/scenario-office.jpg', label: 'Office' },
                  { src: '/images/scenario-industrial.jpg', label: 'Industrial' },
                  { src: '/images/scenario-warehouse.jpg', label: 'Warehouse' },
                  { src: '/images/scenario-realestate.jpg', label: 'Residential' },
                ].map(({ src, label }) => (
                  <div key={label} className="relative overflow-hidden aspect-square group">
                    <Image src={src} alt={label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="170px" />
                    <div className="absolute inset-0 bg-[#0A1628]/45 group-hover:bg-[#0A1628]/20 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <span className="text-[0.52rem] text-white/70 uppercase tracking-[0.2em] font-semibold">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT M: Control Layer                                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-M">
        <Label letter="M" title="Control layer" note="White bg, TMPC management services as floating cards sliding in" />
        <section className="bg-canvas border-b border-line overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-center py-20 lg:py-24">
              <div>
                <div className="inline-flex items-center gap-2 border border-line bg-canvas-subtle px-3 py-1.5 text-xs text-ink-muted mb-8 tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  Bangkok, Thailand
                </div>
                <h1 className="font-display font-bold text-5xl lg:text-[4rem] text-ink leading-[1.06] tracking-tight mb-7">
                  Project Consulting and Development Management in Thailand
                </h1>
                <div className="w-12 h-0.5 bg-accent mb-7" />
                <p className="text-base text-ink-secondary leading-relaxed max-w-sm mb-10">
                  TMPC provides the full coordination and management control layer, from brief to operational handover.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-7 py-3.5">Discuss Your Project</span>
                  <span className="inline-flex gap-2 text-sm font-semibold text-ink border border-line px-6 py-3.5">Our Services &#8594;</span>
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-4">
                {[
                  { title: 'Scope Management', desc: 'Define what gets built, at what standard, and for what cost. Scope creep eliminated before it starts.', delay: '0s' },
                  { title: 'Stakeholder Coordination', desc: 'Owner, consultants, contractors, government authorities. All parties aligned through a single TMPC layer.', delay: '0.1s' },
                  { title: 'Contract Administration', desc: 'RFIs, instructions, variations, approvals, notices. Every contract event tracked and managed in real time.', delay: '0.2s' },
                  { title: 'Budget Control', desc: 'Cashflows, variation orders, and cost forecasts maintained with full visibility for the owner throughout.', delay: '0.3s' },
                  { title: 'Programme Oversight', desc: 'Master programme maintained, critical path managed, delays surfaced early before they compound.', delay: '0.4s' },
                  { title: 'Operational Readiness', desc: 'The project is not done until it works operationally. TMPC ensures the facility opens exactly as intended.', delay: '0.5s' },
                ].map(({ title, desc, delay }) => (
                  <div
                    key={title}
                    className="border border-line bg-canvas-subtle p-5 group hover:border-accent/40 hover:bg-white transition-all duration-200"
                    style={{ animation: 'fade-up 0.5s ease-out both', animationDelay: delay }}
                  >
                    <div className="w-6 h-0.5 bg-accent mb-4 group-hover:w-10 transition-all duration-300" />
                    <h3 className="font-display font-semibold text-sm text-ink mb-2.5 leading-snug">{title}</h3>
                    <p className="text-xs text-ink-muted leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONCEPT N: Cinematic Project Collage                         */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div id="concept-N">
        <Label letter="N" title="Cinematic project collage" note="Full-bleed Bangkok photo, TMPC overlay card, sector image strip, cinematic depth" />
        <section className="border-b border-line overflow-hidden relative" style={{ minHeight: '92vh' }}>
          <div className="absolute inset-0">
            <Image src="/images/hero-home.jpg" alt="Bangkok project" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,22,40,0.90) 0%, rgba(10,22,40,0.60) 50%, rgba(10,22,40,0.30) 100%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,22,40,0.65) 0%, transparent 55%)' }} />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 flex items-center" style={{ minHeight: '92vh' }}>
            <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-center w-full py-24">

              <div>
                <div className="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-xs text-white/55 mb-8 tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink flex-shrink-0" />
                  Bangkok, Thailand
                </div>
                <h1 className="font-display font-bold text-6xl lg:text-[5.5rem] text-white leading-[1.03] tracking-tight mb-8">
                  Project Consulting and Development Management in Thailand
                </h1>
                <div className="w-16 h-0.5 bg-accent mb-8" />
                <p className="text-xl text-white/50 leading-relaxed max-w-lg mb-12">
                  Structured coordination, development management, and execution oversight for complex projects across Thailand.
                </p>
                <div className="flex flex-wrap items-center gap-5">
                  <span className="inline-flex text-sm font-semibold bg-accent text-white px-8 py-4">Discuss Your Project</span>
                  <span className="text-sm text-white/45 flex items-center gap-2">Schedule a Consultation &#8594;</span>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-14 pt-8 border-t border-white/[0.12]">
                  {['Bangkok-Based', 'International Standards', 'All Project Sectors', 'End-to-End Management'].map((tag) => (
                    <span key={tag} className="text-[0.6rem] text-white/35 uppercase tracking-[0.2em]">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="hidden lg:flex flex-col gap-3">
                <div className="border border-accent/50 bg-[#0A1628]/90 px-6 py-5 mb-1 animate-hub-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[0.45rem] text-accent uppercase tracking-[0.3em] mb-1.5">Coordination Layer</p>
                      <p className="font-display font-bold text-[2rem] text-white leading-none tracking-tight">TMPC</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {[0, 0.4, 0.8].map((d) => (
                        <span key={d} className="w-1.5 h-1.5 rounded-full bg-accent animate-dot-blink" style={{ animationDelay: `${d}s` }} />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Scope Aligned', 'Budget Controlled', 'All Parties Managed', 'On Programme'].map((s) => (
                      <div key={s} className="border border-accent/20 bg-accent/[0.06] px-2 py-1.5 text-[0.6rem] text-accent/80">{s}</div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { src: '/images/scenario-commercial.jpg', label: 'Commercial' },
                    { src: '/images/scenario-wellness.jpg', label: 'Wellness' },
                    { src: '/images/scenario-industrial.jpg', label: 'Industrial' },
                  ].map(({ src, label }) => (
                    <div key={label} className="relative overflow-hidden" style={{ height: '110px' }}>
                      <Image src={src} alt={label} fill className="object-cover" sizes="130px" />
                      <div className="absolute inset-0 bg-[#0A1628]/45" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <span className="text-[0.5rem] text-white/65 uppercase tracking-[0.18em]">{label}</span>
                      </div>
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
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'].map((c) => (
            <a key={c} href={`#concept-${c}`} className="text-xs font-semibold border border-line px-4 py-2 text-ink-muted hover:border-accent hover:text-accent transition-all duration-150">
              Concept {c}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
