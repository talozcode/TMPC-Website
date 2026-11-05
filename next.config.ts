import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // 60 is for the before/after card streams: busy site photographs that AVIF
    // at 75 renders heavier than WebP. Only values listed here are allowed.
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kzzdyfnmtyiccehfisup.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
