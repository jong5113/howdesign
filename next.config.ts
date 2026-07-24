import type { NextConfig } from "next";

function getSupabaseHostname() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return null;
  }

  try {
    const url = new URL(supabaseUrl);

    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co")
      ? url.hostname
      : null;
  } catch {
    return null;
  }
}

const supabaseHostname = getSupabaseHostname();

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
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
