/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{
      protocol: 'https',
      hostname: '*',
    }]
  },
  experimental: {
    ppr: 'incremental'
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
