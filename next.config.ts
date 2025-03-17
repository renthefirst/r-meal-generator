import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        port: '',
        pathname: '/**',
        hostname: 'img.clerk.com',
      },
    ],
  },
};

export default nextConfig;
