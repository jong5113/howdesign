import Link from "next/link";

import { ConceptScene } from "@/components/design-preview/concept-scenes";
import { designPreviewConcepts, type DesignPreviewConcept } from "@/lib/design-preview";
import type { PortfolioItem } from "@/lib/types";

type ConceptPreviewPageProps = {
  concept: DesignPreviewConcept;
  projects: PortfolioItem[];
};

export function ConceptPreviewPage({ concept, projects }: ConceptPreviewPageProps) {
  const currentIndex = designPreviewConcepts.findIndex((item) => item.slug === concept.slug);
  const previous = designPreviewConcepts[(currentIndex - 1 + designPreviewConcepts.length) % designPreviewConcepts.length];
  const next = designPreviewConcepts[(currentIndex + 1) % designPreviewConcepts.length];

  return (
    <div className="dp-detail">
      <nav className="dp-detail__topbar" aria-label="시안 이동">
        <Link href="/design-preview">ALL CONCEPTS</Link>
        <div>
          <Link href={`/design-preview/${previous.slug}`} aria-label={`이전 시안: ${previous.name}`}>
            PREV
          </Link>
          <span>{concept.number} / 05</span>
          <Link href={`/design-preview/${next.slug}`} aria-label={`다음 시안: ${next.name}`}>
            NEXT
          </Link>
        </div>
      </nav>

      <header className="dp-detail__intro">
        <span>CONCEPT {concept.number}</span>
        <h1>{concept.name}</h1>
        <p>“{concept.description}”</p>
        <small>REFERENCE MOOD · {concept.benchmark}</small>
      </header>

      <section id="desktop-preview" className="dp-preview-section">
        <div className="dp-preview-section__heading">
          <div>
            <span>DESKTOP PREVIEW</span>
            <h2>1440px layout</h2>
          </div>
          <p>프레임 안에서 세로로 스크롤해 전체 구성을 확인할 수 있습니다.</p>
        </div>
        <div className="dp-preview-window dp-preview-window--desktop">
          <ConceptScene conceptSlug={concept.slug} mode="desktop" projects={projects} />
        </div>
      </section>

      <section id="mobile-preview" className="dp-preview-section dp-preview-section--mobile">
        <div className="dp-preview-section__heading">
          <div>
            <span>MOBILE PREVIEW</span>
            <h2>390px layout</h2>
          </div>
          <p>실제 모바일 흐름처럼 프레임 내부를 세로로 스크롤할 수 있습니다.</p>
        </div>
        <div className="dp-mobile-stage">
          <div className="dp-preview-window dp-preview-window--mobile">
            <ConceptScene conceptSlug={concept.slug} mode="mobile" projects={projects} />
          </div>
        </div>
      </section>

      <nav className="dp-detail__bottom-nav" aria-label="다른 시안 보기">
        <Link href={`/design-preview/${previous.slug}`}>
          <span>PREVIOUS</span>
          <strong>{previous.name}</strong>
        </Link>
        <Link href={`/design-preview/${next.slug}`}>
          <span>NEXT</span>
          <strong>{next.name}</strong>
        </Link>
      </nav>
    </div>
  );
}
