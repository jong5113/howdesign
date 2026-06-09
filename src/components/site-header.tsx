import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

const navItems = [
  { href: "/portfolio", label: "PORTFOLIO" },
  { href: "/contact", label: "CONTACT" },
];

export function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-20 w-full bg-background px-4 py-2.5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-4">
        <BrandMark placement="header" />
        <nav className="flex gap-5 text-[10px] font-normal uppercase tracking-wide" aria-label="주요 메뉴">
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
