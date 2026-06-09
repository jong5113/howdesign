import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

const navItems = [
  { href: "/portfolio", label: "PORTFOLIO" },
  { href: "/contact", label: "CONTACT" },
];

export function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-20 w-full bg-background px-5 py-3 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-4">
        <BrandMark placement="header" />
        <nav className="flex gap-5 text-[11px] font-normal uppercase tracking-[0.09em] text-foreground sm:gap-6" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="underline-offset-4 hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
