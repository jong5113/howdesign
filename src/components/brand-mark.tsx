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
      ? "h-4 w-auto object-contain sm:h-[18px]"
      : "h-[18px] w-auto object-contain";

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
        <span className="text-[11px] font-normal">{siteConfig.name}</span>
      )}
    </Link>
  );
}
