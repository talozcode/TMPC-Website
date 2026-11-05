'use client'

import { useEffect, useState } from 'react'

/**
 * Bangkok's wall clock, "HH:MM", ticking on the minute. Null until mounted,
 * so the server never renders a time that would be stale by hydration.
 */
export function useBangkokTime() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', hour12: false })
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      setTime(fmt.format(new Date()))
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
    }
    tick()
    return () => clearTimeout(timer)
  }, [])
  return time
}
