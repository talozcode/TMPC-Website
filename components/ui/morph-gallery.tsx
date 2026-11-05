'use client'

import * as React from 'react'
import Image, { getImageProps } from 'next/image'

/**
 * Morph Gallery: photographs that dissolve into each other through noise
 * instead of cutting or cross-fading.
 *
 * The dissolve is the 21st.dev Morph Gallery shader: an fbm noise field gives
 * every pixel a threshold, progress sweeps past those thresholds, and the
 * threshold is biased by the brightness of the incoming frame, so its lit
 * areas burn through first. The frame, counter, arrows and strip are the
 * site's own, square and quiet.
 *
 * Speed first. The photographs are ordinary next/image elements and stay that
 * way: the first one paints exactly as it did before this component existed.
 * The canvas sits on top of them and is visible only while a dissolve runs.
 * WebGL is set up after the visitor's first scroll, tap or key, when the
 * browser is idle, and textures are uploaded from the same optimised files the
 * page already downloaded. Until then, and with reduced motion or no WebGL,
 * slides cross-fade as they always have.
 */

export type MorphItem = {
  src: string
  alt: string
}

interface Props {
  items: MorphItem[]
  /** Controlled index. Omit for uncontrolled. */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Changes when the list is swapped wholesale (a phase tab), so the counter restarts. */
  setKey?: string
  /** Aspect of the frame. */
  aspect?: string
  sizes?: string
  /** Load the first photograph eagerly. */
  priority?: boolean
  /** Names the photographs in button labels, e.g. the project title. */
  label: string
  /** Opens the photographs fullscreen when the frame is clicked. */
  onOpen?: () => void
  /** Milliseconds of dissolve. */
  duration?: number
  /** fbm frequency. Higher tears into finer shreds. */
  noiseScale?: number
  /** Width of the dissolve front, in threshold units. */
  edge?: number
  /** How far the frames slide against each other while dissolving. */
  drift?: number
  /** Chrome on the frame, top left (the phase tabs). */
  children?: React.ReactNode
}

/** Wrap past the ends. */
export const wrapIndex = (i: number, n: number): number => (n <= 0 ? 0 : ((i % n) + n) % n)

/**
 * Cubic in-out. The original's quintic spent most of the dissolve standing
 * still and tore through the middle in a few frames; cubic lets the photograph
 * come apart at a walking pace.
 */
export const easeInOutCubic = (t: number): number => {
  const x = Math.min(Math.max(t, 0), 1)
  return x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2
}

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_fromAspect;
uniform float u_toAspect;
uniform float u_scale;
uniform float u_direction;
uniform float u_edge;
uniform float u_drift;

varying vec2 v_uv;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 v) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(v);
    v *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// The drift pushes UVs past the edge of the image; reflecting keeps real
// picture there instead of CLAMP_TO_EDGE's smeared streaks. Done here because
// MIRRORED_REPEAT is illegal on the non-power-of-two textures photos produce.
vec2 mirror(vec2 uv) {
  return 1.0 - abs(1.0 - mod(uv, 2.0));
}

// object-fit: cover, about the centre, so the canvas lines up with the
// next/image photographs underneath it pixel for pixel.
vec2 coverUV(vec2 uv, float imgAspect) {
  float canvasAspect = u_resolution.x / u_resolution.y;
  vec2 scale = (canvasAspect > imgAspect)
    ? vec2(1.0, imgAspect / canvasAspect)
    : vec2(canvasAspect / imgAspect, 1.0);
  return mirror((uv - 0.5) * scale + 0.5);
}

void main() {
  // Widen the sweep by one edge at each end, so progress 0 and 1 are fully
  // one image or the other rather than already half-dissolved.
  float adjusted = u_progress * (1.0 + 2.0 * u_edge) - u_edge;

  float noise = fbm(v_uv * u_scale + vec2(0.0, u_progress * u_direction)) * 0.5 + 0.5;
  // Bias the threshold by how bright the incoming frame is here: its lit areas
  // cross the front first, so the new image appears to burn through the old.
  noise = smoothstep(
    0.0,
    2.0,
    length(texture2D(u_to, coverUV(v_uv, u_toAspect)).rgb) + noise
  );

  float mixFactor = 1.0 - smoothstep(adjusted - u_edge, adjusted + u_edge, noise);

  // Both frames slide, by different amounts and in opposite directions, so the
  // tatters have parallax against each other instead of sitting in one plane.
  vec2 fromUV = coverUV(
    v_uv + vec2(0.0, noise * u_progress * u_drift * u_direction),
    u_fromAspect
  );
  vec2 toUV = coverUV(
    v_uv + vec2(0.0, noise * (1.0 - u_progress) * -0.5 * u_drift * u_direction),
    u_toAspect
  );

  gl_FragColor = mix(texture2D(u_from, fromUV), texture2D(u_to, toUV), mixFactor);
}
`

const UNIFORMS = [
  'from', 'to', 'progress', 'resolution', 'fromAspect', 'toAspect', 'scale', 'direction', 'edge', 'drift',
] as const

type Tuning = { duration: number; noiseScale: number; edge: number; drift: number }

interface Engine {
  /** Dissolve from one photograph to another. False when it cannot, so the caller can cross-fade. */
  morph(fromSrc: string, toSrc: string, direction: number): boolean
  /** Upload these in the background, so the next dissolve starts at once. */
  warm(srcs: string[]): void
  dispose(): void
}

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('could not create shader')
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error('shader compile failed: ' + log)
  }
  return shader
}

/**
 * Builds the GL side once. Returns null where WebGL is missing or refuses the
 * program; the gallery then keeps cross-fading and nobody sees a black frame.
 */
function createEngine(
  canvas: HTMLCanvasElement,
  resolveUrl: (src: string, width: number) => string,
  tuning: React.RefObject<Tuning>,
): Engine | null {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
  })
  if (!gl) return null

  let program: WebGLProgram
  try {
    const vert = compile(gl, gl.VERTEX_SHADER, VERT)
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    program = gl.createProgram()!
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    gl.deleteShader(vert)
    gl.deleteShader(frag)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  } catch {
    return null
  }
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const u = Object.fromEntries(
    UNIFORMS.map((name) => [name, gl.getUniformLocation(program, 'u_' + name)])
  ) as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>
  gl.uniform1i(u.from, 0)
  gl.uniform1i(u.to, 1)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  type Tex = { tex: WebGLTexture; aspect: number }
  const textures = new Map<string, Tex>()
  const loading = new Map<string, Promise<Tex>>()
  let disposed = false
  let raf = 0
  // Bumped by every morph, so a slow texture never starts a dissolve the
  // visitor has already clicked past.
  let token = 0

  const resize = () => {
    // 1.5 is plenty for a dissolve that is on screen for a second and a half,
    // and keeps five octaves of noise cheap on a phone.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    gl.viewport(0, 0, w, h)
  }

  const load = (src: string): Promise<Tex> => {
    const have = textures.get(src)
    if (have) return Promise.resolve(have)
    const pending = loading.get(src)
    if (pending) return pending
    const promise = new Promise<Tex>((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.decoding = 'async'
      img.onload = () => {
        loading.delete(src)
        if (disposed) return reject(new Error('disposed'))
        const tex = gl.createTexture()
        if (!tex) return reject(new Error('no texture'))
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        // Photos are not powers of two: clamp and linear are the only legal
        // pair in WebGL1, and the wrong one renders black with no error.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        const entry = { tex, aspect: img.naturalWidth / Math.max(img.naturalHeight, 1) }
        textures.set(src, entry)
        resolve(entry)
      }
      img.onerror = () => {
        loading.delete(src)
        reject(new Error('could not load ' + src))
      }
      img.src = resolveUrl(src, canvas.clientWidth * (window.devicePixelRatio || 1))
    })
    // A warm-up nobody waits on must not surface as an unhandled rejection.
    promise.catch(() => {})
    loading.set(src, promise)
    return promise
  }

  const draw = (from: Tex, to: Tex, progress: number, direction: number) => {
    const t = tuning.current
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, from.tex)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, to.tex)
    gl.uniform1f(u.progress, progress)
    gl.uniform2f(u.resolution, canvas.width, canvas.height)
    gl.uniform1f(u.fromAspect, from.aspect)
    gl.uniform1f(u.toAspect, to.aspect)
    gl.uniform1f(u.scale, t.noiseScale)
    gl.uniform1f(u.direction, direction)
    gl.uniform1f(u.edge, Math.max(t.edge, 0.001))
    gl.uniform1f(u.drift, t.drift)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  const hide = (fade = false) => {
    canvas.style.transition = fade ? 'opacity 500ms ease-out' : 'none'
    canvas.style.opacity = '0'
  }

  return {
    morph(fromSrc, toSrc, direction) {
      const from = textures.get(fromSrc)
      if (disposed || !from) return false
      cancelAnimationFrame(raf)
      const mine = ++token
      resize()
      // Drawn and shown before the browser paints, so the photograph that is
      // leaving stays put while the one arriving swaps in underneath.
      draw(from, from, 0, direction)
      canvas.style.transition = 'none'
      canvas.style.opacity = '1'

      load(toSrc).then(
        (to) => {
          if (disposed || mine !== token) return
          const startedAt = performance.now()
          const step = (now: number) => {
            if (disposed || mine !== token) return
            const t = Math.min((now - startedAt) / Math.max(tuning.current.duration, 1), 1)
            draw(from, to, easeInOutCubic(t), direction)
            if (t < 1) raf = requestAnimationFrame(step)
            // The photograph underneath is the same frame, so this is invisible.
            else raf = requestAnimationFrame(() => mine === token && hide())
          }
          raf = requestAnimationFrame(step)
        },
        () => {
          if (mine === token) hide(true)
        }
      )
      return true
    },
    warm(srcs) {
      for (const src of srcs) void load(src)
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      for (const { tex } of textures.values()) gl.deleteTexture(tex)
      textures.clear()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

const ARROWS = [
  { delta: -1, label: 'Previous photograph', d: 'M15 19l-7-7 7-7' },
  { delta: 1, label: 'Next photograph', d: 'M9 5l7 7-7 7' },
]

export function MorphGallery({
  items,
  index,
  defaultIndex = 0,
  onIndexChange,
  setKey = '',
  aspect = 'aspect-[16/10]',
  sizes = '(max-width: 1024px) 100vw, 60rem',
  priority = false,
  label,
  onOpen,
  duration = 1600,
  noiseScale = 3.5,
  edge = 0.15,
  drift = 0.35,
  children,
}: Props) {
  const n = items.length
  const [uncontrolled, setUncontrolled] = React.useState(() => wrapIndex(defaultIndex, n))
  const active = wrapIndex(index ?? uncontrolled, n)
  const current = items[active]

  const go = (next: number) => {
    const wrapped = wrapIndex(next, n)
    if (index === undefined) setUncontrolled(wrapped)
    onIndexChange?.(wrapped)
  }

  // Which way things move: the counter rolls and the tatters drift the same
  // way, the shortest way round, so last-to-first still reads as forward.
  // 0 until the first change, so nothing animates on load.
  const [seen, setSeen] = React.useState({ key: setKey, index: active })
  const [dir, setDir] = React.useState<0 | 1 | -1>(0)
  if (seen.key !== setKey || seen.index !== active) {
    const forward = seen.key !== setKey || ((active - seen.index + n) % n) * 2 <= n
    setSeen({ key: setKey, index: active })
    setDir(forward ? 1 : -1)
  }

  const frameRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const engine = React.useRef<Engine | null>(null)
  const [glReady, setGlReady] = React.useState(false)
  const [generation, setGeneration] = React.useState(0)
  const tuning = React.useRef<Tuning>({ duration, noiseScale, edge, drift })
  React.useEffect(() => {
    tuning.current = { duration, noiseScale, edge, drift }
  }, [duration, noiseScale, edge, drift])

  // The texture comes from the exact file the browser already picked for the
  // photograph underneath, so it is a cache hit rather than a second download.
  const resolveUrl = React.useCallback(
    (src: string, width: number) => {
      const shown = frameRef.current?.querySelectorAll<HTMLImageElement>('img[data-morph-src]') ?? []
      for (const img of shown) if (img.dataset.morphSrc === src && img.currentSrc) return img.currentSrc
      const { props } = getImageProps({ src, alt: '', fill: true, sizes })
      const candidates = (props.srcSet ?? '')
        .split(', ')
        .map((entry) => {
          const [url, w] = entry.trim().split(' ')
          return { url, w: parseInt(w, 10) }
        })
        .filter((c) => c.url && c.w)
      if (candidates.length === 0) return props.src
      return (candidates.find((c) => c.w >= width) ?? candidates[candidates.length - 1]).url
    },
    [sizes]
  )

  // WebGL waits for the visitor's first scroll, tap or key, then for an idle
  // moment, so it never competes with the first paint.
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    let idle = 0
    let built: Engine | null = null

    const build = () => {
      built = createEngine(canvas, resolveUrl, tuning)
      if (!built) return
      engine.current = built
      setGlReady(true)
    }
    const schedule = () => {
      idle =
        typeof window.requestIdleCallback === 'function'
          ? window.requestIdleCallback(build, { timeout: 1500 })
          : window.setTimeout(build, 200)
    }
    const onLost = (e: Event) => {
      e.preventDefault()
      engine.current = null
      setGlReady(false)
      canvas.style.opacity = '0'
    }
    // A restored context is empty: build the whole thing again.
    const onRestored = () => setGeneration((g) => g + 1)
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    const opts = { once: true, passive: true } as const
    const events = ['scroll', 'pointerdown', 'keydown'] as const
    const on = () => {
      for (const e of events) window.removeEventListener(e, on)
      schedule()
    }
    if (generation > 0) schedule()
    else for (const e of events) window.addEventListener(e, on, opts)

    return () => {
      for (const e of events) window.removeEventListener(e, on)
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      built?.dispose()
      engine.current = null
      setGlReady(false)
    }
  }, [generation, resolveUrl])

  // The photograph on show and its neighbours are uploaded ahead of time.
  React.useEffect(() => {
    if (!glReady || n === 0) return
    const near = [active, wrapIndex(active + 1, n), wrapIndex(active - 1, n)]
    engine.current?.warm([...new Set(near)].map((i) => items[i].src))
  }, [glReady, active, items, n])

  // A layout effect, so the canvas covers the leaving photograph before the
  // browser paints the arriving one underneath it.
  const shownSrc = React.useRef(current?.src)
  React.useLayoutEffect(() => {
    const prev = shownSrc.current
    shownSrc.current = current?.src
    if (!prev || !current || prev === current.src) return
    engine.current?.morph(prev, current.src, dir === -1 ? -1 : 1)
  }, [current, dir])

  // A horizontal swipe on the frame steps through; it must not also count as
  // the click that opens the lightbox.
  const swipe = React.useRef<{ x: number; y: number } | null>(null)
  const swiped = React.useRef(false)

  // Only the current frame and its neighbours are mounted, so a long phase
  // does not download every photograph up front.
  const near = (i: number) => i === active || i === wrapIndex(active + 1, n) || i === wrapIndex(active - 1, n)
  const showNav = n > 1

  return (
    <div
      className="relative flex flex-col"
      onKeyDown={(e) => {
        if (!showNav || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return
        e.preventDefault()
        go(active + (e.key === 'ArrowRight' ? 1 : -1))
      }}
    >
      <div
        ref={frameRef}
        className={`relative overflow-hidden bg-ink touch-pan-y ${aspect}`}
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, y: e.clientY }
          swiped.current = false
        }}
        onPointerUp={(e) => {
          const start = swipe.current
          swipe.current = null
          if (!start || !showNav) return
          const dx = e.clientX - start.x
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
            swiped.current = true
            go(active + (dx < 0 ? 1 : -1))
          }
        }}
        onClickCapture={(e) => {
          if (!swiped.current) return
          swiped.current = false
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        {items.map((item, i) =>
          near(i) ? (
            <Image
              key={`${setKey}-${i}`}
              src={item.src}
              alt={item.alt}
              data-morph-src={item.src}
              fill
              priority={i === 0 && priority}
              loading={i === 0 && priority ? undefined : i === active ? 'eager' : 'lazy'}
              sizes={sizes}
              // Once the canvas does the dissolving, the photographs underneath
              // switch at once; before that they cross-fade as they always did.
              className={`object-cover ${
                glReady ? '' : 'transition-opacity duration-500 ease-out motion-reduce:transition-none'
              }`}
              style={{ opacity: i === active ? 1 : 0 }}
            />
          ) : null
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full pointer-events-none"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />

        {onOpen && (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`View ${label} photographs fullscreen`}
            className="absolute inset-0 z-10 w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-inset"
          />
        )}

        {children}

        {showNav && (
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1">
            <span className="t-meta bg-ink-deep/85 px-3 h-10 inline-flex items-center text-fog/80 select-none">
              <span className="count-roll" data-dir={dir || undefined}>
                <span key={`${setKey}-${active}`}>{String(active + 1).padStart(2, '0')}</span>
              </span>
              &nbsp;/ {String(n).padStart(2, '0')}
            </span>
            {ARROWS.map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => go(active + b.delta)}
                aria-label={b.label}
                className="press w-10 h-10 flex items-center justify-center bg-ink-deep/85 text-fog/80 hover:text-ink-deep hover:bg-signal transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="square" strokeWidth={1.75} d={b.d} />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {showNav && (
        <div className="flex gap-1.5 pt-2 flex-shrink-0 overflow-x-auto">
          {items.map((item, i) => (
            <button
              key={`${setKey}-${i}`}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${item.alt}, photograph ${i + 1} of ${n}`}
              aria-current={i === active}
              className={`press relative flex-shrink-0 w-20 h-14 overflow-hidden border-2 transition-all duration-200 ${
                i === active ? 'border-signal' : 'border-transparent opacity-55 hover:opacity-100'
              }`}
            >
              <Image src={item.src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {current ? `${current.alt}, ${active + 1} of ${n}` : ''}
      </span>
    </div>
  )
}

export default MorphGallery
