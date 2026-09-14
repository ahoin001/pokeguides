import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      { source: "/learn/battles", destination: "/learn/preview", permanent: true },
      { source: "/learn/types", destination: "/types", permanent: true },
      { source: "/learn/first-team", destination: "/learn/building", permanent: true },
      { source: "/learn/stats", destination: "/learn/speed", permanent: true },
      { source: "/learn/mega", destination: "/learn/roles/mega", permanent: true },
      { source: "/learn/vp", destination: "/learn", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/**",
      },
    ],
  },
};

export default nextConfig;
