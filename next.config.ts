import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/maekhan/:path*',
        destination: 'http://maekhan2020.duckdns.org:3001/:path*',
      },
      {
        source: '/sanpatong/:path*',
        destination: 'http://sanpatongddns.duckdns.org:3001/:path*',
      },
      {
        source: '/doilor/:path*',
        destination: 'http://doilorddns.duckdns.org:3001/:path*',
      },
    ]
  },
}

export default nextConfig;
