import { getPortfolioBySlug, getPublishedPortfolios } from "@/lib/portfolio";
import type { PortfolioItem } from "@/lib/types";

const PREFERRED_PREVIEW_SLUGS = [
  "project-1781072022010",
  "project-1781244093723",
  "project-1781072569005",
];

function selectPreviewProject(projects: PortfolioItem[]) {
  return (
    PREFERRED_PREVIEW_SLUGS.map((slug) =>
      projects.find((project) => project.slug === slug),
    ).find(Boolean) ||
    projects.find((project) => project.title.includes("대동장어")) ||
    projects[0]
  );
}

export async function getDesignPreviewData() {
  const projects = await getPublishedPortfolios();
  const selectedProject = selectPreviewProject(projects);
  const detailedProject = selectedProject
    ? await getPortfolioBySlug(selectedProject.slug)
    : undefined;
  const project = detailedProject || selectedProject;
  const nextProject = projects.find((item) => item.id !== project?.id) || project;

  return {
    projects,
    project,
    nextProject,
  };
}
