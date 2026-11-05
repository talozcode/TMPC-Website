import { unstable_cache } from 'next/cache'

/**
 * Reference exchange rates quoted in Thai baht, for the strip under the home
 * hero. The source is Frankfurter, which republishes the European Central
 * Bank's daily reference rates: free, no key, and with history, so the change
 * can be measured against the previous business day.
 *
 * ECB quotes everything against the euro to four or five significant figures.
 * Each baht rate is crossed from those (THB per EUR / currency per EUR), which
 * keeps more precision than asking the API for a THB base.
 *
 * Read on the server only and cached for an hour. When the source fails or
 * answers with something unexpected this returns null and the strip is not
 * rendered: no stale or made-up numbers.
 */

const API = 'https://api.frankfurter.dev/v1'

export const FX_CODES = ['USD', 'EUR', 'GBP', 'CNY', 'JPY', 'SGD', 'AUD', 'ILS'] as const
export type FxCode = (typeof FX_CODES)[number]

export type FxRate = {
  code: FxCode
  /** How many units the rate is quoted for: 1, or 100 for currencies worth less than a baht. */
  unit: number
  /** Baht for `unit` of the currency on the latest date. */
  rate: number
  /** Percent change against the previous business day. */
  change: number
}

export type FxSnapshot = {
  /** ECB reference date of the latest rates, YYYY-MM-DD. */
  date: string
  rates: FxRate[]
}

type Series = { base?: string; rates?: Record<string, Record<string, number>> }

/** Today's date in Bangkok minus `days`, as YYYY-MM-DD. */
function bangkokDate(days: number) {
  const d = new Date(Date.now() - days * 86_400_000)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(d)
}

async function fetchSnapshot(): Promise<FxSnapshot> {
  // Ten days back always holds at least two business days, holidays included.
  const symbols = ['THB', ...FX_CODES.filter((c) => c !== 'EUR')].join(',')
  const res = await fetch(`${API}/${bangkokDate(10)}..?symbols=${symbols}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(4000),
  })
  if (!res.ok) throw new Error(`rates: HTTP ${res.status}`)
  const data = (await res.json()) as Series
  if (data.base !== 'EUR' || !data.rates) throw new Error('rates: unexpected response')

  const dates = Object.keys(data.rates).sort()
  if (dates.length < 2) throw new Error('rates: not enough history')
  const latest = data.rates[dates[dates.length - 1]]
  const previous = data.rates[dates[dates.length - 2]]

  const inBaht = (day: Record<string, number>, code: FxCode) => {
    const thb = day.THB
    const per = code === 'EUR' ? 1 : day[code]
    if (!(thb > 0) || !(per > 0)) return null
    return thb / per
  }

  const rates: FxRate[] = []
  for (const code of FX_CODES) {
    const now = inBaht(latest, code)
    const before = inBaht(previous, code)
    if (now === null || before === null) continue
    // Quote per 100 when one unit is worth less than a baht, so the figure
    // never starts with "0.".
    const unit = now < 1 ? 100 : 1
    rates.push({ code, unit, rate: now * unit, change: ((now - before) / before) * 100 })
  }
  if (rates.length === 0) throw new Error('rates: no usable currencies')

  return { date: dates[dates.length - 1], rates }
}

// Errors are thrown inside the cache so a failure is never cached as an empty
// result; the next request simply tries again.
const cachedSnapshot = unstable_cache(fetchSnapshot, ['fx-thb-v1'], { revalidate: 3600 })

export async function getFxSnapshot(): Promise<FxSnapshot | null> {
  try {
    return await cachedSnapshot()
  } catch {
    return null
  }
}
