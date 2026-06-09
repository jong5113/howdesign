import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="px-5 py-8 text-[10px] text-muted sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1.5">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
        <div className="flex gap-5 uppercase tracking-[0.09em]">
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
