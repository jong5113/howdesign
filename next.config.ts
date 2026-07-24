import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/logo-transparent.png",
      },
      {
        pathname: "/logo.png",
      },
      {
        pathname: "/logo.svg",
      },
      {
        pathname: "/contact-hero.png",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
