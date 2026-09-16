import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      { source: "/usage", destination: "/meta", permanent: true },
      { source: "/usage/:id", destination: "/meta?mon=:id", permanent: false },
      { source: "/learn/battles", destination: "/learn/preview", permanent: true },
      { source: "/learn/first-team", destination: "/learn/building", permanent: true },
      { source: "/learn/stats", destination: "/learn/speed", permanent: true },
      { source: "/learn/mega", destination: "/learn/roles/mega", permanent: true },
      { source: "/learn/vp", destination: "/learn", permanent: true },
      { source: "/learn/the-format", destination: "/learn/the-fight", permanent: true },
      { source: "/learn/turn-economy", destination: "/learn/turns", permanent: true },
      { source: "/learn/matchups", destination: "/learn/holes", permanent: true },
      { source: "/learn/items", destination: "/learn/training", permanent: true },
      { source: "/learn/evs", destination: "/learn/training", permanent: true },
      { source: "/learn/team-roles", destination: "/learn/jobs", permanent: true },
      { source: "/learn/team-building", destination: "/learn/building", permanent: true },
      { source: "/learn/playstyles", destination: "/learn/archetypes", permanent: true },
      { source: "/learn/speed-control", destination: "/learn/speed", permanent: true },
      { source: "/learn/archetypes/:id", destination: "/team/archetypes/:id", permanent: false },
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
