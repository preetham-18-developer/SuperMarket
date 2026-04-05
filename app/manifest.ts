import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BlinkStore Supermarket — Premium Grocery SaaS',
    short_name: 'BlinkStore',
    description: 'Ultra-fast, zero-lag supermarket delivery platform with high-concurrency support.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8F0',
    theme_color: '#FF6B00',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '192x192',
        type: 'image/x-icon',
        purpose: 'any',
      },
      {
        src: '/favicon.ico',
        sizes: '512x512',
        type: 'image/x-icon',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'My Orders',
        short_name: 'Orders',
        url: '/orders',
        icons: [{ src: '/favicon.ico', sizes: '192x192' }],
      },
      {
        name: 'Top Deals',
        short_name: 'Deals',
        url: '/products?tag=deals',
        icons: [{ src: '/favicon.ico', sizes: '192x192' }],
      },
    ],
  }
}
