import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/facct-event",
        destination: "https://luma.com/r6ey1avq",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/procurement",
        destination: "/procurement/index.html",
      },
    ];
  },
};

export default nextConfig;
