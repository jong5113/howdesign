import Link from "next/link";

import { PreviewImage } from "@/components/design-preview/preview-image";
import { designPreviewConcepts } from "@/lib/design-preview";
import type { PortfolioItem } from "@/lib/types";

type DesignPreviewIndexProps = {
  projects: PortfolioItem[];
};

export function DesignPreviewIndex({ projects }: DesignPreviewIndexProps) {
  return (
    <div className="dp-index">
      <header className="dp-index__intro">
        <div>
          <p>HOW DESIGN · RENEWAL STUDY</p>
          <h1>Five directions for the next HOW DESIGN.</h1>
        </div>
        <p>
          운영 사이트와 분리된 디자인 검토용 페이지입니다. 실제 프로젝트 이미지와 정보를 사용해
          서로 다른 다섯 가지 방향을 PC와 모바일 화면으로 비교할 수 있습니다.
        </p>
      </header>

      <div className="dp-index__guide">
        <span>5 CONCEPTS</span>
        <span>DESKTOP · 1440</span>
        <span>MOBILE · 390</span>
        <span>LIVE PORTFOLIO DATA</span>
      </div>

      <section className="dp-index__grid" aria-label="디자인 시안 목록">
        {designPreviewConcepts.map((concept, index) => {
          const project = projects[index % Math.max(projects.length, 1)];

          return (
            <article key={concept.slug} className={`dp-index-card dp-index-card--${concept.slug}`}>
              <Link href={`/design-preview/${concept.slug}`} className="dp-index-card__visual">
                {project ? (
                  <PreviewImage
                    project={project}
                    className="dp-index-card__image"
                    sizes="(max-width: 760px) 100vw, 46vw"
                    priority={index < 2}
                  />
                ) : (
                  <span className="dp-index-card__placeholder" />
                )}
                <span className="dp-index-card__veil" />
                <span className="dp-index-card__number">{concept.number}</span>
                <span className="dp-index-card__name">{concept.name}</span>
              </Link>

              <div className="dp-index-card__body">
                <p>{concept.description}</p>
                <span>{concept.benchmark}</span>
                <div className="dp-index-card__actions">
                  <Link href={`/design-preview/${concept.slug}#desktop-preview`}>PC 보기</Link>
                  <Link href={`/design-preview/${concept.slug}#mobile-preview`}>모바일 보기</Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
