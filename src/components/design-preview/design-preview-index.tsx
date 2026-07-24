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
          <p>HOW DESIGN · FINAL DIRECTION STUDY</p>
          <h1>Two selected directions for the next HOW DESIGN.</h1>
        </div>
        <p>
          선택한 두 가지 리뉴얼 방향을 홈, 프로젝트 상세, CONTACT 화면까지
          확장했습니다. 실제 포트폴리오 데이터로 PC와 모바일 구성을 비교할 수
          있습니다.
        </p>
      </header>

      <div className="dp-index__guide">
        <span>2 SELECTED CONCEPTS</span>
        <span>3 PAGES EACH</span>
        <span>DESKTOP · 1440</span>
        <span>MOBILE · 390</span>
      </div>

      <section className="dp-index__grid" aria-label="선택한 디자인 시안 목록">
        {designPreviewConcepts.map((concept, index) => {
          const imageIndex = concept.slug === "concept-2" ? 1 : 0;
          const project =
            projects[imageIndex % Math.max(projects.length, 1)] || projects[index];

          return (
            <article
              key={concept.slug}
              className={`dp-index-card dp-index-card--${concept.slug}`}
            >
              <Link
                href={`/design-preview/${concept.slug}`}
                className="dp-index-card__visual"
              >
                {project ? (
                  <PreviewImage
                    project={project}
                    className="dp-index-card__image"
                    sizes="(max-width: 760px) 100vw, 46vw"
                    priority
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
                  <Link href={`/design-preview/${concept.slug}`}>HOME PREVIEW</Link>
                  <Link href={`/design-preview/${concept.slug}/project`}>
                    PROJECT DETAIL
                  </Link>
                  <Link href={`/design-preview/${concept.slug}/contact`}>
                    CONTACT
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
