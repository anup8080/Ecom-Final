/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow loading images from our own public directory and uploaded
    // endpoints on the backend.  Adjust domains as necessary when
    // deploying to production.
    domains: [],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;