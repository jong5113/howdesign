import Link from "next/link";

import { PortfolioMedia } from "@/components/portfolio-media";
import { PortfolioGrid } from "@/components/portfolio-grid";
import {
  getAreaLine,
  getEnglishProjectName,
  getProjectTitleLine,
  getSiteLine,
} from "@/lib/portfolio-display";
import { getFeaturedPortfolios } from "@/lib/portfolio";

export const revalidate = 600;

export default async function HomePage() {
  const featuredPortfolios = await getFeaturedPortfolios();
  const featuredProject = featuredPortfolios[0];
  const selectedProjects = featuredPortfolios.slice(1, 7);
  const process = [
    ["01", "Planning", "공간의 목적과 사용 방식, 일정과 예산을 함께 정리합니다."],
    ["02", "Design", "동선과 재료, 빛의 균형을 구체적인 설계로 발전시킵니다."],
    ["03", "Construction", "설계 의도를 지키며 정확한 공정과 품질을 관리합니다."],
    ["04", "Completion", "마감과 사용성을 점검하고 완성된 공간을 인도합니다."],
  ];

  return (
    <div className="public-shell">
      <section className="home-intro site-container">
        <div>
          <p className="architecture-label">HOW DESIGN / INTERIOR ARCHITECTURE</p>
          <h1>
            Space, resolved
            <br />
            with clarity.
          </h1>
        </div>
        <p className="home-intro__statement">
          공간의 조건을 분석하고 설계와 시공을 하나의 기준으로 관리합니다.
          명확한 정보와 세심한 디테일로 오래 신뢰할 수 있는 공간을 만듭니다.
        </p>
      </section>

      {featuredProject ? (
        <section className="home-feature site-container">
          <div className="home-feature__information">
            <p className="architecture-label">Featured project</p>
            <strong className="home-feature__number">01</strong>
            <div>
              <p className="home-feature__name">
                {getEnglishProjectName(featuredProject) || featuredProject.title}
              </p>
              {getEnglishProjectName(featuredProject) ? <p>{featuredProject.title}</p> : null}
              <div className="home-feature__facts">
                {getSiteLine(featuredProject) ? <p>{getSiteLine(featuredProject)}</p> : null}
                {getAreaLine(featuredProject) ? <p>{getAreaLine(featuredProject)}</p> : null}
              </div>
            </div>
          </div>
          <Link
            href={`/portfolio/${featuredProject.slug}`}
            className="home-feature__link"
            aria-label={`View ${getProjectTitleLine(featuredProject)}`}
          >
            <PortfolioMedia
              src={featuredProject.coverImageUrl || featuredProject.coverImage}
              alt={getProjectTitleLine(featuredProject)}
              objectPosition={featuredProject.coverObjectPosition}
              priority
              sizes="(max-width: 767px) 100vw, 68vw"
              className="home-feature__media"
            />
          </Link>
        </section>
      ) : null}

      <section className="home-works site-container">
        <header className="architecture-section-heading">
          <div>
            <p className="architecture-label">Selected works</p>
            <h2>Recent projects</h2>
          </div>
          <Link href="/portfolio">View all work</Link>
        </header>
        <PortfolioGrid
          items={selectedProjects.length > 0 ? selectedProjects : featuredPortfolios}
          startIndex={selectedProjects.length > 0 ? 1 : 0}
        />
      </section>

      <section className="home-process site-container">
        <header className="architecture-section-heading">
          <div>
            <p className="architecture-label">Process</p>
            <h2>From brief to completion</h2>
          </div>
          <p>01 - 04</p>
        </header>
        <div className="home-process__grid">
          {process.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-contact">
        <div className="site-container home-contact__inner">
          <p className="architecture-label">Project consultation</p>
          <h2>
            공간의 조건과 계획을 알려주시면
            <br />
            다음 단계를 안내해 드립니다.
          </h2>
          <Link href="/contact">Contact HOW DESIGN</Link>
        </div>
      </section>
    </div>
  );
}
