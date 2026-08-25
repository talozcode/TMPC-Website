/**
 * A spring parameterised the way Apple's designers think about it, rather than
 * in mass/stiffness/damping:
 *
 *   damping   damping ratio. 1.0 is critically damped, no overshoot.
 *             Below 1.0 overshoots. Use bounce only when a gesture carried
 *             momentum into the animation.
 *   response  how quickly the value reaches the target, in seconds. This is
 *             not a duration; a spring has no fixed duration.
 *
 * The two properties that matter for a fluid interface are that it is always
 * interruptible and that re-targeting carries the current velocity through, so
 * reversing a gesture mid flight never produces a velocity discontinuity.
 */

export type SpringHandle = {
  /** Re-target without losing the current value or velocity. */
  setTarget: (target: number, velocity?: number) => void
  /** Jump straight to a value, cancelling motion. */
  set: (value: number) => void
  stop: () => void
  readonly value: number
  readonly velocity: number
  readonly isAnimating: boolean
  /** Damping ratio. 1.0 is critically damped. Retunable between gestures. */
  damping: number
  /** Seconds to reach the target. Not a duration. Retunable between gestures. */
  response: number
}

// A fixed substep keeps the integration stable regardless of frame rate, which
// matters both on a 120Hz display and on a frame that took 200ms.
const SUBSTEP = 1 / 240
const REST_DISTANCE = 0.03
const REST_VELOCITY = 0.03

export function createSpring(opts: {
  from: number
  to?: number
  damping?: number
  response?: number
  velocity?: number
  onUpdate: (value: number, velocity: number) => void
  onRest?: () => void
}): SpringHandle {
  let value = opts.from
  let velocity = opts.velocity ?? 0
  let target = opts.to ?? opts.from
  let zeta = opts.damping ?? 1
  let omega = (2 * Math.PI) / (opts.response ?? 0.4)
  let raf = 0
  let last = 0

  const tick = (now: number) => {
    raf = 0
    let dt = (now - last) / 1000
    last = now
    // A long frame (tab restored, jank) must not be integrated in one go.
    if (dt > 0.064) dt = 0.064

    let remaining = dt
    while (remaining > 0) {
      const h = Math.min(SUBSTEP, remaining)
      remaining -= h
      const accel = -(omega * omega) * (value - target) - 2 * zeta * omega * velocity
      velocity += accel * h
      value += velocity * h
    }

    if (Math.abs(value - target) < REST_DISTANCE && Math.abs(velocity) < REST_VELOCITY) {
      value = target
      velocity = 0
      opts.onUpdate(value, velocity)
      opts.onRest?.()
      return
    }

    opts.onUpdate(value, velocity)
    schedule()
  }

  const schedule = () => {
    if (raf) return
    last = performance.now()
    raf = requestAnimationFrame(tick)
  }

  return {
    setTarget(next: number, v?: number) {
      target = next
      // Carrying velocity across a re-target is what stops a reversal from
      // feeling like it hits a brick wall.
      if (v !== undefined) velocity = v
      if (Math.abs(value - target) < REST_DISTANCE && Math.abs(velocity) < REST_VELOCITY) {
        value = target
        velocity = 0
        opts.onUpdate(value, velocity)
        opts.onRest?.()
        return
      }
      schedule()
    },
    set(next: number) {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      value = next
      velocity = 0
      opts.onUpdate(value, velocity)
    },
    stop() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    },
    get value() {
      return value
    },
    get velocity() {
      return velocity
    },
    get isAnimating() {
      return raf !== 0
    },
    get damping() {
      return zeta
    },
    set damping(v: number) {
      zeta = v
    },
    get response() {
      return (2 * Math.PI) / omega
    },
    set response(v: number) {
      omega = (2 * Math.PI) / v
    },
  }
}

/**
 * Where a flick would come to rest, using the exponential decay form Apple
 * ships in the Designing Fluid Interfaces sample code. The physics textbook
 * v^2/(2a) form is not what the platform uses and feels wrong.
 */
export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

/**
 * Progressive resistance past a boundary. Real things slow before they stop; a
 * hard clamp reads as frozen rather than as "there is nothing more here".
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
}

/** Tracks recent pointer samples so release velocity is real, not a single delta. */
export class VelocityTracker {
  private samples: { v: number; t: number }[] = []

  add(value: number, time: number) {
    this.samples.push({ v: value, t: time })
    // 100ms window: long enough to be stable, short enough to feel current.
    const cutoff = time - 100
    while (this.samples.length > 2 && this.samples[0].t < cutoff) this.samples.shift()
  }

  /** Pixels per second. */
  get velocity(): number {
    if (this.samples.length < 2) return 0
    const first = this.samples[0]
    const last = this.samples[this.samples.length - 1]
    const dt = (last.t - first.t) / 1000
    if (dt <= 0) return 0
    return (last.v - first.v) / dt
  }

  reset() {
    this.samples = []
  }
}
