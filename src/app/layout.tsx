import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const siteUrl = "https://howdesign.vercel.app";
const socialPreviewImage = `${siteUrl}/og-logo-preview.png`;
const siteDescription = "주식회사 하우디자인 인테리어 포트폴리오 홈페이지";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteConfig.name,
    description: siteDescription,
    url: siteUrl,
    siteName: siteConfig.brandName,
    images: [
      {
        url: socialPreviewImage,
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
    description: siteDescription,
    images: [socialPreviewImage],
  },
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
