'use client'

import { useCallback, useRef, useState } from 'react'
import type { CompareHeading, CompareImage } from '@/lib/compare-slots'
import { SplitHeading } from '@/components/anim/split-heading'
import { gsap, useGSAP, MOTION_OK } from '@/components/anim/gsap'
import { CompareSeam, CompareStage } from './compare-stage'
import { useCompare, useMediaQuery } from './use-compare'

/**
 * Variant 3: the section pins and scrolling moves the seam from 0 to 100, the
 * after image wiping in from the left. A mono readout counts the days, and the
 * caption swaps at the midpoint.
 *
 * With reduced motion it is an ordinary drag slider that never pins, and
 * without JavaScript it is a static 50/50 split.
 */
export function CompareScrub({
  before,
  after,
  labels,
  heading,
  days,
  captions,
}: {
  before: CompareImage
  after: CompareImage
  labels: { before: string; after: string }
  heading: CompareHeading
  days: number
  captions: { early: string; late: string }
}) {
  const pinRef = useRef<HTMLDivElement>(null)
  const readRef = useRef<HTMLParagraphElement>(null)
  const lateRef = useRef(false)
  const [late, setLate] = useState(false)
  // Scroll drives the seam unless motion is reduced. False on the server, so
  // the server-rendered markup is the interactive (and no-JS) one.
  const scrolling = useMediaQuery(MOTION_OK)

  const readout = useCallback(
    (v: number) => (v >= 99 ? labels.after : `Day ${1 + Math.round((v / 100) * (days - 1))}`),
    [days, labels.after]
  )

  const onValue = (v: number) => {
    if (readRef.current) readRef.current.textContent = readout(v)
    const isLate = v >= 50
    if (isLate !== lateRef.current) {
      lateRef.current = isLate
      setLate(isLate)
    }
  }

  const c = useCompare({ disabled: scrolling, valueText: readout, onValue })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const proxy = { v: 0 }
        c.set(0)
        gsap.to(proxy, {
          v: 100,
          ease: 'none',
          onUpdate: () => c.set(proxy.v),
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: '+=140%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        })
        return () => c.set(50)
      })
      return () => mm.revert()
    },
    { scope: pinRef }
  )

  return (
    <section className="bg-paper">
      <div ref={pinRef} className="sec cmp-pin">
        <div className="wrap w-full">
          <div className="grid lg:grid-cols-12 gap-x-10 gap-y-5 items-end mb-8">
            <SplitHeading className="t-h1 lg:col-span-7 max-w-[16ch]">
              {heading.lead} <em>{heading.em}</em>
            </SplitHeading>
            <div className="lg:col-span-5 grid gap-3">
              <p ref={readRef} className="t-meta text-ink" aria-hidden="true">
                {readout(50)}
              </p>
              <div className="grid">
                {(['early', 'late'] as const).map((k) => {
                  const on = (k === 'late') === late
                  return (
                    <p
                      key={k}
                      aria-hidden={!on}
                      className={`t-body [grid-area:1/1] transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] ${
                        on ? 'opacity-100' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      {captions[k]}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>
          <CompareStage
            stageRef={c.stageRef}
            before={before}
            after={after}
            top="after"
            shape="x"
            labels={labels}
            sizes="(max-width: 1400px) 100vw, 1360px"
            className={`aspect-[4/3] md:aspect-[16/9] md:max-h-[60svh] w-full ${scrolling ? '' : 'touch-pan-y cursor-ew-resize'}`}
            {...c.stageProps}
          >
            <CompareSeam
              axis="x"
              handleRef={c.handleRef}
              interactive={!scrolling}
              label="Reveal the site from day one to opening day"
              valueText={readout(50)}
              {...c.handleProps}
            />
          </CompareStage>
        </div>
      </div>
    </section>
  )
}
