import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

const navItems = [
  {
    label: "WORK",
    href: "/portfolio",
  },
  {
    label: "CONTACT",
    href: "/contact",
  },
];

export function SiteHeader() {
  return (
    <header className="px-5 py-6 sm:px-10 sm:py-7">
      <div className="mx-auto grid max-w-[1760px] justify-items-center gap-4">
        <Link href="/" aria-label="Go to home" className="inline-flex">
          <BrandMark placement="header" priority />
        </Link>
        <nav className="flex items-center justify-center gap-8 text-[13px] font-normal uppercase tracking-[0.11em] sm:text-[14px]">
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
