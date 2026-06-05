import sharp from 'sharp'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Sharp needs the Node runtime (not Edge).
export const runtime = 'nodejs'

// Crop an image server-side with sharp. Unlike a browser <canvas> re-encode, this
// preserves the embedded ICC color profile, so wide-gamut (e.g. Display P3) photos
// are not reinterpreted as sRGB and do not come out darker. See image-crop-modal.tsx.

const MAX_BYTES = 25 * 1024 * 1024 // matches the largest uploader limit (media library: 20 MB) plus headroom

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

export async function POST(request: Request) {
  // This route is not under /admin, so proxy.ts does not gate it: check auth here.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 })
    }

    const x = Number(form.get('x'))
    const y = Number(form.get('y'))
    const w = Number(form.get('width'))
    const h = Number(form.get('height'))
    if (![x, y, w, h].every((n) => Number.isFinite(n)) || w < 1 || h < 1) {
      return NextResponse.json({ error: 'Invalid crop rectangle' }, { status: 400 })
    }

    const input = Buffer.from(await file.arrayBuffer())
    const meta = await sharp(input).metadata()
    if (!meta.width || !meta.height) {
      return NextResponse.json({ error: 'Unreadable image' }, { status: 400 })
    }

    // react-easy-crop reports the rectangle in the *displayed* (EXIF-oriented) pixel
    // space, so we auto-orient with .rotate() and compute the oriented dimensions to
    // clamp against.
    const swapped = typeof meta.orientation === 'number' && meta.orientation >= 5
    const ow = swapped ? meta.height : meta.width
    const oh = swapped ? meta.width : meta.height

    const left = clamp(Math.round(x), 0, ow - 1)
    const top = clamp(Math.round(y), 0, oh - 1)
    const width = clamp(Math.round(w), 1, ow - left)
    const height = clamp(Math.round(h), 1, oh - top)

    let pipeline = sharp(input)
      .rotate() // bake EXIF orientation in so extract coords match the preview
      .extract({ left, top, width, height })
      .withMetadata() // keep the ICC profile (this is the actual color fix)

    let contentType = 'image/jpeg'
    switch (meta.format) {
      case 'png':
        pipeline = pipeline.png()
        contentType = 'image/png'
        break
      case 'webp':
        pipeline = pipeline.webp({ quality: 92 })
        contentType = 'image/webp'
        break
      default:
        // jpeg and anything else fall back to high-quality jpeg
        pipeline = pipeline.jpeg({ quality: 92, mozjpeg: true })
        contentType = 'image/jpeg'
    }

    const output = await pipeline.toBuffer()
    return new NextResponse(new Uint8Array(output), {
      status: 200,
      headers: { 'Content-Type': contentType, 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('crop failed', err)
    return NextResponse.json({ error: 'Crop failed' }, { status: 500 })
  }
}
