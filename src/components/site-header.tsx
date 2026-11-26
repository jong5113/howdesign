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
    <header className="site-header">
      <div className="site-container site-header__inner">
        <Link href="/" aria-label="Go to home" className="site-header__brand">
          <BrandMark
            placement="header"
            priority
            sizes="(max-width: 639px) 116px, (max-width: 1023px) 140px, 154px"
            imageClassName="h-auto w-[116px] object-contain sm:w-[140px] lg:w-[154px]"
          />
        </Link>
        <nav className="site-header__nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="site-header__link"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
