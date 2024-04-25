/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  env: {
    GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'cdn.shopify.com',
      'encrypted-tbn0.gstatic.com',
      'dev.reactml.carbonmint.com',
      'dev.poultry.carbonmint.com',
      'organova.carbonmint.com',
      'agrinet.carbonmint.com',
      'agriinverse.carbonmint.com',
      'gramonnati.carbonmint.com',
      'annamrit.carbonmint.com',
      'aurick.carbonmint.com',
      'avalon.carbonmint.com',
      'greenbliss.carbonmint.com',
      'moringa.carbonmint.com',
      'tuvai.carbonmint.com',
      'samruddhi.carbonmint.com',
      'saytrees.carbonmint.com',
      'licious.carbonmint.com',
        'carbonmint.com',
        'localhost'
    ],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

const analyzerConfig = {
  enabled: process.env.ANALYZE === 'true',
};

const withBundleAnalyzer = require('@next/bundle-analyzer')(analyzerConfig);
module.exports = withBundleAnalyzer(nextConfig);


