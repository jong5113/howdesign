import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import "./design-preview.css";

const previewSans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--dp-font-sans",
  display: "swap",
});

const previewSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--dp-font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Renewal Design Preview",
  description: "HOW DESIGN 리뉴얼 최종 후보 2종 비교 페이지",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignPreviewLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className={`${previewSans.variable} ${previewSerif.variable} dp-root`}>
      {children}
    </div>
  );
}
