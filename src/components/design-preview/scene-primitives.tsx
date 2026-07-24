import Image from "next/image";
import Link from "next/link";

import type { PreviewMode } from "@/components/design-preview/concept-scenes";
import type { DesignPreviewSlug } from "@/lib/design-preview";
import { getEnglishProjectName } from "@/lib/portfolio-display";
import type { PortfolioItem } from "@/lib/types";

type ConceptNavigationProps = {
  conceptSlug: DesignPreviewSlug;
  mode: PreviewMode;
  tone?: "light" | "dark";
  className?: string;
};

export function PreviewLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/design-preview"
      className={`dp-logo ${compact ? "is-compact" : ""}`}
      aria-label="디자인 시안 목록으로 이동"
    >
      <Image
        src="/logo.png"
        alt="HOW DESIGN"
        width={320}
        height={150}
        sizes={compact ? "120px" : "180px"}
      />
    </Link>
  );
}

export function ConceptNavigation({
  conceptSlug,
  mode,
  tone = "light",
  className = "",
}: ConceptNavigationProps) {
  return (
    <header className={`dp-concept-nav dp-preview-site-nav is-${tone} ${className}`}>
      <PreviewLogo compact={mode === "mobile"} />
      <nav aria-label={`${conceptSlug} preview navigation`}>
        <Link href={`/design-preview/${conceptSlug}`}>HOME</Link>
        <Link href={`/design-preview/${conceptSlug}/project`}>PROJECT</Link>
        <Link href={`/design-preview/${conceptSlug}/contact`}>CONTACT</Link>
      </nav>
    </header>
  );
}

export function ProjectName({ project }: { project: PortfolioItem }) {
  const englishName =
    getEnglishProjectName(project) ||
    project.slug.replaceAll("-", " ").toUpperCase();

  return (
    <>
      <strong>{englishName}</strong>
      <span>{project.title}</span>
    </>
  );
}

export function ProjectFacts({ project }: { project: PortfolioItem }) {
  return (
    <span className="dp-project-facts">
      {project.location ? <span>Site. {project.location}</span> : null}
      {project.area ? <span>Area. {project.area}</span> : null}
    </span>
  );
}

export function ProjectMetadata({ project }: { project: PortfolioItem }) {
  const facts = [
    ["LOCATION", project.location || "Seoul"],
    ["AREA", project.area || "—"],
    ["TYPE", project.category.toUpperCase()],
    ["COMPLETED", project.year || project.duration || "—"],
  ];

  return (
    <dl className="dp-project-metadata">
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PreviewFooter({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  return (
    <footer className={`dp-concept-footer is-${tone}`}>
      <span>HOW DESIGN</span>
      <span>INTERIOR DESIGN &amp; CONSTRUCTION</span>
      <Link href="/design-preview">BACK TO PREVIEW LIST</Link>
    </footer>
  );
}

export function EmptyScene() {
  return (
    <div className="dp-empty-scene">
      <PreviewLogo />
      <p>등록된 프로젝트 이미지를 불러오지 못했습니다.</p>
    </div>
  );
}
