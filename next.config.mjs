/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [{
      hostname: "github.com"
    }]
  },
  experimental: {
    webpackBuildWorker: true,
  },
}

export default nextConfig
