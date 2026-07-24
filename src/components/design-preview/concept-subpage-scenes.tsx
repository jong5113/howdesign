import Link from "next/link";

import type { PreviewMode } from "@/components/design-preview/concept-scenes";
import { PreviewImage } from "@/components/design-preview/preview-image";
import {
  ConceptNavigation,
  EmptyScene,
  PreviewFooter,
  ProjectMetadata,
  ProjectName,
} from "@/components/design-preview/scene-primitives";
import type { DesignPreviewSlug } from "@/lib/design-preview";
import { getEnglishProjectName } from "@/lib/portfolio-display";
import type { PortfolioItem } from "@/lib/types";

type ProjectSceneProps = {
  conceptSlug: DesignPreviewSlug;
  mode: PreviewMode;
  project?: PortfolioItem;
  nextProject?: PortfolioItem;
  projects: PortfolioItem[];
};

type ContactSceneProps = {
  conceptSlug: DesignPreviewSlug;
  mode: PreviewMode;
  projects: PortfolioItem[];
};

const contactDetails = [
  {
    label: "EMAIL",
    value: "jong51133@nate.com",
    href: "mailto:jong51133@nate.com",
  },
  {
    label: "PHONE",
    value: "010-9551-5113",
    href: "tel:+821095515113",
  },
  {
    label: "ADDRESS",
    value: "서울시 송파구 충민로66 가든파이브라이프 제지2층 2007호",
  },
];

function getGalleryImages(project: PortfolioItem, projects: PortfolioItem[]) {
  const candidates = [
    ...project.gallery,
    project.coverImageUrl || project.coverImage,
    ...projects.map((item) => item.coverImageUrl || item.coverImage),
  ].filter(Boolean);
  const uniqueImages = Array.from(new Set(candidates));

  if (uniqueImages.length === 0) {
    return [];
  }

  return Array.from(
    { length: Math.max(6, uniqueImages.length) },
    (_, index) => uniqueImages[index % uniqueImages.length],
  ).slice(0, 8);
}

function projectDescription(project: PortfolioItem) {
  return (
    project.description ||
    "공간의 인상과 실제 사용 경험이 자연스럽게 이어지도록 동선, 재료, 조명과 디테일을 하나의 흐름으로 설계했습니다."
  );
}

function ContactRows({ tone }: { tone: "light" | "dark" }) {
  return (
    <div className={`dp-contact-rows is-${tone}`}>
      {contactDetails.map((detail, index) => (
        <div key={detail.label} className="dp-contact-row">
          <span>0{index + 1}</span>
          <strong>{detail.label}</strong>
          {detail.href ? (
            <a href={detail.href}>{detail.value}</a>
          ) : (
            <p>{detail.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function ConceptTwoProject({
  mode,
  project,
  nextProject,
  projects,
}: Omit<ProjectSceneProps, "conceptSlug">) {
  if (!project) {
    return <EmptyScene />;
  }

  const images = getGalleryImages(project, projects);
  const englishName = getEnglishProjectName(project) || project.title;

  return (
    <div className={`dp-scene dp-scene--${mode} dp-concept-2 dp-c2-detail`}>
      <ConceptNavigation
        conceptSlug="concept-2"
        mode={mode}
        tone="dark"
        className="dp-c2-nav"
      />

      <section className="dp-c2-detail-hero">
        <PreviewImage
          project={project}
          src={images[0]}
          priority
          className="dp-c2-detail-hero__image"
          sizes={mode === "mobile" ? "390px" : "min(1440px, 100vw)"}
        />
        <span className="dp-c2-detail-hero__shade" />
        <div className="dp-c2-detail-hero__title">
          <span>PROJECT · 01</span>
          <h1>{englishName}</h1>
          <p>{project.title}</p>
        </div>
        <ProjectMetadata project={project} />
      </section>

      <section className="dp-c2-detail-intro">
        <span>PROJECT NARRATIVE</span>
        <div>
          <h2>A space composed through light, material and movement.</h2>
          <p>{projectDescription(project)}</p>
        </div>
      </section>

      <section className="dp-c2-detail-gallery">
        <header>
          <span>IMAGE SERIES</span>
          <p>01 — {String(images.length).padStart(2, "0")}</p>
        </header>
        <div className="dp-c2-detail-gallery__grid">
          {images.slice(1, 7).map((image, index) => (
            <PreviewImage
              key={`${image}-${index}`}
              project={project}
              src={image}
              className={`dp-c2-detail-gallery__image is-${index + 1}`}
              sizes={mode === "mobile" ? "390px" : index % 3 === 0 ? "70vw" : "46vw"}
            />
          ))}
        </div>
      </section>

      <section className="dp-c2-next-project">
        <span>NEXT PROJECT</span>
        {nextProject ? (
          <div>
            <ProjectName project={nextProject} />
            <Link href="/design-preview/concept-2">BACK TO SELECTED WORKS</Link>
          </div>
        ) : (
          <Link href="/design-preview/concept-2">BACK TO SELECTED WORKS</Link>
        )}
      </section>

      <PreviewFooter tone="dark" />
    </div>
  );
}

function ConceptFourProject({
  mode,
  project,
  nextProject,
  projects,
}: Omit<ProjectSceneProps, "conceptSlug">) {
  if (!project) {
    return <EmptyScene />;
  }

  const images = getGalleryImages(project, projects);
  const englishName = getEnglishProjectName(project) || project.title;

  return (
    <div className={`dp-scene dp-scene--${mode} dp-concept-4 dp-c4-detail`}>
      <ConceptNavigation
        conceptSlug="concept-4"
        mode={mode}
        className="dp-c4-nav"
      />

      <section className="dp-c4-detail-heading">
        <span>PROJECT / 01</span>
        <h1>{englishName}</h1>
        <p>{project.title}</p>
      </section>

      <ProjectMetadata project={project} />

      <PreviewImage
        project={project}
        src={images[0]}
        priority
        className="dp-c4-detail-hero"
        sizes={mode === "mobile" ? "390px" : "min(1440px, 100vw)"}
      />

      <section className="dp-c4-detail-brief">
        <span>DESIGN STATEMENT</span>
        <h2>Clear decisions, resolved in detail.</h2>
        <p>{projectDescription(project)}</p>
      </section>

      <section className="dp-c4-detail-gallery">
        <header>
          <span>PROJECT IMAGES</span>
          <span>DRAWING THE COMPLETE EXPERIENCE</span>
        </header>
        <div className="dp-c4-detail-gallery__grid">
          {images.slice(1, 7).map((image, index) => (
            <figure key={`${image}-${index}`} className={`is-${index + 1}`}>
              <PreviewImage
                project={project}
                src={image}
                className="dp-c4-detail-gallery__image"
                sizes={mode === "mobile" ? "390px" : index === 0 ? "64vw" : "32vw"}
              />
              <figcaption>0{index + 2} / INTERIOR VIEW</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="dp-c4-next-project">
        <span>NEXT PROJECT</span>
        <strong>02</strong>
        <div>
          {nextProject ? <ProjectName project={nextProject} /> : null}
          <Link href="/design-preview/concept-4">BACK TO SELECTED WORKS</Link>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}

function ConceptTwoContact({
  mode,
  projects,
}: Omit<ContactSceneProps, "conceptSlug">) {
  const imageProject = projects[1] || projects[0];

  if (!imageProject) {
    return <EmptyScene />;
  }

  return (
    <div className={`dp-scene dp-scene--${mode} dp-concept-2 dp-c2-contact-page`}>
      <ConceptNavigation
        conceptSlug="concept-2"
        mode={mode}
        tone="dark"
        className="dp-c2-nav"
      />

      <section className="dp-c2-contact-hero">
        <div>
          <span>PROJECT INQUIRY</span>
          <h1>
            Begin a
            <br />
            conversation.
          </h1>
          <p>
            공간의 목적과 일정, 예산에 관한 간단한 정보를 보내주시면 프로젝트
            가능 여부와 다음 단계를 안내해 드립니다.
          </p>
        </div>
        <PreviewImage
          project={imageProject}
          priority
          className="dp-c2-contact-hero__image"
          sizes={mode === "mobile" ? "390px" : "46vw"}
        />
      </section>

      <section className="dp-c2-contact-information">
        <header>
          <span>HOW TO REACH US</span>
          <p>SEOUL · SOUTH KOREA</p>
        </header>
        <ContactRows tone="dark" />
      </section>

      <section className="dp-c2-contact-note">
        <span>HOW DESIGN</span>
        <h2>We shape spaces with atmosphere, clarity and lasting detail.</h2>
        <a href="mailto:jong51133@nate.com">START A PROJECT</a>
      </section>

      <PreviewFooter tone="dark" />
    </div>
  );
}

function ConceptFourContact({
  mode,
  projects,
}: Omit<ContactSceneProps, "conceptSlug">) {
  const imageProject = projects[0];

  if (!imageProject) {
    return <EmptyScene />;
  }

  return (
    <div className={`dp-scene dp-scene--${mode} dp-concept-4 dp-c4-contact-page`}>
      <ConceptNavigation
        conceptSlug="concept-4"
        mode={mode}
        className="dp-c4-nav"
      />

      <section className="dp-c4-contact-heading">
        <div>
          <span>CONTACT / HOW DESIGN</span>
          <h1>Let&apos;s discuss your space.</h1>
        </div>
        <p>
          프로젝트의 용도, 위치, 예상 일정과 함께 문의해 주세요. 검토 후 상담
          가능한 일정을 안내해 드립니다.
        </p>
      </section>

      <ContactRows tone="light" />

      <section className="dp-c4-contact-image">
        <PreviewImage
          project={imageProject}
          priority
          className="dp-c4-contact-image__media"
          sizes={mode === "mobile" ? "390px" : "min(1440px, 100vw)"}
        />
        <div>
          <span>OFFICE / SEOUL</span>
          <span>INTERIOR DESIGN &amp; CONSTRUCTION</span>
        </div>
      </section>

      <section className="dp-c4-contact-process">
        <span>CONSULTATION</span>
        <div>
          <strong>01</strong>
          <p>프로젝트 기본 정보 전달</p>
        </div>
        <div>
          <strong>02</strong>
          <p>검토 및 상담 일정 안내</p>
        </div>
        <div>
          <strong>03</strong>
          <p>현장 미팅과 설계 범위 협의</p>
        </div>
      </section>

      <PreviewFooter />
    </div>
  );
}

export function ConceptProjectScene(props: ProjectSceneProps) {
  return props.conceptSlug === "concept-2" ? (
    <ConceptTwoProject {...props} />
  ) : (
    <ConceptFourProject {...props} />
  );
}

export function ConceptContactScene(props: ContactSceneProps) {
  return props.conceptSlug === "concept-2" ? (
    <ConceptTwoContact {...props} />
  ) : (
    <ConceptFourContact {...props} />
  );
}
