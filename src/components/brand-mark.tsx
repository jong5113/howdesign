import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  priority?: boolean;
  variant?: "header" | "footer";
  fallbackText?: string;
};

function getLogoSrc() {
  const logoSvgPath = path.join(process.cwd(), "public", "logo.svg");
  const logoPngPath = path.join(process.cwd(), "public", "logo.png");

  if (fs.existsSync(logoSvgPath)) {
    return "/logo.svg";
  }

  if (fs.existsSync(logoPngPath)) {
    return "/logo.png";
  }

  return null;
}

export function BrandMark({
  className = "",
  imageClassName = "h-auto w-[180px] object-contain sm:w-[240px]",
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
          width={320}
          height={120}
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
