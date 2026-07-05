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
    <header className="px-5 pb-6 pt-7 sm:px-10 sm:pb-8 sm:pt-8 lg:px-12 lg:pb-9">
      <div className="mx-auto grid max-w-[1760px] justify-items-center gap-5">
        <Link href="/" aria-label="Go to home" className="inline-flex transition-opacity duration-200 hover:opacity-75">
          <BrandMark placement="header" priority />
        </Link>
        <nav className="flex min-h-9 items-center justify-center gap-8 text-[12px] font-normal uppercase tracking-[0.14em] sm:gap-10 sm:text-[13px]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-1 py-2 underline-offset-4 transition-opacity duration-200 hover:opacity-55"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
