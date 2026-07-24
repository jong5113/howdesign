import Image from "next/image";
import Link from "next/link";

import { PreviewImage } from "@/components/design-preview/preview-image";
import { getEnglishProjectName } from "@/lib/portfolio-display";
import type { PortfolioItem } from "@/lib/types";

export type PreviewMode = "desktop" | "mobile";

type ConceptSceneProps = {
  conceptSlug: string;
  mode: PreviewMode;
  projects: PortfolioItem[];
};

type ConceptHeaderProps = {
  mode: PreviewMode;
  workTarget: string;
  contactTarget: string;
  className?: string;
};

function getSceneProjects(projects: PortfolioItem[]) {
  if (projects.length === 0) {
    return [];
  }

  return Array.from({ length: 6 }, (_, index) => projects[index % projects.length]);
}

function PreviewLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/design-preview" className={`dp-logo ${compact ? "is-compact" : ""}`} aria-label="시안 목록으로 이동">
      <Image src="/logo.png" alt="HOW DESIGN" width={320} height={150} sizes={compact ? "120px" : "180px"} />
    </Link>
  );
}

function ConceptHeader({
  mode,
  workTarget,
  contactTarget,
  className = "",
}: ConceptHeaderProps) {
  return (
    <header className={`dp-concept-nav ${className}`}>
      <PreviewLogo compact={mode === "mobile"} />
      <nav aria-label="Concept navigation">
        <a href={`#${workTarget}`}>WORK</a>
        <a href={`#${contactTarget}`}>CONTACT</a>
      </nav>
    </header>
  );
}

function ProjectName({ project }: { project: PortfolioItem }) {
  const englishName = getEnglishProjectName(project) || project.slug.replaceAll("-", " ").toUpperCase();

  return (
    <>
      <strong>{englishName}</strong>
      <span>{project.title}</span>
    </>
  );
}

function ProjectFacts({ project }: { project: PortfolioItem }) {
  return (
    <span className="dp-project-facts">
      {project.location ? <span>Site. {project.location}</span> : null}
      {project.area ? <span>Area. {project.area}</span> : null}
    </span>
  );
}

function PreviewFooter({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <footer className={`dp-concept-footer is-${tone}`}>
      <span>HOW DESIGN</span>
      <span>INTERIOR DESIGN &amp; CONSTRUCTION</span>
      <span>SEOUL, KOREA</span>
    </footer>
  );
}

function EmptyScene() {
  return (
    <div className="dp-empty-scene">
      <PreviewLogo />
      <p>등록된 프로젝트 이미지를 불러오지 못했습니다.</p>
    </div>
  );
}

function ConceptOne({ mode, projects }: Omit<ConceptSceneProps, "conceptSlug">) {
  const items = getSceneProjects(projects);
  const workTarget = `${mode}-concept-1-work`;
  const contactTarget = `${mode}-concept-1-contact`;

  if (items.length === 0) {
    return <EmptyScene />;
  }

  return (
    <div className={`dp-scene dp-scene--${mode} dp-concept-1`}>
      <ConceptHeader mode={mode} workTarget={workTarget} contactTarget={contactTarget} />

      <section className="dp-c1-hero">
        <div className="dp-c1-hero__copy">
          <p className="dp-kicker">INTERIOR DESIGN &amp; CONSTRUCTION</p>
          <h1>
            Quiet spaces,
            <br />
            <em>designed to last.</em>
          </h1>
          <p className="dp-c1-hero__description">
            빛과 재료, 생활의 흐름을 세심하게 연결해 오래 머물고 싶은 공간을 만듭니다.
          </p>
          <a href={`#${workTarget}`} className="dp-text-link">
            SELECTED WORKS <span aria-hidden="true">VIEW</span>
          </a>
        </div>
        <PreviewImage
          project={items[0]}
          priority
          className="dp-c1-hero__image"
          sizes={mode === "mobile" ? "390px" : "(max-width: 1500px) 58vw, 840px"}
        />
      </section>

      <section id={workTarget} className="dp-c1-works">
        <div className="dp-section-heading">
          <div>
            <span>SELECTED WORKS</span>
            <h2>Recent spaces</h2>
          </div>
          <span>01—03</span>
        </div>
        <div className="dp-c1-work-grid">
          {items.slice(1, 4).map((project, index) => (
            <article key={`${project.slug}-${index}`} className="dp-c1-project">
              <PreviewImage
                project={project}
                className="dp-c1-project__image"
                sizes={mode === "mobile" ? "350px" : "(max-width: 1500px) 30vw, 420px"}
              />
              <div className="dp-project-copy">
                <span className="dp-project-index">0{index + 1}</span>
                <ProjectName project={project} />
                <ProjectFacts project={project} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dp-c1-philosophy">
        <p className="dp-kicker">OUR APPROACH</p>
        <blockquote>
          A calm interior begins with
          <br />
          understanding how life moves.
        </blockquote>
        <p>
          보이는 장면보다 그 안에서 이어질 일상을 먼저 생각합니다. 기능과 감성의 균형을 맞추고,
          작은 디테일까지 완성도 있게 설계합니다.
        </p>
      </section>

      <section id={contactTarget} className="dp-c1-contact">
        <span>START A PROJECT</span>
        <h2>새로운 공간에 대해 이야기해 주세요.</h2>
        <a href="mailto:howdesign@naver.com">CONTACT HOW DESIGN</a>
      </section>

      <PreviewFooter />
    </div>
  );
}

function ConceptTwo({ mode, projects }: Omit<ConceptSceneProps, "conceptSlug">) {
  const items = getSceneProjects(projects);
  const workTarget = `${mode}-concept-2-work`;
  const contactTarget = `${mode}-concept-2-contact`;

  if (items.length === 0) {
    return <EmptyScene />;
  }

  return (
    <div className={`dp-scene dp-scene--${mode} dp-concept-2`}>
      <ConceptHeader mode={mode} workTarget={workTarget} contactTarget={contactTarget} className="dp-c2-nav" />

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

      <section id={workTarget} className="dp-c2-featured">
        <div className="dp-c2-section-title">
          <p>SELECTED PROJECTS</p>
          <h2>Spaces with a distinct point of view.</h2>
          <span>DRAG / SCROLL</span>
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
                  <ProjectName project={project} />
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
            하우디자인은 주거와 상업공간의 분위기, 동선, 재료를 하나의 경험으로 설계합니다.
            절제된 디테일과 정확한 시공으로 공간의 인상을 완성합니다.
          </p>
        </div>
      </section>

      <section id={contactTarget} className="dp-c2-contact">
        <span>PROJECT INQUIRY</span>
        <h2>Let&apos;s shape the next atmosphere.</h2>
        <a href="mailto:howdesign@naver.com">HOWDESIGN@NAVER.COM</a>
      </section>

      <PreviewFooter tone="dark" />
    </div>
  );
}

function ConceptThree({ mode, projects }: Omit<ConceptSceneProps, "conceptSlug">) {
  const items = getSceneProjects(projects);
  const workTarget = `${mode}-concept-3-work`;
  const contactTarget = `${mode}-concept-3-contact`;

  if (items.length === 0) {
    return <EmptyScene />;
  }

  return (
    <div className={`dp-scene dp-scene--${mode} dp-concept-3`}>
      <div className="dp-c3-layout">
        <aside className="dp-c3-sidebar">
          <PreviewLogo compact={mode === "mobile"} />
          <nav aria-label="Concept navigation">
            <a href={`#${workTarget}`}>WORK</a>
            <a href={`#${contactTarget}`}>CONTACT</a>
          </nav>
          <p>CALM INTERIORS<br />FOR EVERYDAY LIFE</p>
          <span>SEOUL · EST. 2018</span>
        </aside>

        <div className="dp-c3-main">
          <section className="dp-c3-hero">
            <PreviewImage
              project={items[2]}
              priority
              className="dp-c3-hero__image"
              sizes={mode === "mobile" ? "390px" : "(max-width: 1500px) 76vw, 1080px"}
            />
            <div className="dp-c3-hero__caption">
              <span>FEATURED HOME · 2026</span>
              <ProjectName project={items[2]} />
              <ProjectFacts project={items[2]} />
            </div>
          </section>

          <section className="dp-c3-philosophy">
            <p className="dp-kicker">PHILOSOPHY</p>
            <h1>Warmth is found in proportion, texture and quiet light.</h1>
            <p>
              필요한 것만 남기고 재료가 가진 본래의 결을 살립니다. 편안한 비례와 자연스러운 빛이
              일상에 오래 머무는 공간을 만듭니다.
            </p>
          </section>

          <section id={workTarget} className="dp-c3-works">
            <div className="dp-section-heading">
              <div>
                <span>SELECTED WORK</span>
                <h2>Homes &amp; spaces</h2>
              </div>
              <span>VIEW ALL</span>
            </div>
            <div className="dp-c3-grid">
              {items.slice(0, 4).map((project, index) => (
                <article key={`${project.slug}-${index}`} className={index % 3 === 0 ? "is-wide" : ""}>
                  <PreviewImage
                    project={project}
                    className="dp-c3-project__image"
                    sizes={mode === "mobile" ? "350px" : index % 3 === 0 ? "55vw" : "28vw"}
                  />
                  <div className="dp-project-copy">
                    <ProjectName project={project} />
                    <ProjectFacts project={project} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id={contactTarget} className="dp-c3-contact">
            <p>BEGIN A CONVERSATION</p>
            <h2>좋은 공간은 충분한 대화에서 시작됩니다.</h2>
            <a href="mailto:howdesign@naver.com">CONTACT</a>
          </section>

          <PreviewFooter />
        </div>
      </div>
    </div>
  );
}

function ConceptFour({ mode, projects }: Omit<ConceptSceneProps, "conceptSlug">) {
  const items = getSceneProjects(projects);
  const workTarget = `${mode}-concept-4-work`;
  const contactTarget = `${mode}-concept-4-contact`;
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
      <ConceptHeader mode={mode} workTarget={workTarget} contactTarget={contactTarget} className="dp-c4-nav" />

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

      <section id={workTarget} className="dp-c4-projects">
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
              <ProjectName project={project} />
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

      <section id={contactTarget} className="dp-c4-contact">
        <span>PROJECT CONSULTATION</span>
        <h2>프로젝트 조건을 알려주시면 다음 단계를 안내해 드립니다.</h2>
        <a href="mailto:howdesign@naver.com">CONTACT HOW DESIGN</a>
      </section>

      <PreviewFooter />
    </div>
  );
}

function ConceptFive({ mode, projects }: Omit<ConceptSceneProps, "conceptSlug">) {
  const items = getSceneProjects(projects);
  const workTarget = `${mode}-concept-5-work`;
  const contactTarget = `${mode}-concept-5-contact`;

  if (items.length === 0) {
    return <EmptyScene />;
  }

  return (
    <div className={`dp-scene dp-scene--${mode} dp-concept-5`}>
      <ConceptHeader mode={mode} workTarget={workTarget} contactTarget={contactTarget} className="dp-c5-nav" />

      <section className="dp-c5-hero">
        <PreviewImage
          project={items[3]}
          priority
          className="dp-c5-hero__image"
          sizes={mode === "mobile" ? "390px" : "min(1440px, 100vw)"}
        />
        <span className="dp-c5-hero__shade" />
        <div className="dp-c5-hero__copy">
          <p>HOW DESIGN · SELECTED INTERIORS</p>
          <h1>
            Spaces made
            <br />
            to be remembered.
          </h1>
          <span>SCROLL TO DISCOVER</span>
        </div>
        <div className="dp-c5-hero__project">
          <span>01 / FEATURED</span>
          <ProjectName project={items[3]} />
        </div>
      </section>

      <section id={workTarget} className="dp-c5-projects">
        <header>
          <p>SELECTED STORIES</p>
          <h2>Each space, a distinct scene.</h2>
        </header>
        {items.slice(0, 3).map((project, index) => (
          <article key={`${project.slug}-${index}`} className="dp-c5-project">
            <PreviewImage
              project={project}
              className="dp-c5-project__image"
              sizes={mode === "mobile" ? "390px" : "min(1280px, 88vw)"}
            />
            <div className="dp-c5-project__overlay">
              <span>0{index + 1}</span>
              <ProjectName project={project} />
              <ProjectFacts project={project} />
            </div>
          </article>
        ))}
      </section>

      <section className="dp-c5-studio">
        <span>THE STUDIO</span>
        <h2>Designing the mood, detail and rhythm of a place.</h2>
        <p>
          하우디자인은 한 장면의 인상부터 실제 사용의 편안함까지 함께 설계합니다.
          컨셉과 시공 품질이 끝까지 이어지는 공간을 완성합니다.
        </p>
      </section>

      <section id={contactTarget} className="dp-c5-contact">
        <PreviewImage
          project={items[5]}
          className="dp-c5-contact__image"
          sizes={mode === "mobile" ? "390px" : "min(1440px, 100vw)"}
        />
        <span className="dp-c5-contact__shade" />
        <div>
          <p>LET&apos;S CREATE YOUR NEXT SPACE</p>
          <h2>프로젝트를 시작할 준비가 되셨나요?</h2>
          <a href="mailto:howdesign@naver.com">CONTACT HOW DESIGN</a>
        </div>
      </section>

      <PreviewFooter tone="dark" />
    </div>
  );
}

export function ConceptScene({ conceptSlug, mode, projects }: ConceptSceneProps) {
  const props = { mode, projects };

  switch (conceptSlug) {
    case "concept-1":
      return <ConceptOne {...props} />;
    case "concept-2":
      return <ConceptTwo {...props} />;
    case "concept-3":
      return <ConceptThree {...props} />;
    case "concept-4":
      return <ConceptFour {...props} />;
    case "concept-5":
      return <ConceptFive {...props} />;
    default:
      return null;
  }
}
