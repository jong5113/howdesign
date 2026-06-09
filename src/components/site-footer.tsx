import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="px-4 py-8 text-[10px] text-muted sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2">
          <BrandMark placement="footer" />
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
        <div className="flex gap-5 uppercase tracking-wide">
          <Link href="/portfolio" className="underline-offset-4 hover:underline">
            Portfolio
          </Link>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
