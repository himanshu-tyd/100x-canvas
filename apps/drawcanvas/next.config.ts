import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // Ensures proper bundling
  experimental: {
  },
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;