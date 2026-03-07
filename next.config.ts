import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  experimental: {
    globalNotFound: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
