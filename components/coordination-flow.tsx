/**
 * Replaces the old "One Coordination Layer" one-sentence statement band with a
 * short visual flow: the parties a client would otherwise deal with directly,
 * into TMPC, into a clear decision for the client.
 *
 * A near-identical idea was tried here once before (a horizontal/vertical
 * Inputs -> TMPC -> Outcomes diagram, three bordered boxes each stuffed with
 * wrapping chip lists) and was deliberately removed for being "confusing/long
 * on mobile." That version stacked to roughly 700-750px tall on a phone: three
 * padded boxes, two connector rows each carrying both an arrow and a text
 * label, and two 8-chip wrapping lists.
 *
 * This version stays inside the same dark panel the statement band already
 * used, one plain sentence per row instead of chips, and a single unlabeled
 * dot as the connector, no separate arrow-plus-caption row. No responsive
 * branching either, the same short stack renders at every width.
 */
export function CoordinationFlow() {
  return (
    <div className="on-dark panel relative bg-canvas-dark mt-[clamp(3rem,6vw,5rem)] px-8 py-10 lg:px-14 lg:py-14">
      <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center text-center gap-5 lg:gap-6 max-w-md mx-auto">
        <p className="eye">One Coordination Layer</p>

        <div>
          <p className="text-[0.62rem] font-bold text-white/40 uppercase tracking-[0.16em]">They</p>
          <p className="text-white/70 text-[0.9rem] leading-snug mt-1.5">
            Architects, Engineers, Contractors, Suppliers, Designers
          </p>
        </div>

        <Connector />

        <div>
          <span className="inline-flex items-center rounded-full border border-accent-light/30 bg-accent/10 px-5 py-2 animate-hub-glow">
            <span className="font-display font-bold text-white text-[1.05rem] tracking-[-0.01em]">TMPC</span>
          </span>
          <p className="text-white/60 text-[0.82rem] leading-snug mt-2">
            We coordinate. We review. We negotiate. We manage.
          </p>
        </div>

        <Connector />

        <div>
          <p className="font-display font-semibold text-white text-[1.05rem]">You</p>
          <p className="text-white/70 text-[0.9rem] leading-snug mt-1.5">
            Clear decisions. No unnecessary noise.
          </p>
        </div>

        <div className="mt-3 lg:mt-4 pt-6 border-t border-white/10 w-full">
          <p className="text-[0.7rem] text-white/45 uppercase tracking-[0.14em]">
            Multiple Teams, 2 Languages, 1 Point of Contact
          </p>
        </div>
      </div>
    </div>
  )
}

/** A joint, not a labeled step: no arrow glyph, no caption, just a mark. */
function Connector() {
  return (
    <div className="relative w-px h-6 bg-white/15" aria-hidden="true">
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-light animate-dot-blink" />
    </div>
  )
}
