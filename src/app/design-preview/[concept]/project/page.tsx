import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConceptPreviewPage } from "@/components/design-preview/concept-preview-page";
import {
  designPreviewConcepts,
  getDesignPreviewConcept,
} from "@/lib/design-preview";
import { getDesignPreviewData } from "@/lib/design-preview-data";

export const revalidate = 600;
export const dynamicParams = false;

type ProjectPreviewPageProps = {
  params: Promise<{
    concept: string;
  }>;
};

export function generateStaticParams() {
  return designPreviewConcepts.map((concept) => ({
    concept: concept.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPreviewPageProps): Promise<Metadata> {
  const { concept: conceptSlug } = await params;
  const concept = getDesignPreviewConcept(conceptSlug);

  return {
    title: concept
      ? `${concept.name} Project Detail Preview`
      : "Project Detail Preview",
  };
}

export default async function ProjectPreviewPage({
  params,
}: ProjectPreviewPageProps) {
  const { concept: conceptSlug } = await params;
  const concept = getDesignPreviewConcept(conceptSlug);

  if (!concept) {
    notFound();
  }

  const { projects, project, nextProject } = await getDesignPreviewData();

  return (
    <ConceptPreviewPage
      concept={concept}
      pageKind="project"
      projects={projects}
      project={project}
      nextProject={nextProject}
    />
  );
}
