import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  priority?: boolean;
  variant?: "header" | "footer";
  placement?: "header" | "footer" | "default";
  fallbackText?: string;
};

function getLogoSrc() {
  const transparentLogoPngPath = path.join(process.cwd(), "public", "logo-transparent.png");
  const logoSvgPath = path.join(process.cwd(), "public", "logo.svg");
  const logoPngPath = path.join(process.cwd(), "public", "logo.png");

  if (fs.existsSync(transparentLogoPngPath)) {
    const version = Math.round(fs.statSync(transparentLogoPngPath).mtimeMs);
    return `/logo-transparent.png?v=${version}`;
  }

  if (fs.existsSync(logoPngPath)) {
    const version = Math.round(fs.statSync(logoPngPath).mtimeMs);
    return `/logo.png?v=${version}`;
  }

  if (fs.existsSync(logoSvgPath)) {
    const version = Math.round(fs.statSync(logoSvgPath).mtimeMs);
    return `/logo.svg?v=${version}`;
  }

  return null;
}

export function BrandMark({
  className = "",
  imageClassName = "h-auto w-[165px] object-contain sm:w-[215px] lg:w-[235px]",
  textClassName = "text-[18px] font-normal tracking-[0.08em] sm:text-[22px]",
  priority = false,
  fallbackText = "주식회사 하우디자인",
}: BrandMarkProps) {
  const logoSrc = getLogoSrc();

  return (
    <div className={className}>
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt="주식회사 하우디자인"
          width={1254}
          height={588}
          priority={priority}
          className={imageClassName}
        />
      ) : (
        <span className={textClassName}>{fallbackText}</span>
      )}
    </div>
  );
}

export default BrandMark;
