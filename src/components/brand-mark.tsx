import { existsSync } from "node:fs";
import { join } from "node:path";

import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

type BrandMarkProps = {
  placement: "header" | "footer";
};

function getLogoPath() {
  const publicPath = join(process.cwd(), "public");

  if (existsSync(join(publicPath, "logo.svg"))) {
    return "/logo.svg";
  }

  if (existsSync(join(publicPath, "logo.png"))) {
    return "/logo.png";
  }

  return null;
}

export function BrandMark({ placement }: BrandMarkProps) {
  const logoPath = getLogoPath();
  const logoClassName =
    placement === "header"
      ? "h-auto w-[92px] object-contain sm:w-[118px]"
      : "h-auto w-[76px] object-contain";

  return (
    <Link href="/" className="inline-flex items-center">
      {logoPath ? (
        <Image
          src={logoPath}
          alt={siteConfig.name}
          width={355}
          height={204}
          className={logoClassName}
          priority={placement === "header"}
        />
      ) : (
        <span className="text-[12px] font-normal tracking-tight">{siteConfig.name}</span>
      )}
    </Link>
  );
}
