import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectLightboxGallery } from "@/components/project-lightbox-gallery";
import { getPortfolioBySlug } from "@/lib/portfolio";
import { getDetailInfoRows, getEnglishProjectName } from "@/lib/portfolio-display";

export const revalidate = 600;

type PortfolioDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  return {
    title: portfolio?.title || "Portfolio Detail",
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  const coverImage = portfolio.coverImageUrl || portfolio.coverImage;
  const detailRows = getDetailInfoRows(portfolio);
  const englishName = getEnglishProjectName(portfolio) || portfolio.title;
  const galleryImages = [coverImage, ...portfolio.gallery]
    .filter(Boolean)
    .filter((image, index, images) => images.indexOf(image) === index);

  return (
    <div className="public-shell project-page">
      <article>
        <header className="project-heading site-container">
          <p className="architecture-label">Project / {portfolio.category}</p>
          <h1>{englishName}</h1>
          <p>{englishName !== portfolio.title ? portfolio.title : portfolio.category}</p>
        </header>

        <section className="project-metadata site-container" aria-label="Project information">
          <div>
            <span>Type</span>
            <p>{portfolio.category}</p>
          </div>
          <div>
            <span>Location</span>
            <p>{portfolio.location || "-"}</p>
          </div>
          <div>
            <span>Area</span>
            <p>{portfolio.area || "-"}</p>
          </div>
          <div>
            <span>Date</span>
            <p>{portfolio.year || "-"}</p>
          </div>
        </section>

        <ProjectLightboxGallery
          images={galleryImages.map((image, index) => ({
            src: image,
            alt: `${portfolio.title} image ${index + 1}`,
          }))}
          className="project-architecture-gallery"
          afterFirst={
            <section key="project-information" className="project-detail-information site-container">
              <div>
                <p className="architecture-label">Project information</p>
                <h2>Clear decisions, resolved in detail.</h2>
              </div>
              <div className="project-detail-information__rows">
                {detailRows.map((row) => (
                  <div key={row.label}>
                    <p>{row.label}</p>
                    <p>{row.value}</p>
                  </div>
                ))}
              </div>
            </section>
          }
        />

        <footer className="project-back site-container">
          <p className="architecture-label">Project index</p>
          <Link href="/portfolio">Back to WORK</Link>
        </footer>
      </article>
    </div>
  );
}
