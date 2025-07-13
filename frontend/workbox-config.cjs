module.exports = {
  globDirectory: 'dist/',
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff2, avif}'
  ],
  swDest: 'dist/sw.js',
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-cache',
      }
    },
    {
      urlPattern: ({ request }) =>
        request.destination === 'style' || request.destination === 'script',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      }
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
      }
    }
  ]
};
