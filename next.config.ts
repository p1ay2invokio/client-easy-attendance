import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/maekhan/:path*',
        destination: 'http://maekhantunnel.outwittrader.com/:path*',
      },
      {
        source: '/sanpatong/:path*',
        destination: 'https://sanpatong.outwittrader.com/:path*',
      },
      {
        source: '/doilor/:path*',
        destination: 'https://doilor.outwittrader.com/:path*',
      },
    ]
  },
}

export default nextConfig;
