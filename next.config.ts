import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/admin/users",
        destination: "/admin/users/list-users",
      },
      {
        source: "/admin/events",
        destination: "/admin/events/list-events",
      },
      {
        source: "/admin/performers",
        destination: "/admin/performers/list-performers",
      },
      {
        source: "/admin/venues",
        destination: "/admin/venues/list-venues",
      },
      {
        source: "/admin/tickets",
        destination: "/admin/events/list-tickets",
      },
    ];
  },
};

export default nextConfig;
