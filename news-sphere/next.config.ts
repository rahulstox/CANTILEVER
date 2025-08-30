/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // This allows all secure domains
        hostname: "**",
      },
      {
        protocol: "http", // <-- ADD THIS to allow all insecure domains
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
