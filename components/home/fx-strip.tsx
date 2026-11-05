import { getFxSnapshot, type FxCode, type FxRate } from '@/lib/fx-rates'
import { FxDrift } from './fx-drift'

const CURRENCY: Record<FxCode, { symbol: string; one: string; many: string }> = {
  USD: { symbol: '$', one: 'US dollar', many: 'US dollars' },
  EUR: { symbol: '€', one: 'euro', many: 'euros' },
  GBP: { symbol: '£', one: 'British pound', many: 'British pounds' },
  CNY: { symbol: '¥', one: 'Chinese yuan', many: 'Chinese yuan' },
  JPY: { symbol: '¥', one: 'Japanese yen', many: 'Japanese yen' },
  SGD: { symbol: 'S$', one: 'Singapore dollar', many: 'Singapore dollars' },
  AUD: { symbol: 'A$', one: 'Australian dollar', many: 'Australian dollars' },
  ILS: { symbol: '₪', one: 'Israeli shekel', many: 'Israeli shekels' },
}

const figure = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** 2026-10-16 to 16/10, the site's day/month order. */
const dayMonth = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

/** A short hairline, centred on the line of type, never touching the band's edges. */
const Rule = ({ className = 'h-4' }: { className?: string }) => (
  <span aria-hidden="true" className={`w-px shrink-0 self-center bg-fog/15 ${className}`} />
)

function Cell({ r }: { r: FxRate }) {
  const c = CURRENCY[r.code]
  const pct = Math.abs(r.change)
  // Shown to two places, so anything that rounds to 0.00% reads as unchanged.
  const dir = pct < 0.005 ? 'flat' : r.change > 0 ? 'up' : 'down'
  const sentence =
    `${r.unit} ${r.unit === 1 ? c.one : c.many} = ${figure(r.rate)} baht, ` +
    (dir === 'flat' ? 'unchanged' : `${dir} ${figure(pct)}%`)

  return (
    <li className="relative flex shrink-0">
      <span className="sr-only">{sentence}</span>
      <p
        aria-hidden="true"
        className="self-center flex items-baseline whitespace-nowrap py-4 lg:py-[1.15rem] px-[clamp(1.1rem,1.6vw,1.75rem)]"
      >
        <span className="font-mono text-[0.75rem] text-fog-muted/70 mr-2">{c.symbol}</span>
        {r.unit > 1 && <span className="font-mono text-[0.75rem] text-fog-muted mr-1.5">{r.unit}</span>}
        <span className="font-mono text-[0.75rem] tracking-[0.1em] text-fog/90">{r.code}</span>
        <span className="ml-3.5 font-display font-[300] text-fog text-[clamp(1.15rem,1rem+0.35vw,1.35rem)] leading-none tracking-[-0.01em] tabular-nums [font-variation-settings:'wdth'_102]">
          {figure(r.rate)}
        </span>
        <span className="ml-1 font-mono text-[0.68rem] text-fog-muted">฿</span>
        <span className={`ml-3 font-mono text-[0.72rem] tracking-[0.02em] tabular-nums ${dir === 'up' ? 'text-signal' : 'text-fog-muted'}`}>
          <span className="inline-block text-[0.78em] mr-1 -translate-y-[0.06em]">
            {dir === 'up' ? '▲' : dir === 'down' ? '▼' : '▪'}
          </span>
          {dir === 'up' ? '+' : dir === 'down' ? '−' : ''}
          {figure(pct)}%
        </span>
      </p>
      <Rule />
    </li>
  )
}

/**
 * A dark instrument band under the home hero: ECB reference rates quoted in
 * baht, with the move since the previous business day. One quiet line per
 * currency, split by short rules, the row running off the edges behind a
 * fade. Server rendered, and absent entirely when the rates cannot be read.
 * The row runs as a slow belt (see FxDrift), or with reduced motion or no
 * JavaScript scrolls sideways inside the band; the page never does.
 *
 * Up is signal orange and down is fog, always paired with a triangle, so the
 * direction never rests on colour alone. No red or green.
 */
export async function FxStrip() {
  const fx = await getFxSnapshot()
  if (!fx) return null

  return (
    <section className="dark-band border-y border-fog/10" data-tone="dark" aria-labelledby="fx-title">
      <div className="flex max-lg:flex-col lg:pl-[max(var(--gutter),calc((100%_-_var(--wrap))_/_2_+_var(--gutter)))]">
        <div className="shrink-0 flex max-lg:px-[var(--gutter)] max-lg:pt-4">
          <div className="self-center lg:pr-8 lg:py-3">
            <h2
              id="fx-title"
              className="font-display text-[0.875rem] font-[500] leading-tight text-fog tracking-[0] [font-variation-settings:'wdth'_104]"
            >
              Exchange rates vs. the baht
            </h2>
            <p className="t-meta !text-[0.66rem] text-fog-muted mt-1.5 flex items-center gap-2">
              <span className="grid place-items-center w-3 h-3 bg-signal/15" aria-hidden="true">
                <span className="w-[5px] h-[5px] bg-signal" />
              </span>
              <span>
                Updated <time dateTime={fx.date}>{dayMonth(fx.date)}</time>
                <span aria-hidden="true"> · </span>
                <span className="sr-only">, source </span>ECB
              </span>
            </p>
          </div>
          <span className="max-lg:hidden contents">
            <Rule className="h-7" />
          </span>
        </div>

        <FxDrift className="relative min-w-0 flex-1 overflow-x-auto overscroll-x-contain data-[running]:overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_0.75rem,black_calc(100%_-_3rem),transparent)] lg:[mask-image:linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%_-_5rem),transparent)] data-[running]:[mask-image:linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%_-_3rem),transparent)] lg:data-[running]:[mask-image:linear-gradient(to_right,transparent,black_4rem,black_calc(100%_-_6rem),transparent)] focus-visible:outline-offset-[-2px]">
          <ul className="flex w-max after:content-[''] after:shrink-0 after:w-12 lg:after:w-20 group-data-[running]:after:hidden">
            {fx.rates.map((r) => (
              <Cell key={r.code} r={r} />
            ))}
          </ul>
        </FxDrift>
      </div>
    </section>
  )
}
