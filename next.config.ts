import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow images from external domains used in the app
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dolarapi.com" },
      { protocol: "https", hostname: "api.argentinadatos.com" },
    ],
  },
};

export default nextConfig;
