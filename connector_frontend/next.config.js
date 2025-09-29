/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["swr", "clsx"]
  },
  images: {
    remotePatterns: []
  }
};

module.exports = nextConfig;
