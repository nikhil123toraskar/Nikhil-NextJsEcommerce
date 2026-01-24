import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "www.berrylush.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
    ],
  },

  webpack: (config) => {
    config.resolve.alias["@ai"] = path.resolve(process.cwd(), "ai");
    return config;
  },
};

export default nextConfig;
