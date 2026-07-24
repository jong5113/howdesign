import Link from "next/link";

import { ConceptScene } from "@/components/design-preview/concept-scenes";
import {
  ConceptContactScene,
  ConceptProjectScene,
} from "@/components/design-preview/concept-subpage-scenes";
import {
  designPreviewConcepts,
  designPreviewPageCopy,
  getDesignPreviewPagePath,
  type DesignPreviewConcept,
  type DesignPreviewPageKind,
} from "@/lib/design-preview";
import type { PortfolioItem } from "@/lib/types";

type ConceptPreviewPageProps = {
  concept: DesignPreviewConcept;
  pageKind?: DesignPreviewPageKind;
  projects: PortfolioItem[];
  project?: PortfolioItem;
  nextProject?: PortfolioItem;
};

function PreviewScene({
  concept,
  pageKind,
  mode,
  projects,
  project,
  nextProject,
}: Required<Pick<ConceptPreviewPageProps, "concept" | "pageKind" | "projects">> & {
  mode: "desktop" | "mobile";
  project?: PortfolioItem;
  nextProject?: PortfolioItem;
}) {
  if (pageKind === "project") {
    return (
      <ConceptProjectScene
        conceptSlug={concept.slug}
        mode={mode}
        projects={projects}
        project={project}
        nextProject={nextProject}
      />
    );
  }

  if (pageKind === "contact") {
    return (
      <ConceptContactScene
        conceptSlug={concept.slug}
        mode={mode}
        projects={projects}
      />
    );
  }

  return (
    <ConceptScene
      conceptSlug={concept.slug}
      mode={mode}
      projects={projects}
    />
  );
}

export function ConceptPreviewPage({
  concept,
  pageKind = "home",
  projects,
  project,
  nextProject,
}: ConceptPreviewPageProps) {
  const pageCopy = designPreviewPageCopy[pageKind];
  const otherConcept =
    designPreviewConcepts.find((item) => item.slug !== concept.slug) || concept;
  const otherConceptPath = getDesignPreviewPagePath(otherConcept.slug, pageKind);

  return (
    <div className="dp-detail">
      <nav className="dp-detail__topbar" aria-label="디자인 시안 이동">
        <Link href="/design-preview">ALL CONCEPTS</Link>
        <div className="dp-detail__page-links">
          <Link href={`/design-preview/${concept.slug}`}>HOME</Link>
          <Link href={`/design-preview/${concept.slug}/project`}>PROJECT DETAIL</Link>
          <Link href={`/design-preview/${concept.slug}/contact`}>CONTACT</Link>
        </div>
        <span>{concept.number} / SELECTED</span>
      </nav>

      <header className="dp-detail__intro">
        <span>
          CONCEPT {concept.number} / {pageCopy.label}
        </span>
        <h1>
          {concept.name}
          <small>{pageCopy.title}</small>
        </h1>
        <p>{pageCopy.description}</p>
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
          <PreviewScene
            concept={concept}
            pageKind={pageKind}
            mode="desktop"
            projects={projects}
            project={project}
            nextProject={nextProject}
          />
        </div>
      </section>

      <section
        id="mobile-preview"
        className="dp-preview-section dp-preview-section--mobile"
      >
        <div className="dp-preview-section__heading">
          <div>
            <span>MOBILE PREVIEW</span>
            <h2>390px layout</h2>
          </div>
          <p>실제 모바일 화면처럼 프레임 내부를 세로로 스크롤할 수 있습니다.</p>
        </div>
        <div className="dp-mobile-stage">
          <div className="dp-preview-window dp-preview-window--mobile">
            <PreviewScene
              concept={concept}
              pageKind={pageKind}
              mode="mobile"
              projects={projects}
              project={project}
              nextProject={nextProject}
            />
          </div>
        </div>
      </section>

      <nav className="dp-detail__bottom-nav" aria-label="다른 시안과 비교">
        <Link href="/design-preview">
          <span>PREVIEW LIST</span>
          <strong>Selected concepts</strong>
        </Link>
        <Link href={otherConceptPath}>
          <span>COMPARE THIS PAGE</span>
          <strong>{otherConcept.name}</strong>
        </Link>
      </nav>
    </div>
  );
}
