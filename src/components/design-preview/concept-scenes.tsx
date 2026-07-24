import Link from "next/link";

import { PreviewImage } from "@/components/design-preview/preview-image";
import {
  ConceptNavigation,
  EmptyScene,
  PreviewFooter,
  ProjectFacts,
  ProjectName,
} from "@/components/design-preview/scene-primitives";
import type { DesignPreviewSlug } from "@/lib/design-preview";
import type { PortfolioItem } from "@/lib/types";

export type PreviewMode = "desktop" | "mobile";

type ConceptSceneProps = {
  conceptSlug: DesignPreviewSlug;
  mode: PreviewMode;
  projects: PortfolioItem[];
};

function getSceneProjects(projects: PortfolioItem[]) {
  if (projects.length === 0) {
    return [];
  }

  return Array.from({ length: 6 }, (_, index) => projects[index % projects.length]);
}

function ConceptTwo({ mode, projects }: Omit<ConceptSceneProps, "conceptSlug">) {
  const items = getSceneProjects(projects);

  if (items.length === 0) {
    return <EmptyScene />;
  }

  return (
    <div className={`dp-scene dp-scene--${mode} dp-concept-2`}>
      <ConceptNavigation
        conceptSlug="concept-2"
        mode={mode}
        tone="dark"
        className="dp-c2-nav"
      />

      <section className="dp-c2-hero">
        <PreviewImage
          project={items[1]}
          priority
          className="dp-c2-hero__image"
          sizes={mode === "mobile" ? "390px" : "min(1440px, 100vw)"}
        />
        <span className="dp-c2-hero__shade" />
        <div className="dp-c2-hero__copy">
          <p>HOW DESIGN · SEOUL</p>
          <h1>
            Interiors
            <br />
            with atmosphere.
          </h1>
          <div>
            <span>RESIDENTIAL</span>
            <span>COMMERCIAL</span>
            <span>CONSTRUCTION</span>
          </div>
        </div>
        <div className="dp-c2-hero__project">
          <span>FEATURED · 01</span>
          <ProjectName project={items[1]} />
        </div>
      </section>

      <section className="dp-c2-featured">
        <div className="dp-c2-section-title">
          <p>SELECTED PROJECTS</p>
          <h2>Spaces with a distinct point of view.</h2>
          <span>SCROLL TO EXPLORE</span>
        </div>
        <div className="dp-c2-project-track">
          {items.slice(0, 4).map((project, index) => (
            <article key={`${project.slug}-${index}`} className="dp-c2-project">
              <PreviewImage
                project={project}
                className="dp-c2-project__image"
                sizes={mode === "mobile" ? "350px" : "(max-width: 1500px) 37vw, 530px"}
              />
              <div className="dp-c2-project__copy">
                <span>0{index + 1}</span>
                <div>
                  <Link href="/design-preview/concept-2/project">
                    <ProjectName project={project} />
                  </Link>
                </div>
                <ProjectFacts project={project} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dp-c2-studio">
        <p>THE STUDIO</p>
        <div>
          <h2>Every project begins with a sense of place.</h2>
          <p>
            하우디자인은 주거와 상업공간의 분위기, 동선, 재료를 하나의 경험으로
            설계합니다. 절제된 디테일과 정확한 시공으로 공간의 인상을 완성합니다.
          </p>
        </div>
      </section>

      <section className="dp-c2-contact">
        <span>PROJECT INQUIRY</span>
        <h2>Let&apos;s shape the next atmosphere.</h2>
        <Link href="/design-preview/concept-2/contact">CONTACT HOW DESIGN</Link>
      </section>

      <PreviewFooter tone="dark" />
    </div>
  );
}

function ConceptFour({ mode, projects }: Omit<ConceptSceneProps, "conceptSlug">) {
  const items = getSceneProjects(projects);
  const process = [
    ["01", "DISCOVER", "공간의 목적과 사용 방식을 정리합니다."],
    ["02", "PLAN", "동선과 예산, 일정을 구체화합니다."],
    ["03", "DESIGN", "재료와 디테일을 설계합니다."],
    ["04", "BUILD", "정확한 공정으로 구현합니다."],
    ["05", "COMPLETE", "마감과 사용성을 점검합니다."],
  ];

  if (items.length === 0) {
    return <EmptyScene />;
  }

  return (
    <div className={`dp-scene dp-scene--${mode} dp-concept-4`}>
      <ConceptNavigation
        conceptSlug="concept-4"
        mode={mode}
        className="dp-c4-nav"
      />

      <section className="dp-c4-intro">
        <div>
          <p>HOW DESIGN / INTERIOR ARCHITECTURE</p>
          <h1>Space, resolved with clarity.</h1>
        </div>
        <p>
          공간의 조건을 분석하고 설계와 시공을 하나의 기준으로 관리합니다.
          명확한 정보와 디테일로 신뢰할 수 있는 결과를 만듭니다.
        </p>
      </section>

      <section className="dp-c4-hero">
        <div className="dp-c4-hero__index">
          <span>FEATURED PROJECT</span>
          <strong>01</strong>
          <ProjectName project={items[0]} />
          <ProjectFacts project={items[0]} />
        </div>
        <PreviewImage
          project={items[0]}
          priority
          className="dp-c4-hero__image"
          sizes={mode === "mobile" ? "390px" : "(max-width: 1500px) 64vw, 920px"}
        />
      </section>

      <section className="dp-c4-projects">
        <div className="dp-c4-label-row">
          <span>NO.</span>
          <span>PROJECT</span>
          <span>TYPE</span>
          <span>INFORMATION</span>
          <span>IMAGE</span>
        </div>
        {items.slice(1, 5).map((project, index) => (
          <article key={`${project.slug}-${index}`} className="dp-c4-project-row">
            <span className="dp-c4-project-row__number">0{index + 2}</span>
            <div className="dp-c4-project-row__name">
              <Link href="/design-preview/concept-4/project">
                <ProjectName project={project} />
              </Link>
            </div>
            <span>{project.category.toUpperCase()}</span>
            <ProjectFacts project={project} />
            <PreviewImage
              project={project}
              className="dp-c4-project-row__image"
              sizes={mode === "mobile" ? "350px" : "260px"}
            />
          </article>
        ))}
      </section>

      <section className="dp-c4-process">
        <div className="dp-section-heading">
          <div>
            <span>PROCESS</span>
            <h2>From brief to completion</h2>
          </div>
          <span>01—05</span>
        </div>
        <div className="dp-c4-process-grid">
          {process.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dp-c4-contact">
        <span>PROJECT CONSULTATION</span>
        <h2>프로젝트 조건을 알려주시면 다음 단계를 안내해 드립니다.</h2>
        <Link href="/design-preview/concept-4/contact">CONTACT HOW DESIGN</Link>
      </section>

      <PreviewFooter />
    </div>
  );
}

export function ConceptScene({ conceptSlug, mode, projects }: ConceptSceneProps) {
  switch (conceptSlug) {
    case "concept-2":
      return <ConceptTwo mode={mode} projects={projects} />;
    case "concept-4":
      return <ConceptFour mode={mode} projects={projects} />;
  }
}
