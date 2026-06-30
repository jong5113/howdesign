import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://howdesign.vercel.app"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  openGraph: {
    title: siteConfig.name,
    description: "HOW DESIGN interior design portfolio.",
    url: "https://howdesign.vercel.app",
    siteName: siteConfig.brandName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.brandName,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: "HOW DESIGN interior design portfolio.",
    images: ["/og-image.png"],
  },
  description: "주식회사 하우디자인 인테리어 포트폴리오 홈페이지",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
