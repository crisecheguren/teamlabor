/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  
  // Enable experimental features if needed
  experimental: {
    // serverComponentsExternalPackages: ["@prisma/client"],
  },

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
